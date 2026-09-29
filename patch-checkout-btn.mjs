import fs from "fs";

const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/checkout/page.tsx";
let c = fs.readFileSync(p, "utf-8");

// 1. Add acceptTerms checkbox inside the form
const formEndIdx = c.indexOf("</form>");
if (formEndIdx !== -1) {
  const checkboxJsx = `
                <div className="pt-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      {...register("acceptTerms")}
                      className="mt-1"
                    />
                    <div className="text-xs font-body text-muted-foreground">
                      Acepto la <Link href="/politica-datos" className="text-accent hover:underline">Política de Tratamiento de Datos Personales</Link> y <Link href="/terminos-y-condiciones" className="text-accent hover:underline">Términos y Condiciones</Link>.
                      {errors.acceptTerms && <p className="text-destructive mt-1">{errors.acceptTerms.message}</p>}
                    </div>
                  </label>
                </div>
              `;
  c = c.substring(0, formEndIdx) + checkboxJsx + c.substring(formEndIdx);
}

// 2. Add couponCode to the body of the fetch request
c = c.replace(
  `        body: JSON.stringify({
          ...data,
          items: items.map(i => ({`,
  `        body: JSON.stringify({
          ...data,
          couponCode: coupon?.code,
          items: items.map(i => ({`
);

fs.writeFileSync(p, c, "utf-8");
console.log("Patched checkout page with acceptTerms and couponCode");
