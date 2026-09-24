"use client";

import { useState } from "react";
import Image from "next/image";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import Link from "next/link";
import { ShoppingCart, Check, ShieldAlert, Star, ChevronRight, Info, Truck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/stores/cart";
import { formatCOP, parsePrice } from "@/lib/format";
import { toast } from "sonner";
import ProductCard from "@/components/store/ProductCard";
import type { ProductWithDetails } from "@/types";
import type { ProductImage } from "@/db/schema";

interface ProductDetailClientProps {
  product: ProductWithDetails;
  relatedProducts: ProductWithDetails[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const addItem = useCartStore((s) => s.addItem);

  // -- FAKE IMAGES LOGIC PARA QUE NO SE ROMPA LA DEMO --
  let images = (product.images as ProductImage[]) || [];
  const pName = product.name.toLowerCase();
  if (pName.includes("pantalón") || pName.includes("pantalon") || pName.includes("uniforme")) {
    images = [
      { url: "/prod-pant-1.png", altText: "Frontal" },
      { url: "/prod-pant-2.jpg", altText: "Detalle" }
    ] as any;
  } else if (pName.includes("bota")) {
    images = [{ url: "/prod-boot.png", altText: "Frontal" }] as any;
  } else if (pName.includes("chaqueta") || pName.includes("softshell") || pName.includes("chaleco")) {
    images = [{ url: "/prod-jacket.png", altText: "Frontal" }] as any;
  } else if (pName.includes("guante") || pName.includes("mochila")) {
    images = [{ url: "/prod-gloves.png", altText: "Frontal" }] as any;
  }
  // Si definitivamente no hay imagen, array vacío para usar fallback

  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [guiaTallasOpen, setGuiaTallasOpen] = useState(false);

  // Variantes
  const availableVariants = product.variants.filter((v) => v.isActive);
  const totalAvailable = availableVariants.reduce(
    (sum, v) => sum + Math.max(0, v.stock - v.reservedStock),
    0
  );
  const isOutOfStock = totalAvailable === 0;

  const sizes = Array.from(new Set(availableVariants.map((v) => v.size).filter(Boolean))) as string[];
  const colors = Array.from(new Set(availableVariants.map((v) => v.color).filter(Boolean))) as string[];

  const [selectedSize, setSelectedSize] = useState<string | null>(sizes.length === 1 ? sizes[0] : null);
  const [selectedColor, setSelectedColor] = useState<string | null>(colors.length === 1 ? colors[0] : null);
  const [adding, setAdding] = useState(false);

  // Helper para disponibilidad cruzada
  const getSelectedVariant = () => {
    return availableVariants.find((v) => {
      const matchSize = selectedSize ? v.size === selectedSize : true;
      const matchColor = selectedColor ? v.color === selectedColor : true;
      return matchSize && matchColor;
    });
  };
  const selectedVariant = getSelectedVariant();
  const availableStock = selectedVariant ? Math.max(0, selectedVariant.stock - selectedVariant.reservedStock) : totalAvailable;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    if (sizes.length > 1 && !selectedSize) {
      toast.error("Por favor, selecciona una talla");
      return;
    }
    if (colors.length > 1 && !selectedColor) {
      toast.error("Por favor, selecciona un color");
      return;
    }

    const variantToUse = selectedVariant || availableVariants[0];
    if (!variantToUse) return;

    setAdding(true);
    addItem({
      productId: product.id,
      variantId: variantToUse.id,
      productName: product.name,
      productSlug: product.slug,
      variantSize: variantToUse.size,
      variantColor: variantToUse.color,
      unitPrice: parsePrice(variantToUse.priceOverride ?? product.price),
      imageUrl: images[0]?.url ?? "/logo.png",
      imageAlt: images[0]?.altText ?? product.name,
    });

    setTimeout(() => {
      setAdding(false);
      toast.success(`${product.name} agregado al carrito`);
    }, 600);
  };

  // Precios
  const currentPrice = selectedVariant?.priceOverride ? parsePrice(selectedVariant.priceOverride) : parsePrice(product.price);
  const fakeOldPrice = currentPrice * 1.25; // Fake discount logic for demo
  const isDiscounted = false; // Toggle this if real data supports it

  return (
    <div className="max-w-7xl mx-auto px-4 pt-28 pb-32 md:pt-36 md:pb-16 relative">
      
      {/* ── BREADCRUMBS ── */}
      <nav className="flex items-center gap-2 text-[10px] font-heading uppercase tracking-widest text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href={`/productos?categoria=${product.category.slug}`} className="hover:text-foreground transition-colors">{product.category.name}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-accent">{product.name}</span>
      </nav>

      {/* ── MAIN PRODUCT GRID ── */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
        
        {/* GALERÍA DE IMÁGENES (Fija en Desktop) */}
        <div className="w-full lg:w-[55%] flex flex-col gap-4 lg:sticky lg:top-24 h-max">
          {/* Main Image */}
          <div 
            className="relative aspect-square md:aspect-[4/5] bg-[#111] border border-white/5 cursor-zoom-in group overflow-hidden"
            onClick={() => images.length > 0 && setZoomOpen(true)}
          >
            {images.length > 0 ? (
              <>
                <Image
                  src={images[selectedImage].url}
                  alt={images[selectedImage].altText || product.name}
                  fill
                  priority
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add('fallback-triggered');
                  }}
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                <style dangerouslySetInnerHTML={{__html: `
                  .fallback-triggered + .error-placeholder { display: flex !important; }
                `}} />
                <div className="hidden error-placeholder absolute inset-0 items-center justify-center bg-[#181818] z-0">
                  <div className="flex flex-col items-center gap-2 opacity-30">
                    <ShieldAlert className="w-12 h-12 text-white" />
                    <span className="text-[10px] font-heading tracking-widest uppercase">Sin Imagen</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30">
                 <ShieldAlert className="w-12 h-12 text-white mb-2" />
                 <span className="text-[10px] font-heading tracking-widest uppercase">Sin Imagen</span>
              </div>
            )}

            {/* Disclaimer Civil (Visual) */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 p-2.5 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-muted-foreground font-body leading-relaxed">
                <strong className="text-foreground uppercase tracking-wider font-normal">Uso Civil Autorizado:</strong> Producto de libre venta en Colombia. No requiere permisos especiales.
              </p>
            </div>
          </div>

          {/* Thumbnails (Scrollable en mobile) */}
          {images.length > 1 && (
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-2 scrollbar-hide">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-20 flex-shrink-0 snap-start border transition-all ${
                    selectedImage === idx ? "border-accent opacity-100" : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image src={img.url} alt={img.altText} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INFO PRODUCTO */}
        <div className="w-full lg:w-[45%] flex flex-col pt-2 lg:pt-0 pb-32 lg:pb-0">
          
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading text-foreground tracking-widest uppercase mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-heading text-accent tracking-widest">
                {formatCOP(currentPrice)}
              </span>
              {isDiscounted && (
                <span className="text-sm font-heading text-muted-foreground line-through decoration-destructive decoration-2">
                  {formatCOP(fakeOldPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Stock Indicator Premium */}
          {selectedVariant && (
            <div className="mb-8 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${availableStock > 3 ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : availableStock > 0 ? "bg-accent shadow-[0_0_8px_rgba(194,178,128,0.5)]" : "bg-destructive shadow-[0_0_8px_rgba(139,0,0,0.5)]"}`} />
              <p className="text-xs font-heading tracking-widest uppercase text-foreground">
                {availableStock === 0
                  ? "Agotado Temporalmente"
                  : availableStock <= 3
                  ? `Últimas ${availableStock} unidades`
                  : "Disponible para despacho inmediato"}
              </p>
            </div>
          )}

          {/* VARIANTES */}
          <div className="space-y-6 mb-8">
            {sizes.length > 1 && (
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] font-heading uppercase tracking-[0.2em] text-muted-foreground">Talla</label>
                  <button onClick={() => setGuiaTallasOpen(true)} className="text-[10px] text-accent underline hover:text-foreground font-body">Guía de tallas</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const hasStock = availableVariants.some(v => v.size === size && (v.stock - v.reservedStock) > 0);
                    return (
                      <button
                        key={size}
                        onClick={() => hasStock && setSelectedSize(size)}
                        disabled={!hasStock}
                        className={`min-w-[48px] h-10 px-3 border text-xs font-body transition-colors uppercase ${
                          selectedSize === size
                            ? "border-accent text-black bg-accent"
                            : hasStock
                            ? "border-white/10 text-muted-foreground hover:border-white/30 hover:text-foreground bg-white/5"
                            : "border-white/5 text-white/20 bg-transparent cursor-not-allowed line-through"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {colors.length > 1 && (
              <div>
                <label className="block text-[10px] font-heading uppercase tracking-[0.2em] text-muted-foreground mb-3">
                  Color {selectedColor && <span className="text-foreground ml-2">— {selectedColor}</span>}
                </label>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`h-8 px-4 border text-[11px] font-body transition-colors uppercase flex items-center gap-2 ${
                        selectedColor === color
                          ? "border-accent text-accent bg-white/5"
                          : "border-white/10 text-muted-foreground hover:border-white/30 hover:text-foreground bg-transparent"
                      }`}
                    >
                      {/* Fake Color Swatch based on name for realism */}
                      <span className={`w-3 h-3 rounded-full border border-white/20 ${color.toLowerCase() === 'negro' ? 'bg-black' : color.toLowerCase() === 'verde oliva' ? 'bg-[#4B5320]' : 'bg-stone-500'}`} />
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* DESCRIPCIÓN Y ESPECIFICACIONES */}
          <div className="space-y-8 pt-8 border-t border-white/10">
            <div>
              <h3 className="text-xs font-heading uppercase tracking-widest text-foreground mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-accent" /> Descripción Táctica
              </h3>
              <p className="text-[13px] font-body text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description || "Producto táctico diseñado para alto rendimiento. Sin descripción detallada disponible al momento."}
              </p>
            </div>
            
            {/* Fake Specs */}
            <div>
              <h3 className="text-xs font-heading uppercase tracking-widest text-foreground mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-white/20" /> Especificaciones
              </h3>
              <ul className="text-[13px] font-body text-muted-foreground space-y-2">
                <li className="flex justify-between border-b border-white/5 pb-1">
                  <span>Material Base</span> <span className="text-foreground text-right">Cordura® / Ripstop Militar</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-1">
                  <span>Garantía</span> <span className="text-foreground text-right">3 Meses por defectos de fábrica</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-1">
                  <span>Uso recomendado</span> <span className="text-foreground text-right">Airsoft, Outdoor, Trabajo Pesado</span>
                </li>
              </ul>
            </div>
          </div>

          {/* ── MOBILE STICKY CTA CONTAINER ── */}
          {/* On desktop this just sits in the normal flow. On mobile it gets fixed to bottom. */}
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md p-4 border-t border-white/10 lg:static lg:bg-transparent lg:p-0 lg:border-none lg:mt-10 lg:backdrop-blur-none">
            
            <div className="hidden lg:flex items-center gap-3 mb-4 text-xs font-body text-muted-foreground">
              <Truck className="w-4 h-4 text-accent" />
              <span>Envíos a toda Colombia · Coordinamos detalles vía WhatsApp</span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || adding}
              className={`w-full relative flex items-center justify-center gap-3 py-4 md:py-5 text-sm font-heading tracking-[0.2em] uppercase transition-all duration-300 shadow-[2px_2px_0px_rgba(0,0,0,0.5)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none ${
                adding 
                  ? "bg-[#25D366] text-black border-transparent" 
                  : isOutOfStock
                    ? "bg-muted text-muted-foreground border-transparent cursor-not-allowed shadow-none"
                    : "bg-accent text-accent-foreground border-transparent hover:bg-primary-light"
              }`}
            >
              {adding ? (
                <>
                  <Check className="w-5 h-5 animate-bounce" />
                  PROCESANDO...
                </>
              ) : isOutOfStock ? (
                "AGOTADO"
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  AGREGAR AL CARRITO
                </>
              )}
            </button>
            {sizes.length > 1 && !selectedSize && !isOutOfStock && (
              <p className="text-[10px] text-center text-destructive font-body mt-2 uppercase tracking-wider">
                Seleccioná una talla
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── PRODUCTOS RELACIONADOS ── */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-16 border-t border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-lg md:text-xl text-foreground tracking-widest uppercase">
              Equipamiento Relacionado
            </h2>
            <Link href="/productos" className="text-xs font-heading text-accent hover:underline uppercase tracking-widest hidden md:block">
              Ver todo el catálogo
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── RESEÑAS VACÍO ── */}
      <section className="mt-16 pt-16 border-t border-white/5">
         <h2 className="font-heading text-lg md:text-xl text-foreground tracking-widest uppercase mb-8">
            Reseñas Operativas
         </h2>
         <div className="bg-[#111] border border-white/5 p-8 text-center flex flex-col items-center">
            <div className="flex gap-1 mb-4 opacity-30">
               {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 text-white" />)}
            </div>
            <p className="text-foreground font-heading tracking-widest uppercase mb-2">Sé el primero en dar tu reporte</p>
            <p className="text-xs text-muted-foreground font-body max-w-sm">
               Tu experiencia en campo es vital para nosotros. Adquiere este equipo y dejá tu reseña.
            </p>
         </div>
      </section>

            {/* ── MODAL GUÍA DE TALLAS ── */}
      <AnimatePresence>
        {guiaTallasOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setGuiaTallasOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#111] border border-white/10 w-full max-w-lg shadow-2xl relative flex flex-col max-h-[90vh]"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#111] z-10">
                <h3 className="font-heading text-lg tracking-widest text-[#F5F5F0] uppercase">Guía de Tallas</h3>
                <button onClick={() => setGuiaTallasOpen(false)} className="text-[#9A9A94] hover:text-[#F5F5F0]">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="p-6 overflow-y-auto font-body text-[13px] text-[#9A9A94] space-y-6">
                <p>Las medidas mostradas son aproximadas y pueden variar ligeramente según el fabricante. Te recomendamos medir una prenda tuya que te quede bien y compararla.</p>
                
                <div>
                  <h4 className="text-accent uppercase tracking-wider mb-2 font-heading text-xs">Uniformes y Chaquetas</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[300px]">
                      <thead>
                        <tr className="border-b border-white/10 text-[#F5F5F0]">
                          <th className="py-2 font-normal">Talla</th>
                          <th className="py-2 font-normal">Pecho (cm)</th>
                          <th className="py-2 font-normal">Largo (cm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-white/5"><td className="py-2 text-[#F5F5F0]">S</td><td className="py-2">90-95</td><td className="py-2">68</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 text-[#F5F5F0]">M</td><td className="py-2">96-101</td><td className="py-2">70</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 text-[#F5F5F0]">L</td><td className="py-2">102-107</td><td className="py-2">72</td></tr>
                        <tr><td className="py-2 text-[#F5F5F0]">XL</td><td className="py-2">108-113</td><td className="py-2">74</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="text-accent uppercase tracking-wider mb-2 font-heading text-xs">Pantalones</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[300px]">
                      <thead>
                        <tr className="border-b border-white/10 text-[#F5F5F0]">
                          <th className="py-2 font-normal">Talla USA</th>
                          <th className="py-2 font-normal">Talla COL</th>
                          <th className="py-2 font-normal">Cintura (cm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-white/5"><td className="py-2 text-[#F5F5F0]">S (30-32)</td><td className="py-2">28-30</td><td className="py-2">76-81</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 text-[#F5F5F0]">M (32-34)</td><td className="py-2">32-34</td><td className="py-2">81-86</td></tr>
                        <tr className="border-b border-white/5"><td className="py-2 text-[#F5F5F0]">L (34-36)</td><td className="py-2">36-38</td><td className="py-2">86-91</td></tr>
                        <tr><td className="py-2 text-[#F5F5F0]">XL (36-38)</td><td className="py-2">40</td><td className="py-2">91-96</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal zoom de imagen */}
      <AnimatePresence>
        {zoomOpen && images[selectedImage] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomOpen(false)}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-3xl w-full aspect-square"
            >
              <Image
                src={images[selectedImage].url}
                alt={images[selectedImage].altText}
                fill
                className="object-contain"
                sizes="90vw"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

