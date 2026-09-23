"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check, Heart, ShieldAlert, Zap } from "lucide-react";
import { useCartStore } from "@/lib/stores/cart";
import { formatCOP, parsePrice } from "@/lib/format";
import { toast } from "sonner";
import type { ProductWithDetails } from "@/types";
import type { ProductImage } from "@/db/schema";

interface ProductCardProps {
  product: ProductWithDetails;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [isExpanded, setIsExpanded] = useState(false);
  const [addedState, setAddedState] = useState(false);

  let images = product.images as ProductImage[] || [];
  
  // -- OVERRIDE IMAGES FOR DEMO BASED ON NAME --
  const pName = product.name.toLowerCase();
  if (pName.includes("pantalón") || pName.includes("pantalon") || pName.includes("uniforme")) {
    images = [
      { url: "/prod-pant-1.png", altText: "Pantalón Táctico Frontal" },
      { url: "/prod-pant-2.jpg", altText: "Pantalón Táctico Detalle" }
    ] as any;
  } else if (pName.includes("bota")) {
    images = [{ url: "/prod-boot.png", altText: "Botas Tácticas" }] as any;
  } else if (pName.includes("chaqueta") || pName.includes("softshell") || pName.includes("chaleco")) {
    images = [{ url: "/prod-jacket.png", altText: "Chaqueta Softshell" }] as any;
  } else if (pName.includes("guante") || pName.includes("mochila")) {
    images = [{ url: "/prod-gloves.png", altText: "Guantes de Asalto" }] as any;
  } else if (images.length === 0) {
    images = [{ url: "/logo.png", altText: "SGB Logo" }] as any;
  }
  
  const mainImage = images[0];
  const hoverImage = images.length > 1 ? images[1] : null;

  // Calcular disponibilidad
  const totalAvailable = product.variants.reduce(
    (sum, v) => sum + Math.max(0, v.stock - v.reservedStock),
    0
  );
  const isOutOfStock = totalAvailable === 0;

  // Tallas disponibles reales
  const availableVariants = product.variants.filter((v) => v.isActive && v.stock - v.reservedStock > 0);
  const sizes = Array.from(new Set(availableVariants.map((v) => v.size).filter(Boolean))) as string[];

  // Lógica de Badges
  // Prioridad: Discount > Last units > New > Featured
  let badge = null;
  const isDiscounted = false; // Add real logic if you have salePrice in DB
  const isLastUnits = totalAvailable > 0 && totalAvailable <= 3;
  const isNew = false; // Add logic if createdAt is < 30 days

  if (isDiscounted) {
    badge = <span className="bg-destructive text-destructive-foreground text-[10px] font-heading px-2 py-1 tracking-widest uppercase shadow-md">-20% OFF</span>;
  } else if (isLastUnits) {
    badge = (
      <span className="bg-[#C2B280] text-black text-[10px] font-heading px-2 py-1 tracking-widest uppercase shadow-md flex items-center gap-1">
        <Zap className="w-3 h-3 fill-black" /> ÚLTIMAS {totalAvailable}
      </span>
    );
  } else if (isNew) {
    badge = <span className="bg-[#25D366] text-black text-[10px] font-heading px-2 py-1 tracking-widest uppercase shadow-md">NUEVO</span>;
  } else if (product.isFeatured) {
    badge = <span className="bg-black/80 backdrop-blur-sm border border-white/10 text-white text-[10px] font-heading px-2 py-1 tracking-widest uppercase shadow-md">DESTACADO</span>;
  }

  const handleActionClick = (e: React.MouseEvent, variant?: any) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    if (sizes.length > 1 && !variant) {
      setIsExpanded(!isExpanded);
      return;
    }

    const selectedVariant = variant || availableVariants[0];
    if (!selectedVariant) return;

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      productName: product.name,
      productSlug: product.slug,
      variantSize: selectedVariant.size,
      variantColor: selectedVariant.color,
      unitPrice: parsePrice(selectedVariant.priceOverride ?? product.price),
      imageUrl: mainImage?.url ?? "/logo.png",
      imageAlt: mainImage?.altText ?? product.name,
    });

    // Feedback visual
    setAddedState(true);
    setTimeout(() => setAddedState(false), 800);
    setIsExpanded(false);

    toast.success(`${product.name} agregado al carrito`);
  };

  return (
    <div className="group relative bg-background border border-white/5 hover:border-accent/30 transition-colors flex flex-col h-full scroll-reveal-card @container" style={{ contentVisibility: "auto" }}>
      <Link href={`/productos/${product.slug}`} className="flex flex-col flex-1 block">
        
        {/* IMAGEN (Fija 4/5) con Hover Effect Premium */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#111]">
          {/* Skeleton animado mientras carga */}
          <div className="absolute inset-0 bg-white/5 animate-pulse" />

          {mainImage && (
            <Image
              src={mainImage.url}
              alt={mainImage.altText || product.name}
              fill
              onError={(e) => {
                // Fallback visual robusto si la URL falla
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.classList.add('fallback-triggered');
              }}
              className={`object-cover transition-all duration-700 ease-in-out group-hover:scale-105 ${hoverImage ? 'group-hover:opacity-0' : ''}`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          )}
          
          {/* Fallback de error y placeholder */}
          <style dangerouslySetInnerHTML={{__html: `
            .fallback-triggered + .error-placeholder { display: flex !important; }
          `}} />
          <div className={`absolute inset-0 flex items-center justify-center bg-[#181818] z-0 ${mainImage ? 'hidden error-placeholder' : 'flex'}`}>
             <div className="flex flex-col items-center gap-2 opacity-30">
               <ShieldAlert className="w-10 h-10 text-white" />
               <span className="text-[10px] font-heading tracking-widest uppercase">Sin Imagen</span>
             </div>
          </div>

          {/* Badges Overlay Absoluto (Nunca estorba el título) */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5 items-start">
            {badge}
          </div>

          {/* Botón de Favoritos (Esquina derecha) */}
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} 
            className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-accent/20"
          >
            <Heart className="w-4 h-4 text-white hover:text-accent transition-colors" />
          </button>
        </div>

        {/* INFO Y CTA (Siempre debajo de la imagen) */}
        <div className="p-4 md:p-5 flex flex-col flex-1 bg-surface z-20">
          
          {/* Categoría (Accent) */}
          <p className="text-[9px] md:text-[10px] text-accent font-heading uppercase tracking-[0.2em] mb-1.5 line-clamp-1">
            {product.category.name}
          </p>

          {/* Nombre de producto */}
          <h3 className="text-[13px] md:text-[15px] font-heading text-foreground tracking-wide uppercase leading-snug line-clamp-2 mb-3">
            {product.name}
          </h3>

          <div className="mt-auto">
            {/* Precio */}
            <p className="text-accent font-heading text-lg md:text-xl tracking-wider mb-4 drop-shadow-sm">
              {formatCOP(parsePrice(product.price))}
            </p>

            {/* Selector de tallas expandible (CSS Grid animation) */}
            <div className="grid transition-all duration-300 ease-in-out" style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}>
              <div className="overflow-hidden">
                <div className="flex flex-wrap gap-2 pb-4">
                  {availableVariants.map((v) => (
                    <button
                      key={v.id}
                      onClick={(e) => handleActionClick(e, v)}
                      className="text-[10px] md:text-xs font-body px-3 py-1.5 border border-white/20 text-[#9A9A94] hover:border-accent hover:text-foreground transition-colors uppercase"
                    >
                      {v.size || "Única"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Botón principal CTA */}
            <button
              onClick={(e) => handleActionClick(e)}
              disabled={isOutOfStock}
              className={`w-full relative flex items-center justify-center gap-2 py-3 text-xs md:text-[13px] font-heading tracking-[0.15em] uppercase transition-all duration-300 shadow-[2px_2px_0px_rgba(0,0,0,0.5)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none ${
                addedState 
                  ? "bg-[#25D366] text-black border-transparent" 
                  : isOutOfStock
                    ? "bg-muted text-muted-foreground border-transparent cursor-not-allowed"
                    : isExpanded 
                      ? "bg-transparent border border-white/20 text-foreground hover:bg-white/5"
                      : "bg-accent text-accent-foreground border-transparent hover:bg-primary-light"
              }`}
            >
              <div className="w-1.5 h-1.5 bg-black/30 absolute left-3 top-1/2 -translate-y-1/2" />
              
              {addedState ? (
                <>
                  <Check className="w-4 h-4 animate-bounce" />
                  AGREGADO
                </>
              ) : isOutOfStock ? (
                "AGOTADO"
              ) : isExpanded ? (
                "CERRAR"
              ) : sizes.length > 1 ? (
                "ELEGIR TALLA"
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 transition-transform group-hover:scale-110" />
                  AGREGAR AL CARRITO
                </>
              )}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
