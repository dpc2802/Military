import fs from "fs";
const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/admin/(panel)/cupones/page.tsx";
let c = fs.readFileSync(p, "utf-8");
console.log(c.substring(c.indexOf("Generar Cupones") - 50, c.indexOf("Generar Cupones") + 800));
