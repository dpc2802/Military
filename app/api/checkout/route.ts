/**
 * API de Checkout — Crea el pedido, reserva stock y envía email al admin.
 * Ruta: POST /api/checkout
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, productVariants } from "@/db/schema";
import { eq, inArray, sql } from "drizzle-orm";
import NewOrderEmail from "@/lib/emails/NewOrderEmail";
import { render } from "@react-email/render";
import { mailer, SENDER_EMAIL } from "@/lib/mail";
import { generateOrderNumber } from "@/lib/format";
import { STOCK_RESERVATION_HOURS, ADMIN_EMAIL } from "@/lib/constants";
import { z } from "zod";
import crypto from "crypto";

const checkoutSchema = z.object({
  customerEmail: z.string().email(),
  customerName: z.string().min(2),
  customerDni: z.string().min(5),
  customerPhone: z.string().min(7),
  customerDepartment: z.string().min(2),
  customerCity: z.string().min(2),
  customerAddress: z.string().min(5),
  customerNotes: z.string().optional(),
  paymentMethod: z.enum(["whatsapp", "wompi"]).default("whatsapp"),
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
          { error: `No hay stock suficiente para ${item.productName} (Talla: ${item.size ?? "Única"}). Quedan ${availableStock}.` },
          { status: 400 }
        );
      }
    }

    // 2. Calcular total real desde los precios
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

    // 3. Crear Pedido y Reservar Stock
    const [newOrder] = await db.insert(orders).values({
      orderNumber: "TEMP",
      customerEmail: customerData.customerEmail,
      customerName: customerData.customerName,
      customerDni: customerData.customerDni,
      customerDepartment: customerData.customerDepartment,
      customerPhone: customerData.customerPhone,
      customerCity: customerData.customerCity,
      customerAddress: customerData.customerAddress,
      customerNotes: customerData.customerNotes,
      paymentMethod,
      status: paymentMethod === "wompi" ? "pendiente_pago" : "pendiente_whatsapp",
      totalAmount: totalAmount.toString(),
      stockReservationExpiresAt: new Date(Date.now() + STOCK_RESERVATION_HOURS * 60 * 60 * 1000),
    }).returning();

    if (!newOrder) throw new Error("No se pudo crear la orden");

    const orderNum = generateOrderNumber(newOrder.id);
    await db.update(orders).set({ orderNumber: orderNum }).where(eq(orders.id, newOrder.id));
    newOrder.orderNumber = orderNum;

    for (const item of finalItems) {
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

      await db.update(productVariants)
        .set({ reservedStock: sql`${productVariants.reservedStock} + ${item.quantity}` })
        .where(eq(productVariants.id, item.variantId));
    }

    // 4. Obtener orden completa
    const fullOrder = await db.query.orders.findFirst({
      where: eq(orders.id, newOrder.id),
      with: {
        items: {
          with: {
            product: { columns: { name: true, slug: true, images: true } }
          }
        }
      },
    });

    // 5. Enviar email si es WhatsApp manual
    if (fullOrder && paymentMethod === "whatsapp" && process.env.SMTP_USER) {
      const emailHtml = render(NewOrderEmail({ order: fullOrder as any }));
      await mailer.sendMail({
        from: SENDER_EMAIL,
        to: ADMIN_EMAIL,
        subject: `NUEVO PEDIDO MANUAL: ${fullOrder.orderNumber} - SGB Military Shop`,
        html: emailHtml,
      }).catch((e) => console.error("[API CHECKOUT] Error enviando email manual:", e));
    }

    // 6. Generar firma de Wompi
    let signature = undefined;
    let amountInCents = 0;
    if (fullOrder && paymentMethod === "wompi") {
      amountInCents = Math.round(Number(fullOrder.totalAmount) * 100);
      const secret = process.env.WOMPI_INTEGRITY_SECRET || "test_integrity_y3BxtSzFUdNLt0Ch1zUZiMC2fp5hJaNr";
      const stringToHash = `${fullOrder.orderNumber}${amountInCents}COP${secret}`;
      signature = crypto.createHash("sha256").update(stringToHash).digest("hex");
    }

    return NextResponse.json({ 
      success: true, 
      orderId: fullOrder?.id, 
      orderNumber: fullOrder?.orderNumber, 
      amountInCents,
      signature 
    });

  } catch (error) {
    console.error("[API CHECKOUT] Error:", error);
    return NextResponse.json({ error: "Error procesando el pedido" }, { status: 500 });
  }
}
