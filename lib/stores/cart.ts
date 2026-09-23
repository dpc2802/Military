/**
 * Zustand store del carrito de compras.
 * 
 * Persiste en localStorage automáticamente.
 * El carrito es anónimo (sin cuenta de usuario).
 * 
 * Caso borde manejado: si el stock baja a 0 mientras el producto está en el
 * carrito, el usuario verá un aviso al intentar hacer checkout (se valida
 * contra la BD en el momento del pedido, no al agregar al carrito).
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartState, CartItem } from "@/types";

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const { items } = get();
        const existingIndex = items.findIndex(
          (item) => item.variantId === newItem.variantId
        );

        if (existingIndex >= 0) {
          // Si ya existe la variante, sumamos la cantidad
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
          // Nueva variante al carrito
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

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce(
          (sum, item) => sum + item.unitPrice * item.quantity,
          0
        ),
    }),
    {
      name: "sgb-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
