import { MetadataRoute } from "next";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq } from "drizzle-orm";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sgbmilitary.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Bases
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/productos`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/terminos-y-condiciones`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/politica-datos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/politica-envios`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Productos dinámicos
  const allProducts = await db.query.products.findMany({
    where: eq(products.isActive, true),
    columns: { slug: true, updatedAt: true },
  });

  const productRoutes: MetadataRoute.Sitemap = allProducts.map((p) => ({
    url: `${SITE_URL}/productos/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Categorías dinámicas
  const allCategories = await db.query.categories.findMany({
    where: eq(categories.isActive, true),
    columns: { slug: true, updatedAt: true },
  });

  const categoryRoutes: MetadataRoute.Sitemap = allCategories.map((c) => ({
    url: `${SITE_URL}/productos?categoria=${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...routes, ...categoryRoutes, ...productRoutes];
}
