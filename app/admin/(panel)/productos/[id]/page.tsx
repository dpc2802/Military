import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";
import type { Product, ProductVariant } from "@/types";

export const metadata = { title: "Editar Producto — Admin" };

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const productId = Number(params.id);
  if (isNaN(productId)) notFound();

  const [allCategories, product] = await Promise.all([
    db.query.categories.findMany({ orderBy: asc(categories.name) }),
    db.query.products.findFirst({
      where: eq(products.id, productId),
      with: { variants: true },
    }),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/productos"
          className="p-2 border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="font-heading text-2xl tracking-widest uppercase">
          Editar Producto
        </h1>
      </div>

      <ProductForm 
        categories={allCategories} 
        initialData={product as Product & { variants: ProductVariant[] }} 
      />
    </div>
  );
}
