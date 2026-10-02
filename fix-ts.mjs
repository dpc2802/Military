import fs from "fs";

// 1. Fix ProductDetailClient.tsx missing Heart import and undefined fixes
const p1 = "c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/ProductDetailClient.tsx";
let c1 = fs.readFileSync(p1, "utf-8");
if (!c1.includes("import { motion } from")) {
  c1 = c1.replace(
    'import { ShoppingCart, ShieldAlert, Check, X, Heart } from "lucide-react";',
    'import { ShoppingCart, ShieldAlert, Check, X, Heart } from "lucide-react";\nimport { motion } from "framer-motion";'
  );
  if (!c1.includes('import { ShoppingCart, ShieldAlert, Check, X, Heart } from "lucide-react";')) {
     c1 = c1.replace(
      'import { ShoppingCart, ShieldAlert, Check, X } from "lucide-react";',
      'import { ShoppingCart, ShieldAlert, Check, X, Heart } from "lucide-react";\nimport { motion } from "framer-motion";'
    );
  }
}
fs.writeFileSync(p1, c1, "utf-8");

// 2. Fix consultar-pedido/page.tsx missing toast
const p2 = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/consultar-pedido/page.tsx";
let c2 = fs.readFileSync(p2, "utf-8");
if (!c2.includes('import { toast } from "sonner";')) {
  c2 = c2.replace(
    'import { Package, Search, Clock, CheckCircle2, Truck, Star } from "lucide-react";',
    'import { Package, Search, Clock, CheckCircle2, Truck, Star } from "lucide-react";\nimport { toast } from "sonner";'
  );
}
fs.writeFileSync(p2, c2, "utf-8");

console.log("Fixed missing imports");
