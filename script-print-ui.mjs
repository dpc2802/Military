import fs from "fs";
const uiPath = "C:/Users/HP Core i5/Desktop/SGB MILITARY/app/admin/(panel)/pedidos/[id]/page.tsx";
let uiCode = fs.readFileSync(uiPath, "utf-8");
console.log(uiCode);
