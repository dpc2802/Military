/**
 * Zustand store for the Wishlist — persisted in localStorage.
 * No login required.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type WishlistItem = {
  productId: number;
  productName: string;
  productSlug: string;
  imageUrl: string;
  price: number;
};

type WishlistState = {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: number) => void;
  toggle: (item: WishlistItem) => void;
  isWishlisted: (productId: number) => boolean;
  clear: () => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        if (get().isWishlisted(newItem.productId)) return;
        set({ items: [...get().items, newItem] });
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      toggle: (item) => {
        if (get().isWishlisted(item.productId)) {
          get().removeItem(item.productId);
        } else {
          get().addItem(item);
        }
      },

      isWishlisted: (productId) => get().items.some((i) => i.productId === productId),

      clear: () => set({ items: [] }),
    }),
    {
      name: "sgb-wishlist",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
