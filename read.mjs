import fs from "fs";
const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/checkout/page.tsx";
let c = fs.readFileSync(p, "utf-8");
const start = c.indexOf("customerNotes");
const end = c.indexOf("</form>");
console.log(c.substring(Math.max(0, start - 200), end + 200));
