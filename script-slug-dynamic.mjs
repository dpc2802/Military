import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/productos/[slug]/page.tsx";
let code = fs.readFileSync(path, "utf-8");

if (!code.includes("export const dynamic")) {
  code = code.replace(
    /export default async function ProductPage\(\{/,
    `export const dynamic = "force-dynamic";\n\nexport default async function ProductPage({`
  );
  fs.writeFileSync(path, code, "utf-8");
  console.log("Added force-dynamic to product page");
} else {
  console.log("Already dynamic");
}
