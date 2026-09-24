import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/db/schema.ts";
let content = fs.readFileSync(path, "utf-8");

if (!content.includes("customerEmail:")) {
  content = content.replace(
    /customerName:\s*varchar\("customer_name",\s*\{\s*length:\s*256\s*\}\)\.notNull\(\),/,
    `customerName: varchar("customer_name", { length: 256 }).notNull(),\n  customerEmail: varchar("customer_email", { length: 256 }).notNull().default(""),`
  );
  fs.writeFileSync(path, content, "utf-8");
  console.log("Added customerEmail to schema");
} else {
  console.log("customerEmail already in schema");
}
