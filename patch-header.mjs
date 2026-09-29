import fs from "fs";
const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/Header.tsx";
let c = fs.readFileSync(p, "utf-8");

if (!c.includes("Heart")) {
  c = c.replace(
    'import { ShoppingCart, Menu, X, ChevronRight, Search } from "lucide-react";',
    'import { ShoppingCart, Menu, X, ChevronRight, Search, Heart } from "lucide-react";'
  );
  c = c.replace(
    'import { useCartStore } from "@/lib/stores/cart";',
    'import { useCartStore } from "@/lib/stores/cart";\nimport { useWishlistStore } from "@/lib/stores/wishlist";'
  );
  
  // inside the component, add the wishlist hook
  c = c.replace(
    'const { totalItems } = useCartStore();',
    'const { totalItems } = useCartStore();\n  const wishlistItems = useWishlistStore((s) => s.items);'
  );

  // add the Heart link
  const heartLink = `
            <Link 
              href="/favoritos"
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors group"
              aria-label="Lista de deseos"
            >
              <Heart className="w-5 h-5 transition-transform group-hover:scale-110" />
              {isMounted && wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-background text-[10px] font-bold flex items-center justify-center rounded-full shadow-lg">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
  `;
  
  c = c.replace(
    '{/* Right Actions */}\n          <div className="flex items-center gap-4 lg:gap-6 z-50">',
    `{/* Right Actions */}\n          <div className="flex items-center gap-4 lg:gap-6 z-50">${heartLink}`
  );
  
  fs.writeFileSync(p, c, "utf-8");
  console.log("Patched Header.tsx");
} else {
  console.log("Header already has Heart");
}
