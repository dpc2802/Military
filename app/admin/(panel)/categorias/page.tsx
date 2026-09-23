import { db } from "@/db";
import { categories } from "@/db/schema";
import { asc } from "drizzle-orm";
import CategoryManager from "./CategoryManager";

export const metadata = { title: "Categorías — Admin SGB" };

export default async function AdminCategoriesPage() {
  const allCategories = await db.query.categories.findMany({
    orderBy: asc(categories.sortOrder),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl tracking-widest uppercase">Categorías</h1>
      </div>

      <CategoryManager initialCategories={allCategories} />
    </div>
  );
}
