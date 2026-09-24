import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./db/index";
import { products, productVariants, categories } from "./db/schema";
import { eq } from "drizzle-orm";

async function seedProducts() {
  // Asegurar que exista la categorÃ­a "Accesorios" o "Gorras"
  let cat = await db.query.categories.findFirst({
    where: eq(categories.slug, "accesorios")
  });
  
  if (!cat) {
    const [newCat] = await db.insert(categories).values({
      name: "Accesorios",
      slug: "accesorios",
      description: "Gorras, parches y equipo tÃ¡ctico complementario",
      isActive: true,
    }).returning();
    cat = newCat;
  }

  const gorras = [
    {
      name: "Gorra TÃ¡ctica Kryptek Highlander",
      slug: "gorra-tactica-kryptek-highlander",
      price: "45000.00",
      description: "Gorra tÃ¡ctica estilo Kryptek con panel frontal de velcro para parches. Material resistente al desgaste, ideal para outdoor y uso civil.",
      images: [{ url: "/images/products/gorra-1.png", altText: "Gorra Kryptek" }],
      sku: "GOR-KRY-01"
    },
    {
      name: "Gorra TÃ¡ctica Digital Pink",
      slug: "gorra-tactica-digital-pink",
      price: "45000.00",
      description: "Gorra tÃ¡ctica camuflaje digital rosa con panel frontal de velcro para parches. Material resistente al desgaste, ideal para outdoor y uso civil.",
      images: [{ url: "/images/products/gorra-2.jpg", altText: "Gorra Pink" }],
      sku: "GOR-PNK-02"
    },
    {
      name: "Gorra TÃ¡ctica Urban Diamond",
      slug: "gorra-tactica-urban-diamond",
      price: "45000.00",
      description: "Gorra tÃ¡ctica camuflaje geomÃ©trico urbano con panel frontal de velcro. Material resistente al desgaste, ideal para outdoor y uso civil.",
      images: [{ url: "/images/products/gorra-3.png", altText: "Gorra Urban" }],
      sku: "GOR-URB-03"
    },
    {
      name: "Gorra TÃ¡ctica Digital Woodland",
      slug: "gorra-tactica-digital-woodland",
      price: "45000.00",
      description: "Gorra tÃ¡ctica camuflaje digital pixelado verde con panel frontal de velcro. DiseÃ±o clÃ¡sico y resistente.",
      images: [{ url: "/images/products/gorra-4.png", altText: "Gorra Woodland" }],
      sku: "GOR-WDL-04"
    },
    {
      name: "Gorra TÃ¡ctica Kryptek Typhon",
      slug: "gorra-tactica-kryptek-typhon",
      price: "45000.00",
      description: "Gorra tÃ¡ctica camuflaje oscuro tipo Typhon con panel frontal de velcro oscuro. Discreta y elegante.",
      images: [{ url: "/images/products/gorra-5.png", altText: "Gorra Typhon" }],
      sku: "GOR-TYP-05"
    }
  ];

  for (const g of gorras) {
    const [insertedProd] = await db.insert(products).values({
      name: g.name,
      slug: g.slug,
      description: g.description,
      price: g.price,
      categoryId: cat.id,
      isActive: true,
      images: g.images,
    }).returning();

    // Crear la variante de stock (Talla Ãšnica)
    await db.insert(productVariants).values({
      productId: insertedProd.id,
      sku: g.sku,
      size: "ÚNICA",
      stock: 12, // Arbitrary stock
    });
    
    console.log(`Inserted: ${g.name}`);
  }

  console.log("Seed complete!");
  process.exit(0);
}

seedProducts().catch(console.error);
