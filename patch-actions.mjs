import fs from "fs";
const p1 = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/admin/(panel)/pedidos/[id]/actions.ts";
let c = fs.readFileSync(p1, "utf-8");

const oldStr = `  } else if (newStatus === "enviado") {
    updateData.shippedAt = now;
    
    if (order.customerEmail && process.env.SMTP_USER) {`;

const newStr = `  } else if (newStatus === "enviado") {
    updateData.shippedAt = now;
    if (trackingData) {
      updateData.shippingCompany = trackingData.company;
      updateData.trackingNumber = trackingData.tracking;
      order.shippingCompany = trackingData.company; // mutar el objeto para que lo reciba el email
      order.trackingNumber = trackingData.tracking;
    }
    
    if (order.customerEmail && process.env.SMTP_USER) {`;

c = c.replace(oldStr, newStr);
fs.writeFileSync(p1, c, "utf-8");
console.log("Fixed tracking data persistence in actions");
