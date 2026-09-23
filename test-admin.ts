import 'dotenv/config';
import { db } from "./db/index.js";
import { adminUsers } from "./db/schema.js";

async function main() {
  const users = await db.select().from(adminUsers);
  console.log("Usuarios en BD:", users);
  process.exit(0);
}
main();
