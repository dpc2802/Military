import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/CartDrawer.tsx";
let content = fs.readFileSync(path, "utf-8");

// Import useRouter
content = content.replace(
  'import { useState, useEffect, useRef } from "react";',
  'import { useState, useEffect, useRef } from "react";\nimport { useRouter } from "next/navigation";'
);

// Add router to CartDrawer
content = content.replace(
  "export default function CartDrawer({ open, onClose }: CartDrawerProps) {",
  "export default function CartDrawer({ open, onClose }: CartDrawerProps) {\n  const router = useRouter();"
);

// Replace handleCheckout logic
const newHandleCheckout = `
  const handleCheckout = () => {
    setProcessing(true);
    setTimeout(() => {
      onClose();
      router.push("/checkout");
      setProcessing(false);
    }, 400);
  };
`;

content = content.replace(
  /const handleCheckout = \(\) => \{[\s\S]*?\}, 800\);\s*\};/,
  newHandleCheckout
);

// Replace button UI
const newButton = `
                      {processing ? (
                        <span className="flex items-center gap-2">
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                          PROCESANDO...
                        </span>
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          IR A FINALIZAR COMPRA
                        </>
                      )}
`;

content = content.replace(
  /\{processing \? \([\s\S]*?FINALIZAR PEDIDO POR WHATSAPP\s*<\/>\s*\)\}/,
  newButton
);

// We need to change the button background from #25D366 (WhatsApp Green) to primary (white/accent)
content = content.replace(
  /bg-\[\#25D366\] text-black/g,
  "bg-primary text-primary-foreground hover:bg-primary-dark"
);

fs.writeFileSync(path, content, "utf-8");
console.log("Updated Cart Drawer");
