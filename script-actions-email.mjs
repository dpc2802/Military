import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/admin/(panel)/pedidos/[id]/actions.ts";
let content = fs.readFileSync(path, "utf-8");

if (!content.includes("OrderShippedEmail")) {
  // Add imports
  content = content.replace(
    /import type \{ OrderStatus \} from "@\/types";/,
    `import type { OrderStatus } from "@/types";\nimport { Resend } from "resend";\nimport OrderShippedEmail from "@/lib/emails/OrderShippedEmail";`
  );
  
  // Initialize Resend
  content = content.replace(
    /export async function updateOrderStatus/,
    `const resend = new Resend(process.env.RESEND_API_KEY);\n\nexport async function updateOrderStatus`
  );

  // Send email inside the if (newStatus === "enviado") block
  const oldEnviadoBlock = `} else if (newStatus === "enviado") {\n    updateData.shippedAt = now;\n  }`;
  const newEnviadoBlock = `} else if (newStatus === "enviado") {
    updateData.shippedAt = now;
    
    if (order.customerEmail && process.env.RESEND_API_KEY) {
      resend.emails.send({
        from: "SGB Military <onboarding@resend.dev>",
        to: order.customerEmail,
        subject: \`🚚 Tu pedido \${order.orderNumber} va en camino - SGB Military\`,
        react: OrderShippedEmail({ order: order as any }),
      }).catch(e => console.error("[ACTIONS] Error enviando email de envío:", e));
    }
  }`;

  content = content.replace(oldEnviadoBlock, newEnviadoBlock);
  fs.writeFileSync(path, content, "utf-8");
  console.log("Added OrderShippedEmail logic to actions.ts");
} else {
  console.log("OrderShippedEmail already in actions.ts");
}
