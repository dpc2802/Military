import { db } from "./db/index.js";
import { productVariants, products } from "./db/schema.js";

async function run() {
  const vars = await db.query.productVariants.findFirst({
    with: { product: true }
  });
  console.log("Variant:", vars);
  process.exit(0);
}
run();
