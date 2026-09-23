/**
 * Cron job para liberar stock reservado expirado.
 * 
 * Ejecutado por Vercel Cron (configurado en vercel.json).
 * Ruta: GET /api/cron/release-stock
 * 
 * Seguridad: validamos el header CRON_SECRET que Vercel inyecta
 * automáticamente para que nadie externo pueda disparar este endpoint.
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, productVariants } from "@/db/schema";
import { eq, lt, and, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  // Validar que el request viene de Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const now = new Date();

  try {
    // Buscar pedidos pendiente_whatsapp cuya reserva expiró
    const expiredOrders = await db.query.orders.findMany({
      where: and(
        eq(orders.status, "pendiente_whatsapp"),
        lt(orders.stockReservationExpiresAt, now)
      ),
      with: {
        items: true,
      },
    });

    if (expiredOrders.length === 0) {
      return NextResponse.json({
        ok: true,
        message: "Sin reservas expiradas",
        processed: 0,
      });
    }

    let releasedCount = 0;

    for (const order of expiredOrders) {
      // Liberar el stock reservado para cada item del pedido
      for (const item of order.items) {
        // Decrementar reservedStock de forma atómica (mínimo 0 para evitar negativos)
        await db
          .update(productVariants)
          .set({
            reservedStock: sql`GREATEST(0, ${productVariants.reservedStock} - ${item.quantity})`,
            updatedAt: now,
          })
          .where(eq(productVariants.id, item.variantId));
      }

      // Marcar el pedido como cancelado por expiración
      await db
        .update(orders)
        .set({
          status: "cancelado",
          cancelledAt: now,
          adminNotes: `Cancelado automáticamente por expiración de reserva (${now.toISOString()})`,
          updatedAt: now,
        })
        .where(eq(orders.id, order.id));

      releasedCount++;
      console.log(
        `[CRON] Stock liberado para pedido ${order.orderNumber} (expiró ${order.stockReservationExpiresAt?.toISOString()})`
      );
    }

    return NextResponse.json({
      ok: true,
      message: `Se liberó el stock de ${releasedCount} pedido(s) expirado(s)`,
      processed: releasedCount,
    });
  } catch (error) {
    console.error("[CRON release-stock] Error:", error);
    return NextResponse.json(
      { error: "Error al liberar stock" },
      { status: 500 }
    );
  }
}
