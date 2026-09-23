import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/api/checkout/route.ts";
let content = fs.readFileSync(path, "utf-8");

// Add crypto import if it doesn't exist
if (!content.includes("import crypto from")) {
  content = content.replace(
    'import { z } from "zod";',
    'import { z } from "zod";\nimport crypto from "crypto";'
  );
}

// Replace the return JSON line to include the signature calculation
const targetReturn = "return NextResponse.json({ success: true, orderId: fullOrder?.id, orderNumber: fullOrder?.orderNumber, wompiCheckoutUrl, amountInCents: fullOrder ? Math.round(Number(fullOrder.totalAmount) * 100) : 0 });";

const newReturn = `
    let signature = undefined;
    let amountInCents = 0;
    if (fullOrder && paymentMethod === "wompi") {
      amountInCents = Math.round(Number(fullOrder.totalAmount) * 100);
      const secret = process.env.WOMPI_INTEGRITY_SECRET || "test_integrity_y3BxtSzFUdNLt0Ch1zUZiMC2fp5hJaNr";
      const stringToHash = \`\${fullOrder.orderNumber}\${amountInCents}COP\${secret}\`;
      signature = crypto.createHash("sha256").update(stringToHash).digest("hex");
    }

    return NextResponse.json({ 
      success: true, 
      orderId: fullOrder?.id, 
      orderNumber: fullOrder?.orderNumber, 
      amountInCents,
      signature 
    });
`;

content = content.replace(targetReturn, newReturn);

fs.writeFileSync(path, content, "utf-8");
console.log("Added signature logic to API");
