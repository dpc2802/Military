import fs from "fs";
const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/checkout/page.tsx";
let c = fs.readFileSync(p, "utf-8");
const idx = c.indexOf("const { items");
console.log("CHECKOUT:\n", c.substring(idx - 100, idx + 200));
