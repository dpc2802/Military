import { db } from "@/db";
import { categories } from "@/db/schema";
import { asc } from "drizzle-orm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";

export const metadata = { title: "Nuevo Producto — Admin" };

export default async function NewProductPage() {
  const allCategories = await db.query.categories.findMany({
    orderBy: asc(categories.name),
  });

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
          Nuevo Producto
        </h1>
      </div>

      <ProductForm categories={allCategories} />
    </div>
  );
}
