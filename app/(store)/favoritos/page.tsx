"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlistStore } from "@/lib/stores/wishlist";
import { formatCOP } from "@/lib/format";
import { HeartOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function FavoritosPage() {
  const { items, removeItem, clear } = useWishlistStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6 mb-8">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl tracking-widest uppercase text-foreground mb-2">
              Lista de Deseos
            </h1>
            <p className="text-muted-foreground font-body text-sm">
              {items.length} {items.length === 1 ? "artículo guardado" : "artículos guardados"}
            </p>
          </div>
          {items.length > 0 && (
            <button 
              onClick={clear}
              className="text-xs font-heading tracking-widest uppercase text-muted-foreground hover:text-destructive transition-colors flex items-center gap-2"
            >
              <HeartOff className="w-4 h-4" />
              Vaciar Lista
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 bg-surface/50">
            <HeartOff className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <h2 className="font-heading text-xl tracking-widest uppercase mb-2">Tu lista está vacía</h2>
            <p className="text-muted-foreground font-body mb-8 max-w-md">
              Explora nuestro catálogo y guarda tus artículos favoritos para comprarlos más tarde.
            </p>
            <Link
              href="/productos"
              className="bg-accent hover:bg-accent/80 text-black px-8 py-3 text-sm font-heading tracking-widest uppercase transition-colors"
            >
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((item) => (
              <div key={item.productId} className="group relative bg-surface border border-white/5 hover:border-white/20 transition-all duration-300 flex flex-col h-full">
                
                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeItem(item.productId);
                    toast.success("Eliminado de favoritos");
                  }}
                  className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 hover:bg-destructive/80 transition-colors"
                  title="Eliminar de favoritos"
                >
                  <HeartOff className="w-4 h-4 text-white" />
                </button>

                <Link href={`/productos/${item.productSlug}`} className="flex-1 flex flex-col">
                  {/* Image */}
                  <div className="relative aspect-[3/4] bg-[#0A0A0A] overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-heading text-sm text-foreground tracking-widest uppercase mb-2 line-clamp-2">
                      {item.productName}
                    </h3>
                    <div className="mt-auto">
                      <p className="text-accent font-mono text-sm tracking-widest">
                        {formatCOP(item.price)}
                      </p>
                    </div>
                  </div>
                </Link>

                <Link 
                  href={`/productos/${item.productSlug}`}
                  className="w-full bg-white/5 hover:bg-accent hover:text-black text-white text-xs font-heading tracking-widest uppercase py-3 flex items-center justify-center gap-2 transition-colors border-t border-white/5"
                >
                  Ver Opciones
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
