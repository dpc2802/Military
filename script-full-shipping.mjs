import fs from "fs";

// 1. Update Checkout page (Form Schema + UI)
const checkoutPagePath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/checkout/page.tsx";
let checkoutPage = fs.readFileSync(checkoutPagePath, "utf-8");

// Update Zod schema to include all shipping fields
const oldSchema = `const checkoutSchema = z.object({
  customerName: z.string().min(2, "Ingresa tu nombre"),
  customerPhone: z.string().min(7, "Ingresa un teléfono válido"),
  customerCity: z.string().min(2, "Ingresa tu ciudad"),
  customerAddress: z.string().min(5, "Ingresa tu dirección"),
  customerNotes: z.string().optional(),
  paymentMethod: z.enum(["whatsapp", "wompi"]),
});`;

const newSchema = `const checkoutSchema = z.object({
  customerEmail: z.string().email("Ingresa un correo electrónico válido"),
  customerName: z.string().min(2, "Ingresa tu nombre"),
  customerDni: z.string().min(5, "Ingresa tu número de cédula"),
  customerPhone: z.string().min(7, "Ingresa un teléfono válido"),
  customerDepartment: z.string().min(3, "Ingresa tu departamento"),
  customerCity: z.string().min(2, "Ingresa tu ciudad"),
  customerAddress: z.string().min(5, "Ingresa tu dirección"),
  customerNotes: z.string().optional(),
  paymentMethod: z.enum(["whatsapp", "wompi"]),
});`;

checkoutPage = checkoutPage.replace(oldSchema, newSchema);

// Replace the form fields
const oldFormFields = `<div className="space-y-1">
                  <label className="text-xs font-body uppercase tracking-widest text-muted-foreground">
                    Nombre completo
                  </label>
                  <input
                    {...register("customerName")}
                    className="w-full bg-background border border-border px-3 py-2 text-sm font-body focus:outline-none focus:border-primary"
                    placeholder="Ej. Juan Pérez"
                  />
                  {errors.customerName && <p className="text-xs text-destructive mt-1">{errors.customerName.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-body uppercase tracking-widest text-muted-foreground">
                      Teléfono / WhatsApp
                    </label>
                    <input
                      {...register("customerPhone")}
                      type="tel"
                      className="w-full bg-background border border-border px-3 py-2 text-sm font-body focus:outline-none focus:border-primary"
                      placeholder="Ej. 3001234567"
                    />
                    {errors.customerPhone && <p className="text-xs text-destructive mt-1">{errors.customerPhone.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-body uppercase tracking-widest text-muted-foreground">
                      Ciudad
                    </label>
                    <input
                      {...register("customerCity")}
                      className="w-full bg-background border border-border px-3 py-2 text-sm font-body focus:outline-none focus:border-primary"
                      placeholder="Ej. Bogotá"
                    />
                    {errors.customerCity && <p className="text-xs text-destructive mt-1">{errors.customerCity.message}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-body uppercase tracking-widest text-muted-foreground">
                    Dirección exacta
                  </label>
                  <input
                    {...register("customerAddress")}
                    className="w-full bg-background border border-border px-3 py-2 text-sm font-body focus:outline-none focus:border-primary"
                    placeholder="Ej. Calle 123 # 45-67 Apto 8"
                  />
                  {errors.customerAddress && <p className="text-xs text-destructive mt-1">{errors.customerAddress.message}</p>}
                </div>`;

const newFormFields = `<div className="space-y-1">
                  <label className="text-xs font-body uppercase tracking-widest text-muted-foreground">
                    Correo Electrónico *
                  </label>
                  <input
                    {...register("customerEmail")}
                    type="email"
                    className="w-full bg-background border border-border px-3 py-2 text-sm font-body focus:outline-none focus:border-primary"
                    placeholder="Ej. juan@gmail.com (Para enviarte la factura)"
                  />
                  {errors.customerEmail && <p className="text-xs text-destructive mt-1">{errors.customerEmail.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-body uppercase tracking-widest text-muted-foreground">
                      Nombre completo *
                    </label>
                    <input
                      {...register("customerName")}
                      className="w-full bg-background border border-border px-3 py-2 text-sm font-body focus:outline-none focus:border-primary"
                      placeholder="Ej. Juan Pérez"
                    />
                    {errors.customerName && <p className="text-xs text-destructive mt-1">{errors.customerName.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-body uppercase tracking-widest text-muted-foreground">
                      Cédula (Para el envío) *
                    </label>
                    <input
                      {...register("customerDni")}
                      type="text"
                      className="w-full bg-background border border-border px-3 py-2 text-sm font-body focus:outline-none focus:border-primary"
                      placeholder="Ej. 1010123456"
                    />
                    {errors.customerDni && <p className="text-xs text-destructive mt-1">{errors.customerDni.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-body uppercase tracking-widest text-muted-foreground">
                      Departamento *
                    </label>
                    <input
                      {...register("customerDepartment")}
                      className="w-full bg-background border border-border px-3 py-2 text-sm font-body focus:outline-none focus:border-primary"
                      placeholder="Ej. Antioquia"
                    />
                    {errors.customerDepartment && <p className="text-xs text-destructive mt-1">{errors.customerDepartment.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-body uppercase tracking-widest text-muted-foreground">
                      Ciudad *
                    </label>
                    <input
                      {...register("customerCity")}
                      className="w-full bg-background border border-border px-3 py-2 text-sm font-body focus:outline-none focus:border-primary"
                      placeholder="Ej. Medellín"
                    />
                    {errors.customerCity && <p className="text-xs text-destructive mt-1">{errors.customerCity.message}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-body uppercase tracking-widest text-muted-foreground">
                      Dirección exacta *
                    </label>
                    <input
                      {...register("customerAddress")}
                      className="w-full bg-background border border-border px-3 py-2 text-sm font-body focus:outline-none focus:border-primary"
                      placeholder="Ej. Calle 123 # 45-67 Apto 8"
                    />
                    {errors.customerAddress && <p className="text-xs text-destructive mt-1">{errors.customerAddress.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-body uppercase tracking-widest text-muted-foreground">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      {...register("customerPhone")}
                      type="tel"
                      className="w-full bg-background border border-border px-3 py-2 text-sm font-body focus:outline-none focus:border-primary"
                      placeholder="Ej. 3001234567"
                    />
                    {errors.customerPhone && <p className="text-xs text-destructive mt-1">{errors.customerPhone.message}</p>}
                  </div>
                </div>`;

checkoutPage = checkoutPage.replace(oldFormFields, newFormFields);
fs.writeFileSync(checkoutPagePath, checkoutPage, "utf-8");

// 2. Update API route (Validation + Insert)
const apiRoutePath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/api/checkout/route.ts";
let apiRoute = fs.readFileSync(apiRoutePath, "utf-8");

const oldApiSchema = `const checkoutSchema = z.object({
  customerName: z.string(),
  customerPhone: z.string(),
  customerCity: z.string(),
  customerAddress: z.string(),
  customerNotes: z.string().optional(),
  paymentMethod: z.enum(["whatsapp", "wompi"]).default("whatsapp"),
  items: z.array(`;

const newApiSchema = `const checkoutSchema = z.object({
  customerEmail: z.string().email(),
  customerName: z.string(),
  customerDni: z.string(),
  customerPhone: z.string(),
  customerDepartment: z.string(),
  customerCity: z.string(),
  customerAddress: z.string(),
  customerNotes: z.string().optional(),
  paymentMethod: z.enum(["whatsapp", "wompi"]).default("whatsapp"),
  items: z.array(`;

apiRoute = apiRoute.replace(oldApiSchema, newApiSchema);

const oldInsert = `customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerCity: data.customerCity,
      customerAddress: data.customerAddress,`;

const newInsert = `customerEmail: data.customerEmail,
      customerName: data.customerName,
      customerDni: data.customerDni,
      customerDepartment: data.customerDepartment,
      customerPhone: data.customerPhone,
      customerCity: data.customerCity,
      customerAddress: data.customerAddress,`;

apiRoute = apiRoute.replace(oldInsert, newInsert);

fs.writeFileSync(apiRoutePath, apiRoute, "utf-8");

// 3. Admin details view
const adminPagePath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/admin/(panel)/pedidos/[id]/page.tsx";
let adminPage = fs.readFileSync(adminPagePath, "utf-8");

const oldAdminInfo = `<div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Ciudad</p>
                <p>{order.customerCity}</p>
              </div>`;

const newAdminInfo = `<div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Cédula</p>
                <p>{order.customerDni}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Correo</p>
                <p>{order.customerEmail}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Ciudad/Depto</p>
                <p>{order.customerCity}, {order.customerDepartment}</p>
              </div>`;

adminPage = adminPage.replace(oldAdminInfo, newAdminInfo);
fs.writeFileSync(adminPagePath, adminPage, "utf-8");

console.log("Updated Checkout form, API, and Admin details view");
