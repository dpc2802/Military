import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./db/index";

async function dumpText() {
  const cats = await db.query.categories.findMany();
  console.log("--- CATEGORIES ---");
  for (const c of cats) {
    console.log(`[${c.id}] ${c.name} - ${c.description}`);
  }

  const prods = await db.query.products.findMany();
  console.log("\n--- PRODUCTS ---");
  for (const p of prods) {
    console.log(`[${p.id}] ${p.name} - ${p.description}`);
  }
  process.exit(0);
}

dumpText().catch(console.error);
