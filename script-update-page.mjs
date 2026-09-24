import fs from "fs";
const pagePath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/admin/(panel)/pedidos/[id]/page.tsx";
let code = fs.readFileSync(pagePath, "utf-8");

code = code.replace(
  /<StatusSelect orderId=\{order\.id\} currentStatus=\{order\.status as OrderStatus\} \/>/,
  `<StatusSelect orderId={order.id} currentStatus={order.status as OrderStatus} trackingNumber={order.trackingNumber} shippingCompany={order.shippingCompany} />`
);

// We can also display the tracking info in the sidebar below the delivery address!
const oldEnvioBlock = `{order.customerNotes && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Notas</p>
                  <p className="text-muted-foreground">{order.customerNotes}</p>
                </div>
              )}`;
const newEnvioBlock = `{order.customerNotes && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest">Notas</p>
                  <p className="text-muted-foreground">{order.customerNotes}</p>
                </div>
              )}
              {order.trackingNumber && (
                <div className="pt-3 border-t border-border mt-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest text-accent">Guía de Envío</p>
                  <p className="font-bold">{order.shippingCompany}</p>
                  <p className="text-sm font-mono bg-background px-2 py-1 inline-block mt-1">{order.trackingNumber}</p>
                </div>
              )}`;
code = code.replace(oldEnvioBlock, newEnvioBlock);

fs.writeFileSync(pagePath, code, "utf-8");
console.log("Updated page.tsx");
