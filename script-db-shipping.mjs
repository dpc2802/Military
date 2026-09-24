import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/db/schema.ts";
let content = fs.readFileSync(path, "utf-8");

if (!content.includes("customerDni:")) {
  content = content.replace(
    /customerName:\s*varchar\("customer_name",\s*\{\s*length:\s*256\s*\}\)\.notNull\(\),/,
    `customerName: varchar("customer_name", { length: 256 }).notNull(),\n  customerDni: varchar("customer_dni", { length: 32 }).notNull().default(""),`
  );
}

if (!content.includes("customerDepartment:")) {
  content = content.replace(
    /customerCity:\s*varchar\("customer_city",\s*\{\s*length:\s*128\s*\}\)\.notNull\(\),/,
    `customerDepartment: varchar("customer_department", { length: 128 }).notNull().default(""),\n  customerCity: varchar("customer_city", { length: 128 }).notNull(),`
  );
}

fs.writeFileSync(path, content, "utf-8");
console.log("Added customerDni and customerDepartment to schema");
