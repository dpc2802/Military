/**
 * Loading skeleton para las tarjetas de producto.
 * Replica la estructura visual del ProductCard para evitar layout shift.
 */
export function ProductCardSkeleton() {
  return (
    <div className="bg-surface border border-border animate-pulse">
      {/* Imagen */}
      <div className="aspect-square bg-muted" />
      {/* Contenido */}
      <div className="p-4 space-y-3">
        <div className="h-3 bg-muted w-1/3" />
        <div className="h-4 bg-muted w-3/4" />
        <div className="h-3 bg-muted w-1/2" />
        <div className="flex gap-1.5 mt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-8 bg-muted" />
          ))}
        </div>
        <div className="h-5 bg-muted w-1/3 mt-1" />
        <div className="h-9 bg-muted mt-3" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-3">
          <div className="aspect-square bg-muted" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-16 h-16 bg-muted" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-3 bg-muted w-1/4" />
          <div className="h-8 bg-muted w-3/4" />
          <div className="h-6 bg-muted w-1/3" />
          <div className="h-px bg-muted" />
          <div className="space-y-2">
            <div className="h-3 bg-muted w-1/5" />
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-9 w-12 bg-muted" />
              ))}
            </div>
          </div>
          <div className="h-12 bg-muted" />
        </div>
      </div>
    </div>
  );
}
