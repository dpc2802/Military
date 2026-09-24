import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/api/checkout/wompi-verify/route.ts";
let content = fs.readFileSync(path, "utf-8");

// Remove Resend
content = content.replace(/import \{ Resend \} from "resend";\n/, "");
content = content.replace(/const resend = new Resend\(process\.env\.RESEND_API_KEY\);\n/, "");

// Add Nodemailer
content = content.replace(
  /import CustomerReceiptEmail from "@\/lib\/emails\/CustomerReceiptEmail";/,
  `import CustomerReceiptEmail from "@/lib/emails/CustomerReceiptEmail";\nimport { render } from "@react-email/render";\nimport { mailer, SENDER_EMAIL } from "@/lib/mail";`
);

// Replace Resend blocks
const oldBlock1 = `if (process.env.RESEND_API_KEY) {`;
const newBlock1 = `if (process.env.SMTP_USER) {`;
content = content.replace(oldBlock1, newBlock1);

const oldBlock2 = `// 1. Email al dueño
          resend.emails
            .send({
              from: "SGB Military <onboarding@resend.dev>", // Cambia a tu dominio cuando lo verifiques en Resend
              to: ADMIN_EMAIL,
              subject: \`💰 PAGO CONFIRMADO: \${orderNumber} — \${totalFormatted} — SGB Military\`,
              react: PaidOrderEmail({ order: fullOrder as any, transactionId }),
            })
            .catch((e) => console.error("[WOMPI VERIFY] Error enviando email admin:", e));`;

const newBlock2 = `// 1. Email al dueño
          const adminHtml = render(PaidOrderEmail({ order: fullOrder as any, transactionId }));
          mailer.sendMail({
            from: SENDER_EMAIL,
            to: ADMIN_EMAIL,
            subject: \`💰 PAGO CONFIRMADO: \${orderNumber} — \${totalFormatted} — SGB Military\`,
            html: adminHtml,
          }).catch((e) => console.error("[WOMPI VERIFY] Error enviando email admin:", e));`;
content = content.replace(oldBlock2, newBlock2);

const oldBlock3 = `// 2. Email al cliente (Recibo de compra)
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

const newBlock3 = `// 2. Email al cliente (Recibo de compra)
          if (fullOrder.customerEmail) {
            const clientHtml = render(CustomerReceiptEmail({ order: fullOrder as any, transactionId }));
            mailer.sendMail({
              from: SENDER_EMAIL,
              to: fullOrder.customerEmail,
              subject: \`Confirmación de pedido \${orderNumber} - SGB Military\`,
              html: clientHtml,
            }).catch((e) => console.error("[WOMPI VERIFY] Error enviando email cliente:", e));
          }`;
content = content.replace(oldBlock3, newBlock3);

fs.writeFileSync(path, content, "utf-8");
console.log("Updated wompi-verify/route.ts for Nodemailer");
