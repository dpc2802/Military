/**
 * Plantilla de email para notificar al admin sobre un nuevo pedido.
 * Enviado vía Resend al completar el checkout por WhatsApp.
 */

import * as React from "react";
import { formatCOP, formatDateBogota } from "@/lib/format";
import type { OrderWithItems } from "@/types";

interface NewOrderEmailProps {
  order: OrderWithItems;
}

export default function NewOrderEmail({ order }: NewOrderEmailProps) {
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
          .badge { display: inline-block; background-color: #4B5320; color: #F5F5F0; padding: 4px 12px; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; }
          .section { background-color: #1A1A1A; padding: 16px; margin-bottom: 24px; border: 1px solid #3A3A3A; }
          .label { color: #9CA3AF; font-size: 11px; margin: 0 0 12px; letter-spacing: 2px; text-transform: uppercase; }
          .customer-name { color: #F5F5F0; font-size: 15px; margin: 0 0 4px; font-weight: 600; }
          .customer-detail { color: #9CA3AF; font-size: 13px; margin: 0 0 4px; }
          .note { color: #C2B280; font-size: 12px; margin: 8px 0 0; }
          .item { border-bottom: 1px solid #3A3A3A; padding-bottom: 12px; margin-bottom: 12px; display: flex; justify-content: space-between; }
          .item-name { color: #F5F5F0; font-size: 14px; margin: 0 0 4px; font-weight: 600; }
          .item-detail { color: #9CA3AF; font-size: 12px; margin: 0; }
          .item-price { color: #C2B280; font-size: 14px; margin: 0; font-weight: 600; }
          .total-label { color: #F5F5F0; font-size: 16px; font-weight: 700; }
          .total-price { color: #C2B280; font-size: 18px; font-weight: 700; }
          .footer { color: #9CA3AF; font-size: 11px; text-align: center; margin: 0; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <h1 className="header-title">SGB MILITARY SHOP</h1>
          <p className="header-sub">NUEVO PEDIDO — REQUIERE ATENCIÓN</p>

          <hr className="hr" />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
            <div>
              <p className="order-num">{order.orderNumber}</p>
              <p className="order-date">{formatDateBogota(order.createdAt)}</p>
            </div>
            <span className="badge">Pendiente WhatsApp</span>
          </div>

          <div className="section">
            <p className="label">Datos del cliente</p>
            <p className="customer-name">{order.customerName}</p>
            <p className="customer-detail">📞 {order.customerPhone}</p>
            <p className="customer-detail">📍 {order.customerCity} — {order.customerAddress}</p>
            {order.customerNotes && (
              <p className="note">📝 Notas: {order.customerNotes}</p>
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
            <span className="total-label">TOTAL</span>
            <span className="total-price">{formatCOP(total)}</span>
          </div>

          <hr className="hr" style={{ marginTop: "20px" }} />
          <p className="footer">
            Contactar al cliente por WhatsApp y confirmar el pedido en el panel admin.
          </p>
        </div>
      </body>
    </html>
  );
}
