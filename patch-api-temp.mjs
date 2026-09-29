import fs from "fs";
const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/api/checkout/route.ts";
let c = fs.readFileSync(p, "utf-8");
c = c.replace('orderNumber: "TEMP"', 'orderNumber: "TEMP-" + Date.now()');
fs.writeFileSync(p, c, "utf-8");
console.log("Patched TEMP orderNumber bug");
