import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/db/schema.ts";
let code = fs.readFileSync(path, "utf-8");

// Fix json import
code = code.replace(/import \{([\s\S]*?)text,([\s\S]*?)\} from "drizzle-orm\/pg-core";/, `import {$1text, json,$2} from "drizzle-orm/pg-core";`);

fs.writeFileSync(path, code, "utf-8");
console.log("Fixed import");
