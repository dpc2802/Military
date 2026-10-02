import fs from "fs";
const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/CartDrawer.tsx";
let c = fs.readFileSync(p, "utf-8");

// Enhance Cart Drawer styling (from bg-background to frosted glass)
c = c.replace(
  'className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"',
  'className="fixed inset-0 bg-[#0A0A0A]/80 backdrop-blur-md z-[100]"'
);

c = c.replace(
  'className="fixed right-0 top-0 h-[100dvh] w-full sm:max-w-md bg-background border-l border-white/10 \n            z-[100] flex flex-col shadow-2xl"',
  'className="fixed right-0 top-0 h-[100dvh] w-full sm:max-w-md bg-[#0A0A0A]/95 backdrop-blur-3xl border-l border-white/5 z-[100] flex flex-col shadow-2xl"'
);

// Buttons with framer-motion tap
c = c.replace(
  '<button\n                onClick={onClose}\n                className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"',
  '<motion.button\n                whileTap={{ scale: 0.9 }}\n                onClick={onClose}\n                className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"'
);
c = c.replace('</button>\n              </div>\n              {/* Alerta Envío Gratis */}', '</motion.button>\n              </div>\n              {/* Alerta Envío Gratis */}');

// CartItem - increment/decrement buttons
c = c.replace(
  '<button\n                onClick={() => updateQuantity(item.variantId, -1)}',
  '<motion.button\n                whileTap={{ scale: 0.9 }}\n                onClick={() => updateQuantity(item.variantId, -1)}'
);
c = c.replace(
  'onClick={() => updateQuantity(item.variantId, 1)}',
  'whileTap={{ scale: 0.9 }}\n                onClick={() => updateQuantity(item.variantId, 1)}'
);
c = c.replace(
  '<button\n                onClick={() => setConfirmDelete(true)}',
  '<motion.button\n                whileTap={{ scale: 0.9 }}\n                onClick={() => setConfirmDelete(true)}'
);

// Checkout button
c = c.replace(
  '<button\n                      onClick={handleCheckout}',
  '<motion.button\n                      whileTap={{ scale: 0.97 }}\n                      onClick={handleCheckout}'
);
c = c.replace('</button>\n                  </div>\n                </div>\n              )}\n            </motion.div>', '</motion.button>\n                  </div>\n                </div>\n              )}\n            </motion.div>');


fs.writeFileSync(p, c, "utf-8");
console.log("Patched CartDrawer");
