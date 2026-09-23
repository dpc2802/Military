export const dynamic = 'force-dynamic';
/**
 * API de productos con filtros, búsqueda y paginación.
 * GET /api/products?categoria=botas&talla=42&minPrecio=50000&maxPrecio=300000&stock=true&orden=precio_asc&busqueda=bota&pagina=1
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, categories, productVariants } from "@/db/schema";
import { eq, and, gte, lte, ilike, sql, desc, asc, inArray } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const categoria = searchParams.get("categoria");
    const talla = searchParams.get("talla");
    const minPrecio = searchParams.get("minPrecio");
    const maxPrecio = searchParams.get("maxPrecio");
    const soloStock = searchParams.get("stock") === "true";
    const orden = searchParams.get("orden") ?? "newest";
    const busqueda = searchParams.get("busqueda");
    const pagina = Math.max(1, Number(searchParams.get("pagina") ?? "1"));
    const porPagina = 12;

    // Construir condiciones base
    const where = [eq(products.isActive, true)];

    if (categoria) {
      // Buscar el ID de la categoría por slug
      const cat = await db.query.categories.findFirst({
        where: eq(categories.slug, categoria),
      });
      if (cat) {
        where.push(eq(products.categoryId, cat.id));
      }
    }

    if (busqueda && busqueda.length > 1) {
      where.push(ilike(products.name, `%${busqueda}%`));
    }

    if (minPrecio) {
      where.push(gte(products.price, minPrecio));
    }

    if (maxPrecio) {
      where.push(lte(products.price, maxPrecio));
    }

    // Si filtra por talla, necesitamos los IDs de productos que tienen esa variante disponible
    if (talla) {
      const variantsWithSize = await db
        .select({ productId: productVariants.productId })
        .from(productVariants)
        .where(
          and(
            eq(productVariants.size, talla),
            eq(productVariants.isActive, true),
            gte(productVariants.stock, 1)
          )
        );

      const productIds = Array.from(new Set(variantsWithSize.map((v) => v.productId)));
      if (productIds.length === 0) {
        return NextResponse.json({ products: [], total: 0, pagina, totalPaginas: 0 });
      }
      where.push(inArray(products.id, productIds));
    }

    // Ordenamiento
    const orderMap = {
      newest: desc(products.createdAt),
      price_asc: asc(products.price),
      price_desc: desc(products.price),
      bestselling: desc(products.totalSold),
    };
    const orderBy = orderMap[orden as keyof typeof orderMap] ?? desc(products.createdAt);

    // Query principal con relaciones
    const allProducts = await db.query.products.findMany({
      where: and(...where),
      with: {
        category: true,
        variants: {
          where: eq(productVariants.isActive, true),
          orderBy: asc(productVariants.size),
        },
      },
      orderBy,
    });

    // Filtrar por stock disponible si se solicita (post-query para simplificar)
    const filtered = soloStock
      ? allProducts.filter((p) =>
          p.variants.some((v) => v.stock - v.reservedStock > 0)
        )
      : allProducts;

    // Paginación manual
    const total = filtered.length;
    const totalPaginas = Math.ceil(total / porPagina);
    const paginados = filtered.slice((pagina - 1) * porPagina, pagina * porPagina);

    return NextResponse.json({
      products: paginados,
      total,
      pagina,
      totalPaginas,
    });
  } catch (error) {
    console.error("[API /products] Error:", error);
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}

