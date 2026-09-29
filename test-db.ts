import { db } from "./db/index";
import { productVariants, products } from "./db/schema";

async function run() {
  const vars = await db.query.productVariants.findFirst({
    with: { product: true }
  });
  console.log(JSON.stringify(vars, null, 2));
  process.exit(0);
}
run();
