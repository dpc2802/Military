import { pgTable, text, integer, boolean, timestamp, serial, varchar, decimal, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── ADMIN USERS ────────────────────────────────────────────────────────────
// Un solo rol admin, sin registro público. Las credenciales principales
// vienen de variables de entorno, pero guardamos un hash para sesiones futuras.
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── CATEGORIES ─────────────────────────────────────────────────────────────
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── PRODUCTS ────────────────────────────────────────────────────────────────
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).notNull().unique(),
  description: text("description"),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
  // Imágenes almacenadas como array JSON: [{url, altText, sortOrder}]
  images: jsonb("images").$type<ProductImage[]>().default([]).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  // Si aplica disclaimer especial (ej: réplicas)
  requiresDisclaimer: boolean("requires_disclaimer").default(false).notNull(),
  // Guía de tallas en texto/markdown
  sizeGuide: text("size_guide"),
  // Conteo de ventas confirmadas para ordenar por "más vendidos"
  totalSold: integer("total_sold").default(0).notNull(),
  // SEO
  metaTitle: varchar("meta_title", { length: 256 }),
  metaDescription: text("meta_description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── PRODUCT VARIANTS ────────────────────────────────────────────────────────
// Cada combinación talla/color tiene su propio stock y puede tener un precio diferencial
export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  size: varchar("size", { length: 32 }), // XS, S, M, L, XL, XXL, 38, 39, etc.
  color: varchar("color", { length: 64 }), // Verde Oliva, Negro, Coyote, etc.
  // Stock total disponible para venta inmediata
  stock: integer("stock").default(0).notNull(),
  // Stock reservado temporalmente por pedidos pendiente_whatsapp
  reservedStock: integer("reserved_stock").default(0).notNull(),
  // Precio diferencial opcional (si null, usa el precio del producto padre)
  priceOverride: decimal("price_override", { precision: 12, scale: 2 }),
  sku: varchar("sku", { length: 64 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── ORDERS ──────────────────────────────────────────────────────────────────
// Los pedidos llegan como "pendiente_whatsapp" y el admin los confirma manualmente.
// El stock se reserva (no descuenta en firme) hasta que el admin confirma.
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  // Número de orden corto legible (ej: SGB-0234)
  orderNumber: varchar("order_number", { length: 16 }).notNull().unique(),
  // Datos del comprador — sin cuenta de usuario
  customerName: varchar("customer_name", { length: 256 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 32 }).notNull(),
  customerCity: varchar("customer_city", { length: 128 }).notNull(),
  customerAddress: text("customer_address").notNull(),
  customerNotes: text("customer_notes"),
  // Estado del ciclo de vida del pedido
  // pendiente_whatsapp → confirmado → enviado → entregado | cancelado
  status: varchar("status", { length: 32 }).notNull().default("pendiente_whatsapp"),
  // Total en COP
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull(),
  // Reserva de stock: expira después de X horas si no se confirma
  stockReservationExpiresAt: timestamp("stock_reservation_expires_at"),
  // Fecha en que el admin confirmó el pedido (descuenta stock en firme)
  confirmedAt: timestamp("confirmed_at"),
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
  cancelledAt: timestamp("cancelled_at"),
  // Notas internas del admin
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── ORDER ITEMS ─────────────────────────────────────────────────────────────
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  variantId: integer("variant_id").references(() => productVariants.id).notNull(),
  // Snapshot del producto al momento de la compra (por si cambia después)
  productName: varchar("product_name", { length: 256 }).notNull(),
  productSlug: varchar("product_slug", { length: 256 }).notNull(),
  size: varchar("size", { length: 32 }),
  color: varchar("color", { length: 64 }),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
});

// ─── REVIEWS ─────────────────────────────────────────────────────────────────
// Testimonios/reseñas de productos (el admin las modera desde el panel)
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  // Autor sin cuenta: solo nombre y si está verificado (compra confirmada)
  authorName: varchar("author_name", { length: 128 }).notNull(),
  // Opcional: linkar con una orden para verificar compra
  orderId: integer("order_id").references(() => orders.id),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  isApproved: boolean("is_approved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── RELATIONS ───────────────────────────────────────────────────────────────
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
  reviews: many(reviews),
  orderItems: many(orderItems),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
  reviews: many(reviews),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  order: one(orders, {
    fields: [reviews.orderId],
    references: [orders.id],
  }),
}));

// ─── TYPES ───────────────────────────────────────────────────────────────────
export type ProductImage = {
  url: string;
  altText: string;
  sortOrder: number;
};
