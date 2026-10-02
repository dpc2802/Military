import fs from "fs";
const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/Header.tsx";
let c = fs.readFileSync(p, "utf-8");

// 1. Upgrade background blur & styling for Apple frosted glass feel
c = c.replace(
  'bg-background/80 backdrop-blur-md border-b border-white/10 shadow-lg py-3',
  'bg-[#0A0A0A]/60 backdrop-blur-2xl supports-[backdrop-filter]:bg-[#0A0A0A]/40 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] py-3'
);
c = c.replace(
  'bg-background/50 backdrop-blur-sm border-b border-transparent py-5',
  'bg-transparent border-b border-transparent py-5'
);

// 2. Enhance icons with framer-motion whileTap
c = c.replace(
  '<button \n              onClick={() => setSearchOpen(true)}',
  '<motion.button \n              whileTap={{ scale: 0.9 }}\n              onClick={() => setSearchOpen(true)}'
);
c = c.replace(
  'aria-label="Buscar"\n            >',
  'aria-label="Buscar"\n            >'
);
// Make sure closing tags are updated
c = c.replace(/<\/button>\s*<button \s*onClick=\{\(\) => setCartOpen\(true\)\}/g, '</motion.button>\n            <motion.button \n              whileTap={{ scale: 0.9 }}\n              onClick={() => setCartOpen(true)}');

c = c.replace(/<\/button>\s*\{\/\* Mobile Menu Toggle \*\/\}/g, '</motion.button>\n\n            {/* Mobile Menu Toggle */}');

c = c.replace(
  '<button\n              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}',
  '<motion.button\n              whileTap={{ scale: 0.9 }}\n              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}'
);
c = c.replace(/<\/button>\s*<\/div>\s*<\/div>\s*<\/header>/g, '</motion.button>\n          </div>\n        </div>\n      </header>');


// 3. Heart link
c = c.replace(
  '<Link \n              href="/favoritos"',
  '<motion.div whileTap={{ scale: 0.9 }}>\n              <Link \n                href="/favoritos"'
);
c = c.replace(
  '</Link>\n\n            {/* Mobile Menu Toggle */}',
  '</Link>\n            </motion.div>\n\n            {/* Mobile Menu Toggle */}'
);

// 4. Mobile Nav Overlay spring physics
c = c.replace(
  'className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl lg:hidden pt-24 px-4 pb-6 flex flex-col"',
  'className="fixed inset-0 z-40 bg-[#0A0A0A]/90 backdrop-blur-3xl lg:hidden pt-24 px-4 pb-6 flex flex-col"\n            transition={{ type: "spring", damping: 25, stiffness: 200 }}'
);

fs.writeFileSync(p, c, "utf-8");
console.log("Patched Header.tsx for Apple-like feel");
