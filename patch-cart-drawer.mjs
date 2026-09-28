import fs from "fs";
const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/CartDrawer.tsx";
let c = fs.readFileSync(p, "utf-8");

// Get the store methods inside CartDrawer component
const getMethodsOld = `const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCartStore();`;
const getMethodsNew = `const { items, updateQuantity, removeItem, totalPrice, clearCart, coupon, applyCoupon, removeCoupon, discountAmount, finalTotal } = useCartStore();`;
c = c.replace(getMethodsOld, getMethodsNew);

if(!c.includes("applyCoupon")) {
   // Fallback replace
   c = c.replace(/const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCartStore\(\);/g, getMethodsNew);
}

// State for coupon input
const stateOld = `const [processing, setProcessing] = useState(false);`;
const stateNew = `const [processing, setProcessing] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await fetch(\`/api/coupons/validate?code=\${couponInput.trim().toUpperCase()}\`);
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error ?? "Cupón inválido");
      } else {
        applyCoupon({ code: data.code, discountPercentage: data.discountPercentage });
        setCouponInput("");
        setCouponError("");
      }
    } catch {
      setCouponError("Error validando el cupón");
    }
    setCouponLoading(false);
  };
`;
c = c.replace(stateOld, stateNew);

// UI for coupon and summary
const uiOld = `<div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-[13px] font-body text-[#9A9A94]">
                    <span>Subtotal de productos</span>
                    <span className="text-[#F5F5F0]">{formatCOP(totalPrice())}</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px] font-body text-[#9A9A94]">
                    <span className="flex items-center gap-1"><Info className="w-3.5 h-3.5"/> Envío</span>
                    <span>Por coordinar</span>
                  </div>
                  <div className="h-px bg-white/10 my-2" />
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-heading tracking-widest text-[#F5F5F0] uppercase">TOTAL ESTIMADO</span>
                    <span className="text-2xl font-heading tracking-widest text-accent">{formatCOP(totalPrice())}</span>
                  </div>
                </div>`;

const uiNew = `<div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-[13px] font-body text-[#9A9A94]">
                    <span>Subtotal de productos</span>
                    <span className="text-[#F5F5F0]">{formatCOP(totalPrice())}</span>
                  </div>
                  
                  {coupon ? (
                    <div className="flex justify-between items-center text-[13px] font-body">
                      <span className="text-accent flex items-center gap-1">🎟️ {coupon.code} (-{coupon.discountPercentage}%)</span>
                      <div className="flex items-center gap-2">
                        <span className="text-accent font-heading">-{formatCOP(discountAmount())}</span>
                        <button onClick={removeCoupon} className="text-muted-foreground hover:text-destructive text-xs">✕</button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Código de descuento"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          className="flex-1 bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50"
                          onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={couponLoading}
                          className="px-3 py-1.5 bg-white/10 border border-white/10 text-xs font-heading tracking-wider uppercase hover:bg-accent/20 hover:text-accent transition-all disabled:opacity-50"
                        >
                          {couponLoading ? "..." : "Aplicar"}
                        </button>
                      </div>
                      {couponError && <p className="text-xs text-destructive">{couponError}</p>}
                    </div>
                  )}

                  <div className="flex justify-between items-center text-[13px] font-body text-[#9A9A94]">
                    <span className="flex items-center gap-1"><Info className="w-3.5 h-3.5"/> Envío</span>
                    <span>{totalPrice() >= 300000 ? "Gratis" : formatCOP(25000)}</span>
                  </div>
                  <div className="h-px bg-white/10 my-2" />
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-heading tracking-widest text-[#F5F5F0] uppercase">TOTAL ESTIMADO</span>
                    <span className="text-2xl font-heading tracking-widest text-accent">{formatCOP(finalTotal())}</span>
                  </div>
                </div>`;

c = c.replace(uiOld, uiNew);

fs.writeFileSync(p, c, "utf-8");
console.log("CartDrawer updated");
