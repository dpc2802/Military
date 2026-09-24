import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./db/index";
import { products } from "./db/schema";

async function printProds() {
  const allProds = await db.query.products.findMany();
  for (const p of allProds) {
    console.log(`[${p.id}] ${p.name}`);
    console.log(`Desc: ${p.description}`);
  }
  process.exit(0);
}

printProds().catch(console.error);
