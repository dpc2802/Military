import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/api/checkout/route.ts";
let content = fs.readFileSync(path, "utf-8");

content = content.replace(
  "return NextResponse.json({ success: true, orderId: fullOrder?.id, orderNumber: fullOrder?.orderNumber, wompiCheckoutUrl });",
  "return NextResponse.json({ success: true, orderId: fullOrder?.id, orderNumber: fullOrder?.orderNumber, wompiCheckoutUrl, amountInCents: fullOrder ? Math.round(Number(fullOrder.totalAmount) * 100) : 0 });"
);

fs.writeFileSync(path, content, "utf-8");
console.log("Updated API returns");
