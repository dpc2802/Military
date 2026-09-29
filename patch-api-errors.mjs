import fs from "fs";
const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/api/checkout/route.ts";
let c = fs.readFileSync(p, "utf-8");
c = c.replace(
  'import { eq, inArray, sql } from "drizzle-orm";',
  'import { eq, inArray, sql, and } from "drizzle-orm";'
);
c = c.replace(
  'return NextResponse.json({ error: "Error procesando el pedido" }, { status: 500 });',
  'return NextResponse.json({ error: "Error procesando el pedido: " + (error instanceof Error ? error.message : String(error)) }, { status: 500 });'
);
fs.writeFileSync(p, c, "utf-8");
console.log("Patched API route to include 'and' and return verbose errors");
