import fs from "fs";
const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/api/checkout/wompi-verify/route.ts";
let c = fs.readFileSync(p, "utf-8");

if (!c.includes("import crypto from")) {
  c = c.replace('import { formatCOP } from "@/lib/format";', 'import { formatCOP } from "@/lib/format";\nimport crypto from "crypto";');
}

c = c.replace(
  'return NextResponse.json({ success: true, status: order.status, orderNumber: order.orderNumber });',
  `
    let signature = undefined;
    let amountInCents = 0;
    if (order.status !== "APPROVED") {
      amountInCents = Math.round(Number(order.totalAmount) * 100);
      const secret = process.env.WOMPI_INTEGRITY_SECRET || "test_integrity_y3BxtSzFUdNLt0Ch1zUZiMC2fp5hJaNr";
      const stringToHash = \`\${order.orderNumber}\${amountInCents}COP\${secret}\`;
      signature = crypto.createHash("sha256").update(stringToHash).digest("hex");
    }

    return NextResponse.json({ 
      success: true, 
      status: order.status, 
      orderNumber: order.orderNumber,
      amountInCents,
      signature
    });
  `
);

fs.writeFileSync(p, c, "utf-8");
console.log("Patched wompi-verify API");
