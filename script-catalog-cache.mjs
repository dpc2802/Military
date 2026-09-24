import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/CatalogClient.tsx";
let code = fs.readFileSync(path, "utf-8");

code = code.replace(
  /const res = await fetch\(\`\/api\/products\?\$\{params\.toString\(\)\}\`\);/,
  `const res = await fetch(\`/api/products?\${params.toString()}\`, { cache: 'no-store' });`
);

fs.writeFileSync(path, code, "utf-8");
console.log("Updated CatalogClient fetch cache");
