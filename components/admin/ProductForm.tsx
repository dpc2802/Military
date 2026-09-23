"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadDropzone } from "@/lib/uploadthing";
import { Trash2, Plus, GripVertical, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Category, Product, ProductVariant } from "@/types";
import type { ProductImage } from "@/db/schema";

const productSchema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  price: z.number().min(0),
  categoryId: z.number().min(1),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
  requiresDisclaimer: z.boolean(),
  sizeGuide: z.string().optional(),
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

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  categories: Category[];
  initialData?: Product & { variants: ProductVariant[] };
}

export default function ProductForm({ categories, initialData }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<ProductImage[]>(
    (initialData?.images as ProductImage[]) || []
  );

  const { register, control, handleSubmit, formState: { errors }, watch, setValue } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          slug: initialData.slug,
          description: initialData.description || "",
          price: Number(initialData.price),
          categoryId: initialData.categoryId,
          isFeatured: initialData.isFeatured,
          isActive: initialData.isActive,
          requiresDisclaimer: initialData.requiresDisclaimer,
          sizeGuide: initialData.sizeGuide || "",
          variants: initialData.variants.map((v) => ({
            id: v.id,
            size: v.size,
            color: v.color,
            stock: v.stock,
            priceOverride: v.priceOverride ? Number(v.priceOverride) : null,
            sku: v.sku,
            isActive: v.isActive,
          })),
        }
      : {
          isActive: true,
          isFeatured: false,
          requiresDisclaimer: false,
          price: 0,
          variants: [{ size: "Única", color: null, stock: 0, isActive: true }],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const generateSlug = () => {
    const name = watch("name");
    if (name) {
      setValue(
        "slug",
        name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "")
      );
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        images,
      };

      const url = initialData ? `/api/admin/products/${initialData.id}` : "/api/admin/products";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al guardar el producto");
      }

      toast.success(initialData ? "Producto actualizado" : "Producto creado");
      router.push("/admin/productos");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Principal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border p-6 space-y-4">
            <h2 className="font-heading text-lg tracking-widest uppercase mb-4">
              Información General
            </h2>
            
            <div className="space-y-1">
              <label className="text-xs font-body uppercase tracking-widest text-muted-foreground">Nombre</label>
              <input
                {...register("name")}
                onBlur={!initialData ? generateSlug : undefined}
                className="w-full bg-background border border-border px-3 py-2 text-sm font-body focus:outline-none focus:border-primary"
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-body uppercase tracking-widest text-muted-foreground">Slug (URL)</label>
              <input
                {...register("slug")}
                className="w-full bg-background border border-border px-3 py-2 text-sm font-body focus:outline-none focus:border-primary font-mono"
              />
              {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-body uppercase tracking-widest text-muted-foreground">Descripción</label>
              <textarea
                {...register("description")}
                className="w-full bg-background border border-border px-3 py-2 text-sm font-body focus:outline-none focus:border-primary min-h-[120px]"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-body uppercase tracking-widest text-muted-foreground">Guía de Tallas (URL o texto)</label>
              <input
                {...register("sizeGuide")}
                className="w-full bg-background border border-border px-3 py-2 text-sm font-body focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="bg-surface border border-border p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg tracking-widest uppercase">Variantes e Inventario</h2>
              <button
                type="button"
                onClick={() => append({ size: "", color: null, stock: 0, isActive: true })}
                className="text-xs flex items-center gap-1 font-body text-accent hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar variante
              </button>
            </div>
            
            {errors.variants && <p className="text-xs text-destructive mb-2">{errors.variants.message}</p>}

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-3 bg-background border border-border p-3">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                  
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Talla</label>
                      <input
                        {...register(`variants.${index}.size`)}
                        placeholder="Ej: L, 42"
                        className="w-full bg-surface border border-border px-2 py-1.5 text-xs font-body focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Color</label>
                      <input
                        {...register(`variants.${index}.color`)}
                        placeholder="Ej: Verde"
                        className="w-full bg-surface border border-border px-2 py-1.5 text-xs font-body focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Stock</label>
                      <input
                        type="number"
                        {...register(`variants.${index}.stock`, { valueAsNumber: true })}
                        className="w-full bg-surface border border-border px-2 py-1.5 text-xs font-body focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Precio ($)</label>
                      <input
                        type="number"
                        {...register(`variants.${index}.priceOverride`, { valueAsNumber: true })}
                        placeholder="Base"
                        className="w-full bg-surface border border-border px-2 py-1.5 text-xs font-body focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex items-end justify-between h-full pb-1">
                      <label className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground cursor-pointer">
                        <input type="checkbox" {...register(`variants.${index}.isActive`)} className="accent-primary" />
                        Activo
                      </label>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        className="text-muted-foreground hover:text-destructive disabled:opacity-30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Lateral */}
        <div className="space-y-6">
          
          <div className="bg-surface border border-border p-6 space-y-4">
            <h2 className="font-heading text-lg tracking-widest uppercase mb-4">
              Precio y Categoría
            </h2>

            <div className="space-y-1">
              <label className="text-xs font-body uppercase tracking-widest text-muted-foreground">Precio Base (COP)</label>
              <input
                type="number"
                {...register("price", { valueAsNumber: true })}
                className="w-full bg-background border border-border px-3 py-2 text-xl font-heading text-accent focus:outline-none focus:border-primary"
              />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-body uppercase tracking-widest text-muted-foreground">Categoría</label>
              <select
                {...register("categoryId", { valueAsNumber: true })}
                className="w-full bg-background border border-border px-3 py-2 text-sm font-body focus:outline-none focus:border-primary"
              >
                <option value={0}>Seleccioná...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId.message}</p>}
            </div>

            <div className="pt-4 border-t border-border space-y-3">
              <label className="flex items-center gap-2 text-sm font-body cursor-pointer hover:text-accent">
                <input type="checkbox" {...register("isActive")} className="w-4 h-4 accent-primary" />
                Producto Activo
              </label>
              <label className="flex items-center gap-2 text-sm font-body cursor-pointer hover:text-accent">
                <input type="checkbox" {...register("isFeatured")} className="w-4 h-4 accent-primary" />
                Destacado (Home)
              </label>
              <label className="flex items-center gap-2 text-sm font-body cursor-pointer text-destructive hover:text-red-400">
                <input type="checkbox" {...register("requiresDisclaimer")} className="w-4 h-4 accent-destructive" />
                Aviso de "Uso Civil" (Armas/Réplicas)
              </label>
            </div>
          </div>

          <div className="bg-surface border border-border p-6 space-y-4">
            <h2 className="font-heading text-lg tracking-widest uppercase mb-4">
              Imágenes
            </h2>
            
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square border border-border group">
                  <Image src={img.url} alt="Prod" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 bg-destructive/80 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {images.length < 6 && (
              <UploadDropzone
                endpoint="productImage"
                onClientUploadComplete={(res) => {
                  if (res) {
                    const newImages = res.map(r => ({ url: r.url, altText: watch("name"), sortOrder: images.length }));
                    setImages([...images, ...newImages].slice(0, 6));
                  }
                }}
                onUploadError={(error: Error) => {
                  toast.error(`Error al subir: ${error.message}`);
                }}
                className="ut-button:bg-primary ut-button:ut-readying:bg-primary/50 ut-button:ut-uploading:bg-primary/50 border-border bg-background"
              />
            )}
            <p className="text-xs text-muted-foreground text-center">Máx 6 imágenes. 4MB c/u.</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:bg-muted text-primary-foreground py-3 text-sm font-heading tracking-widest uppercase transition-colors"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {initialData ? "Guardar Cambios" : "Crear Producto"}
          </button>

        </div>
      </div>
    </form>
  );
}
