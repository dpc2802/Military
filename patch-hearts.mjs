import fs from "fs";

// 1. Fix ProductCard
const p1 = "c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/ProductCard.tsx";
let c1 = fs.readFileSync(p1, "utf-8");
c1 = c1.replace(
  '<Heart className={`w-4 h-4 transition-colors ${wishlisted ? "fill-accent text-accent" : "text-white hover:text-accent"}`} />',
  '<Heart fill={wishlisted ? "currentColor" : "none"} className={`w-4 h-4 transition-all duration-300 ${wishlisted ? "text-accent scale-110" : "text-white group-hover:text-accent scale-100"}`} />'
);
fs.writeFileSync(p1, c1, "utf-8");

// 2. Fix ProductDetailClient
const p2 = "c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/ProductDetailClient.tsx";
let c2 = fs.readFileSync(p2, "utf-8");
if (!c2.includes("import { Heart")) {
  c2 = c2.replace('import { ShoppingCart, ShieldAlert, Check, X } from "lucide-react";', 'import { ShoppingCart, ShieldAlert, Check, X, Heart } from "lucide-react";');
}
const svgRegex = /<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"[\s\S]*?<\/svg>/;
c2 = c2.replace(
  svgRegex,
  '<Heart fill={wishlisted ? "currentColor" : "none"} className={`w-4 h-4 transition-all duration-300 ${wishlisted ? "text-accent scale-110" : "scale-100"}`} />'
);
fs.writeFileSync(p2, c2, "utf-8");

console.log("Patched Hearts");
