import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/checkout/page.tsx";
let content = fs.readFileSync(path, "utf-8");

const oldSchema = `const checkoutFormSchema = z.object({
  customerName: z.string().min(2, "Ingresá tu nombre completo"),
  customerPhone: z.string().min(7, "Ingresá un teléfono válido"),
  customerCity: z.string().min(2, "Ingresá tu ciudad"),
  customerAddress: z.string().min(5, "Ingresá la dirección de envío"),
  customerNotes: z.string().optional(),
  paymentMethod: z.enum(['whatsapp', 'wompi']).default('wompi'),
});`;

const newSchema = `const checkoutFormSchema = z.object({
  customerEmail: z.string().email("Ingresa un correo válido"),
  customerName: z.string().min(2, "Ingresa tu nombre completo"),
  customerDni: z.string().min(5, "Ingresa tu cédula"),
  customerPhone: z.string().min(7, "Ingresa un teléfono válido"),
  customerDepartment: z.string().min(2, "Ingresa tu departamento"),
  customerCity: z.string().min(2, "Ingresa tu ciudad"),
  customerAddress: z.string().min(5, "Ingresa la dirección de envío"),
  customerNotes: z.string().optional(),
  paymentMethod: z.enum(['whatsapp', 'wompi']).default('wompi'),
});`;

content = content.replace(oldSchema, newSchema);
fs.writeFileSync(path, content, "utf-8");
console.log("Updated frontend schema");
