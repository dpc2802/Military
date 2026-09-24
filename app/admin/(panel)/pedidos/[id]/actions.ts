"use server";

import { db } from "@/db";
import { orders, productVariants } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth";
import type { OrderStatus } from "@/types";
import OrderShippedEmail from "@/lib/emails/OrderShippedEmail";
import { render } from "@react-email/render";
import { mailer, SENDER_EMAIL } from "@/lib/mail";


export async function updateOrderStatus(orderId: number, newStatus: OrderStatus) {
  await requireAdminSession();

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: { items: true },
  });

  if (!order) throw new Error("Pedido no encontrado");

  const oldStatus = order.status as OrderStatus;
  
  if (oldStatus === newStatus) return { success: true };

  const now = new Date();
  const updateData: any = {
    status: newStatus,
    updatedAt: now,
  };

  // Lógica de inventario y fechas
  if (oldStatus === "pendiente_whatsapp") {
    if (newStatus === "confirmado") {
      updateData.confirmedAt = now;
      updateData.stockReservationExpiresAt = null;

      // El admin confirmó el pedido. El stock reservado se descuenta del stock real.
      for (const item of order.items) {
        await db.execute(sql`
          UPDATE product_variants
          SET stock = GREATEST(0, stock - ${item.quantity}),
              reserved_stock = GREATEST(0, reserved_stock - ${item.quantity}),
              updated_at = NOW()
          WHERE id = ${item.variantId}
        `);
      }
    } else if (newStatus === "cancelado") {
      updateData.cancelledAt = now;
      updateData.stockReservationExpiresAt = null;

      // El admin canceló un pedido pendiente. Se libera la reserva.
      for (const item of order.items) {
        await db.execute(sql`
          UPDATE product_variants
          SET reserved_stock = GREATEST(0, reserved_stock - ${item.quantity}),
              updated_at = NOW()
          WHERE id = ${item.variantId}
        `);
      }
    }
  } else if (newStatus === "enviado") {
    updateData.shippedAt = now;
    
    if (order.customerEmail && process.env.SMTP_USER) {
      const html = await render(OrderShippedEmail({ order: order as any }));
      await mailer.sendMail({
        from: SENDER_EMAIL,
        to: order.customerEmail,
        subject: `🚚 Tu pedido ${order.orderNumber} va en camino - SGB Military`,
        html: html,
      }).catch(e => console.error("[ACTIONS] Error enviando email de envío:", e));
    }
  } else if (newStatus === "entregado") {
    updateData.deliveredAt = now;
  } else if (newStatus === "cancelado") {
    updateData.cancelledAt = now;
  }

  await db.update(orders).set(updateData).where(eq(orders.id, orderId));

  revalidatePath(`/admin/pedidos/${orderId}`);
  revalidatePath(`/admin/pedidos`);
  
  return { success: true };
}
