import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { products, productVariants } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { formatCOP } from "@/lib/format";
import { Plus, Edit2, AlertCircle, Package } from "lucide-react";
import type { ProductImage } from "@/db/schema";

export const metadata = { title: "Productos — Admin SGB" };

export default async function AdminProductsPage() {
  const allProducts = await db.query.products.findMany({
    with: {
      category: true,
      variants: true,
    },
    orderBy: desc(products.createdAt),
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 md:pb-0">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl text-foreground tracking-widest flex items-center gap-3 uppercase">
             <Package className="w-6 h-6 text-accent" />
             Arsenal
          </h1>
          <p className="text-[#9A9A94] text-sm font-body mt-2">
            Gestión del inventario y catálogo de productos
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-black px-6 py-3 text-xs font-heading tracking-widest uppercase transition-colors shadow-[2px_2px_0px_rgba(255,255,255,0.1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none"
        >
          <Plus className="w-4 h-4" />
          Registrar Equipo
        </Link>
      </div>

      {/* ── TABLA DE PRODUCTOS ── */}
      <div className="bg-[#111] border border-white/5 overflow-hidden relative group">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-body">
            <thead className="bg-white/5 border-b border-white/5 text-[10px] uppercase font-heading tracking-widest text-[#9A9A94]">
              <tr>
                <th className="px-6 py-4 w-20">IMG</th>
                <th className="px-6 py-4">Designación</th>
                <th className="px-6 py-4">Clasificación</th>
                <th className="px-6 py-4">Valor base</th>
                <th className="px-6 py-4">Stock Total</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {allProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#9A9A94]">
                    <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-heading tracking-widest uppercase">No hay armamento registrado</p>
                  </td>
                </tr>
              ) : (
                allProducts.map((p) => {
                  const imgs = p.images as ProductImage[] | null;
                  const firstImg = imgs?.[0]?.url || "/logo.png";
                  const totalStock = p.variants.reduce((acc, v) => acc + Math.max(0, v.stock - v.reservedStock), 0);
                  
                  return (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors group/row">
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 bg-black border border-white/10 overflow-hidden relative">
                          <Image
                            src={firstImg}
                            alt={p.name}
                            fill
                            className={`object-cover ${firstImg === "/logo.png" ? "p-2 brightness-0 invert opacity-50" : ""}`}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-heading text-[13px] tracking-wider uppercase text-foreground group-hover/row:text-accent transition-colors truncate max-w-[200px] md:max-w-xs">
                          {p.name}
                        </p>
                        {p.variants.length > 0 && (
                          <p className="text-[10px] text-[#9A9A94] uppercase tracking-wider mt-1">
                            {p.variants.length} variables operativas
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[11px] text-[#9A9A94] uppercase tracking-widest font-heading">
                        {p.category.name}
                      </td>
                      <td className="px-6 py-4 font-heading tracking-widest text-[#F5F5F0]">
                        {formatCOP(p.price)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-heading tracking-widest uppercase border ${totalStock === 0 ? 'bg-destructive/10 border-destructive/20 text-destructive' : totalStock < 5 ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-white/5 border-white/10 text-white'}`}>
                          {totalStock === 0 ? "AGOTADO" : `${totalStock} UDS`}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-[10px] font-heading tracking-widest uppercase border ${p.isActive ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-white/5 border-white/10 text-[#9A9A94]'}`}>
                          {p.isActive ? "ACTIVO" : "BAJA"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/productos/${p.id}`}
                          className="inline-flex p-2 text-[#9A9A94] hover:text-accent hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                          title="Editar producto"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
