import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/admin/(panel)/pedidos/[id]/actions.ts";
let content = fs.readFileSync(path, "utf-8");

// Remove Resend
content = content.replace(/import \{ Resend \} from "resend";\n/, "");
content = content.replace(/const resend = new Resend\(process\.env\.RESEND_API_KEY\);\n/, "");

// Add Nodemailer
content = content.replace(
  /import OrderShippedEmail from "@\/lib\/emails\/OrderShippedEmail";/,
  `import OrderShippedEmail from "@/lib/emails/OrderShippedEmail";\nimport { render } from "@react-email/render";\nimport { mailer, SENDER_EMAIL } from "@/lib/mail";`
);

const oldBlock = `if (order.customerEmail && process.env.RESEND_API_KEY) {
      resend.emails.send({
        from: "SGB Military <onboarding@resend.dev>",
        to: order.customerEmail,
        subject: \`🚚 Tu pedido \${order.orderNumber} va en camino - SGB Military\`,
        react: OrderShippedEmail({ order: order as any }),
      }).catch(e => console.error("[ACTIONS] Error enviando email de envío:", e));
    }`;

const newBlock = `if (order.customerEmail && process.env.SMTP_USER) {
      const html = render(OrderShippedEmail({ order: order as any }));
      mailer.sendMail({
        from: SENDER_EMAIL,
        to: order.customerEmail,
        subject: \`🚚 Tu pedido \${order.orderNumber} va en camino - SGB Military\`,
        html: html,
      }).catch(e => console.error("[ACTIONS] Error enviando email de envío:", e));
    }`;

content = content.replace(oldBlock, newBlock);

fs.writeFileSync(path, content, "utf-8");
console.log("Updated actions.ts for Nodemailer");
