import fs from "fs";
const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/ProductDetailClient.tsx";
let c = fs.readFileSync(p, "utf-8");

const marker = "const addItem = useCartStore((s) => s.addItem);";
const injection = `
  const wishlistToggle = useWishlistStore((s) => s.toggle);
  const isWishlisted = useWishlistStore((s) => s.isWishlisted);
  const wishlisted = isWishlisted(product.id);
  const handleWishlist = () => wishlistToggle({
    productId: product.id,
    productName: product.name,
    productSlug: product.slug,
    imageUrl: (product.images as any[])?.[0]?.url ?? "/logo.png",
    price: parsePrice(product.price),
  });`;

c = c.replace(marker, marker + injection);
fs.writeFileSync(p, c, "utf-8");
console.log("ProductDetailClient fixed");
