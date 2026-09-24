import * as React from "react";
import { formatCOP } from "@/lib/format";
import type { OrderWithItems } from "@/types";

interface OrderShippedEmailProps {
  order: OrderWithItems;
}

export default function OrderShippedEmail({ order }: OrderShippedEmailProps) {
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
              <p style={{ margin: "12px 0 0", color: "#4ade80", fontSize: "16px", fontWeight: "bold" }}>
                ¡Tu pedido va en camino! 🚚
              </p>
              <p style={{ margin: "6px 0 0", color: "#888888", fontSize: "14px" }}>
                Hola {order.customerName.split(" ")[0]}, hemos despachado tu orden.
              </p>
            </td>
          </tr>

          {/* Info Block */}
          <tr>
            <td style={{ padding: "30px" }}>
              
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: "25px", backgroundColor: "#1A1A1A", padding: "20px", borderRadius: "6px", border: "1px solid #2A2A2A" }}>
                <tr>
                  <td align="center">
                    <p style={{ margin: "0", color: "#888888", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Pedido No.</p>
                    <p style={{ margin: "4px 0 0", color: "#FFFFFF", fontSize: "20px", fontWeight: "bold" }}>{order.orderNumber}</p>
                  </td>
                </tr>
              </table>

              {order.trackingNumber && (
                <div style={{ marginBottom: "25px", backgroundColor: "#1A1A1A", borderLeft: "4px solid #C2B280", padding: "20px" }}>
                  <p style={{ margin: "0 0 8px", color: "#888888", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase" }}>
                    Información de Rastreo
                  </p>
                  <p style={{ margin: "0 0 4px", color: "#FFFFFF", fontSize: "15px" }}>
                    Transportadora: <strong>{order.shippingCompany}</strong>
                  </p>
                  <p style={{ margin: "0", color: "#FFFFFF", fontSize: "15px" }}>
                    Número de Guía: <strong style={{ color: "#C2B280" }}>{order.trackingNumber}</strong>
                  </p>
                  <a href={`https://www.google.com/search?q=rastrear+envio+${order.shippingCompany}+${order.trackingNumber}`} target="_blank" style={{ display: "inline-block", marginTop: "12px", padding: "8px 16px", backgroundColor: "#333", color: "#FFF", textDecoration: "none", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", borderRadius: "4px" }}>
                    Rastrear Paquete
                  </a>
                </div>
              )}
              
              <div style={{ marginBottom: "25px" }}>
                <p style={{ margin: "0 0 10px", color: "#888888", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase" }}>
                  Dirección de Entrega
                </p>
                <p style={{ margin: "0 0 4px", color: "#FFFFFF", fontSize: "14px" }}>{order.customerName}</p>
                <p style={{ margin: "0 0 4px", color: "#CCCCCC", fontSize: "14px" }}>{order.customerAddress}</p>
                <p style={{ margin: "0 0 4px", color: "#CCCCCC", fontSize: "14px" }}>{order.customerCity}, {order.customerDepartment}</p>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #333333", margin: "0 0 25px" }} />

              {/* Items List */}
              <p style={{ margin: "0 0 15px", color: "#888888", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase" }}>
                Productos Enviados
              </p>
              
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: "15px" }}>
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
                  </tr>
                ))}
              </table>

            </td>
          </tr>

        </table>
        
        <p style={{ textAlign: "center", color: "#666666", fontSize: "12px", marginTop: "20px", lineHeight: "1.5" }}>
          Gracias por confiar en SGB Military.<br/>
          Si tienes problemas con la entrega, escríbenos respondiendo a este correo.
        </p>

      </body>
    </html>
  );
}
