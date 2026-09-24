import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/db/schema.ts";
let code = fs.readFileSync(path, "utf-8");

const oldTotal = '    totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),';
const newTrackingFields = `    totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
    
    // Logística y Envío
    trackingNumber: varchar("tracking_number", { length: 128 }),
    shippingCompany: varchar("shipping_company", { length: 64 }),`;

code = code.replace(oldTotal, newTrackingFields);
fs.writeFileSync(path, code, "utf-8");
console.log("Added tracking fields");
