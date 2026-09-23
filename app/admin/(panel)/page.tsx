import Link from "next/link";
import { sql, and, gte, eq, lte, desc } from "drizzle-orm";
import { db } from "@/db";
import { orders, products, productVariants } from "@/db/schema";
import { formatCOP } from "@/lib/format";
import { ShoppingBag, Package, AlertTriangle, TrendingUp, ChevronRight, Activity, ArrowUpRight } from "lucide-react";

export default async function AdminDashboardPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Estadísticas del mes actual
  const [monthStats] = await db
    .select({
      totalOrders: sql<number>`count(*)`,
      totalRevenue: sql<string>`coalesce(sum(${orders.totalAmount}), 0)`,
    })
    .from(orders)
    .where(
      and(
        gte(orders.createdAt, startOfMonth),
        eq(orders.status, "confirmado")
      )
    );

  // Pedidos pendientes de WhatsApp (necesitan acción del admin)
  const [pendingStats] = await db
    .select({ count: sql<number>`count(*)` })
    .from(orders)
    .where(eq(orders.status, "pendiente_whatsapp"));

  // Variantes con stock bajo (menos de 3 unidades disponibles)
  const lowStockVariants = await db
    .select({
      productName: products.name,
      size: productVariants.size,
      color: productVariants.color,
      stock: productVariants.stock,
      productSlug: products.slug,
    })
    .from(productVariants)
    .innerJoin(products, eq(productVariants.productId, products.id))
    .where(
      and(
        lte(productVariants.stock, 3),
        eq(products.isActive, true),
        eq(productVariants.isActive, true)
      )
    )
    .orderBy(productVariants.stock)
    .limit(10);

  // Pedidos recientes
  const recentOrders = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      customerName: orders.customerName,
      totalAmount: orders.totalAmount,
      status: orders.status,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(8);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 md:pb-0">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl text-foreground tracking-widest flex items-center gap-3 uppercase">
             <Activity className="w-6 h-6 text-accent" />
             Command Center
          </h1>
          <p className="text-[#9A9A94] text-sm font-body mt-2">
            Resumen operativo — {now.toLocaleDateString("es-CO", { month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <StatCard
          icon={<ShoppingBag className="w-5 h-5 text-accent" />}
          label="Pedidos Confirmados"
          value={String(monthStats?.totalOrders ?? 0)}
          subtitle="Este mes"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5 text-accent" />}
          label="Ingresos Mensuales"
          value={formatCOP(Number(monthStats?.totalRevenue ?? 0))}
          subtitle="Confirmados"
        />
        <StatCard
          icon={<AlertTriangle className={`w-5 h-5 ${Number(pendingStats?.count) > 0 ? "text-destructive" : "text-[#9A9A94]"}`} />}
          label="Pendientes WhatsApp"
          value={String(pendingStats?.count ?? 0)}
          urgent={Number(pendingStats?.count) > 0}
          subtitle="Requieren acción"
        />
      </div>

      {/* ── GRIDS PRINCIPALES ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        
        {/* ALERTAS DE STOCK BAJO */}
        <section className="bg-[#111] border border-white/5 relative overflow-hidden group">
          {/* Accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="p-5 md:p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5">
                <Package className="w-4 h-4 text-accent" />
              </div>
              <h2 className="font-heading text-sm tracking-widest text-[#F5F5F0] uppercase">
                Stock Crítico
              </h2>
            </div>
          </div>
          
          <div className="p-2">
            {lowStockVariants.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center opacity-50">
                 <Package className="w-10 h-10 text-[#9A9A94] mb-3" />
                 <p className="text-[#F5F5F0] font-heading tracking-widest uppercase">Inventario Óptimo</p>
              </div>
            ) : (
              <div className="space-y-1">
                {lowStockVariants.map((v, i) => (
                  <div key={i} className="flex items-center justify-between p-3 md:p-4 hover:bg-white/5 transition-colors group/row">
                    <div className="min-w-0 pr-4">
                      <Link
                        href={`/admin/productos?q=${encodeURIComponent(v.productName)}`}
                        className="text-[13px] md:text-sm font-heading text-foreground truncate block group-hover/row:text-accent transition-colors uppercase tracking-wider"
                      >
                        {v.productName}
                      </Link>
                      <span className="text-[#9A9A94] text-[11px] font-body mt-1 block truncate">
                        {v.size && `T: ${v.size}`} {v.color && `· ${v.color}`}
                      </span>
                    </div>
                    <div className="flex-shrink-0">
                      <span
                        className={`font-heading tracking-widest uppercase px-3 py-1 text-[10px] border ${
                          v.stock === 0
                            ? "bg-destructive/10 border-destructive/20 text-destructive"
                            : "bg-accent/10 border-accent/20 text-accent"
                        }`}
                      >
                        {v.stock === 0 ? "AGOTADO" : `${v.stock} UDS`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* PEDIDOS RECIENTES */}
        <section className="bg-[#111] border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-light/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="p-5 md:p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5">
                <ShoppingBag className="w-4 h-4 text-accent" />
              </div>
              <h2 className="font-heading text-sm tracking-widest text-[#F5F5F0] uppercase">
                Últimos Pedidos
              </h2>
            </div>
            <Link
              href="/admin/pedidos"
              className="text-[10px] uppercase font-heading tracking-widest text-[#9A9A94] hover:text-accent flex items-center gap-1 transition-colors"
            >
              Ver Todos <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="p-2">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center opacity-50">
                 <ShoppingBag className="w-10 h-10 text-[#9A9A94] mb-3" />
                 <p className="text-[#F5F5F0] font-heading tracking-widest uppercase">Sin Operaciones</p>
              </div>
            ) : (
              <div className="space-y-1">
                {recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/pedidos/${order.id}`}
                    className="flex items-center justify-between p-3 md:p-4 hover:bg-white/5 transition-colors group/row"
                  >
                    <div className="min-w-0 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-accent text-[11px] font-heading tracking-widest">
                          {order.orderNumber}
                        </span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <span className="text-foreground text-[13px] font-body truncate block group-hover/row:text-white transition-colors">
                        {order.customerName}
                      </span>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span className="text-[13px] md:text-sm font-heading tracking-wider text-[#F5F5F0] block">
                        {formatCOP(Number(order.totalAmount))}
                      </span>
                      <span className="text-[10px] text-[#9A9A94] font-body mt-1">
                        {new Date(order.createdAt).toLocaleDateString("es-CO", { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

// ── COMPONENTES SECUNDARIOS ──

function StatCard({
  icon,
  label,
  value,
  subtitle,
  urgent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle: string;
  urgent?: boolean;
}) {
  return (
    <div className={`bg-[#111] p-6 relative overflow-hidden group transition-colors ${urgent ? "border border-destructive/30" : "border border-white/5 hover:border-white/10"}`}>
      {/* Glare effect */}
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
         <div className="w-24 h-24 bg-white rounded-full blur-3xl mix-blend-overlay" />
      </div>

      <div className="flex items-start justify-between mb-4 relative">
        <div className="p-3 bg-white/5 border border-white/5">
          {icon}
        </div>
      </div>
      
      <div className="relative">
         <h3 className="text-[11px] text-[#9A9A94] uppercase tracking-widest font-heading mb-1">{label}</h3>
         <p className={`font-heading text-3xl tracking-widest ${urgent ? "text-destructive" : "text-[#F5F5F0]"}`}>
           {value}
         </p>
         <p className="text-[10px] text-[#9A9A94] uppercase tracking-widest font-heading mt-2">{subtitle}</p>
      </div>
    </div>
  );
}

const statusColors: Record<string, string> = {
  pendiente_whatsapp: "bg-accent/10 text-accent border border-accent/20",
  confirmado: "bg-white/10 text-[#F5F5F0] border border-white/20",
  enviado: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  entregado: "bg-green-500/10 text-green-400 border border-green-500/20",
  cancelado: "bg-destructive/10 text-destructive border border-destructive/20",
};

const ORDER_STATUS_LABELS = {
  pendiente_whatsapp: "WhatsApp",
  confirmado: "Confirmado",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
} as const;

function OrderStatusBadge({ status }: { status: string }) {
  const label = ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS] ?? status;
  const colorClass = statusColors[status] ?? "bg-white/5 text-white border border-white/10";

  return (
    <span className={`text-[9px] uppercase font-heading tracking-widest px-2 py-0.5 ${colorClass}`}>
      {label}
    </span>
  );
}
