import { NextResponse } from "next/server";
import { mailer, SENDER_EMAIL } from "@/lib/mail";
import { render } from "@react-email/render";
import CustomerReceiptEmail from "@/lib/emails/CustomerReceiptEmail";
import PaidOrderEmail from "@/lib/emails/PaidOrderEmail";

export async function GET() {
  try {
    if (!process.env.SMTP_USER) {
      return NextResponse.json({ error: "Falta SMTP_USER en Vercel" }, { status: 500 });
    }
    
    // Create a dummy order to test rendering
    const dummyOrder = {
      orderNumber: "TEST-123",
      totalAmount: "50000",
      customerName: "Juan",
      customerEmail: "duvanonealsod28@gmail.com",
      customerPhone: "123456",
      customerCity: "Medellin",
      customerDepartment: "Antioquia",
      customerDni: "12345678",
      customerAddress: "Calle Falsa 123",
      items: [{
        productName: "Botas",
        quantity: 1,
        unitPrice: "50000",
        product: { images: ["https://example.com/image.jpg"] }
      }]
    };

    let clientHtml, adminHtml;
    try {
      clientHtml = await render(CustomerReceiptEmail({ order: dummyOrder as any, transactionId: "trans123" }));
      adminHtml = await render(PaidOrderEmail({ order: dummyOrder as any, transactionId: "trans123" }));
    } catch (renderError: any) {
      return NextResponse.json({ 
        success: false, 
        phase: "RENDERING_ERROR", 
        error: renderError.message, 
        stack: renderError.stack 
      }, { status: 500 });
    }

    try {
      await mailer.sendMail({
        from: SENDER_EMAIL,
        to: "duvanonealsod28@gmail.com",
        subject: "TEST VERCEL CON PLANTILLA REACT",
        html: clientHtml
      });
    } catch (sendError: any) {
      return NextResponse.json({ 
        success: false, 
        phase: "SENDING_ERROR", 
        error: sendError.message, 
        stack: sendError.stack 
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Emails generados y enviados correctamente." });
  } catch (error: any) {
    return NextResponse.json({ success: false, phase: "UNKNOWN", error: error.message, stack: error.stack }, { status: 500 });
  }
}
