import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, productVariants } from "@/db/schema";
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
      size: z.string().nullable(),
      color: z.string().nullable(),
      stock: z.number().min(0),
      priceOverride: z.number().nullable().optional(),
      sku: z.string().nullable().optional(),
      isActive: z.boolean(),
    })
  ).min(1),
});

export async function POST(request: NextRequest) {
  try {
    await requireAdminSession();
    const body = await request.json();
    const result = productSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const data = result.data;

    // Crear producto principal
    const [newProduct] = await db.insert(products).values({
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
    }).returning();

    if (!newProduct) throw new Error("Error creando producto");

    // Insertar variantes
    const variantsToInsert = data.variants.map((v) => ({
      productId: newProduct.id,
      size: v.size || null,
      color: v.color || null,
      stock: v.stock,
      priceOverride: v.priceOverride ? v.priceOverride.toString() : null,
      sku: v.sku || null,
      isActive: v.isActive,
    }));

    await db.insert(productVariants).values(variantsToInsert);

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error("API POST /admin/products:", error);
    // Unique constraint error check
    if (error.code === '23505') {
      return NextResponse.json({ error: "El slug ya está en uso." }, { status: 400 });
    }
    return NextResponse.json({ error: "Error de servidor" }, { status: 500 });
  }
}
