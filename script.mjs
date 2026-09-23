import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/api/checkout/route.ts";
let content = fs.readFileSync(path, "utf-8");

// 1. Add paymentMethod to schema
content = content.replace(
  "customerNotes: z.string().optional(),",
  "customerNotes: z.string().optional(),\n  paymentMethod: z.enum(['whatsapp', 'wompi']).default('whatsapp'),"
);

// 2. Destructure paymentMethod
content = content.replace(
  "const { items, ...customerData } = result.data;",
  "const { items, paymentMethod, ...customerData } = result.data;"
);

// 3. Add to the insert query
content = content.replace(
  "customerNotes: customerData.customerNotes,",
  "customerNotes: customerData.customerNotes,\n      paymentMethod: paymentMethod,\n      status: paymentMethod === 'wompi' ? 'pendiente_pago' : 'pendiente_whatsapp',"
);

// 4. Update the email and return logic
const newReturn = `
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    let wompiCheckoutUrl = undefined;
    
    if (paymentMethod === "wompi" && fullOrder) {
      const amountInCents = Math.round(Number(fullOrder.totalAmount) * 100);
      const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || "pub_test_missing";
      const redirectUrl = \`\${SITE_URL}/checkout/wompi-result\`;
      wompiCheckoutUrl = \`https://checkout.wompi.co/p/?public-key=\${publicKey}&currency=COP&amount-in-cents=\${amountInCents}&reference=\${fullOrder.orderNumber}&redirect-url=\${redirectUrl}\`;
    }

    if (fullOrder && process.env.RESEND_API_KEY) {
`;

content = content.replace(
  "if (fullOrder && process.env.RESEND_API_KEY) {",
  newReturn
);

content = content.replace(
  "return NextResponse.json({ success: true, orderId: fullOrder?.id, orderNumber: fullOrder?.orderNumber });",
  "return NextResponse.json({ success: true, orderId: fullOrder?.id, orderNumber: fullOrder?.orderNumber, wompiCheckoutUrl });"
);

fs.writeFileSync(path, content, "utf-8");
console.log("Fixed route");
