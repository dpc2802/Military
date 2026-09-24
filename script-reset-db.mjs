import { db } from "./db/index.js";
import { products, productVariants, orders, orderItems, paymentEvents } from "./db/schema.js";

async function resetDb() {
  console.log("Deleting payment events...");
  await db.delete(paymentEvents);
  console.log("Deleting order items...");
  await db.delete(orderItems);
  console.log("Deleting orders...");
  await db.delete(orders);
  console.log("Deleting product variants...");
  await db.delete(productVariants);
  console.log("Deleting products...");
  await db.delete(products);
  console.log("Database reset complete!");
  process.exit(0);
}

resetDb().catch(console.error);
