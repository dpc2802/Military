/**
 * Plantilla de email para notificar al admin sobre un pedido PAGADO vía Wompi.
 * Tiene el badge verde "PAGO CONFIRMADO" en vez de "Pendiente WhatsApp".
 */

import * as React from "react";
import { formatCOP, formatDateBogota } from "@/lib/format";
import type { OrderWithItems } from "@/types";

interface PaidOrderEmailProps {
  order: OrderWithItems;
  transactionId?: string;
}

export default function PaidOrderEmail({ order, transactionId }: PaidOrderEmailProps) {
  const total = Number(order.totalAmount);

  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <style>{`
          body { margin: 0; padding: 0; background-color: #0D0F0C; font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 24px; background-color: #2C2C2C; border: 1px solid #3A3A3A; }
          .header-title { color: #C2B280; font-size: 20px; letter-spacing: 4px; font-weight: 700; text-transform: uppercase; margin: 0 0 4px; }
          .header-sub { color: #9CA3AF; font-size: 12px; margin: 0 0 24px; letter-spacing: 2px; }
          .hr { border: none; border-top: 1px solid #3A3A3A; margin: 0 0 24px; }
          .order-num { color: #C2B280; font-size: 22px; font-weight: 700; margin: 0; }
          .order-date { color: #9CA3AF; font-size: 12px; margin: 4px 0 0; }
          .badge-paid { display: inline-block; background-color: #166534; color: #86efac; padding: 4px 12px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; border: 1px solid #15803d; }
          .alert-box { background-color: #14532d; border: 1px solid #16a34a; padding: 12px 16px; margin-bottom: 24px; }
          .alert-text { color: #86efac; font-size: 13px; margin: 0; font-weight: 600; }
          .section { background-color: #1A1A1A; padding: 16px; margin-bottom: 24px; border: 1px solid #3A3A3A; }
          .label { color: #9CA3AF; font-size: 11px; margin: 0 0 12px; letter-spacing: 2px; text-transform: uppercase; }
          .customer-name { color: #F5F5F0; font-size: 15px; margin: 0 0 4px; font-weight: 600; }
          .customer-detail { color: #9CA3AF; font-size: 13px; margin: 0 0 4px; }
          .item-name { color: #F5F5F0; font-size: 14px; margin: 0 0 4px; font-weight: 600; }
          .item-detail { color: #9CA3AF; font-size: 12px; margin: 0; }
          .item-price { color: #C2B280; font-size: 14px; margin: 0; font-weight: 600; }
          .total-label { color: #F5F5F0; font-size: 16px; font-weight: 700; }
          .total-price { color: #4ade80; font-size: 20px; font-weight: 700; }
          .tx-id { color: #9CA3AF; font-size: 11px; margin: 4px 0 0; font-family: monospace; }
          .footer { color: #9CA3AF; font-size: 11px; text-align: center; margin: 0; }
          .action-btn { display: inline-block; background-color: #C2B280; color: #0D0F0C; padding: 10px 24px; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; margin-top: 16px; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <h1 className="header-title">SGB MILITARY SHOP</h1>
          <p className="header-sub">💳 PAGO ELECTRÓNICO CONFIRMADO — WOMPI</p>

          <hr className="hr" />

          {/* Alert verde */}
          <div className="alert-box">
            <p className="alert-text">✅ El pago fue aprobado automáticamente. Procede a preparar el envío.</p>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
            <div>
              <p className="order-num">{order.orderNumber}</p>
              <p className="order-date">{formatDateBogota(order.createdAt)}</p>
              {transactionId && <p className="tx-id">TX: {transactionId}</p>}
            </div>
            <span className="badge-paid">✓ Pago Confirmado</span>
          </div>

          <div className="section">
            <p className="label">Datos del cliente</p>
            <p className="customer-name">{order.customerName}</p>
            <p className="customer-detail">📞 {order.customerPhone}</p>
            <p className="customer-detail">📍 {order.customerCity} — {order.customerAddress}</p>
            {order.customerNotes && (
              <p className="customer-detail">📝 {order.customerNotes}</p>
            )}
          </div>

          <p className="label">Productos pedidos</p>
          {order.items.map((item, i) => (
            <div key={i} style={{ borderBottom: "1px solid #3A3A3A", paddingBottom: "12px", marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <p className="item-name">{item.productName}</p>
                  <p className="item-detail">
                    {item.size && `Talla: ${item.size}`}
                    {item.color && ` / Color: ${item.color}`}
                    {` × ${item.quantity}`}
                  </p>
                </div>
                <p className="item-price">{formatCOP(Number(item.subtotal))}</p>
              </div>
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
            <span className="total-label">TOTAL COBRADO</span>
            <span className="total-price">{formatCOP(total)}</span>
          </div>

          <hr className="hr" style={{ marginTop: "20px" }} />
          <p className="footer">
            El dinero fue cobrado automáticamente vía Wompi. Contacta al cliente para coordinar el envío.
          </p>
        </div>
      </body>
    </html>
  );
}
