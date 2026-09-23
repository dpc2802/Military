"use client";
import { useState, useTransition } from "react";
import Image from "next/image";
import { Trash2, Plus, Edit2, Loader2, Save, X, FolderOpen, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import type { Category } from "@/types";
import { upsertCategory, deleteCategory } from "./actions";
import { UploadDropzone } from "@/lib/uploadthing";

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setIsActive(cat.isActive);
    setSortOrder(cat.sortOrder);
    setImageUrl(cat.imageUrl || null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setIsActive(true);
    setSortOrder(0);
    setImageUrl(null);
  };

  const handleSave = async () => {
    if (!name || !slug) {
      toast.error("Nombre y slug son obligatorios");
      return;
    }

    startTransition(async () => {
      try {
        const payload = { name, slug, isActive, sortOrder, imageUrl };
        const saved = await upsertCategory(editingId, payload);
        
        if (editingId) {
          setCategories(categories.map(c => c.id === saved.id ? saved : c));
          toast.success("Categoría actualizada");
        } else {
          setCategories([...categories, saved].sort((a, b) => a.sortOrder - b.sortOrder));
          toast.success("Categoría creada");
        }
        cancelEdit();
      } catch (error: any) {
        toast.error(error.message || "Error al guardar");
      }
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar categoría? Los productos asociados podrían quedar sin categoría.")) return;

    startTransition(async () => {
      try {
        await deleteCategory(id);
        setCategories(categories.filter(c => c.id !== id));
        toast.success("Categoría eliminada");
      } catch (error: any) {
        toast.error(error.message || "Error al eliminar");
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 md:pb-0">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl text-foreground tracking-widest flex items-center gap-3 uppercase">
             <FolderOpen className="w-6 h-6 text-accent" />
             Clasificaciones
          </h1>
          <p className="text-[#9A9A94] text-sm font-body mt-2">
            Gestión de categorías y fotos de portada (Home)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── FORMULARIO ── */}
        <div className="lg:col-span-1">
          <div className="bg-[#111] border border-white/5 p-6 sticky top-24">
            <h2 className="font-heading text-sm tracking-widest text-[#F5F5F0] uppercase mb-6 flex items-center gap-2">
              {editingId ? <><Edit2 className="w-4 h-4 text-accent"/> Editar Categoría</> : <><Plus className="w-4 h-4 text-accent"/> Nueva Categoría</>}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-heading uppercase tracking-widest text-[#9A9A94] mb-2">Nombre</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingId) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                    }
                  }}
                  className="w-full bg-background border border-white/10 text-foreground px-4 py-2 text-sm font-body focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] font-heading uppercase tracking-widest text-[#9A9A94] mb-2">Slug (URL)</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-background border border-white/10 text-[#9A9A94] px-4 py-2 text-sm font-body focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-[10px] font-heading uppercase tracking-widest text-[#9A9A94] mb-2">Orden</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full bg-background border border-white/10 text-foreground px-4 py-2 text-sm font-body focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-end h-full">
                  <label className="flex items-center gap-2 cursor-pointer pb-2">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 accent-accent bg-background border-white/10"
                    />
                    <span className="text-sm font-body text-foreground">Activa</span>
                  </label>
                </div>
              </div>

              {/* Imagen de portada */}
              <div>
                 <label className="block text-[10px] font-heading uppercase tracking-widest text-[#9A9A94] mb-2">Foto de Portada (Home)</label>
                 {imageUrl ? (
                   <div className="relative aspect-video bg-background border border-white/10 overflow-hidden group">
                     <Image src={imageUrl} alt="Portada" fill className="object-cover opacity-80" />
                     <button
                       onClick={() => setImageUrl(null)}
                       className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                     >
                       <Trash2 className="w-6 h-6 text-destructive" />
                     </button>
                   </div>
                 ) : (
                   <div className="bg-background border border-white/10 p-2">
                     <UploadDropzone
                       endpoint="productImage"
                       onClientUploadComplete={(res) => {
                         if (res?.[0]) {
                           setImageUrl(res[0].url);
                           toast.success("Imagen subida correctamente");
                         }
                       }}
                       onUploadError={(error: Error) => {
                         toast.error(`Error al subir: ${error.message}`);
                       }}
                       config={{ mode: "auto" }}
                       appearance={{
                         container: "border-none bg-transparent p-4",
                         label: "text-[#9A9A94] font-body text-xs",
                         button: "bg-accent text-black font-heading tracking-widest uppercase text-[10px] px-4",
                       }}
                     />
                   </div>
                 )}
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={isPending}
                  className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-black px-4 py-3 text-xs font-heading tracking-widest uppercase transition-colors shadow-[2px_2px_0px_rgba(255,255,255,0.1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Guardar
                </button>
                {editingId && (
                  <button
                    onClick={cancelEdit}
                    disabled={isPending}
                    className="flex-none p-3 border border-white/10 text-[#9A9A94] hover:text-white hover:bg-white/5 transition-colors"
                    title="Cancelar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── LISTA ── */}
        <div className="lg:col-span-2">
          <div className="bg-[#111] border border-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm font-body">
                <thead className="bg-white/5 border-b border-white/5 text-[10px] uppercase font-heading tracking-widest text-[#9A9A94]">
                  <tr>
                    <th className="px-6 py-4 w-16">Orden</th>
                    <th className="px-6 py-4 w-16">Foto</th>
                    <th className="px-6 py-4">Categoría</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-[#9A9A94]">
                        <FolderOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="font-heading tracking-widest uppercase">No hay categorías</p>
                      </td>
                    </tr>
                  ) : (
                    categories.map((c) => (
                      <tr key={c.id} className={`transition-colors group/row ${editingId === c.id ? "bg-white/5" : "hover:bg-white/5"}`}>
                        <td className="px-6 py-4 font-mono text-[11px] text-[#9A9A94]">
                          #{c.sortOrder}
                        </td>
                        <td className="px-6 py-4">
                           {c.imageUrl ? (
                             <div className="w-10 h-10 relative bg-black border border-white/10 overflow-hidden">
                               <Image src={c.imageUrl} alt={c.name} fill className="object-cover" />
                             </div>
                           ) : (
                             <div className="w-10 h-10 bg-background border border-white/10 flex items-center justify-center opacity-50">
                               <ImageIcon className="w-4 h-4 text-[#9A9A94]" />
                             </div>
                           )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-heading text-[13px] tracking-wider uppercase text-foreground group-hover/row:text-accent transition-colors">
                            {c.name}
                          </p>
                          <p className="text-[10px] text-[#9A9A94] font-body mt-1">
                            /{c.slug}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-[10px] font-heading tracking-widest uppercase border ${c.isActive ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-white/5 border-white/10 text-[#9A9A94]'}`}>
                            {c.isActive ? "ACTIVA" : "OCULTA"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-1">
                          <button
                            onClick={() => startEdit(c)}
                            disabled={isPending}
                            className="inline-flex p-2 text-[#9A9A94] hover:text-accent hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 disabled:opacity-50"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            disabled={isPending}
                            className="inline-flex p-2 text-[#9A9A94] hover:text-destructive hover:bg-destructive/10 transition-colors border border-transparent hover:border-destructive/20 disabled:opacity-50"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
