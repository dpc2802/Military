import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, productVariants } from "@/db/schema";
import { eq, inArray, notInArray } from "drizzle-orm";
import { requireAdminSession } from "@/lib/auth";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().optional(),
  price: z.number().min(0),
  categoryId: z.number().min(1),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
  requiresDisclaimer: z.boolean(),
  sizeGuide: z.string().optional(),
  images: z.array(z.any()),
  variants: z.array(
    z.object({
      id: z.number().optional(),
      size: z.string().nullable(),
      color: z.string().nullable(),
      stock: z.number().min(0),
      priceOverride: z.number().nullable().optional(),
      sku: z.string().nullable().optional(),
      isActive: z.boolean(),
    })
  ).min(1),
});

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdminSession();
    const productId = Number(params.id);
    if (isNaN(productId)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const body = await request.json();
    const result = productSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const data = result.data;

    // Actualizar producto principal
    await db.update(products).set({
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price.toString(),
      categoryId: data.categoryId,
      isActive: data.isActive,
      isFeatured: data.isFeatured,
      requiresDisclaimer: data.requiresDisclaimer,
      sizeGuide: data.sizeGuide,
      images: data.images, // JSONb
      updatedAt: new Date(),
    }).where(eq(products.id, productId));

    // Upsert variants: 
    // 1. Desactivar / Eliminar variantes que ya no están
    const currentVariantIds = data.variants.map(v => v.id).filter(id => id !== undefined) as number[];
    if (currentVariantIds.length > 0) {
      // Ocultar o eliminar variantes que fueron quitadas en el UI
      await db.update(productVariants)
        .set({ isActive: false, updatedAt: new Date() })
        .where(
          eq(productVariants.productId, productId)
        ); // En realidad esto debería ser un delete si no tienen dependencias, o simplemente isActive=false
      // Vamos a manejarlos por separado
    }
    
    // Lo más sencillo con Neon HTTP es borrar las que no vienen y recrear, o hacer updates explícitos
    for (const v of data.variants) {
      if (v.id) {
        await db.update(productVariants).set({
          size: v.size || null,
          color: v.color || null,
          stock: v.stock,
          priceOverride: v.priceOverride ? v.priceOverride.toString() : null,
          sku: v.sku || null,
          isActive: v.isActive,
          updatedAt: new Date(),
        }).where(eq(productVariants.id, v.id));
      } else {
        await db.insert(productVariants).values({
          productId,
          size: v.size || null,
          color: v.color || null,
          stock: v.stock,
          priceOverride: v.priceOverride ? v.priceOverride.toString() : null,
          sku: v.sku || null,
          isActive: v.isActive,
        });
      }
    }
    
    // (Opcional) si hay variantes en la DB que no vinieron en data.variants, desactivarlas
    if (currentVariantIds.length > 0) {
      await db.update(productVariants).set({ isActive: false })
        .where(notInArray(productVariants.id, currentVariantIds));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API PUT /admin/products/[id]:", error);
    if (error.code === '23505') {
      return NextResponse.json({ error: "El slug ya está en uso." }, { status: 400 });
    }
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}
