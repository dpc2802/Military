/**
 * Home page de SGB Military Shop.
 * Diseño moderno, responsive, full hero.
 */

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/db";
import { products, categories, reviews, productVariants } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import ProductCard from "@/components/store/ProductCard";
import { Shield, Truck, MessageCircle, Star, ChevronRight } from "lucide-react";
import type { ProductWithDetails } from "@/types";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export const metadata: Metadata = {
  title: "SGB Military Shop - Equipo Táctico Colombia",
  description:
    "Tienda de artículos militares y equipo táctico en Colombia. Uniformes, botas, mochilas tácticas y accesorios de uso civil. Comprá por WhatsApp.",
};

export default async function HomePage() {
  const featuredProducts = await db.query.products.findMany({
    where: and(eq(products.isFeatured, true), eq(products.isActive, true)),
    with: {
      category: true,
      variants: { where: eq(productVariants.isActive, true) },
    },
    limit: 4,
    orderBy: desc(products.createdAt),
  });

  const activeCategories = await db.query.categories.findMany({
    where: eq(categories.isActive, true),
    orderBy: categories.sortOrder,
    limit: 6,
  });

  const testimonials = await db.query.reviews.findMany({
    where: eq(reviews.isApproved, true),
    limit: 3,
    orderBy: desc(reviews.createdAt),
  });

  return (
    <div>
      {/* ── HERO MODERNO ──────────────────────────────────────────── */}
      <section className="relative min-h-[75vh] md:min-h-[90vh] flex items-center justify-center lg:justify-start overflow-hidden pt-12 md:pt-0">
        
        {/* Barra de Anuncio Marquee (Top Hero) */}
        <div className="absolute top-[72px] md:top-[88px] left-0 w-full z-30 bg-accent text-accent-foreground py-2 overflow-hidden shadow-lg border-y border-black/10">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <span key={i} className="text-[10px] md:text-xs font-heading tracking-[0.2em] uppercase font-bold flex items-center gap-12">
                <span>⚡ NUEVA COLECCIÓN TÁCTICA 2026 DISPONIBLE</span>
                <span>ENVÍOS A TODA COLOMBIA</span>
              </span>
            ))}
          </div>
        </div>

        {/* ── FONDO CAMUFLAJE ÉPICO ── */}
        <div className="absolute inset-0 z-0">
          {/* Imagen de camuflaje oscurecida y ligeramente desaturada */}
          <Image
            src="/camo-bg.png"
            alt="Fondo camuflaje SGB Military"
            fill
            className="object-cover object-center brightness-[0.36] saturate-90"
            priority
            quality={90}
          />

          {/* Glow verde militar en esquina superior derecha */}
          <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_80%_60%_at_75%_20%,rgba(74,108,50,0.25)_0%,transparent_65%)]" />
          {/* Glow ámbar/dorado sutil en zona de texto */}
          <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_50%_50%_at_15%_60%,rgba(194,178,128,0.08)_0%,transparent_70%)]" />

          {/* Gradiente izquierda (desktop) para que el texto sea legible */}
          <div className="absolute inset-0 z-[2] hidden lg:block bg-gradient-to-r from-black from-[15%] via-black/60 via-[30%] to-transparent to-[45%]" />
          {/* Gradiente para mobile */}
          <div className="absolute inset-0 z-[2] lg:hidden bg-gradient-to-t from-black via-black/70 to-black/20" />

          {/* Viñeta inferior */}
          <div className="absolute bottom-0 left-0 right-0 h-32 z-[3] bg-gradient-to-t from-black to-transparent" />

          {/* Scanlines militares para efecto de pantalla táctica */}
          <div
            className="absolute inset-0 z-[4] pointer-events-none opacity-40"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)',
            }}
          />

          {/* Grid de puntos dorados – textura táctica */}
          <div
            className="absolute inset-0 z-[5] opacity-[0.15] pointer-events-none mix-blend-overlay"
            style={{ backgroundImage: 'radial-gradient(rgba(194, 178, 128, 0.5) 1px, transparent 1px)', backgroundSize: '4px 4px' }}
          />

          {/* Esquina táctica — arriba izquierda */}
          <div className="absolute top-[140px] left-8 z-[6] w-20 h-20 border-l-2 border-t-2 border-accent/40 pointer-events-none" />
          {/* Esquina táctica — abajo derecha */}
          <div className="absolute bottom-12 right-8 z-[6] w-16 h-16 border-r-2 border-b-2 border-accent/25 pointer-events-none hidden lg:block" />
        </div>

        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32 flex flex-col items-center lg:items-start text-center lg:text-left mt-8">
          <div className="space-y-6 max-w-2xl animate-fade-in-up">
            <div className="flex items-center justify-center lg:justify-start gap-3 border-l-2 border-accent pl-3">
              <span className="font-mono text-[10px] md:text-xs text-muted-foreground uppercase tracking-[0.2em]">
                SGB-COL // EQUIPO TÁCTICO CIVIL
              </span>
            </div>
            
            <h1 className="font-heading text-[3rem] leading-[0.95] sm:text-6xl md:text-7xl lg:text-[5.5rem] text-white tracking-tighter uppercase drop-shadow-xl">
              EQUIPO <br />
              <span className="text-accent">TÁCTICO</span> <br />
              REAL.
            </h1>
            
            <p className="text-[#9A9A94] font-body text-sm md:text-base lg:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Uniformes militares, botas de combate, mochilas MOLLE y equipamiento 
              de grado táctico para uso civil y actividades outdoor.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
              <Link
                href="/productos"
                className="group relative inline-flex items-center justify-center gap-3 bg-accent hover:bg-[#a69666] text-accent-foreground px-8 py-4 text-sm font-heading tracking-[0.2em] uppercase transition-colors border border-transparent shadow-[4px_4px_0px_rgba(0,0,0,0.5)] active:translate-y-1 active:translate-x-1 active:shadow-none"
              >
                <span className="w-1.5 h-1.5 bg-black/30" />
                VER CATÁLOGO
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%2C%20quiero%20información%20sobre%20sus%20productos`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 bg-background/50 hover:bg-background border border-white/20 hover:border-[#25D366]/50 text-white px-8 py-4 text-sm font-heading tracking-[0.2em] uppercase transition-colors shadow-[4px_4px_0px_rgba(0,0,0,0.3)] active:translate-y-1 active:translate-x-1 active:shadow-none backdrop-blur-sm"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25D366] transition-transform group-hover:scale-110" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                ASISTENCIA DIRECTA
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── DISCLAIMER LEGAL (Ultra Compacto) ── */}
      <div className="bg-[#121212] border-y border-white/5 relative z-30 h-10 flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-center gap-2">
          <Shield className="w-3.5 h-3.5 text-accent flex-shrink-0" />
          <p className="text-[10px] md:text-[11px] text-[#9A9A94] font-body text-center tracking-widest uppercase">
            SGB NO vende armas de fuego. Elementos de uso civil legal.
          </p>
        </div>
      </div>

      {/* ── TRUST BAR COMPACTA (Vista Única) ── */}
      <section className="bg-background border-b border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto px-2 md:px-4">
          <div className="grid grid-cols-3 divide-x divide-white/5 h-[70px] md:h-[80px]">
            {[
              { icon: <Truck className="w-4 h-4 md:w-5 md:h-5 text-accent" />, title: "Envíos a toda Colombia", desc: "Despachamos seguro a tu ciudad" },
              { icon: <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-accent" />, title: "Asistencia WhatsApp", desc: "Atención 100% personalizada" },
              { icon: <Shield className="w-4 h-4 md:w-5 md:h-5 text-accent" />, title: "Productos verificados", desc: "Calidad táctica garantizada" },
            ].map((item, i) => (
              <div 
                key={item.title} 
                className="flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-4 px-1 md:px-8 scroll-reveal-card group text-center md:text-left"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex-shrink-0 text-accent transition-transform duration-300 group-hover:scale-110 group-hover:text-primary-light">
                  {item.icon}
                </div>
                <div className="flex flex-col">
                  <h3 className="font-heading text-[8px] md:text-xs tracking-wider md:tracking-[0.15em] text-foreground uppercase leading-tight md:leading-none md:mb-1.5">{item.title}</h3>
                  <p className="hidden md:block text-[10px] text-[#9A9A94] font-body uppercase tracking-wider">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENTO GRID CATEGORÍAS ── */}
      <section className="bg-surface pb-12 pt-8 md:pt-12 md:pb-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 md:mb-8 gap-4 scroll-reveal-card">
            <h2 className="font-heading text-2xl md:text-3xl text-foreground tracking-widest uppercase">
              Explorar Categorías
            </h2>
            <Link href="/productos" className="flex items-center gap-1 text-[10px] md:text-xs text-accent hover:text-primary-light font-heading tracking-[0.2em] uppercase transition-colors group">
              Catálogo Completo <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="flex overflow-x-auto md:grid md:overflow-visible snap-x snap-mandatory md:snap-none scrollbar-hide md:grid-cols-12 gap-3 md:gap-4 pb-4 md:pb-0 px-4 md:px-0 -mx-4 md:mx-0 @container">
            {activeCategories.map((cat, i) => {
              // Asymmetric Bento Grid Logic
              let spanClass = "md:col-span-3 aspect-[4/5] md:aspect-square"; 
              if (i === 0) spanClass = "md:col-span-7 aspect-[4/5] md:aspect-auto md:min-h-[300px]";
              else if (i === 1) spanClass = "md:col-span-5 aspect-[4/5] md:aspect-auto md:min-h-[300px]";
              
              const getCategoryBg = (slug: string) => {
                const s = slug.toLowerCase();
                if (s.includes("ropa") || s.includes("uniforme")) return "/cat-ropa.jpg";
                if (s.includes("bota") || s.includes("calzado")) return "/cat-botas.png";
                if (s.includes("mochila") || s.includes("equipaje")) return "/cat-mochilas.jpg";
                if (s.includes("replica") || s.includes("airsoft")) return "/cat-replicas.jpg";
                if (s.includes("proteccion") || s.includes("seguridad")) return "/cat-proteccion.png";
                return "/cat-accesorios.png";
              };

              return (
                <Link
                  key={cat.slug}
                  href={`/productos?categoria=${cat.slug}`}
                  className={`flex-none w-[75vw] sm:w-[45vw] md:w-auto snap-center group relative overflow-hidden bg-black border border-white/5 hover:border-accent/30 flex flex-col justify-end p-0 transition-all duration-700 scroll-reveal-card ${spanClass}`}
                  style={{ contentVisibility: "auto", animationDelay: `${i * 0.05}s` }}
                >
                  <Image 
                    src={cat.imageUrl || getCategoryBg(cat.slug)}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 opacity-70 group-hover:opacity-100"
                    sizes="(max-width: 768px) 80vw, 33vw"
                  />
                  {/* Overlay Gradiente Premium */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent transition-opacity duration-700 group-hover:opacity-60" />
                  
                  {/* Contenido Elevado */}
                  <div className="relative z-10 p-5 md:p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <div className="flex items-end justify-between">
                      <p className="text-base md:text-xl font-heading text-white tracking-[0.2em] uppercase leading-snug drop-shadow-md">
                        {cat.name}
                      </p>
                      {/* Botón flotante Glassmorphism */}
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent/20 backdrop-blur-md flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                      </div>
                    </div>
                    {/* Barra de acento animada */}
                    <div className="h-[2px] w-0 bg-accent mt-4 transition-all duration-700 ease-out group-hover:w-full" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PRODUCTOS DESTACADOS ── */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-0 md:px-4 py-12 md:py-24 overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-10 gap-4 px-4 md:px-0">
            <h2 className="font-heading text-2xl md:text-3xl text-foreground tracking-widest uppercase">
              Destacados
            </h2>
            <Link href="/productos" className="flex items-center gap-1 text-[10px] md:text-xs text-accent hover:text-primary-light font-heading tracking-widest uppercase transition-colors group">
              Ver catálogo <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="flex overflow-x-auto md:grid md:overflow-visible snap-x snap-mandatory md:snap-none scrollbar-hide md:grid-cols-4 gap-4 pb-8 md:pb-0 px-4 md:px-0 @container">
            {(featuredProducts as ProductWithDetails[]).map((product, i) => (
              <div key={product.id} className="flex-none w-[75vw] sm:w-[45vw] md:w-auto snap-center" style={{ animationDelay: `${i * 0.1}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── TESTIMONIOS (Carrusel Infinito / Scroll Snap) ── */}
      {testimonials.length > 0 && (
        <section className="bg-surface border-t border-white/5 py-16 md:py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 mb-10 md:mb-16">
            <div className="flex flex-col items-center text-center">
              <h2 className="font-heading text-2xl md:text-3xl text-foreground tracking-widest uppercase mb-3">
                Lo que dicen
              </h2>
              <div className="w-16 h-1 bg-accent mb-4" />
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-[#25D366]" />
                <p className="text-[10px] md:text-xs text-[#9A9A94] font-heading uppercase tracking-widest">
                  4.9/5 basado en +120 reseñas verificadas
                </p>
              </div>
            </div>
          </div>

          {/* Contenedor del Carrusel */}
          <div className="relative w-full md:mask-edges">
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide md:overflow-visible md:w-max md:animate-infinite-scroll md:hover:[animation-play-state:paused] gap-4 md:gap-6 px-4 md:px-0">
              
              {/* Duplicamos el arreglo para el efecto infinito en desktop */}
              {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((review, i) => (
                <div 
                  key={`${review.id}-${i}`} 
                  className={`bg-background border border-white/5 p-6 md:p-8 flex flex-col hover:border-accent/30 transition-colors relative overflow-hidden group w-[85vw] md:w-[400px] flex-none snap-center ${i >= testimonials.length ? 'md:flex hidden' : 'flex'}`}
                >
                  {/* Comilla Decorativa */}
                  <span className="absolute -top-6 -left-2 text-[140px] leading-none text-accent opacity-5 font-heading select-none group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                    "
                  </span>

                  {/* Header: Avatar, Name, Date, Verified */}
                  <div className="flex items-start justify-between mb-5 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-accent font-heading text-lg">{review.authorName.charAt(0)}</span>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-xs font-heading text-foreground tracking-widest uppercase flex items-center gap-1.5">
                          {review.authorName}
                          <span className="text-[#25D366]" title="Compra Verificada">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </span>
                        </p>
                        <p className="text-[9px] text-[#9A9A94] uppercase tracking-wider mt-0.5">
                          Compró: Equipo Táctico SGB
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] text-[#9A9A94] font-body uppercase tracking-wider bg-white/5 px-2 py-1">
                      Hace {1 + (i % 3)} sem.
                    </span>
                  </div>

                  {/* Estrellas Tácticas */}
                  <div className="flex gap-1 mb-4 relative z-10">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg key={s} className={`w-4 h-4 ${s <= review.rating ? "text-accent fill-accent" : "text-white/5 fill-white/5"}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>

                  {/* Comentario (Gris Claro #9A9A94 para corregir el bug de color) */}
                  {review.comment && (
                    <p className="text-[13px] md:text-sm text-[#9A9A94] font-body leading-relaxed flex-1 relative z-10 italic">
                      "{review.comment}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}





