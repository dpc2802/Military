import fs from "fs";

const compPath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/RelatedProducts.tsx";

const compCode = `import ProductCard from "./ProductCard";

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
`;

fs.writeFileSync(compPath, compCode, "utf-8");

const pagePath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/productos/[slug]/page.tsx";
let pageCode = fs.readFileSync(pagePath, "utf-8");

if (!pageCode.includes("RelatedProducts")) {
  pageCode = pageCode.replace(
    `import ProductDetailClient from "@/components/store/ProductDetailClient";`,
    `import ProductDetailClient from "@/components/store/ProductDetailClient";\nimport RelatedProducts from "@/components/store/RelatedProducts";\nimport { ne } from "drizzle-orm";`
  );
  
  // Find where to inject the fetch logic
  const oldFetch = `const product = await getProduct(params.slug);`;
  const newFetch = `const product = await getProduct(params.slug);
  
  // Fetch related products (same category, different product)
  let relatedProducts = [];
  if (product && product.categoryId) {
    relatedProducts = await db.query.products.findMany({
      where: and(
        eq(products.categoryId, product.categoryId),
        eq(products.isActive, true),
        ne(products.id, product.id)
      ),
      limit: 4,
    });
  }`;
  pageCode = pageCode.replace(oldFetch, newFetch);
  
  // Render it below the ProductDetailClient
  const oldRender = `<ProductDetailClient product={product} />\n    </div>`;
  const newRender = `<ProductDetailClient product={product} />\n      <RelatedProducts products={relatedProducts} />\n    </div>`;
  pageCode = pageCode.replace(oldRender, newRender);

  fs.writeFileSync(pagePath, pageCode, "utf-8");
  console.log("Updated product page with related products");
} else {
  console.log("RelatedProducts already injected");
}
