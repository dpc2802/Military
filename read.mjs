import fs from "fs";
const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/types/index.ts";
let c = fs.readFileSync(p, "utf-8");
// Print CartState section
const idx = c.indexOf("CartState");
console.log(c.substring(idx - 20, idx + 600));
