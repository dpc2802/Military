import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/productos/[slug]/page.tsx";
let code = fs.readFileSync(path, "utf-8");
const match = code.match(/export async function generateMetadata[\s\S]*?\}\n/);
if (match) console.log(match[0]);
