import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import PaidOrderEmail from "@/lib/emails/PaidOrderEmail";
import CustomerReceiptEmail from "@/lib/emails/CustomerReceiptEmail";
import { render } from "@react-email/render";
import { mailer, SENDER_EMAIL } from "@/lib/mail";
import { ADMIN_EMAIL, WHATSAPP_NUMBER } from "@/lib/constants";
import { formatCOP } from "@/lib/format";


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get("id");

  if (!transactionId) {
    return NextResponse.json({ error: "Missing transaction ID" }, { status: 400 });
  }

  try {
    // 1. Verificar transacción con Wompi (sandbox)
    const wompiRes = await fetch(`https://sandbox.wompi.co/v1/transactions/${transactionId}`);

    if (!wompiRes.ok) {
      return NextResponse.json({ error: "Transaction not found in Wompi" }, { status: 404 });
    }

    const wompiData = await wompiRes.json();
    const transaction = wompiData.data;

    // 2. Buscar el pedido en la base de datos
    const orderNumber = transaction.reference;
    const order = await db.query.orders.findFirst({
      where: eq(orders.orderNumber, orderNumber),
      with: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 3. Actualizar estado del pedido
    let newStatus = order.status;

    if (transaction.status === "APPROVED") {
      newStatus = "confirmado";
    } else if (
      transaction.status === "DECLINED" ||
      transaction.status === "ERROR" ||
      transaction.status === "VOIDED"
    ) {
      newStatus = "cancelado";
    }

    const wasAlreadyConfirmed = order.status === "confirmado";

    if (order.status !== newStatus) {
      await db
        .update(orders)
        .set({
          status: newStatus,
          paymentId: transactionId,
          confirmedAt: newStatus === "confirmado" ? new Date() : order.confirmedAt,
        })
        .where(eq(orders.id, order.id));
    }

    // 4. Si el pago fue APROBADO y no estaba ya confirmado → notificar al dueño
    if (newStatus === "confirmado" && !wasAlreadyConfirmed) {
      const totalFormatted = formatCOP(Number(order.totalAmount));

      // ── Email al dueño via Resend ──────────────────────────────────────────
      if (process.env.SMTP_USER) {
        // Cargar el pedido con items completos para el email
        const fullOrder = await db.query.orders.findFirst({
          where: eq(orders.id, order.id),
          with: {
            items: {
              with: {
                product: { columns: { name: true, slug: true, images: true } },
              },
            },
          },
        });

        if (fullOrder) {
          // 1. Email al dueño
          const adminHtml = await render(PaidOrderEmail({ order: fullOrder as any, transactionId }));
          await mailer.sendMail({
            from: SENDER_EMAIL,
            to: ADMIN_EMAIL,
            subject: `💰 PAGO CONFIRMADO: ${orderNumber} — ${totalFormatted} — SGB Military`,
            html: adminHtml,
          }).catch((e) => console.error("[WOMPI VERIFY] Error enviando email admin:", e));
          
          // 2. Email al cliente (Recibo de compra)
          if (fullOrder.customerEmail) {
            const clientHtml = await render(CustomerReceiptEmail({ order: fullOrder as any, transactionId }));
            await mailer.sendMail({
              from: SENDER_EMAIL,
              to: fullOrder.customerEmail,
              subject: `Confirmación de pedido ${orderNumber} - SGB Military`,
              html: clientHtml,
            }).catch((e) => console.error("[WOMPI VERIFY] Error enviando email cliente:", e));
          }
        }
      }

      // ── WhatsApp al dueño (link de apertura rápida) ───────────────────────
      // Guardamos la URL en la respuesta para que el cliente la pueda usar si quiere
      const ownerWhatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `🔔 *NUEVO PAGO CONFIRMADO*\n\nPedido: *${orderNumber}*\nTotal: *${totalFormatted}*\nCliente: ${order.customerName}\nTeléfono: ${order.customerPhone}\nCiudad: ${order.customerCity}\n\n✅ Pago vía Wompi aprobado. Procede con el envío.`
      )}`;

      return NextResponse.json({
        success: true,
        orderNumber,
        status: transaction.status,
        dbStatus: newStatus,
        notified: true,
        ownerWhatsappUrl,
      });
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      status: transaction.status,
      dbStatus: newStatus,
      notified: false,
    });
  } catch (error) {
    console.error("[WOMPI VERIFY] Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
