import fs from "fs";

// 1. Update Cart Store (Remove shipping from finalTotal)
const cartPath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/lib/stores/cart.ts";
let cart = fs.readFileSync(cartPath, "utf-8");
cart = cart.replace(
  `      finalTotal: () => {
        const { totalPrice, discountAmount } = get();
        const subtotal = totalPrice();
        const shipping = subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_FLAT;
        return subtotal + shipping - discountAmount();
      },`,
  `      finalTotal: () => {
        const { totalPrice, discountAmount } = get();
        return totalPrice() - discountAmount();
      },`
);
fs.writeFileSync(cartPath, cart, "utf-8");

// 2. Update Checkout Page (Add shipping back to final total display)
const checkoutPath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/checkout/page.tsx";
let checkout = fs.readFileSync(checkoutPath, "utf-8");
checkout = checkout.replace(
  `const finalTotal = getFinalTotal();`,
  `const finalTotal = getFinalTotal() + shippingCost;`
);
fs.writeFileSync(checkoutPath, checkout, "utf-8");

// 3. Update Cart Drawer UI
const drawerPath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/CartDrawer.tsx";
let drawer = fs.readFileSync(drawerPath, "utf-8");

// Remove "También te puede interesar" block
const startUpsell = `                  {/* Upsell Relacionados */}`;
const endUpsell = `                  </div>\n                </>\n              )}`;
const idxUpsell = drawer.indexOf(startUpsell);
const idxEndUpsell = drawer.indexOf(endUpsell);
if (idxUpsell !== -1 && idxEndUpsell !== -1) {
  drawer = drawer.substring(0, idxUpsell) + `                </>\n              )}` + drawer.substring(idxEndUpsell + endUpsell.length);
}

// Update shipping display to just say "Calculado al finalizar" and use the new finalTotal
drawer = drawer.replace(
  `<div className="flex justify-between items-center text-[13px] font-body text-[#9A9A94]">
                    <span className="flex items-center gap-1"><Info className="w-3.5 h-3.5"/> Envío</span>
                    <span>{totalPrice() >= 300000 ? "Gratis" : formatCOP(25000)}</span>
                  </div>`,
  `<div className="flex justify-between items-center text-[13px] font-body text-[#9A9A94]">
                    <span className="flex items-center gap-1"><Info className="w-3.5 h-3.5"/> Envío</span>
                    <span>{totalPrice() >= 300000 ? "Gratis" : "Calculado al finalizar"}</span>
                  </div>`
);

fs.writeFileSync(drawerPath, drawer, "utf-8");

console.log("Math fixed and Upsell removed successfully");
