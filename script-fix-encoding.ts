import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./db/index";
import { products, categories } from "./db/schema";
import { eq } from "drizzle-orm";

async function fixEncoding() {
  const allProds = await db.query.products.findMany();
  
  for (const p of allProds) {
    let newName = p.name.replace(/TÃ¡ctica/g, "Táctica").replace(/TÃƒÂ¡ctica/g, "Táctica");
    let newDesc = (p.description || "").replace(/TÃ¡ctica/g, "Táctica").replace(/TÃƒÂ¡ctica/g, "Táctica").replace(/geomÃ©trico/g, "geométrico").replace(/diseÃ±o/g, "diseño").replace(/DiseÃ±o/g, "Diseño").replace(/tÃ¡ctico/g, "táctico").replace(/tÃƒÂ¡ctico/g, "táctico").replace(/tÃ¡cticos/g, "tácticos");

    await db.update(products).set({
      name: newName,
      description: newDesc
    }).where(eq(products.id, p.id));
    console.log(`Updated: ${newName}`);
  }
  
  console.log("Fixed encoding!");
  process.exit(0);
}

fixEncoding().catch(console.error);
