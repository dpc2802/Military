import fs from "fs";

// 1. Update Cart Store
const cartPath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/lib/stores/cart.ts";
let cart = fs.readFileSync(cartPath, "utf-8");
cart = cart.replace(
  "// En vez de porcentaje, los cupones de 10, 20, 30 significan 10.000, 20.000 y 30.000 pesos\n        return coupon.discountPercentage * 1000;",
  "return Math.round(totalPrice() * (coupon.discountPercentage / 100));"
);
// Fallback if the exact string wasn't found
if(cart.includes("coupon.discountPercentage * 1000")) {
   cart = cart.replace(/return coupon\.discountPercentage \* 1000;/g, "return Math.round(totalPrice() * (coupon.discountPercentage / 100));");
}
fs.writeFileSync(cartPath, cart, "utf-8");

// 2. Update Checkout API
const apiPath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/api/checkout/route.ts";
let api = fs.readFileSync(apiPath, "utf-8");
api = api.replace(
  "discountAmount = pct * 1000;",
  "discountAmount = Math.round(subtotalAmount * (pct / 100));"
);
fs.writeFileSync(apiPath, api, "utf-8");

// 3. Update Admin Panel UI
const adminPath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/admin/(panel)/cupones/page.tsx";
let admin = fs.readFileSync(adminPath, "utf-8");
admin = admin.replace(/\$10\.000 OFF/g, "10% OFF");
admin = admin.replace(/\$20\.000 OFF/g, "20% OFF");
admin = admin.replace(/\$30\.000 OFF/g, "30% OFF");
admin = admin.replace(/\{tier\.label\.replace\(' OFF', ''\)\}/g, "{tier.percentage}%");
admin = admin.replace(/\$\\{coupon\.discountPercentage\\}\.000/g, "{coupon.discountPercentage}%");
admin = admin.replace(/\$\{coupon\.discountPercentage\}\.000/g, "{coupon.discountPercentage}%");
admin = admin.replace(/\$\\{c\.discountPercentage\\}\.000/g, "{c.discountPercentage}%");
admin = admin.replace(/\$\{c\.discountPercentage\}\.000/g, "{c.discountPercentage}%");
fs.writeFileSync(adminPath, admin, "utf-8");

// 4. Update CartDrawer UI
const drawerPath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/CartDrawer.tsx";
let drawer = fs.readFileSync(drawerPath, "utf-8");
drawer = drawer.replace(/\-\$\\{coupon\.discountPercentage\\}\.000/g, "-{coupon.discountPercentage}%");
drawer = drawer.replace(/\-\$\{coupon\.discountPercentage\}\.000/g, "-{coupon.discountPercentage}%");
fs.writeFileSync(drawerPath, drawer, "utf-8");

// 5. Update Checkout UI
const checkoutPath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/checkout/page.tsx";
let checkout = fs.readFileSync(checkoutPath, "utf-8");
checkout = checkout.replace(/\$\\{coupon\.discountPercentage\\}\.000/g, "{coupon.discountPercentage}%");
checkout = checkout.replace(/\$\{coupon\.discountPercentage\}\.000/g, "{coupon.discountPercentage}%");
fs.writeFileSync(checkoutPath, checkout, "utf-8");

console.log("All coupon logic changed BACK to percentages successfully");
