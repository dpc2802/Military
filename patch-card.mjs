import fs from "fs";
const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/ProductCard.tsx";
let c = fs.readFileSync(p, "utf-8");

// Import motion
if (!c.includes('import { motion } from "framer-motion"')) {
  c = c.replace(
    'import { ShoppingCart, Check, Heart, ShieldAlert, Zap } from "lucide-react";',
    'import { ShoppingCart, Check, Heart, ShieldAlert, Zap } from "lucide-react";\nimport { motion } from "framer-motion";'
  );
}

// 1. Refine the Card Container (less brutalist border, more refined)
// From: border border-white/5 hover:border-accent/30
// To: rounded-xl border border-white/5 hover:border-white/20 hover:bg-white/[0.02]
c = c.replace(
  'className="group relative bg-background border border-white/5 hover:border-accent/30 transition-colors flex flex-col h-full scroll-reveal-card @container"',
  'className="group relative bg-[#0A0A0A] rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/[0.02] transition-all duration-500 flex flex-col h-full scroll-reveal-card overflow-hidden shadow-sm @container"'
);

// 2. Refine Image Wrapper
c = c.replace(
  '<div className="relative aspect-[4/5] w-full overflow-hidden bg-[#111]">',
  '<div className="relative aspect-[4/5] w-full overflow-hidden bg-[#111] ring-1 ring-inset ring-white/10">'
);

// 3. Refine Wishlist Button (motion + scale)
c = c.replace(
  '<button\n            onClick={handleWishlist}',
  '<motion.button\n            whileTap={{ scale: 0.8 }}\n            onClick={handleWishlist}'
);
c = c.replace(
  'hover:bg-accent/20"\n            title',
  'hover:bg-white/10"\n            title'
);
c = c.replace(
  '</button>\n        </div>',
  '</motion.button>\n        </div>'
);

// 4. Refine Text & Typography
c = c.replace(
  'text-[13px] md:text-[15px] font-heading text-foreground tracking-wide uppercase leading-snug',
  'text-sm md:text-base font-heading text-foreground tracking-widest uppercase leading-snug'
);
c = c.replace(
  'text-accent font-heading text-lg md:text-xl tracking-wider mb-4 drop-shadow-sm',
  'text-accent font-mono text-sm md:text-base tracking-widest mb-4'
);

// 5. Refine CTA Button
c = c.replace(
  '<button\n              onClick={(e) => handleActionClick(e)}',
  '<motion.button\n              whileTap={!isOutOfStock ? { scale: 0.97 } : {}}\n              onClick={(e) => handleActionClick(e)}'
);

c = c.replace(
  'uppercase transition-all duration-300 shadow-[2px_2px_0px_rgba(0,0,0,0.5)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none',
  'uppercase transition-colors duration-300 rounded-xl font-semibold'
);
c = c.replace(
  '</button>\n          </div>',
  '</motion.button>\n          </div>'
);
c = c.replace(
  '<div className="w-1.5 h-1.5 bg-black/30 absolute left-3 top-1/2 -translate-y-1/2" />',
  ''
); // remove the clunky dot
c = c.replace(
  '"bg-accent text-accent-foreground border-transparent hover:bg-primary-light"',
  '"bg-accent text-black border-transparent hover:bg-accent/90"'
);

// Fix sizes buttons (Apple-like pills)
c = c.replace(
  'className="text-[10px] md:text-xs font-body px-3 py-1.5 border border-white/20 text-[#9A9A94] hover:border-accent hover:text-foreground transition-colors uppercase"',
  'className="text-[10px] md:text-xs font-heading px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[#9A9A94] hover:bg-white/10 hover:text-foreground transition-all uppercase tracking-widest"'
);

fs.writeFileSync(p, c, "utf-8");
console.log("Patched ProductCard.tsx for Apple-like premium UI");
