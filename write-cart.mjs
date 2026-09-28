import fs from "fs";
const content = `import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartState, CartItem, AppliedCoupon } from "@/types";

const SHIPPING_FLAT = 25000;
const SHIPPING_FREE_THRESHOLD = 300000;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,

      addItem: (newItem) => {
        const { items } = get();
        const existingIndex = items.findIndex(
          (item) => item.variantId === newItem.variantId
        );

        if (existingIndex >= 0) {
          const updated = [...items];
          const existing = updated[existingIndex];
          if (existing) {
            updated[existingIndex] = {
              ...existing,
              quantity: existing.quantity + (newItem.quantity ?? 1),
            };
          }
          set({ items: updated });
        } else {
          set({
            items: [...items, { ...newItem, quantity: newItem.quantity ?? 1 }],
          });
        }
      },

      removeItem: (variantId) => {
        set({ items: get().items.filter((item) => item.variantId !== variantId) });
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.variantId === variantId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [], coupon: null }),

      applyCoupon: (coupon) => set({ coupon }),

      removeCoupon: () => set({ coupon: null }),

      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),

      discountAmount: () => {
        const { coupon, totalPrice } = get();
        if (!coupon) return 0;
        return Math.round(totalPrice() * (coupon.discountPercentage / 100));
      },

      finalTotal: () => {
        const { totalPrice, discountAmount } = get();
        const subtotal = totalPrice();
        const shipping = subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_FLAT;
        return subtotal + shipping - discountAmount();
      },
    }),
    {
      name: "sgb-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);`;
fs.writeFileSync("c:/Users/HP Core i5/Desktop/SGB MILITARY/lib/stores/cart.ts", content, "utf-8");
console.log("cart.ts correctly written");
