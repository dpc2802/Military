"use server";

import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminSession } from "@/lib/auth";

export async function upsertCategory(id: number | null, data: { name: string; slug: string; isActive: boolean; sortOrder: number; imageUrl?: string | null }) {
  await requireAdminSession();

  try {
    if (id) {
      const [updated] = await db.update(categories)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(categories.id, id))
        .returning();
      if (!updated) throw new Error("No se pudo actualizar");
      return updated;
    } else {
      const [created] = await db.insert(categories).values(data).returning();
      if (!created) throw new Error("No se pudo crear");
      return created;
    }
  } catch (error: any) {
    if (error.code === '23505') throw new Error("El slug ya existe");
    throw new Error("Error interno al guardar la categoría");
  }
}

export async function deleteCategory(id: number) {
  await requireAdminSession();
  try {
    await db.delete(categories).where(eq(categories.id, id));
  } catch (error: any) {
    if (error.code === '23503') {
      throw new Error("No se puede eliminar: hay productos asociados a esta categoría");
    }
    throw new Error("Error interno al eliminar");
  }
}
