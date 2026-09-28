"use client";

import { useEffect, useState } from "react";
import { formatCOP } from "@/lib/format";
import { TrendingUp, TrendingDown, Package, ShoppingBag, DollarSign, BarChart2, Minus } from "lucide-react";
import Link from "next/link";

type Stats = {
  totalRevenue: number;
  thisWeekRevenue: number;
  lastWeekRevenue: number;
  weekGrowth: number;
  thisMonthRevenue: number;
  totalOrders: number;
  confirmedOrders: number;
  byStatus: Record<string, number>;
  topProducts: { productName: string; productSlug: string; totalQty: number; totalRevenue: number }[];
  dailyRevenue: { label: string; revenue: number; count: number }[];
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pendiente_whatsapp: { label: "Pendiente WA", color: "bg-accent/20 text-accent" },
  pendiente_pago:     { label: "Pendiente Pago", color: "bg-yellow-500/20 text-yellow-400" },
  confirmado:         { label: "Confirmado", color: "bg-blue-500/20 text-blue-400" },
  enviado:            { label: "En camino", color: "bg-sky-500/20 text-sky-400" },
  entregado:          { label: "Entregado", color: "bg-green-500/20 text-green-400" },
  cancelado:          { label: "Cancelado", color: "bg-red-500/20 text-red-400" },
};

export default function AdminStatsPanel() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#111] border border-white/5 p-6 animate-pulse h-28 rounded-none" />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const maxRev = Math.max(...stats.dailyRevenue.map((d) => d.revenue), 1);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Ingresos del mes",
            value: formatCOP(stats.thisMonthRevenue),
            icon: DollarSign,
            sub: "Pedidos confirmados",
          },
          {
            label: "Esta semana",
            value: formatCOP(stats.thisWeekRevenue),
            icon: stats.weekGrowth >= 0 ? TrendingUp : TrendingDown,
            sub: `${stats.weekGrowth > 0 ? "+" : ""}${stats.weekGrowth}% vs semana anterior`,
            accent: stats.weekGrowth >= 0 ? "text-green-400" : "text-red-400",
          },
          {
            label: "Total pedidos",
            value: String(stats.totalOrders),
            icon: ShoppingBag,
            sub: `${stats.confirmedOrders} confirmados`,
          },
          {
            label: "Ingresos totales",
            value: formatCOP(stats.totalRevenue),
            icon: BarChart2,
            sub: "Histórico",
          },
        ].map((card) => (
          <div key={card.label} className="bg-[#111] border border-white/5 p-5 group hover:border-accent/20 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground">{card.label}</p>
              <card.icon className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
            </div>
            <p className="font-heading text-xl md:text-2xl text-white tracking-wider">{card.value}</p>
            <p className={`text-[10px] font-body mt-1 ${card.accent ?? "text-muted-foreground"}`}>{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue Bar Chart + Top Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 7-day Revenue Chart */}
        <div className="bg-[#111] border border-white/5 p-5">
          <h3 className="font-heading text-xs tracking-widest uppercase text-muted-foreground mb-5">
            Ingresos — últimos 7 días
          </h3>
          <div className="flex items-end gap-2 h-32">
            {stats.dailyRevenue.map((day) => (
              <div key={day.label} className="flex flex-col items-center gap-1 flex-1">
                <p className="text-[9px] text-muted-foreground font-body">
                  {day.revenue > 0 ? formatCOP(day.revenue).replace("$", "") : "—"}
                </p>
                <div className="w-full relative" style={{ height: "80px" }}>
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-accent/80 transition-all duration-700 hover:bg-accent"
                    style={{ height: `${day.revenue === 0 ? 4 : Math.max(8, (day.revenue / maxRev) * 80)}px` }}
                    title={`${formatCOP(day.revenue)} · ${day.count} pedido(s)`}
                  />
                </div>
                <p className="text-[9px] text-muted-foreground font-heading uppercase">{day.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-[#111] border border-white/5 p-5">
          <h3 className="font-heading text-xs tracking-widest uppercase text-muted-foreground mb-4">
            Top productos vendidos
          </h3>
          {stats.topProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground font-body">Sin ventas aún.</p>
          ) : (
            <div className="space-y-3">
              {stats.topProducts.map((p, i) => (
                <div key={p.productSlug} className="flex items-center gap-3">
                  <span className="text-[10px] font-heading text-muted-foreground w-5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <Link href={`/productos/${p.productSlug}`} target="_blank" className="text-xs font-body text-foreground hover:text-accent transition-colors line-clamp-1">
                      {p.productName}
                    </Link>
                    <p className="text-[10px] text-muted-foreground">{p.totalQty} vendidos</p>
                  </div>
                  <span className="text-xs font-heading text-accent shrink-0">{formatCOP(p.totalRevenue)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Orders by Status */}
      <div className="bg-[#111] border border-white/5 p-5">
        <h3 className="font-heading text-xs tracking-widest uppercase text-muted-foreground mb-4">
          Pedidos por estado
        </h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(stats.byStatus).map(([status, count]) => {
            const info = STATUS_LABELS[status] ?? { label: status, color: "bg-white/5 text-white" };
            return (
              <Link key={status} href="/admin/pedidos" className={`px-3 py-2 rounded-lg text-xs font-heading tracking-widest uppercase flex items-center gap-2 ${info.color} hover:opacity-80 transition-opacity`}>
                <span className="text-xl font-heading">{count}</span>
                <span className="text-[10px]">{info.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
