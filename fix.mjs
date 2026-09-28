import fs from "fs";
const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/CartDrawer.tsx";
let c = fs.readFileSync(p, "utf-8");

const oldLine = `const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();`;
const newLine = `const { items, removeItem, updateQuantity, totalPrice, clearCart, coupon, applyCoupon, removeCoupon, discountAmount, finalTotal } = useCartStore();`;

c = c.replace(oldLine, newLine);
fs.writeFileSync(p, c, "utf-8");
console.log("CartDrawer variables fixed");
