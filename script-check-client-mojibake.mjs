import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/ProductDetailClient.tsx";
let code = fs.readFileSync(path, "utf-8");
console.log(code.includes("Ã") ? "Found Mojibake in ProductDetailClient.tsx" : "No Mojibake in ProductDetailClient.tsx");
