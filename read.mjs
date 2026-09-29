import fs from "fs";
const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/consultar-pedido/page.tsx";
let c = fs.readFileSync(p, "utf-8");
console.log(c.substring(c.indexOf("const handleSearch"), c.indexOf("return (")));
