import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/productos/[slug]/page.tsx";
let code = fs.readFileSync(path, "utf-8");
console.log(code.substring(0, 400));
