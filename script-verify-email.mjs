import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/api/checkout/wompi-verify/route.ts";
let content = fs.readFileSync(path, "utf-8");

if (!content.includes("CustomerReceiptEmail")) {
  content = content.replace(
    /import PaidOrderEmail from "@\/lib\/emails\/PaidOrderEmail";/,
    `import PaidOrderEmail from "@/lib/emails/PaidOrderEmail";\nimport CustomerReceiptEmail from "@/lib/emails/CustomerReceiptEmail";`
  );

  const resendCode = `resend.emails
            .send({
              from: "SGB Military <onboarding@resend.dev>",
              to: ADMIN_EMAIL,
              subject: \`💰 PAGO CONFIRMADO: \${orderNumber} — \${totalFormatted} — SGB Military\`,
              react: PaidOrderEmail({ order: fullOrder as any, transactionId }),
            })
            .catch((e) => console.error("[WOMPI VERIFY] Error enviando email:", e));`;

  const newResendCode = `// 1. Email al dueño
          resend.emails
            .send({
              from: "SGB Military <onboarding@resend.dev>", // Cambia a tu dominio cuando lo verifiques en Resend
              to: ADMIN_EMAIL,
              subject: \`💰 PAGO CONFIRMADO: \${orderNumber} — \${totalFormatted} — SGB Military\`,
              react: PaidOrderEmail({ order: fullOrder as any, transactionId }),
            })
            .catch((e) => console.error("[WOMPI VERIFY] Error enviando email admin:", e));
          
          // 2. Email al cliente (Recibo de compra)
          if (fullOrder.customerEmail) {
            resend.emails
              .send({
                from: "SGB Military <onboarding@resend.dev>", // Cambia a tu dominio cuando lo verifiques
                to: fullOrder.customerEmail,
                subject: \`Confirmación de pedido \${orderNumber} - SGB Military\`,
                react: CustomerReceiptEmail({ order: fullOrder as any, transactionId }),
              })
              .catch((e) => console.error("[WOMPI VERIFY] Error enviando email cliente:", e));
          }`;

  content = content.replace(resendCode, newResendCode);
  fs.writeFileSync(path, content, "utf-8");
  console.log("Added CustomerReceiptEmail to wompi-verify route");
} else {
  console.log("CustomerReceiptEmail already present");
}
