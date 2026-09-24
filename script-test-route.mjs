import fs from "fs";

const testRouteCode = `import { NextResponse } from "next/server";
import { mailer, SENDER_EMAIL } from "@/lib/mail";

export async function GET() {
  try {
    if (!process.env.SMTP_USER) {
      return NextResponse.json({ error: "Falta SMTP_USER en Vercel" }, { status: 500 });
    }
    
    await mailer.sendMail({
      from: SENDER_EMAIL,
      to: "duvanpalacios830@gmail.com",
      subject: "TEST VERCEL",
      html: "<p>Si ves esto, Vercel SI puede enviar correos.</p>"
    });

    return NextResponse.json({ success: true, user: process.env.SMTP_USER });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
  }
}
`;

fs.mkdirSync("c:/Users/HP Core i5/Desktop/SGB MILITARY/app/api/test-email", { recursive: true });
fs.writeFileSync("c:/Users/HP Core i5/Desktop/SGB MILITARY/app/api/test-email/route.ts", testRouteCode, "utf-8");
console.log("Created test route");
