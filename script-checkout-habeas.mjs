import fs from "fs";

// 1. Update checkout page
const pagePath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/checkout/page.tsx";
let pageCode = fs.readFileSync(pagePath, "utf-8");

const oldSchema = `customerNotes: z.string().optional(),`;
const newSchema = `customerNotes: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "Debes aceptar la Política de Tratamiento de Datos Personales para continuar.",
  }),`;
pageCode = pageCode.replace(oldSchema, newSchema);

const oldDefaultValues = `customerNotes: "",`;
const newDefaultValues = `customerNotes: "",
      acceptTerms: false,`;
pageCode = pageCode.replace(oldDefaultValues, newDefaultValues);

// Find the payment buttons and put the checkbox right above them
const oldSubmitBlock = `            {/* Botones de Pago */}`;
const newSubmitBlock = `            {/* Tratamiento de Datos Personales (Habeas Data) */}
            <div className="flex items-start gap-3 p-4 bg-[#141414] border border-white/5 mb-6">
              <input
                type="checkbox"
                id="acceptTerms"
                {...form.register("acceptTerms")}
                className="mt-1 w-4 h-4 bg-transparent border border-white/20 checked:bg-accent focus:ring-1 focus:ring-accent accent-accent cursor-pointer"
              />
              <div className="flex-1">
                <label htmlFor="acceptTerms" className="text-sm text-[#A0A09A] font-body cursor-pointer">
                  Acepto la <a href="/politica-datos" target="_blank" className="text-accent hover:underline">Política de Tratamiento de Datos Personales</a> (Ley 1581 de 2012) y autorizo a SGB Military a contactarme respecto a mi pedido.
                </label>
                {form.formState.errors.acceptTerms && (
                  <p className="text-red-400 text-xs mt-1 font-body">{form.formState.errors.acceptTerms.message}</p>
                )}
              </div>
            </div>

            {/* Botones de Pago */}`;
pageCode = pageCode.replace(oldSubmitBlock, newSubmitBlock);

fs.writeFileSync(pagePath, pageCode, "utf-8");
console.log("Updated checkout page");

// 2. Update API route
const apiPath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/api/checkout/route.ts";
let apiCode = fs.readFileSync(apiPath, "utf-8");

const oldApiSchema = `customerNotes: z.string().optional(),`;
const newApiSchema = `customerNotes: z.string().optional(),
  acceptTerms: z.boolean(),`;
apiCode = apiCode.replace(oldApiSchema, newApiSchema);

fs.writeFileSync(apiPath, apiCode, "utf-8");
console.log("Updated checkout API");
