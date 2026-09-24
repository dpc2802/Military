import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./db/index";
import { products } from "./db/schema";
import { eq } from "drizzle-orm";

async function setFeatured() {
  await db.update(products).set({ isFeatured: true });
  console.log("All products set to featured!");
  process.exit(0);
}

setFeatured().catch(console.error);
