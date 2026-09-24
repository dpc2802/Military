"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronDown, Filter, Trash2, ArrowUp } from "lucide-react";
import ProductCard from "@/components/store/ProductCard";
import { ProductGridSkeleton } from "@/components/store/ProductSkeleton";
import type { Category, ProductWithDetails } from "@/types";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "Única"];
const SORT_OPTIONS = [
  { value: "newest", label: "Más nuevos" },
  { value: "price_asc", label: "Menor precio" },
  { value: "price_desc", label: "Mayor precio" },
  { value: "bestselling", label: "Más vendidos" },
];

interface CatalogClientProps {
  categories: Category[];
  initialFilters: {
    categoria: string;
    talla: string;
    minPrecio: string;
    maxPrecio: string;
    stock: string;
    orden: string;
    busqueda: string;
  };
}

export default function CatalogClient({ categories, initialFilters }: CatalogClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // States
  const [busqueda, setBusqueda] = useState(initialFilters.busqueda);
  // Sincronizar búsqueda global desde la URL
  useEffect(() => {
    const q = searchParams.get("busqueda");
    if (q !== null && q !== busqueda) {
      setBusqueda(q);
    }
  }, [searchParams]);

  const [categoria, setCategoria] = useState(initialFilters.categoria);
  const [talla, setTalla] = useState(initialFilters.talla);
  const [minPrecio, setMinPrecio] = useState(initialFilters.minPrecio);
  const [maxPrecio, setMaxPrecio] = useState(initialFilters.maxPrecio);
  const [soloStock, setSoloStock] = useState(initialFilters.stock === "true");
  const [orden, setOrden] = useState(initialFilters.orden);
  const [pagina, setPagina] = useState(Number(searchParams.get("pagina")) || 1);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync state to URL and fetch
  const applyFiltersAndFetch = useCallback(async (resetPage = false) => {
    const currentPagina = resetPage ? 1 : pagina;
    if (resetPage) setPagina(1);
    
    setLoading(true);
    setError(false);
    
    // Validar precio
    let finalMin = minPrecio;
    let finalMax = maxPrecio;
    if (minPrecio && maxPrecio && Number(minPrecio) > Number(maxPrecio)) {
      finalMin = maxPrecio;
      finalMax = minPrecio;
      setMinPrecio(finalMin);
      setMaxPrecio(finalMax);
    }

    const params = new URLSearchParams();
    if (categoria) params.set("categoria", categoria);
    if (talla) params.set("talla", talla);
    if (finalMin) params.set("minPrecio", finalMin);
    if (finalMax) params.set("maxPrecio", finalMax);
    if (soloStock) params.set("stock", "true");
    if (busqueda) params.set("busqueda", busqueda);
    if (orden && orden !== "newest") params.set("orden", orden);
    if (currentPagina > 1) params.set("pagina", String(currentPagina));

    // Update URL without refresh
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });

    try {
      const res = await fetch(`/api/products?${params.toString()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error("Fallo en red");
      const data = await res.json() as { products: ProductWithDetails[]; total: number };
      setProducts(data.products ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setError(true);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [categoria, talla, minPrecio, maxPrecio, soloStock, busqueda, orden, pagina, pathname, router]);

  // Debounced effect for inputs
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void applyFiltersAndFetch(true);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [busqueda, minPrecio, maxPrecio]);

  // Immediate effect for clicks
  useEffect(() => {
    void applyFiltersAndFetch(true);
  }, [categoria, talla, soloStock, orden]);

  // Effect for pagination
  useEffect(() => {
    void applyFiltersAndFetch(false);
    // Scroll to top of grid
    if (!loading) {
       window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  }, [pagina]);

  const clearFilters = () => {
    setBusqueda("");
    setCategoria("");
    setTalla("");
    setMinPrecio("");
    setMaxPrecio("");
    setSoloStock(false);
    setOrden("newest");
    setPagina(1);
  };

  const getActiveFilterCount = () => {
    return [busqueda, categoria, talla, minPrecio, maxPrecio, soloStock].filter(Boolean).length;
  };
  const filterCount = getActiveFilterCount();
  const hasFilters = filterCount > 0;

  // Chips rendering
  const activeChips = [];
  if (categoria) activeChips.push({ label: categories.find(c => c.slug === categoria)?.name || categoria, onRemove: () => setCategoria("") });
  if (talla) activeChips.push({ label: `Talla ${talla}`, onRemove: () => setTalla("") });
  if (soloStock) activeChips.push({ label: "Disponibles", onRemove: () => setSoloStock(false) });
  if (minPrecio) activeChips.push({ label: `Min $${minPrecio}`, onRemove: () => setMinPrecio("") });
  if (maxPrecio) activeChips.push({ label: `Max $${maxPrecio}`, onRemove: () => setMaxPrecio("") });

  return (
    <div className="flex flex-col lg:flex-row gap-8 relative">
      
      {/* ── MOBILE FILTERS BUTTON ── */}
      <div className="lg:hidden sticky top-[80px] z-40 bg-background/95 backdrop-blur-sm py-3 border-b border-white/5 flex items-center justify-between -mx-4 px-4">
        <button
          onClick={() => setFiltersOpen(true)}
          className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 text-xs font-heading tracking-widest uppercase text-[#F5F5F0] hover:bg-white/10 transition-colors"
        >
          <Filter className="w-4 h-4 text-accent" />
          Filtros {filterCount > 0 && <span className="text-accent">({filterCount})</span>}
        </button>
        
        {/* Sort Mobile */}
        <div className="relative">
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="appearance-none bg-transparent border border-white/10 text-xs font-heading uppercase tracking-widest text-[#F5F5F0] pl-3 pr-8 py-2.5 outline-none focus:border-accent"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-background text-[#F5F5F0]">{o.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-accent pointer-events-none" />
        </div>
      </div>

      {/* ── SIDEBAR FILTERS (Desktop & Mobile Drawer) ── */}
      <aside
        className={`
          fixed inset-0 z-50 bg-background/95 backdrop-blur-md transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-y-0 lg:w-64 lg:bg-transparent lg:z-0 lg:block flex flex-col h-full lg:h-auto
          ${filtersOpen ? "translate-y-0" : "translate-y-full"}
        `}
      >
        <div className="flex-1 overflow-y-auto p-6 lg:p-0">
          
          {/* Header solo Mobile */}
          <div className="flex items-center justify-between lg:hidden mb-8 border-b border-white/10 pb-4">
            <h2 className="font-heading text-lg tracking-widest uppercase text-[#F5F5F0]">Filtros</h2>
            <button onClick={() => setFiltersOpen(false)} className="p-2 bg-white/5 text-[#F5F5F0] rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Buscador */}
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9A94]" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar equipo..."
                  className="w-full bg-[#111] border border-white/10 text-[13px] font-body text-[#F5F5F0] pl-10 pr-3 py-2.5 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            {/* Categoría */}
            <div className="border-t border-white/5 pt-6">
              <label className="block text-[10px] font-heading uppercase tracking-[0.2em] text-accent mb-4">
                Categoría
              </label>
              <div className="space-y-1.5">
                <button
                  onClick={() => setCategoria("")}
                  className={`w-full text-left text-[13px] font-body px-3 py-2 transition-all border-l-2 ${
                    !categoria ? "border-accent text-[#F5F5F0] bg-white/5" : "border-transparent text-[#9A9A94] hover:text-[#F5F5F0] hover:bg-white/5"
                  }`}
                >
                  Todas
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setCategoria(categoria === cat.slug ? "" : cat.slug)}
                    className={`w-full text-left text-[13px] font-body px-3 py-2 transition-all border-l-2 ${
                      categoria === cat.slug
                        ? "border-accent text-[#F5F5F0] bg-white/5 font-medium"
                        : "border-transparent text-[#9A9A94] hover:text-[#F5F5F0] hover:bg-white/5"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Talla */}
            <div className="border-t border-white/5 pt-6">
              <label className="block text-[10px] font-heading uppercase tracking-[0.2em] text-accent mb-4">
                Talla
              </label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setTalla(talla === s ? "" : s)}
                    className={`text-xs px-3 py-1.5 border font-body transition-colors ${
                      talla === s
                        ? "border-accent text-black bg-accent"
                        : "border-white/10 text-[#9A9A94] hover:border-accent/50 hover:text-[#F5F5F0]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Rango de precio */}
            <div className="border-t border-white/5 pt-6">
              <label className="block text-[10px] font-heading uppercase tracking-[0.2em] text-accent mb-4">
                Precio (COP)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={minPrecio}
                  onChange={(e) => setMinPrecio(e.target.value)}
                  placeholder="Desde"
                  className="w-full bg-[#111] border border-white/10 text-xs font-body text-[#F5F5F0] px-3 py-2 focus:outline-none focus:border-accent"
                />
                <span className="text-[#9A9A94]">-</span>
                <input
                  type="number"
                  value={maxPrecio}
                  onChange={(e) => setMaxPrecio(e.target.value)}
                  placeholder="Hasta"
                  className="w-full bg-[#111] border border-white/10 text-xs font-body text-[#F5F5F0] px-3 py-2 focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            {/* Disponibilidad */}
            <div className="border-t border-white/5 pt-6">
               <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={soloStock}
                      onChange={(e) => setSoloStock(e.target.checked)}
                      className="appearance-none w-5 h-5 border border-white/20 bg-[#111] checked:bg-accent checked:border-accent transition-colors cursor-pointer"
                    />
                    {soloStock && <X className="w-3 h-3 text-black absolute pointer-events-none rotate-45" />}
                  </div>
                  <span className="text-[13px] font-body text-[#9A9A94] group-hover:text-[#F5F5F0] transition-colors">
                    Solo disponibles
                  </span>
               </label>
            </div>
          </div>
        </div>

        {/* Botones de acción Mobile Drawer */}
        <div className="lg:hidden p-4 border-t border-white/10 bg-background">
          <button
            onClick={() => setFiltersOpen(false)}
            className="w-full bg-accent text-black font-heading tracking-widest uppercase py-3 text-xs shadow-[2px_2px_0px_rgba(255,255,255,0.1)]"
          >
            Aplicar Filtros ({total})
          </button>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="w-full mt-3 text-xs font-heading tracking-widest uppercase text-[#9A9A94] py-2"
            >
              Limpiar Todo
            </button>
          )}
        </div>
      </aside>

      {/* ── GRID DE PRODUCTOS ── */}
      <div className="flex-1 min-w-0 flex flex-col">
        
        {/* Barra superior (Desktop) & Filtros Activos */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="hidden lg:flex items-center justify-between">
            <p className="text-[13px] text-[#9A9A94] font-body">
              Mostrando <strong className="text-[#F5F5F0] font-normal">{total}</strong> productos
            </p>
            <div className="flex items-center gap-3">
              <label className="text-[10px] text-accent font-heading uppercase tracking-[0.2em]">
                Ordenar por
              </label>
              <div className="relative">
                <select
                  value={orden}
                  onChange={(e) => setOrden(e.target.value)}
                  className="appearance-none bg-transparent border-b border-white/20 text-[13px] font-body text-[#F5F5F0] pl-2 pr-8 py-1 outline-none focus:border-accent cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} className="bg-background text-[#F5F5F0]">{o.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9A9A94] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Chips Filtros Activos */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {activeChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={chip.onRemove}
                  className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 text-[11px] font-body text-[#F5F5F0] hover:bg-white/10 transition-colors rounded-sm"
                >
                  {chip.label}
                  <X className="w-3 h-3 text-accent" />
                </button>
              ))}
              <button
                onClick={clearFilters}
                className="text-[11px] font-body text-[#9A9A94] hover:text-accent ml-2 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Limpiar
              </button>
            </div>
          )}
        </div>

        {/* ESTADOS: Carga / Error / Vacío / Grid */}
        <div className="flex-1">
          {error ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border border-white/5 bg-[#111]">
              <X className="w-12 h-12 text-destructive mb-4 opacity-50" />
              <p className="font-heading text-lg text-foreground tracking-widest uppercase">
                Error de conexión
              </p>
              <p className="text-[13px] text-[#9A9A94] font-body mt-2 mb-6 max-w-sm">
                No pudimos conectar con el servidor táctico. Por favor, verificá tu conexión y reintentá.
              </p>
              <button onClick={() => applyFiltersAndFetch(false)} className="bg-white/10 px-6 py-2 text-xs font-heading tracking-widest uppercase text-white hover:bg-white/20 transition-colors border border-white/5">
                Reintentar
              </button>
            </div>
          ) : loading ? (
            <ProductGridSkeleton count={12} />
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border border-white/5 bg-[#111]">
              <Filter className="w-12 h-12 text-accent mb-4 opacity-30" />
              <p className="font-heading text-xl text-foreground tracking-widest uppercase">
                Misión Fallida
              </p>
              <p className="text-[13px] text-[#9A9A94] font-body mt-2 mb-6 max-w-sm">
                No hay productos en nuestro inventario que coincidan con estos filtros específicos.
              </p>
              <button onClick={clearFilters} className="bg-accent px-6 py-2 text-xs font-heading tracking-widest uppercase text-black hover:bg-[#a69666] transition-colors">
                Resetear Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* ── PAGINACIÓN NUMERADA CLÁSICA ── */}
        {!loading && total > 12 && (
          <div className="flex items-center justify-center gap-2 mt-16 pb-8">
            <button
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={pagina === 1}
              className="px-4 py-2 border border-white/10 text-xs font-heading uppercase tracking-widest text-[#F5F5F0] hover:bg-white/5 hover:border-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Anterior
            </button>
            
            <div className="hidden sm:flex items-center gap-1 mx-2">
              {Array.from({ length: Math.ceil(total / 12) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPagina(i + 1)}
                  className={`w-8 h-8 flex items-center justify-center border text-xs font-heading transition-all ${
                    pagina === i + 1 
                      ? 'border-accent bg-accent text-black' 
                      : 'border-transparent text-[#9A9A94] hover:text-[#F5F5F0] hover:border-white/20'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            
            <span className="sm:hidden text-xs text-[#9A9A94] font-body px-4">
              Página {pagina} / {Math.ceil(total / 12)}
            </span>

            <button
              onClick={() => setPagina((p) => p + 1)}
              disabled={pagina >= Math.ceil(total / 12)}
              className="px-4 py-2 border border-white/10 text-xs font-heading uppercase tracking-widest text-[#F5F5F0] hover:bg-white/5 hover:border-accent disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

