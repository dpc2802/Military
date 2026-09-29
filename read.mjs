import fs from "fs";
const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/checkout/page.tsx";
let c = fs.readFileSync(p, "utf-8");
console.log(c.substring(c.indexOf("data.paymentMethod === \"wompi\""), c.indexOf("} else {") + 10));
