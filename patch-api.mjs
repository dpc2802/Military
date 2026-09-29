import fs from "fs";

const apiPath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/api/checkout/route.ts";
let api = fs.readFileSync(apiPath, "utf-8");

if (!api.includes("const totalAmount = subtotalAmount + shippingCost - discountAmount;")) {
  api = api.replace(
    `// 3. Crear Pedido y Reservar Stock`,
    `const totalAmount = subtotalAmount + shippingCost - discountAmount;\n\n    // 3. Crear Pedido y Reservar Stock`
  );
  fs.writeFileSync(apiPath, api, "utf-8");
  console.log("Restored totalAmount in API");
} else {
  console.log("totalAmount already exists");
}
