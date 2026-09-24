import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./db/index";
import { products, productVariants, categories } from "./db/schema";
import { eq } from "drizzle-orm";

async function seedBalaclava() {
  // Asegurar que exista la categoría "Accesorios"
  let cat = await db.query.categories.findFirst({
    where: eq(categories.slug, "accesorios")
  });

  const balaclava = {
    name: "Balaclava Táctica Digital Woodland",
    slug: "balaclava-tactica-digital-woodland",
    price: "35000.00",
    description: "Balaclava pasamontañas táctico en camuflaje digital pixelado verde. Ideal para protección facial completa en outdoor, airsoft y uso táctico civil.",
    images: [{ url: "/images/products/balaclava-1.png", altText: "Balaclava Táctica" }],
    sku: "BAL-WDL-01"
  };

  const [insertedProd] = await db.insert(products).values({
    name: balaclava.name,
    slug: balaclava.slug,
    description: balaclava.description,
    price: balaclava.price,
    categoryId: cat.id,
    isActive: true,
    images: balaclava.images,
  }).returning();

  // Crear la variante de stock (Talla Única)
  await db.insert(productVariants).values({
    productId: insertedProd.id,
    sku: balaclava.sku,
    size: "ÚNICA",
    stock: 15,
  });
  
  console.log(`Inserted: ${balaclava.name}`);
  process.exit(0);
}

seedBalaclava().catch(console.error);
