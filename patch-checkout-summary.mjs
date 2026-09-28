import fs from "fs";

// 1. Fix checkout page JSX
const checkoutPath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/checkout/page.tsx";
let checkout = fs.readFileSync(checkoutPath, "utf-8");

const startStr = `<div className="border-t border-border pt-4 space-y-3 mb-6">`;
const endStr = `</div>

              <div className="bg-background border border-border p-3 mb-6 text-xs text-muted-foreground font-body">`;

const idxStart = checkout.indexOf(startStr);
const idxEnd = checkout.indexOf(endStr);

if (idxStart !== -1 && idxEnd !== -1) {
  const newJsx = `<div className="border-t border-border pt-4 space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm font-body text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatCOP(subtotal)}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between items-center text-sm font-body text-accent">
                    <span>🎟️ Cupón ({coupon.discountPercentage}%)</span>
                    <span>-{formatCOP(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm font-body text-muted-foreground">
                  <span>Envío</span>
                  <span>{shippingCost === 0 ? "Gratis" : formatCOP(shippingCost)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border mt-2">
                  <span className="text-base font-body tracking-wider uppercase text-foreground">Total</span>
                  <span className="text-xl font-heading text-accent">{formatCOP(finalTotal)}</span>
                </div>
              `;
  checkout = checkout.substring(0, idxStart) + newJsx + checkout.substring(idxEnd);
  fs.writeFileSync(checkoutPath, checkout, "utf-8");
}

// 2. Fix checkout API route
const apiPath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/api/checkout/route.ts";
let api = fs.readFileSync(apiPath, "utf-8");
api = api.replace(
  `// 3. Crear el pedido`,
  `const totalAmount = subtotalAmount + shippingCost - discountAmount;\n\n    // 3. Crear el pedido`
);
fs.writeFileSync(apiPath, api, "utf-8");

console.log("Fixed checkout JSX and restored totalAmount in API");
