/**
 * Seed script para poblar la base de datos con datos de ejemplo.
 * 
 * USO: npx tsx db/seed.ts
 * 
 * IMPORTANTE: Ejecutar solo una vez en dev/staging. En producción,
 * borrar la data de ejemplo antes de usar.
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import bcrypt from "bcryptjs";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  console.log("🌱 Iniciando seed de SGB MILITARY SHOP...");

  // ─── ADMIN USER ──────────────────────────────────────────────────────────
  // Contraseña de ejemplo: "admin123" — CAMBIAR antes de producción
  const passwordHash = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "admin123",
    12
  );

  await db
    .insert(schema.adminUsers)
    .values({
      username: process.env.ADMIN_USERNAME || "admin",
      passwordHash,
    })
    .onConflictDoNothing();

  console.log("✅ Admin user creado");

  // ─── CATEGORÍAS ──────────────────────────────────────────────────────────
  const categoryValues = [
    { name: "Uniformes y Ropa Táctica", slug: "uniformes-ropa-tactica", description: "Uniformes militares, camisas tácticas, pantalones cargo y ropa de combate para uso civil.", sortOrder: 1 },
    { name: "Botas y Calzado", slug: "botas-calzado", description: "Botas militares, botas tácticas y calzado de combate para terreno exigente.", sortOrder: 2 },
    { name: "Mochilas y Equipaje", slug: "mochilas-equipaje", description: "Mochilas militares, bolsos tácticos, porta-equipos y sistemas MOLLE.", sortOrder: 3 },
    { name: "Accesorios Tácticos", slug: "accesorios-tacticos", description: "Cinturones, porta-cargadores, guantes, rodilleras y accesorios de equipo táctico.", sortOrder: 4 },
    { name: "Réplicas y Airsoft", slug: "replicas-airsoft", description: "Réplicas de colección y equipos de airsoft. Solo para uso civil y deportivo legal. NO son armas de fuego reales.", sortOrder: 5 },
    { name: "Protección y Seguridad", slug: "proteccion-seguridad", description: "Cascos, chalecos (sin placa balística real), coderas, rodilleras y equipo de protección deportiva.", sortOrder: 6 },
  ] as const;

  const insertedCategories = await db
    .insert(schema.categories)
    .values(categoryValues.map((c) => ({ ...c, isActive: true })))
    .onConflictDoNothing()
    .returning();

  console.log(`✅ ${insertedCategories.length} categorías creadas`);

  // Mapear slugs → IDs para referenciar en productos
  const categoryIdMap = insertedCategories.reduce<Record<string, number>>(
    (acc, cat) => {
      acc[cat.slug] = cat.id;
      return acc;
    },
    {}
  );

  // ─── PRODUCTOS DE EJEMPLO ─────────────────────────────────────────────────
  const productSeed = [
    {
      name: "Uniforme Camuflaje Pixelado",
      slug: "uniforme-camuflaje-pixelado",
      description: "Uniforme de combate completo (camisa + pantalón) en camuflaje pixelado verde. Tela ripstop 65/35 poliéster/algodón. Ideal para actividades outdoor, airsoft y coleccionismo. Uso exclusivamente civil.",
      price: "180000.00",
      categorySlug: "uniformes-ropa-tactica",
      images: [{ url: "https://placehold.co/600x600/4B5320/F5F5F0?text=Uniforme", altText: "Uniforme Camuflaje Pixelado verde oliva", sortOrder: 0 }],
      isFeatured: true,
      requiresDisclaimer: false,
      variants: [
        { size: "S", color: "Verde Pixelado", stock: 10 },
        { size: "M", color: "Verde Pixelado", stock: 15 },
        { size: "L", color: "Verde Pixelado", stock: 12 },
        { size: "XL", color: "Verde Pixelado", stock: 8 },
        { size: "XXL", color: "Verde Pixelado", stock: 4 },
      ],
    },
    {
      name: "Botas Militares Jungle",
      slug: "botas-militares-jungle",
      description: "Botas militares de caña alta para terreno selvático. Suela antideslizante Vibram, parte superior en lona y cuero genuino. Resistentes al agua. Ideales para actividades outdoor, senderismo y airsoft.",
      price: "250000.00",
      categorySlug: "botas-calzado",
      images: [{ url: "https://placehold.co/600x600/3A3F2B/F5F5F0?text=Botas", altText: "Botas Militares Jungle negras", sortOrder: 0 }],
      isFeatured: true,
      requiresDisclaimer: false,
      variants: [
        { size: "38", color: "Negro", stock: 5 },
        { size: "39", color: "Negro", stock: 8 },
        { size: "40", color: "Negro", stock: 12 },
        { size: "41", color: "Negro", stock: 10 },
        { size: "42", color: "Negro", stock: 9 },
        { size: "43", color: "Negro", stock: 6 },
        { size: "44", color: "Negro", stock: 4 },
        { size: "45", color: "Negro", stock: 2 },
      ],
    },
    {
      name: "Mochila Táctica 40L MOLLE",
      slug: "mochila-tactica-40l-molle",
      description: "Mochila táctica de 40 litros con sistema de rieles MOLLE para accesorios adicionales. Múltiples bolsillos organizadores, porta-hidratación compatible. Tela 1000D Cordura. Para trekking, campismo y equipamiento táctico deportivo.",
      price: "320000.00",
      categorySlug: "mochilas-equipaje",
      images: [{ url: "https://placehold.co/600x600/2C2C2C/C2B280?text=Mochila+40L", altText: "Mochila Táctica 40L sistema MOLLE verde", sortOrder: 0 }],
      isFeatured: true,
      requiresDisclaimer: false,
      variants: [
        { size: "Única", color: "Verde Oliva", stock: 7 },
        { size: "Única", color: "Negro", stock: 9 },
        { size: "Única", color: "Coyote", stock: 5 },
        { size: "Única", color: "Multicam", stock: 3 },
      ],
    },
    {
      name: "Cinturón Táctico Rigger",
      slug: "cinturon-tactico-rigger",
      description: "Cinturón táctico tipo rigger con hebilla de liberación rápida. Nylon 1000D de alta resistencia. Compatible con porta-cargadores, fundas y accesorios MOLLE. Talla ajustable hasta 120cm.",
      price: "65000.00",
      categorySlug: "accesorios-tacticos",
      images: [{ url: "https://placehold.co/600x600/4B5320/F5F5F0?text=Cinturon", altText: "Cinturón Táctico Rigger negro", sortOrder: 0 }],
      isFeatured: false,
      requiresDisclaimer: false,
      variants: [
        { size: "Ajustable", color: "Negro", stock: 20 },
        { size: "Ajustable", color: "Verde Oliva", stock: 15 },
        { size: "Ajustable", color: "Coyote", stock: 10 },
      ],
    },
    {
      name: "Chaleco Táctico Plate Carrier (Sin Placas)",
      slug: "chaleco-tactico-plate-carrier",
      description: "Chaleco plate carrier de uso civil y deportivo. Vendido SIN placas balísticas. Compatible con insertos de espuma para airsoft/entrenamiento. Sistema MOLLE frontal y lateral. Talla ajustable. EXCLUSIVAMENTE para airsoft, simulación táctica y coleccionismo.",
      price: "280000.00",
      categorySlug: "proteccion-seguridad",
      images: [{ url: "https://placehold.co/600x600/2C2C2C/C2B280?text=Chaleco+PC", altText: "Chaleco Táctico Plate Carrier sin placas balísticas", sortOrder: 0 }],
      isFeatured: true,
      requiresDisclaimer: true, // Este requiere disclaimer especial
      variants: [
        { size: "M/L", color: "Negro", stock: 6 },
        { size: "M/L", color: "Verde Oliva", stock: 4 },
        { size: "XL/XXL", color: "Negro", stock: 4 },
        { size: "XL/XXL", color: "Verde Oliva", stock: 3 },
      ],
    },
    {
      name: "Guantes Tácticos Half Finger",
      slug: "guantes-tacticos-half-finger",
      description: "Guantes tácticos sin dedos (half finger) para airsoft, tiro deportivo y actividades outdoor. Palma reforzada en cuero sintético, dorso en malla respirable. Protección articulada en nudillos.",
      price: "45000.00",
      categorySlug: "accesorios-tacticos",
      images: [{ url: "https://placehold.co/600x600/4B5320/F5F5F0?text=Guantes", altText: "Guantes Tácticos Half Finger negros", sortOrder: 0 }],
      isFeatured: false,
      requiresDisclaimer: false,
      variants: [
        { size: "S", color: "Negro", stock: 12 },
        { size: "M", color: "Negro", stock: 18 },
        { size: "L", color: "Negro", stock: 14 },
        { size: "XL", color: "Negro", stock: 8 },
        { size: "S", color: "Verde Oliva", stock: 6 },
        { size: "M", color: "Verde Oliva", stock: 10 },
        { size: "L", color: "Verde Oliva", stock: 8 },
      ],
    },
  ];

  for (const productData of productSeed) {
    const catId = categoryIdMap[productData.categorySlug];
    if (!catId) {
      console.warn(`⚠️  Categoría no encontrada: ${productData.categorySlug}`);
      continue;
    }

    const [insertedProduct] = await db
      .insert(schema.products)
      .values({
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        price: productData.price,
        categoryId: catId,
        images: productData.images,
        isFeatured: productData.isFeatured,
        isActive: true,
        requiresDisclaimer: productData.requiresDisclaimer,
        totalSold: 0,
      })
      .onConflictDoNothing()
      .returning();

    if (!insertedProduct) {
      console.log(`⏭️  Producto ya existe: ${productData.name}`);
      continue;
    }

    // Insertar variantes
    await db.insert(schema.productVariants).values(
      productData.variants.map((v) => ({
        productId: insertedProduct.id,
        size: v.size,
        color: v.color,
        stock: v.stock,
        reservedStock: 0,
        isActive: true,
      }))
    );

    console.log(`✅ Producto creado: ${productData.name}`);
  }

  // ─── RESEÑA DE EJEMPLO ────────────────────────────────────────────────────
  // Solo para mostrar la sección de testimonios en home
  const firstProduct = await db.query.products.findFirst();
  if (firstProduct) {
    await db
      .insert(schema.reviews)
      .values([
        {
          productId: firstProduct.id,
          authorName: "Carlos M.",
          rating: 5,
          comment: "Excelente calidad, el uniforme llegó perfectamente empacado. La tela es muy resistente, ideal para actividades outdoor. Totalmente recomendado.",
          isApproved: true,
        },
        {
          productId: firstProduct.id,
          authorName: "Diego R.",
          rating: 5,
          comment: "Muy buena atención por WhatsApp, me orientaron en la talla correcta. El producto superó mis expectativas. SGB MILITARY es confiable.",
          isApproved: true,
        },
        {
          productId: firstProduct.id,
          authorName: "Andrés P.",
          rating: 4,
          comment: "Producto de buena calidad. El envío fue rápido. Lo recomiendo para entusiastas del airsoft y equipo táctico.",
          isApproved: true,
        },
      ])
      .onConflictDoNothing();

    console.log("✅ Reseñas de ejemplo creadas");
  }

  console.log("\n🎉 Seed completado exitosamente!");
  console.log("👤 Admin: username=admin, password=admin123 (cambiar en .env.local)");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Error en seed:", err);
  process.exit(1);
});
