import fs from "fs";
const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/checkout/page.tsx";
let c = fs.readFileSync(p, "utf-8");

// Remove local state
const stateOld = `  const [couponCode, setCouponCode] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  const shippingCost = subtotal >= 300000 ? 0 : 25000;
  const discountAmount = Math.round(subtotal * (couponDiscount / 100));
  const finalTotal = subtotal + shippingCost - discountAmount;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const applyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await fetch(\`/api/coupons/validate?code=\${couponInput.trim().toUpperCase()}\`);
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.error ?? "Cupón inválido");
        setCouponCode("");
        setCouponDiscount(0);
      } else {
        setCouponCode(data.code);
        setCouponDiscount(data.discountPercentage);
        setCouponError("");
      }
    } catch {
      setCouponError("Error verificando el cupón. Intenta de nuevo.");
    }
    setCouponLoading(false);
  };

  const removeCoupon = () => {
    setCouponCode("");
    setCouponInput("");
    setCouponDiscount(0);
    setCouponError("");
  };`;

const stateNew = `  const { coupon, discountAmount: getDiscountAmount, finalTotal: getFinalTotal } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const shippingCost = subtotal >= 300000 ? 0 : 25000;
  const discountAmount = getDiscountAmount();
  const finalTotal = getFinalTotal();
`;

// Only replace if not already done
if(c.includes("setCouponDiscount(0);")) {
  c = c.replace(stateOld, stateNew);
}

// Find form payload and pass `coupon.code` instead of `couponCode`
c = c.replace(
  `couponCode: couponCode || undefined,`,
  `couponCode: coupon?.code || undefined,`
);

// We should also remove the UI section for coupons from checkout, because it's now in the Cart Drawer. Let the user do it in the Drawer, or we leave the UI here but wire it to Zustand. It's better to wire the UI to Zustand here so they can apply it in either place.

// Let's wire the UI in Checkout to Zustand as well:
const uiOld = `{/* Cupón */}
                {couponCode ? (
                  <div className="flex justify-between items-center text-sm font-body">
                    <span className="text-accent flex items-center gap-1.5">
                      🎟️ Cupón <strong>{couponCode}</strong> ({couponDiscount}% OFF)
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-accent font-heading">-{formatCOP(discountAmount)}</span>
                      <button onClick={removeCoupon} className="text-muted-foreground hover:text-destructive text-xs">✕</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Código de descuento"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-transparent border border-white/10 px-3 py-1.5 text-xs font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50"
                      onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      disabled={couponLoading}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 text-xs font-heading tracking-wider uppercase hover:bg-accent/20 hover:text-accent transition-all disabled:opacity-50"
                    >
                      {couponLoading ? "..." : "Aplicar"}
                    </button>
                  </div>
                )}
                {couponError && <p className="text-xs text-destructive font-body">{couponError}</p>}

                <div className="flex justify-between items-center text-sm font-body text-muted-foreground">`;

const uiNew = `{/* Cupón (Solo visual aquí, se aplica en el carrito) */}
                {coupon && (
                  <div className="flex justify-between items-center text-sm font-body">
                    <span className="text-accent flex items-center gap-1.5">
                      🎟️ Cupón <strong>{coupon.code}</strong> ({coupon.discountPercentage}% OFF)
                    </span>
                    <span className="text-accent font-heading">-{formatCOP(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm font-body text-muted-foreground">`;

if(c.includes("{/* Cupón */}")) {
  c = c.replace(uiOld, uiNew);
}

fs.writeFileSync(p, c, "utf-8");
console.log("Checkout updated for unified coupon state");
