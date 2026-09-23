/**
 * Tipos globales del proyecto SGB MILITARY SHOP
 * Exportados desde las tablas de Drizzle + tipos de negocio propios
 */

import type {
  categories,
  products,
  productVariants,
  orders,
  orderItems,
  reviews,
  adminUsers,
} from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

// ─── TIPOS DE DRIZZLE ────────────────────────────────────────────────────────
export type Category = InferSelectModel<typeof categories>;
export type Product = InferSelectModel<typeof products>;
export type ProductVariant = InferSelectModel<typeof productVariants>;
export type Order = InferSelectModel<typeof orders>;
export type OrderItem = InferSelectModel<typeof orderItems>;
export type Review = InferSelectModel<typeof reviews>;
export type AdminUser = InferSelectModel<typeof adminUsers>;

// ─── TIPOS ENRIQUECIDOS PARA UI ──────────────────────────────────────────────

/** Producto con categoría y variantes embebidas (para detalle y listado) */
export type ProductWithDetails = Product & {
  category: Category;
  variants: ProductVariant[];
  reviews?: Review[];
};

/** Orden con sus items y snapshots de producto */
export type OrderWithItems = Order & {
  items: (OrderItem & {
    product: Pick<Product, "name" | "slug" | "images">;
  })[];
};

// ─── CARRITO (Zustand) ───────────────────────────────────────────────────────
export type CartItem = {
  productId: number;
  variantId: number;
  productName: string;
  productSlug: string;
  variantSize: string | null;
  variantColor: string | null;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
  imageAlt: string;
};

export type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (variantId: number) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

// ─── ESTADOS DE ORDEN ────────────────────────────────────────────────────────
export const ORDER_STATUS = {
  PENDIENTE_WHATSAPP: "pendiente_whatsapp",
  CONFIRMADO: "confirmado",
  ENVIADO: "enviado",
  ENTREGADO: "entregado",
  CANCELADO: "cancelado",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pendiente_whatsapp: "Pendiente confirmación",
  confirmado: "Confirmado",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

// ─── IMAGEN DE PRODUCTO ──────────────────────────────────────────────────────
export type ProductImage = {
  url: string;
  altText: string;
  sortOrder: number;
};

// ─── FILTROS DEL CATÁLOGO ────────────────────────────────────────────────────
export type CatalogFilters = {
  category?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: "newest" | "price_asc" | "price_desc" | "bestselling";
  search?: string;
};

// ─── FORMULARIO DE CHECKOUT ──────────────────────────────────────────────────
export type CheckoutFormData = {
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress: string;
  customerNotes?: string;
  // Campo honeypot anti-spam (siempre debe quedar vacío si es humano)
  _hp?: string;
};

// ─── SESIÓN ADMIN ────────────────────────────────────────────────────────────
export type AdminSession = {
  id: number;
  username: string;
};
