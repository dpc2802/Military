import * as React from "react";
import { formatCOP, formatDateBogota } from "@/lib/format";
import type { OrderWithItems } from "@/types";

interface PaidOrderEmailProps {
  order: OrderWithItems;
  transactionId: string;
}

export default function PaidOrderEmail({ order, transactionId }: PaidOrderEmailProps) {
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
            <td style={{ padding: "30px 30px", borderBottom: "1px solid #333333", backgroundColor: "#0f1410", textAlign: "center" }}>
              <h1 style={{ margin: "0", color: "#C2B280", fontSize: "22px", letterSpacing: "3px", textTransform: "uppercase" }}>
                SGB MILITARY
              </h1>
              <p style={{ margin: "8px 0 0", color: "#4ade80", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", fontWeight: "bold" }}>
                NUEVO PAGO CONFIRMADO (WOMPI)
              </p>
            </td>
          </tr>

          {/* Info Block */}
          <tr>
            <td style={{ padding: "30px" }}>
              
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: "25px" }}>
                <tr>
                  <td align="left">
                    <p style={{ margin: "0", color: "#C2B280", fontSize: "20px", fontWeight: "bold" }}>{order.orderNumber}</p>
                    <p style={{ margin: "4px 0 0", color: "#888888", fontSize: "13px" }}>{formatDateBogota(order.createdAt)}</p>
                    <p style={{ margin: "4px 0 0", color: "#666666", fontSize: "11px" }}>Ref Wompi: {transactionId}</p>
                  </td>
                  <td align="right" valign="top">
                    <span style={{ backgroundColor: "#142c16", color: "#4ade80", padding: "6px 12px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold", letterSpacing: "1px", border: "1px solid #254a28" }}>
                      PAGADO
                    </span>
                  </td>
                </tr>
              </table>

              {/* Customer Box */}
              <div style={{ backgroundColor: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: "6px", padding: "20px", marginBottom: "30px" }}>
                <p style={{ margin: "0 0 15px", color: "#888888", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" }}>
                  Datos del Cliente (Para envío)
                </p>
                <table width="100%" cellPadding="0" cellSpacing="0" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                  <tr>
                    <td style={{ color: "#888888", width: "100px", paddingBottom: "8px" }}>Nombre:</td>
                    <td style={{ color: "#FFFFFF", fontWeight: "bold", paddingBottom: "8px" }}>{order.customerName}</td>
                  </tr>
                  <tr>
                    <td style={{ color: "#888888", paddingBottom: "8px" }}>Cédula:</td>
                    <td style={{ color: "#FFFFFF", paddingBottom: "8px" }}>{order.customerDni || "N/A"}</td>
                  </tr>
                  <tr>
                    <td style={{ color: "#888888", paddingBottom: "8px" }}>Correo:</td>
                    <td style={{ color: "#FFFFFF", paddingBottom: "8px" }}>{order.customerEmail || "N/A"}</td>
                  </tr>
                  <tr>
                    <td style={{ color: "#888888", paddingBottom: "8px" }}>Teléfono:</td>
                    <td style={{ color: "#FFFFFF", paddingBottom: "8px" }}>{order.customerPhone}</td>
                  </tr>
                  <tr>
                    <td style={{ color: "#888888", paddingBottom: "8px" }}>Depto:</td>
                    <td style={{ color: "#FFFFFF", paddingBottom: "8px" }}>{order.customerDepartment || "N/A"}</td>
                  </tr>
                  <tr>
                    <td style={{ color: "#888888", paddingBottom: "8px" }}>Ciudad:</td>
                    <td style={{ color: "#FFFFFF", paddingBottom: "8px" }}>{order.customerCity}</td>
                  </tr>
                  <tr>
                    <td style={{ color: "#888888" }}>Dirección:</td>
                    <td style={{ color: "#FFFFFF" }}>{order.customerAddress}</td>
                  </tr>
                </table>
                {order.customerNotes && (
                  <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "1px solid #333333" }}>
                    <p style={{ margin: 0, color: "#C2B280", fontSize: "13px" }}><strong>Notas:</strong> {order.customerNotes}</p>
                  </div>
                )}
              </div>

              {/* Items List */}
              <p style={{ margin: "0 0 15px", color: "#888888", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" }}>
                Resumen de Productos
              </p>
              
              <table width="100%" cellPadding="0" cellSpacing="0">
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

            </td>
          </tr>

          {/* Footer Total */}
          <tr>
            <td style={{ backgroundColor: "#1A1A1A", padding: "20px 30px", borderTop: "1px solid #333333" }}>
              <table width="100%" cellPadding="0" cellSpacing="0">
                <tr>
                  <td align="left">
                    <span style={{ color: "#FFFFFF", fontSize: "16px", fontWeight: "bold" }}>PAGADO (WOMPI)</span>
                  </td>
                  <td align="right">
                    <span style={{ color: "#4ade80", fontSize: "22px", fontWeight: "bold" }}>{formatCOP(total)}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        
        <p style={{ textAlign: "center", color: "#666666", fontSize: "12px", marginTop: "20px" }}>
          Ingresa a tu panel de administración para ver detalles y gestionar el envío.
        </p>

      </body>
    </html>
  );
}
