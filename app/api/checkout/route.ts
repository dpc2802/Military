/**
 * API de Checkout — Crea el pedido, reserva stock y envía email al admin.
 * Ruta: POST /api/checkout
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, productVariants } from "@/db/schema";
import { eq, inArray, sql } from "drizzle-orm";
import { Resend } from "resend";
import NewOrderEmail from "@/lib/emails/NewOrderEmail";
import { generateOrderNumber } from "@/lib/format";
import { STOCK_RESERVATION_HOURS, ADMIN_EMAIL } from "@/lib/constants";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const checkoutSchema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(7),
  customerCity: z.string().min(2),
  customerAddress: z.string().min(5),
  customerNotes: z.string().optional(),
  paymentMethod: z.enum(['whatsapp', 'wompi']).default('whatsapp'),
  paymentMethod: z.enum(['whatsapp', 'wompi']).default('whatsapp'),
  items: z.array(
    z.object({
      variantId: z.number(),
      productId: z.number(),
      productName: z.string(),
      productSlug: z.string(),
      size: z.string().optional().nullable(),
      color: z.string().optional().nullable(),
      quantity: z.number().min(1),
      unitPrice: z.number().min(0),
    })
  ).min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = checkoutSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const { items, paymentMethod, ...customerData } = result.data;

    // 1. Verificar stock actual de todas las variantes
    const variantIds = items.map((i) => i.variantId);
    const dbVariants = await db.query.productVariants.findMany({
      where: inArray(productVariants.id, variantIds),
      with: { product: true },
    });

    for (const item of items) {
      const dbVariant = dbVariants.find((v) => v.id === item.variantId);
      if (!dbVariant || !dbVariant.isActive || !dbVariant.product.isActive) {
        return NextResponse.json(
          { error: `El producto ${item.productName} ya no está disponible.` },
          { status: 400 }
        );
      }

      const availableStock = dbVariant.stock - dbVariant.reservedStock;
      if (availableStock < item.quantity) {
        return NextResponse.json(
          { error: `No hay stock suficiente para ${item.productName} (Talla: ${item.size ?? 'Única'}). Quedan ${availableStock}.` },
          { status: 400 }
        );
      }
    }

    // 2. Calcular total real desde los precios enviados (validados)
    // Para simplificar, confiamos en el unitPrice enviado si querés, 
    // pero idealmente deberíamos recalcularlo usando dbVariant.priceOverride ?? dbVariant.product.price
    let totalAmount = 0;
    const finalItems = items.map((item) => {
      const dbVariant = dbVariants.find((v) => v.id === item.variantId)!;
      const realPrice = Number(dbVariant.priceOverride ?? dbVariant.product.price);
      const subtotal = realPrice * item.quantity;
      totalAmount += subtotal;
      
      return {
        ...item,
        unitPrice: realPrice,
        subtotal,
      };
    });

    // 3. Crear Pedido y Reservar Stock en Transacción simulada (Neon HTTP driver limita transacciones complejas, hacemos inserts/updates secuenciales)
    
    // Primero, crear la orden base
    const [newOrder] = await db.insert(orders).values({
      orderNumber: "TEMP", // Se actualiza abajo
      customerName: customerData.customerName,
      customerPhone: customerData.customerPhone,
      customerCity: customerData.customerCity,
      customerAddress: customerData.customerAddress,
      customerNotes: customerData.customerNotes,
      paymentMethod: paymentMethod,
      status: paymentMethod === 'wompi' ? 'pendiente_pago' : 'pendiente_whatsapp',
      status: paymentMethod === 'wompi' ? 'pendiente_pago' : 'pendiente_whatsapp',
      paymentMethod,
      totalAmount: totalAmount.toString(),
      stockReservationExpiresAt: new Date(Date.now() + STOCK_RESERVATION_HOURS * 60 * 60 * 1000),
    }).returning();

    if (!newOrder) throw new Error("No se pudo crear la orden");

    // Actualizar Order Number real usando el ID
    const orderNum = generateOrderNumber(newOrder.id);
    await db.update(orders).set({ orderNumber: orderNum }).where(eq(orders.id, newOrder.id));
    newOrder.orderNumber = orderNum;

    // Crear los items y reservar stock
    for (const item of finalItems) {
      // Crear order item
      await db.insert(orderItems).values({
        orderId: newOrder.id,
        productId: item.productId,
        variantId: item.variantId,
        productName: item.productName,
        productSlug: item.productSlug,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toString(),
        subtotal: item.subtotal.toString(),
      });

      // Aumentar stock reservado
      await db.update(productVariants)
        .set({
          reservedStock: sql`${productVariants.reservedStock} + ${item.quantity}`,
        })
        .where(eq(productVariants.id, item.variantId));
    }

    // 4. Enviar email al admin de forma asíncrona (no bloquea el response)
    const fullOrder = await db.query.orders.findFirst({
      where: eq(orders.id, newOrder.id),
      with: {
        items: {
          with: {
            product: {
              columns: { name: true, slug: true, images: true }
            }
          }
        }
      },
    });

    
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    let wompiCheckoutUrl = undefined;
    
    if (paymentMethod === "wompi" && fullOrder) {
      const amountInCents = Math.round(Number(fullOrder.totalAmount) * 100);
      const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || "pub_test_missing";
      const redirectUrl = `${SITE_URL}/checkout/wompi-result`;
      wompiCheckoutUrl = `https://checkout.wompi.co/p/?public-key=${publicKey}&currency=COP&amount-in-cents=${amountInCents}&reference=${encodeURIComponent(fullOrder.orderNumber)}&redirect-url=${encodeURIComponent(redirectUrl)}`;
    }

    if (fullOrder && process.env.RESEND_API_KEY) {

      resend.emails.send({
        from: "SGB Military <onboarding@resend.dev>", // Cambiar por tu dominio verificado si tenés
        to: ADMIN_EMAIL,
        subject: `NUEVO PEDIDO: ${fullOrder.orderNumber} - SGB Military Shop`,
        react: NewOrderEmail({ order: fullOrder }),
      }).catch((e) => console.error("Error enviando email:", e));
    }

    return NextResponse.json({ success: true, orderId: fullOrder?.id, orderNumber: fullOrder?.orderNumber, wompiCheckoutUrl, amountInCents: fullOrder ? Math.round(Number(fullOrder.totalAmount) * 100) : 0 });

  } catch (error) {
    console.error("[API CHECKOUT] Error:", error);
    return NextResponse.json({ error: "Error procesando el pedido" }, { status: 500 });
  }
}
