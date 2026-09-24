import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/SearchOverlay.tsx";
let code = fs.readFileSync(path, "utf-8");
code = code.replace(/router\.push\(\`\/productos\?q=\$\{encodeURIComponent\(query\.trim\(\)\)\}\`\);/, `router.push(\`/productos?busqueda=\${encodeURIComponent(query.trim())}\`);`);
fs.writeFileSync(path, code, "utf-8");
console.log("Updated SearchOverlay to use busqueda");
