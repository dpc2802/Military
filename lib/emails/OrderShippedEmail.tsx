/**
 * Plantilla de email enviada al CLIENTE cuando su pedido ha sido marcado como "enviado".
 */

import * as React from "react";
import type { OrderWithItems } from "@/types";

interface OrderShippedEmailProps {
  order: OrderWithItems;
}

export default function OrderShippedEmail({ order }: OrderShippedEmailProps) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <style>{`
          body { margin: 0; padding: 0; background-color: #0D0F0C; font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 32px; background-color: #121212; border: 1px solid #2A2A2A; }
          .logo { color: #C2B280; font-size: 24px; letter-spacing: 4px; font-weight: 700; text-transform: uppercase; margin: 0 0 16px; text-align: center; }
          .header-title { color: #F5F5F0; font-size: 24px; font-weight: 700; margin: 0 0 8px; text-align: center; }
          .header-sub { color: #60a5fa; font-size: 14px; margin: 0 0 32px; text-align: center; letter-spacing: 1px; }
          .hr { border: none; border-top: 1px solid #2A2A2A; margin: 24px 0; }
          .section-title { color: #C2B280; font-size: 12px; margin: 0 0 16px; letter-spacing: 2px; text-transform: uppercase; }
          .text-main { color: #D1D5DB; font-size: 14px; line-height: 1.6; margin: 0 0 16px; }
          .order-box { background-color: #1A1A1A; border: 1px solid #2A2A2A; padding: 20px; margin-bottom: 24px; text-align: center; }
          .order-label { color: #9CA3AF; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 8px; }
          .order-number { color: #F5F5F0; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: 2px; }
          .footer { color: #6B7280; font-size: 11px; text-align: center; margin: 32px 0 0; line-height: 1.5; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <p className="logo">SGB MILITARY</p>
          <h1 className="header-title">¡Buenas noticias, {order.customerName.split(" ")[0]}!</h1>
          <p className="header-sub">Tu pedido ya va en camino hacia ti.</p>

          <p className="text-main">
            Hemos entregado tu paquete a la transportadora. Te enviaremos el número de guía por WhatsApp en el transcurso del día para que puedas rastrearlo en todo momento.
          </p>

          <div className="order-box">
            <p className="order-label">Número de Pedido</p>
            <p className="order-number">{order.orderNumber}</p>
          </div>

          <div style={{ marginTop: "32px", backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", padding: "20px" }}>
            <p className="section-title">Dirección de Entrega</p>
            <p className="text-main" style={{ margin: 0 }}>
              <strong>{order.customerName}</strong><br />
              {order.customerAddress}<br />
              {order.customerCity}<br />
              Tel: {order.customerPhone}
            </p>
          </div>

          <p className="footer">
            Si tienes alguna duda o necesitas cambiar algo, contáctanos cuanto antes por WhatsApp.<br />
            © {new Date().getFullYear()} SGB Military Shop Colombia. Todos los derechos reservados.
          </p>
        </div>
      </body>
    </html>
  );
}
