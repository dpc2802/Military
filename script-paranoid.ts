import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";

async function check() {
  const sql = neon(process.env.DATABASE_URL);
  const rows = await sql`SELECT id, name, description FROM products WHERE id = 10`;
  console.log(rows[0]);
  process.exit(0);
}
check().catch(console.error);
