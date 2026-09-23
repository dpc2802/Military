/**
 * Catálogo de productos — página principal del e-commerce.
 * Ruta: /productos
 * 
 * Renderizado: Client Component para interactividad (filtros + búsqueda).
 * Los datos iniciales se pasan desde un Server Component padre.
 */

import type { Metadata } from "next";
import { Suspense } from "react";
import CatalogClient from "@/components/store/CatalogClient";
import { ProductGridSkeleton } from "@/components/store/ProductSkeleton";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Catálogo — Equipo Táctico y Artículos Militares",
  description:
    "Explorá nuestra selección de uniformes tácticos, botas militares, mochilas, accesorios y réplicas para uso civil en Colombia.",
};

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  // Cargar categorías activas del lado del servidor (no cambian frecuentemente)
  const activeCategories = await db.query.categories.findMany({
    where: eq(categories.isActive, true),
    orderBy: asc(categories.sortOrder),
  });

  // Pasar searchParams como filtros iniciales al cliente
  const initialFilters = {
    categoria: String(searchParams.categoria ?? ""),
    talla: String(searchParams.talla ?? ""),
    minPrecio: String(searchParams.minPrecio ?? ""),
    maxPrecio: String(searchParams.maxPrecio ?? ""),
    stock: String(searchParams.stock ?? ""),
    orden: String(searchParams.orden ?? "newest"),
    busqueda: String(searchParams.busqueda ?? ""),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-28 pb-16 md:pt-36">
      {/* Encabezado de sección */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl text-foreground tracking-widest">
          CATÁLOGO
        </h1>
        <p className="text-muted-foreground font-body text-sm mt-2">
          Equipo táctico y artículos militares para uso civil en Colombia
        </p>
      </div>

      <Suspense fallback={<ProductGridSkeleton count={8} />}>
        <CatalogClient
          categories={activeCategories}
          initialFilters={initialFilters}
        />
      </Suspense>
    </div>
  );
}

