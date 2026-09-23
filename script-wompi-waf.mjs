import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/checkout/page.tsx";
let content = fs.readFileSync(path, "utf-8");

// We need to remove redirectUrl from the WidgetCheckout configuration
content = content.replace(
  "publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || \"pub_test_7ACX50PPzAW8WBB3ZQwqZRO6wMZaxB6R\",\n                redirectUrl: `${window.location.origin}/checkout/wompi-result`",
  "publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || \"pub_test_7ACX50PPzAW8WBB3ZQwqZRO6wMZaxB6R\""
);

// Fallback replace if the exact spacing didn't match
content = content.replace(/,\s*redirectUrl:\s*`\$\{window\.location\.origin\}\/checkout\/wompi-result`/g, "");

fs.writeFileSync(path, content, "utf-8");
console.log("Removed redirectUrl");
