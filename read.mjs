import fs from "fs";
const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/api/checkout/route.ts";
let c = fs.readFileSync(p, "utf-8");
const start = c.indexOf("const totalAmount");
console.log(c.substring(Math.max(0, start - 100), start + 2500));
