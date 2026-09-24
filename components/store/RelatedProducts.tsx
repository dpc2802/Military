import ProductCard from "./ProductCard";

interface RelatedProductsProps {
  products: any[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="mt-24 border-t border-white/10 pt-16">
      <div className="flex items-center gap-4 mb-10">
        <div className="h-px flex-1 bg-white/5" />
        <h2 className="text-xl md:text-2xl font-heading tracking-widest uppercase text-white">
          Completa tu <span className="text-accent">Equipamiento</span>
        </h2>
        <div className="h-px flex-1 bg-white/5" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
