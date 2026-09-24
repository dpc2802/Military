import fs from "fs";
const emailPath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/lib/emails/OrderShippedEmail.tsx";
let code = fs.readFileSync(emailPath, "utf-8");

// Inside OrderShippedEmail, let's look for "Dirección de Entrega" block and insert the Tracking block above it
const searchString = `<div style={{ marginBottom: "25px" }}>
                <p style={{ margin: "0 0 10px", color: "#888888", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase" }}>
                  Dirección de Entrega
                </p>`;

const replacementString = `{order.trackingNumber && (
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
                  <a href={\`https://www.google.com/search?q=rastrear+envio+\${order.shippingCompany}+\${order.trackingNumber}\`} target="_blank" style={{ display: "inline-block", marginTop: "12px", padding: "8px 16px", backgroundColor: "#333", color: "#FFF", textDecoration: "none", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", borderRadius: "4px" }}>
                    Rastrear Paquete
                  </a>
                </div>
              )}
              
              <div style={{ marginBottom: "25px" }}>
                <p style={{ margin: "0 0 10px", color: "#888888", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase" }}>
                  Dirección de Entrega
                </p>`;

code = code.replace(searchString, replacementString);

fs.writeFileSync(emailPath, code, "utf-8");
console.log("Updated email template");
