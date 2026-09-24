import fs from "fs";

const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/sitemap.ts";

const code = `import { MetadataRoute } from "next";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq } from "drizzle-orm";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://military-eosin.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Obtener productos activos
  const activeProducts = await db.query.products.findMany({
    where: eq(products.isActive, true),
    columns: { slug: true, updatedAt: true },
  });

  const productUrls = activeProducts.map((product) => ({
    url: \`\${BASE_URL}/productos/\${product.slug}\`,
    lastModified: product.updatedAt || new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Rutas estáticas principales
  const staticRoutes = [
    {
      url: \`\${BASE_URL}\`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: \`\${BASE_URL}/productos\`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: \`\${BASE_URL}/politica-envios\`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: \`\${BASE_URL}/politica-datos\`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: \`\${BASE_URL}/terminos-y-condiciones\`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
  ];

  return [...staticRoutes, ...productUrls];
}
`;

fs.writeFileSync(path, code, "utf-8");
console.log("Created sitemap.ts");
