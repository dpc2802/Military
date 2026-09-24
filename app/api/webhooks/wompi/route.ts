import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, paymentEvents } from "@/db/schema";
import { eq } from "drizzle-orm";
import PaidOrderEmail from "@/lib/emails/PaidOrderEmail";
import CustomerReceiptEmail from "@/lib/emails/CustomerReceiptEmail";
import { render } from "@react-email/render";
import { mailer, SENDER_EMAIL } from "@/lib/mail";
import { ADMIN_EMAIL, WHATSAPP_NUMBER } from "@/lib/constants";
import { formatCOP } from "@/lib/format";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const eventType = payload.event || "UNKNOWN";
    const transactionId = payload.data?.transaction?.id;

    if (!transactionId) {
      return NextResponse.json({ error: "Missing transaction ID in payload" }, { status: 400 });
    }

    // 1. Guardar el evento crudo para auditoría
    const [auditLog] = await db.insert(paymentEvents).values({
      transactionId,
      eventType,
      payload,
    }).returning();

    // 2. Verificar estado real consultando la API de Wompi (Evita spoofing de webhooks)
    const wompiRes = await fetch(`https://sandbox.wompi.co/v1/transactions/${transactionId}`);
    if (!wompiRes.ok) {
      console.error("[WOMPI WEBHOOK] Transaction not found in Wompi API");
      return NextResponse.json({ error: "Transaction not valid" }, { status: 404 });
    }

    const wompiData = await wompiRes.json();
    const transaction = wompiData.data;
    const orderNumber = transaction.reference;

    // 3. Buscar el pedido
    const order = await db.query.orders.findFirst({
      where: eq(orders.orderNumber, orderNumber),
      with: { items: true },
    });

    if (!order) {
      console.error("[WOMPI WEBHOOK] Order not found:", orderNumber);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 4. Idempotencia: Verificar si ya estaba confirmado/cancelado por este mismo transactionId
    if (order.status === "confirmado" || order.status === "cancelado") {
      // Marcar log como procesado
      await db.update(paymentEvents).set({ processedAt: new Date() }).where(eq(paymentEvents.id, auditLog.id));
      return NextResponse.json({ message: "Already processed" }, { status: 200 });
    }

    // 5. Actualizar el estado si es necesario
    let newStatus = order.status;
    if (transaction.status === "APPROVED") {
      newStatus = "confirmado";
    } else if (
      transaction.status === "DECLINED" ||
      transaction.status === "ERROR" ||
      transaction.status === "VOIDED"
    ) {
      newStatus = "cancelado"; // o "pago_rechazado"
    }

    if (order.status !== newStatus) {
      await db
        .update(orders)
        .set({
          status: newStatus,
          paymentId: transactionId,
          confirmedAt: newStatus === "confirmado" ? new Date() : order.confirmedAt,
          cancelledAt: newStatus === "cancelado" ? new Date() : order.cancelledAt,
        })
        .where(eq(orders.id, order.id));
    }

    // 6. Si fue aprobado por primera vez, enviar correos
    if (newStatus === "confirmado") {
      const totalFormatted = formatCOP(Number(order.totalAmount));

      if (process.env.SMTP_USER) {
        const fullOrder = await db.query.orders.findFirst({
          where: eq(orders.id, order.id),
          with: { items: { with: { product: { columns: { name: true, slug: true, images: true } } } } },
        });

        if (fullOrder) {
          const adminHtml = await render(PaidOrderEmail({ order: fullOrder as any, transactionId }));
          await mailer.sendMail({
            from: SENDER_EMAIL,
            to: ADMIN_EMAIL,
            subject: `💰 PAGO CONFIRMADO (WEBHOOK): ${orderNumber} — ${totalFormatted} — SGB Military`,
            html: adminHtml,
          }).catch(console.error);

          if (fullOrder.customerEmail) {
            const clientHtml = await render(CustomerReceiptEmail({ order: fullOrder as any, transactionId }));
            await mailer.sendMail({
              from: SENDER_EMAIL,
              to: fullOrder.customerEmail,
              subject: `Confirmación de pedido ${orderNumber} - SGB Military`,
              html: clientHtml,
            }).catch(console.error);
          }
        }
      }
    }

    // Marcar log como procesado con éxito
    await db.update(paymentEvents).set({ processedAt: new Date() }).where(eq(paymentEvents.id, auditLog.id));

    return NextResponse.json({ success: true, newStatus });
  } catch (error) {
    console.error("[WOMPI WEBHOOK] Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
