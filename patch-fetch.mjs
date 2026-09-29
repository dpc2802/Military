import fs from "fs";
const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/consultar-pedido/page.tsx";
let c = fs.readFileSync(p, "utf-8");
c = c.replace(
  "const res = await fetch(`/api/orders/lookup?q=${encodeURIComponent(query.trim())}`);",
  "const res = await fetch(`/api/orders/lookup?order=${encodeURIComponent(orderNumber.trim())}&contact=${encodeURIComponent(contactInfo.trim())}`);"
);
fs.writeFileSync(p, c, "utf-8");
console.log("Patched fetch URL");
