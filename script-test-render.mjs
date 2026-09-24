import { render } from "@react-email/render";
import PaidOrderEmail from "c:/Users/HP Core i5/Desktop/SGB MILITARY/lib/emails/PaidOrderEmail.tsx";
import CustomerReceiptEmail from "c:/Users/HP Core i5/Desktop/SGB MILITARY/lib/emails/CustomerReceiptEmail.tsx";
import NewOrderEmail from "c:/Users/HP Core i5/Desktop/SGB MILITARY/lib/emails/NewOrderEmail.tsx";

const dummyOrder = {
  orderNumber: "TEST-123",
  totalAmount: "50000",
  customerName: "Juan",
  customerEmail: "juan@example.com",
  customerPhone: "123456",
  customerCity: "Medellin",
  customerDepartment: "Ant",
  customerDni: "123",
  customerAddress: "Calle",
  items: [{
    productName: "Botas",
    quantity: 1,
    unitPrice: "50000",
    product: { images: ["url"] }
  }]
};

try {
  console.log("Rendering PaidOrderEmail...");
  render(PaidOrderEmail({ order: dummyOrder, transactionId: "trans123" }));
  
  console.log("Rendering CustomerReceiptEmail...");
  render(CustomerReceiptEmail({ order: dummyOrder, transactionId: "trans123" }));
  
  console.log("Rendering NewOrderEmail...");
  render(NewOrderEmail({ order: dummyOrder }));
  
  console.log("All renders successful!");
} catch(e) {
  console.error("Render failed:", e);
}
