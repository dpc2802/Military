import Link from "next/link";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc } from "drizzle-orm";
import { formatCOP } from "@/lib/format";
import { Eye, ShoppingBag } from "lucide-react";

export const metadata = { title: "Pedidos — Admin SGB" };

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

export default async function AdminOrdersPage() {
  const allOrders = await db.query.orders.findMany({
    orderBy: desc(orders.createdAt),
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 md:pb-0">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl text-foreground tracking-widest flex items-center gap-3 uppercase">
             <ShoppingBag className="w-6 h-6 text-accent" />
             Operaciones
          </h1>
          <p className="text-[#9A9A94] text-sm font-body mt-2">
            Control de pedidos y despachos
          </p>
        </div>
      </div>

      {/* ── TABLA DE PEDIDOS ── */}
      <div className="bg-[#111] border border-white/5 overflow-hidden relative group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-light/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-body">
            <thead className="bg-white/5 border-b border-white/5 text-[10px] uppercase font-heading tracking-widest text-[#9A9A94]">
              <tr>
                <th className="px-6 py-4">ID Operación</th>
                <th className="px-6 py-4">Operador (Cliente)</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {allOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#9A9A94]">
                    <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-heading tracking-widest uppercase">Sin operaciones registradas</p>
                  </td>
                </tr>
              ) : (
                allOrders.map((order) => {
                  const statusLabel = ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] ?? order.status;
                  const colorClass = statusColors[order.status] ?? "bg-white/5 text-white border border-white/10";
                  
                  return (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors group/row">
                      <td className="px-6 py-4">
                        <span className="font-heading text-[13px] tracking-widest text-accent">
                          {order.orderNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-body text-[13px] text-foreground">
                        {order.customerName}
                        <br />
                        <span className="text-[11px] text-[#9A9A94] font-mono">{order.customerPhone}</span>
                      </td>
                      <td className="px-6 py-4 text-[11px] text-[#9A9A94] uppercase tracking-widest font-heading">
                        {new Date(order.createdAt).toLocaleDateString("es-CO", {
                          day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                      </td>
                      <td className="px-6 py-4 font-heading tracking-widest text-[#F5F5F0]">
                        {formatCOP(Number(order.totalAmount))}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-[10px] font-heading tracking-widest uppercase border ${colorClass}`}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/pedidos/${order.id}`}
                          className="inline-flex p-2 text-[#9A9A94] hover:text-accent hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
