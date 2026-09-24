/**
 * Plantilla de email enviada al CLIENTE cuando su pago en Wompi es aprobado.
 */

import * as React from "react";
import { formatCOP, formatDateBogota } from "@/lib/format";
import type { OrderWithItems } from "@/types";

interface CustomerReceiptEmailProps {
  order: OrderWithItems;
  transactionId?: string;
}

export default function CustomerReceiptEmail({ order, transactionId }: CustomerReceiptEmailProps) {
  const total = Number(order.totalAmount);

  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <style>{`
          body { margin: 0; padding: 0; background-color: #0D0F0C; font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 32px; background-color: #121212; border: 1px solid #2A2A2A; }
          .logo { color: #C2B280; font-size: 24px; letter-spacing: 4px; font-weight: 700; text-transform: uppercase; margin: 0 0 16px; text-align: center; }
          .header-title { color: #F5F5F0; font-size: 24px; font-weight: 700; margin: 0 0 8px; text-align: center; }
          .header-sub { color: #86efac; font-size: 14px; margin: 0 0 32px; text-align: center; letter-spacing: 1px; }
          .hr { border: none; border-top: 1px solid #2A2A2A; margin: 24px 0; }
          .section-title { color: #C2B280; font-size: 12px; margin: 0 0 16px; letter-spacing: 2px; text-transform: uppercase; }
          .text-main { color: #D1D5DB; font-size: 14px; line-height: 1.6; margin: 0 0 16px; }
          .order-box { background-color: #1A1A1A; border: 1px solid #2A2A2A; padding: 20px; margin-bottom: 24px; text-align: center; }
          .order-label { color: #9CA3AF; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 8px; }
          .order-number { color: #F5F5F0; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: 2px; }
          .item { border-bottom: 1px solid #2A2A2A; padding-bottom: 16px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
          .item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
          .item-name { color: #F5F5F0; font-size: 15px; margin: 0 0 4px; font-weight: 600; }
          .item-detail { color: #9CA3AF; font-size: 13px; margin: 0; }
          .item-price { color: #F5F5F0; font-size: 15px; margin: 0; font-weight: 600; }
          .total-row { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 16px; border-top: 1px solid #3A3A3A; }
          .total-label { color: #C2B280; font-size: 14px; font-weight: 700; letter-spacing: 1px; }
          .total-price { color: #C2B280; font-size: 20px; font-weight: 700; }
          .footer { color: #6B7280; font-size: 11px; text-align: center; margin: 32px 0 0; line-height: 1.5; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <p className="logo">SGB MILITARY</p>
          <h1 className="header-title">¡Gracias por tu compra, {order.customerName.split(" ")[0]}!</h1>
          <p className="header-sub">Tu pago ha sido confirmado con éxito.</p>

          <p className="text-main">
            Hemos recibido tu pedido y ya estamos preparándolo para el envío. Te notificaremos por este mismo medio tan pronto como tu paquete vaya en camino.
          </p>

          <div className="order-box">
            <p className="order-label">Número de Pedido</p>
            <p className="order-number">{order.orderNumber}</p>
          </div>

          <p className="section-title">Resumen de tu pedido</p>
          
          <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", padding: "24px" }}>
            {order.items.map((item, i) => (
              <div key={i} className="item">
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
            ))}

            <div className="total-row">
              <span className="total-label">TOTAL PAGADO</span>
              <span className="total-price">{formatCOP(total)}</span>
            </div>
          </div>

          <div style={{ marginTop: "32px", backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", padding: "20px" }}>
            <p className="section-title">Datos de Envío</p>
            <p className="text-main" style={{ margin: 0 }}>
              <strong>{order.customerName}</strong><br />
              {order.customerAddress}<br />
              {order.customerCity}<br />
              Tel: {order.customerPhone}
            </p>
          </div>

          <p className="footer">
            Si tienes alguna duda sobre tu pedido, puedes responder a este correo o escribirnos por WhatsApp.<br />
            © {new Date().getFullYear()} SGB Military Shop Colombia. Todos los derechos reservados.
          </p>
        </div>
      </body>
    </html>
  );
}
