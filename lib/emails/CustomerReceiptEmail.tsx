import * as React from "react";
import { formatCOP, formatDateBogota } from "@/lib/format";
import type { OrderWithItems } from "@/types";

interface CustomerReceiptEmailProps {
  order: OrderWithItems;
  transactionId: string;
}

export default function CustomerReceiptEmail({ order, transactionId }: CustomerReceiptEmailProps) {
  const total = Number(order.totalAmount);

  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{ margin: 0, padding: "20px", backgroundColor: "#0A0A0A", fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif", color: "#EDEDED", WebkitFontSmoothing: "antialiased" }}>
        
        <table width="100%" cellPadding="0" cellSpacing="0" style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "#121212", border: "1px solid #333333", borderRadius: "8px", overflow: "hidden" }}>
          
          {/* Header */}
          <tr>
            <td style={{ padding: "40px 30px", borderBottom: "1px solid #333333", backgroundColor: "#0f1410", textAlign: "center" }}>
              <h1 style={{ margin: "0", color: "#C2B280", fontSize: "24px", letterSpacing: "3px", textTransform: "uppercase" }}>
                SGB MILITARY
              </h1>
              <p style={{ margin: "12px 0 0", color: "#FFFFFF", fontSize: "16px" }}>
                ¡Gracias por tu compra, {order.customerName.split(" ")[0]}!
              </p>
              <p style={{ margin: "6px 0 0", color: "#888888", fontSize: "14px" }}>
                Hemos recibido tu pedido y estamos preparándolo para el envío.
              </p>
            </td>
          </tr>

          {/* Info Block */}
          <tr>
            <td style={{ padding: "30px" }}>
              
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: "25px" }}>
                <tr>
                  <td align="left">
                    <p style={{ margin: "0", color: "#888888", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Pedido No.</p>
                    <p style={{ margin: "4px 0 0", color: "#FFFFFF", fontSize: "18px", fontWeight: "bold" }}>{order.orderNumber}</p>
                  </td>
                  <td align="right">
                    <p style={{ margin: "0", color: "#888888", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Fecha</p>
                    <p style={{ margin: "4px 0 0", color: "#FFFFFF", fontSize: "14px" }}>{formatDateBogota(order.createdAt)}</p>
                  </td>
                </tr>
              </table>

              <hr style={{ border: "none", borderTop: "1px solid #333333", margin: "0 0 25px" }} />

              {/* Items List */}
              <p style={{ margin: "0 0 15px", color: "#888888", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase" }}>
                Tu Pedido
              </p>
              
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: "25px" }}>
                {order.items.map((item, i) => (
                  <tr key={i}>
                    <td style={{ paddingBottom: "15px", borderBottom: i === order.items.length - 1 ? "none" : "1px solid #333333", paddingTop: i === 0 ? "0" : "15px" }}>
                      <p style={{ margin: "0 0 4px", color: "#FFFFFF", fontSize: "15px", fontWeight: "bold" }}>
                        {item.productName}
                      </p>
                      <p style={{ margin: "0", color: "#888888", fontSize: "13px" }}>
                        {item.size ? `Talla: ${item.size}` : ""}
                        {item.size && item.color ? " • " : ""}
                        {item.color ? `Color: ${item.color}` : ""}
                        {(item.size || item.color) ? " • " : ""}
                        Cantidad: {item.quantity}
                      </p>
                    </td>
                    <td align="right" valign="top" style={{ paddingTop: i === 0 ? "0" : "15px", borderBottom: i === order.items.length - 1 ? "none" : "1px solid #333333" }}>
                      <p style={{ margin: "0", color: "#C2B280", fontSize: "15px", fontWeight: "bold" }}>
                        {formatCOP(Number(item.subtotal))}
                      </p>
                    </td>
                  </tr>
                ))}
              </table>

              <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: "#1A1A1A", borderRadius: "6px", padding: "15px" }}>
                <tr>
                  <td align="left">
                    <span style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: "bold" }}>TOTAL PAGADO</span>
                  </td>
                  <td align="right">
                    <span style={{ color: "#C2B280", fontSize: "18px", fontWeight: "bold" }}>{formatCOP(total)}</span>
                  </td>
                </tr>
              </table>

              <div style={{ marginTop: "30px" }}>
                <p style={{ margin: "0 0 10px", color: "#888888", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase" }}>
                  Datos de Envío
                </p>
                <p style={{ margin: "0 0 4px", color: "#FFFFFF", fontSize: "14px" }}>{order.customerName}</p>
                <p style={{ margin: "0 0 4px", color: "#CCCCCC", fontSize: "14px" }}>{order.customerAddress}</p>
                <p style={{ margin: "0 0 4px", color: "#CCCCCC", fontSize: "14px" }}>{order.customerCity}, {order.customerDepartment}</p>
                <p style={{ margin: "0", color: "#CCCCCC", fontSize: "14px" }}>Tel: {order.customerPhone}</p>
              </div>

            </td>
          </tr>

        </table>
        
        <p style={{ textAlign: "center", color: "#666666", fontSize: "12px", marginTop: "20px", lineHeight: "1.5" }}>
          Recibirás otro correo cuando tu pedido sea despachado.<br/>
          Si tienes alguna duda, responde a este correo.
        </p>

      </body>
    </html>
  );
}
