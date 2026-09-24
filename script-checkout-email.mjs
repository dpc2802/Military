import fs from "fs";

// 1. Update checkout page (Form Schema + UI)
const checkoutPagePath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/checkout/page.tsx";
let checkoutPage = fs.readFileSync(checkoutPagePath, "utf-8");

checkoutPage = checkoutPage.replace(
  /name:\s*z\.string\(\)\.min\(2,\s*"Ingresa tu nombre"\),/,
  `name: z.string().min(2, "Ingresa tu nombre"),\n  email: z.string().email("Ingresa un correo válido"),`
);

// We need to inject the input field for Email. Let's find the Name input.
const nameInputHtml = `<div className="space-y-2">\n                <Label htmlFor="name" className="text-white">Nombre Completo *</Label>\n                <Input\n                  id="name"\n                  placeholder="Ej: Juan Pérez"\n                  {...register("name")}\n                  className="bg-[#1A1A1A] border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent"\n                />\n                {errors.name && <span className="text-destructive text-xs">{errors.name.message}</span>}\n              </div>`;

const emailInputHtml = `<div className="space-y-2">\n                <Label htmlFor="email" className="text-white">Correo Electrónico *</Label>\n                <Input\n                  id="email"\n                  type="email"\n                  placeholder="Ej: juan@gmail.com"\n                  {...register("email")}\n                  className="bg-[#1A1A1A] border-white/10 text-white placeholder:text-white/30 focus-visible:ring-accent"\n                />\n                {errors.email && <span className="text-destructive text-xs">{errors.email.message}</span>}\n              </div>`;

if (!checkoutPage.includes("id=\"email\"")) {
  checkoutPage = checkoutPage.replace(nameInputHtml, nameInputHtml + "\n\n              " + emailInputHtml);
}

fs.writeFileSync(checkoutPagePath, checkoutPage, "utf-8");


// 2. Update API route (Validation + Insert)
const apiRoutePath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/api/checkout/route.ts";
let apiRoute = fs.readFileSync(apiRoutePath, "utf-8");

apiRoute = apiRoute.replace(
  /name:\s*z\.string\(\),/,
  `name: z.string(),\n  email: z.string().email(),`
);

apiRoute = apiRoute.replace(
  /customerName:\s*data\.name,/,
  `customerName: data.name,\n      customerEmail: data.email,`
);

fs.writeFileSync(apiRoutePath, apiRoute, "utf-8");

console.log("Updated Checkout form and API");
