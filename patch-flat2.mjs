import fs from "fs";

// 1. Update Cart Store
const cartPath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/lib/stores/cart.ts";
let cart = fs.readFileSync(cartPath, "utf-8");
cart = cart.replace(
  "return Math.round(totalPrice() * (coupon.discountPercentage / 100));",
  "// En vez de porcentaje, los cupones de 10, 20, 30 significan 10.000, 20.000 y 30.000 pesos\n        return coupon.discountPercentage * 1000;"
);
fs.writeFileSync(cartPath, cart, "utf-8");

// 2. Update Checkout API
const apiPath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/api/checkout/route.ts";
let api = fs.readFileSync(apiPath, "utf-8");
api = api.replace(
  "discountAmount = Math.round(subtotalAmount * (pct / 100));",
  "discountAmount = pct * 1000;"
);
fs.writeFileSync(apiPath, api, "utf-8");

// 3. Update Admin Panel UI
const adminPath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/admin/(panel)/cupones/page.tsx";
let admin = fs.readFileSync(adminPath, "utf-8");
admin = admin.replace(
  `const TIERS = [
  { percentage: 10, label: "10% OFF", color: "text-blue-400 border-blue-400/30 bg-blue-400/10", btnColor: "bg-blue-500 hover:bg-blue-400" },
  { percentage: 20, label: "20% OFF", color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10", btnColor: "bg-yellow-500 hover:bg-yellow-400" },
  { percentage: 30, label: "30% OFF", color: "text-red-400 border-red-400/30 bg-red-400/10", btnColor: "bg-red-500 hover:bg-red-400" },
];`,
  `const TIERS = [
  { percentage: 10, label: "$10.000 OFF", color: "text-blue-400 border-blue-400/30 bg-blue-400/10", btnColor: "bg-blue-500 hover:bg-blue-400" },
  { percentage: 20, label: "$20.000 OFF", color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10", btnColor: "bg-yellow-500 hover:bg-yellow-400" },
  { percentage: 30, label: "$30.000 OFF", color: "text-red-400 border-red-400/30 bg-red-400/10", btnColor: "bg-red-500 hover:bg-red-400" },
];`
);
admin = admin.replace(
  `<span className="font-heading tracking-widest text-lg group-hover:scale-110 transition-transform">{tier.percentage}%</span>`,
  `<span className="font-heading tracking-widest text-lg group-hover:scale-110 transition-transform">{tier.label.replace(' OFF', '')}</span>`
);
admin = admin.replace(
  `<span className="text-accent">{coupon.discountPercentage}%</span>`,
  `<span className="text-accent">\\${coupon.discountPercentage}.000</span>`.replace('\\$', '$')
);
admin = admin.replace(
  `{c.discountPercentage}%`,
  `\\${c.discountPercentage}.000`.replace('\\$', '$')
);
fs.writeFileSync(adminPath, admin, "utf-8");

// 4. Update CartDrawer UI
const drawerPath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/CartDrawer.tsx";
let drawer = fs.readFileSync(drawerPath, "utf-8");
drawer = drawer.replace(
  `🎟️ {coupon.code} (-{coupon.discountPercentage}%)`,
  `🎟️ {coupon.code} (-$\\{coupon.discountPercentage\\}.000)`.replace('\\{', '{').replace('\\}', '}')
);
fs.writeFileSync(drawerPath, drawer, "utf-8");

// 5. Update Checkout UI
const checkoutPath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/checkout/page.tsx";
let checkout = fs.readFileSync(checkoutPath, "utf-8");
checkout = checkout.replace(
  `🎟️ Cupón <strong>{coupon.code}</strong> ({coupon.discountPercentage}% OFF)`,
  `🎟️ Cupón <strong>{coupon.code}</strong> ($\\{coupon.discountPercentage\\}.000 OFF)`.replace('\\{', '{').replace('\\}', '}')
);
fs.writeFileSync(checkoutPath, checkout, "utf-8");

console.log("All coupon logic changed from percentage to flat amount successfully");
