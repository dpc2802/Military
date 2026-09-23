import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/checkout/page.tsx";
let content = fs.readFileSync(path, "utf-8");

content = content.replace(
  "publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || \"pub_test_7ACX50PPzAW8WBB3ZQwqZRO6wMZaxB6R\"\n              });",
  "publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || \"pub_test_7ACX50PPzAW8WBB3ZQwqZRO6wMZaxB6R\",\n                signature: { integrity: result.signature }\n              });"
);

fs.writeFileSync(path, content, "utf-8");
console.log("Added signature to frontend");
