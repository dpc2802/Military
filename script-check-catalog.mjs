import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/productos/page.tsx";
let code = fs.readFileSync(path, "utf-8");
console.log(code.includes("export const dynamic") ? "Catalog is dynamic" : "Catalog is static");
