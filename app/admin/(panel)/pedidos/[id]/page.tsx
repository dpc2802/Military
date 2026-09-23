import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { formatCOP, formatDateBogota } from "@/lib/format";
import { ArrowLeft, User, MapPin, Package, Clock } from "lucide-react";
import { StatusSelect } from "./StatusSelect";
import type { OrderStatus } from "@/types";

export const metadata = { title: "Detalle de Pedido — Admin" };

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const orderId = Number(params.id);
  if (isNaN(orderId)) notFound();

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: { items: true },
  });

  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/pedidos"
          className="p-2 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-heading text-2xl tracking-widest uppercase">
            Pedido {order.orderNumber}
          </h1>
          <p className="text-sm text-muted-foreground font-body">
            {formatDateBogota(order.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-lg tracking-widest uppercase flex items-center gap-2">
                <Package className="w-5 h-5 text-accent" />
                Artículos
              </h2>
              <StatusSelect orderId={order.id} currentStatus={order.status as OrderStatus} />
            </div>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start py-3 border-b border-border last:border-0 last:pb-0">
                  <div>
                    <Link href={`/productos/${item.productSlug}`} target="_blank" className="font-medium text-sm font-body hover:text-accent transition-colors">
                      {item.productName}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.size && `Talla: ${item.size}`} {item.color && `/ ${item.color}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Cant: {item.quantity} × {formatCOP(Number(item.unitPrice))}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-heading tracking-wider">
                      {formatCOP(Number(item.subtotal))}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
              <span className="font-heading tracking-widest uppercase text-muted-foreground">Total</span>
              <span className="text-xl font-heading text-accent tracking-wider">
                {formatCOP(Number(order.totalAmount))}
              </span>
            </div>
          </div>
        </div>

        {/* Columna lateral */}
        <div className="space-y-6">
          <div className="bg-surface border border-border p-6 space-y-4">
            <h2 className="font-heading text-lg tracking-widest uppercase flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-accent" />
              Cliente
            </h2>
            <div className="space-y-3 text-sm font-body">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Nombre</p>
                <p>{order.customerName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">WhatsApp</p>
                <a
                  href={`https://wa.me/57${order.customerPhone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  {order.customerPhone}
                </a>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border p-6 space-y-4">
            <h2 className="font-heading text-lg tracking-widest uppercase flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-accent" />
              Envío
            </h2>
            <div className="space-y-3 text-sm font-body">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Ciudad</p>
                <p>{order.customerCity}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Dirección</p>
                <p>{order.customerAddress}</p>
              </div>
              {order.customerNotes && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Notas</p>
                  <p className="text-muted-foreground">{order.customerNotes}</p>
                </div>
              )}
            </div>
          </div>
          
          {(order.stockReservationExpiresAt || order.cancelledAt || order.confirmedAt) && (
            <div className="bg-surface border border-border p-6 space-y-4">
              <h2 className="font-heading text-lg tracking-widest uppercase flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-accent" />
                Timestamps
              </h2>
              <div className="space-y-2 text-xs font-body text-muted-foreground">
                {order.stockReservationExpiresAt && (
                  <p>Reserva expira: {formatDateBogota(order.stockReservationExpiresAt)}</p>
                )}
                {order.confirmedAt && (
                  <p>Confirmado: {formatDateBogota(order.confirmedAt)}</p>
                )}
                {order.shippedAt && (
                  <p>Enviado: {formatDateBogota(order.shippedAt)}</p>
                )}
                {order.cancelledAt && (
                  <p className="text-red-400">Cancelado: {formatDateBogota(order.cancelledAt)}</p>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
