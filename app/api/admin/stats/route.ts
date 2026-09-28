/**
 * API para estadísticas del dashboard del admin.
 * GET /api/admin/stats
 * Retorna: ingresos, pedidos por estado, top productos, comparación semana actual vs anterior.
 */

import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { eq, gte, lt, and, sql, not, inArray } from "drizzle-orm";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const now = new Date();
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate() - now.getDay());
  startOfThisWeek.setHours(0, 0, 0, 0);

  const startOfLastWeek = new Date(startOfThisWeek);
  startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  // All non-cancelled orders
  const activeStatuses = ["confirmado", "enviado", "entregado", "pendiente_whatsapp", "pendiente_pago"];

  const [allOrders, topItems] = await Promise.all([
    db.query.orders.findMany({
      columns: {
        id: true,
        status: true,
        totalAmount: true,
        createdAt: true,
      },
    }),
    // Top 5 selling products by quantity
    db.select({
      productName: orderItems.productName,
      productSlug: orderItems.productSlug,
      totalQty: sql<number>`cast(sum(${orderItems.quantity}) as int)`,
      totalRevenue: sql<number>`cast(sum(${orderItems.subtotal}) as numeric)`,
    })
      .from(orderItems)
      .groupBy(orderItems.productName, orderItems.productSlug)
      .orderBy(sql`sum(${orderItems.quantity}) desc`)
      .limit(5),
  ]);

  const confirmedOrders = allOrders.filter((o) => activeStatuses.includes(o.status) && o.status !== "pendiente_whatsapp" && o.status !== "pendiente_pago");

  // Revenue calculations
  const totalRevenue = confirmedOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

  const thisWeekOrders = confirmedOrders.filter((o) => new Date(o.createdAt) >= startOfThisWeek);
  const lastWeekOrders = confirmedOrders.filter(
    (o) => new Date(o.createdAt) >= startOfLastWeek && new Date(o.createdAt) < startOfThisWeek
  );
  const thisMonthOrders = confirmedOrders.filter((o) => new Date(o.createdAt) >= startOfMonth);

  const thisWeekRevenue = thisWeekOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
  const lastWeekRevenue = lastWeekOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
  const thisMonthRevenue = thisMonthOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

  const weekGrowth = lastWeekRevenue === 0 ? 100 : Math.round(((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100);

  // Orders by status
  const byStatus = allOrders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Revenue by day for the last 7 days (for a simple bar chart)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const dailyRevenue = last7Days.map((day) => {
    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);
    const dayOrders = confirmedOrders.filter(
      (o) => new Date(o.createdAt) >= day && new Date(o.createdAt) < nextDay
    );
    return {
      label: day.toLocaleDateString("es-CO", { weekday: "short" }),
      revenue: dayOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0),
      count: dayOrders.length,
    };
  });

  return NextResponse.json({
    totalRevenue,
    thisWeekRevenue,
    lastWeekRevenue,
    weekGrowth,
    thisMonthRevenue,
    totalOrders: allOrders.length,
    confirmedOrders: confirmedOrders.length,
    byStatus,
    topProducts: topItems,
    dailyRevenue,
  });
}
