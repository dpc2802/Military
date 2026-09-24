import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/db/schema.ts";
let code = fs.readFileSync(path, "utf-8");

const webhookTable = `
// ─── WEBHOOK LOGS (Auditoría de Pagos) ───────────────────────────────────────
export const paymentEvents = pgTable("payment_events", {
  id: serial("id").primaryKey(),
  transactionId: varchar("transaction_id", { length: 128 }).notNull(),
  eventType: varchar("event_type", { length: 64 }).notNull(),
  payload: json("payload").notNull(),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
`;

if (!code.includes("payment_events")) {
  code += "\n" + webhookTable;
  fs.writeFileSync(path, code, "utf-8");
  console.log("Added paymentEvents table");
} else {
  console.log("Table already exists");
}
