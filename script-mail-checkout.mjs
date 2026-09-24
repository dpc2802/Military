import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/api/checkout/route.ts";
let content = fs.readFileSync(path, "utf-8");

// Remove Resend imports and instantiate
content = content.replace(/import \{ Resend \} from "resend";\n/, "");
content = content.replace(/const resend = new Resend\(process\.env\.RESEND_API_KEY\);\n/, "");

// Add Nodemailer imports
content = content.replace(
  /import NewOrderEmail from "@\/lib\/emails\/NewOrderEmail";/,
  `import NewOrderEmail from "@/lib/emails/NewOrderEmail";\nimport { render } from "@react-email/render";\nimport { mailer, SENDER_EMAIL } from "@/lib/mail";`
);

// Replace the Resend block
const oldResendBlock = `if (fullOrder && process.env.RESEND_API_KEY) {
      resend.emails.send({
        from: "SGB Military <onboarding@resend.dev>", // Cambiar por tu dominio verificado si tenés
        to: ADMIN_EMAIL,
        subject: \`NUEVO PEDIDO: \${orderNumber} - SGB Military\`,
        react: NewOrderEmail({ order: fullOrder as any }),
      }).catch(e => console.error("Error enviando email con Resend:", e));
    }`;

const newNodemailerBlock = `if (fullOrder && process.env.SMTP_USER) {
      const emailHtml = render(NewOrderEmail({ order: fullOrder as any }));
      mailer.sendMail({
        from: SENDER_EMAIL,
        to: ADMIN_EMAIL,
        subject: \`NUEVO PEDIDO: \${orderNumber} - SGB Military\`,
        html: emailHtml,
      }).catch(e => console.error("Error enviando email con Nodemailer:", e));
    }`;

content = content.replace(oldResendBlock, newNodemailerBlock);
fs.writeFileSync(path, content, "utf-8");
console.log("Updated checkout/route.ts for Nodemailer");
