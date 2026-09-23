"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { X, Trash2, ShoppingBag, AlertCircle, Info, ChevronRight, Check } from "lucide-react";
import { useCartStore } from "@/lib/stores/cart";
import { formatCOP } from "@/lib/format";
import { motion, AnimatePresence } from "framer-motion";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

// Subcomponente para cada ítem (maneja su propio estado de confirmación de borrado)
function CartItem({ item, updateQuantity, removeItem }: any) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isLogo = item.imageUrl === "/logo.png";
  const limitReached = item.quantity >= 10; // Límite simulado

  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0, overflow: "hidden" }}
      className="flex gap-4 pb-6 mb-6 border-b border-white/5 last:border-0 last:mb-0 last:pb-0"
    >
      {/* Imagen */}
      <div className="w-20 h-20 bg-[#111] border border-white/5 flex-shrink-0 relative overflow-hidden group">
        <Image
          src={item.imageUrl || "/logo.png"}
          alt={item.imageAlt || item.productName}
          fill
          className={`object-cover ${isLogo ? "p-4 brightness-0 invert opacity-50" : ""}`}
        />
      </div>

      {/* Info y Controles */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <h3 className="text-[13px] md:text-sm font-heading text-foreground uppercase truncate">
              {item.productName}
            </h3>
            <p className="text-[11px] text-[#9A9A94] font-body mt-0.5">
              {item.variantSize && `Talla: ${item.variantSize}`}
              {item.variantColor && ` / ${item.variantColor}`}
            </p>
            <button className="text-[10px] text-accent underline mt-1 hover:text-foreground transition-colors">
              Cambiar variante
            </button>
            <p className="text-[11px] text-[#9A9A94] font-body mt-2">
              Unidad: {formatCOP(item.unitPrice)}
            </p>
          </div>
          {/* SUBTOTAL REAL */}
          <div className="text-right flex-shrink-0">
            <p className="text-accent text-[15px] font-heading tracking-wider">
              {formatCOP(item.unitPrice * item.quantity)}
            </p>
          </div>
        </div>

        {/* Stepper y Eliminar */}
        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center border border-white/20 bg-white/5">
            <button
              onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
              className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center text-[#F5F5F0] hover:bg-white/10 transition-colors text-sm"
              aria-label="Reducir cantidad"
            >
              −
            </button>
            <span className="w-10 text-center text-[13px] font-body text-foreground">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
              disabled={limitReached}
              className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center text-[#F5F5F0] hover:bg-white/10 transition-colors text-sm disabled:opacity-30 disabled:hover:bg-transparent"
              aria-label="Aumentar cantidad"
            >
              +
            </button>
          </div>

          <div className="relative">
            {confirmDelete ? (
              <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 px-2 py-1 rounded-sm">
                <span className="text-[10px] font-heading uppercase text-destructive tracking-wider">¿Eliminar?</span>
                <button onClick={() => removeItem(item.variantId)} className="text-[10px] font-heading uppercase bg-destructive text-white px-2 py-1 hover:bg-destructive/80">
                  Sí
                </button>
                <button onClick={() => setConfirmDelete(false)} className="text-[10px] font-heading uppercase text-[#9A9A94] px-2 py-1 hover:text-white">
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-[#9A9A94] hover:text-destructive transition-colors p-2 -m-2"
                aria-label="Eliminar del carrito"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        {limitReached && <p className="text-[10px] text-accent mt-2">Máximo disponible alcanzado</p>}
      </div>
    </motion.div>
  );
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const router = useRouter();
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();
  const [processing, setProcessing] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Bloquear scroll del body
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setConfirmClear(false);
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [open]);

  
  const handleCheckout = () => {
    setProcessing(true);
    setTimeout(() => {
      onClose();
      router.push("/checkout");
      setProcessing(false);
    }, 400);
  };


  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay oscuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />

          {/* Drawer Lateral */}
          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-[100dvh] w-full sm:max-w-md bg-background border-l border-white/10 z-[100] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#111]">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-accent" />
                <h2 className="font-heading text-lg tracking-widest text-[#F5F5F0] uppercase">
                  Carrito
                </h2>
                {items.length > 0 && (
                  <span className="bg-accent text-black text-[10px] font-heading px-2 py-0.5">
                    {items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <button onClick={onClose} className="hidden sm:block text-[10px] font-heading uppercase text-accent hover:underline tracking-widest">
                  Seguir comprando
                </button>
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 text-[#9A9A94] hover:text-[#F5F5F0] transition-colors"
                  aria-label="Cerrar carrito"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Contenido (Scrollable) */}
            <div className="flex-1 overflow-y-auto bg-background">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-accent opacity-50" />
                  </div>
                  <p className="font-heading text-xl tracking-widest text-foreground uppercase mb-2">
                    CARRITO VACÍO
                  </p>
                  <p className="text-[13px] text-[#9A9A94] font-body mb-8">
                    Tu arsenal táctico está vacío. Explorá el catálogo para equiparte.
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-accent text-black px-8 py-3 text-[11px] font-heading tracking-widest uppercase hover:bg-accent/90 transition-colors"
                  >
                    Ver Catálogo
                  </button>
                </div>
              ) : (
                <>
                  {/* Aviso Local */}
                  <div className="px-6 py-3 bg-[#111] border-b border-white/5 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#9A9A94] font-body leading-relaxed">
                      Tu carrito se guarda en este dispositivo. Las unidades no se reservan hasta finalizar el pedido.
                    </p>
                  </div>

                  {/* Items List */}
                  <div className="p-6">
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <CartItem 
                          key={item.variantId} 
                          item={item} 
                          updateQuantity={updateQuantity} 
                          removeItem={removeItem} 
                        />
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Upsell Relacionados */}
                  <div className="px-6 py-8 border-t border-white/5 bg-[#111]">
                    <h4 className="text-[11px] font-heading uppercase tracking-widest text-[#F5F5F0] mb-4">
                      También te puede interesar
                    </h4>
                    <div className="flex gap-4 overflow-x-auto snap-x pb-4 scrollbar-hide">
                      {/* Fake Upsell Items */}
                      <div className="w-40 flex-shrink-0 snap-start bg-background border border-white/5 p-3">
                        <div className="aspect-square bg-white/5 mb-3 relative flex items-center justify-center">
                           <Image src="/prod-gloves.png" alt="Guantes" fill className="object-cover p-2" />
                        </div>
                        <p className="text-[10px] font-heading uppercase text-foreground truncate mb-1">Guantes de asalto</p>
                        <p className="text-[11px] text-accent font-heading mb-2">$45.000</p>
                        <button onClick={onClose} className="w-full text-center border border-white/10 text-[9px] font-heading uppercase py-1.5 hover:border-accent">Ver</button>
                      </div>
                      <div className="w-40 flex-shrink-0 snap-start bg-background border border-white/5 p-3">
                        <div className="aspect-square bg-white/5 mb-3 relative flex items-center justify-center">
                           <Image src="/logo.png" alt="Parche" fill className="object-contain p-4 brightness-0 invert opacity-50" />
                        </div>
                        <p className="text-[10px] font-heading uppercase text-foreground truncate mb-1">Parche SGB Force</p>
                        <p className="text-[11px] text-accent font-heading mb-2">$15.000</p>
                        <button onClick={onClose} className="w-full text-center border border-white/10 text-[9px] font-heading uppercase py-1.5 hover:border-accent">Ver</button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer Fijo */}
            {items.length > 0 && (
              <div className="border-t border-white/10 bg-[#111] p-6">
                
                {/* Desglose */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-[13px] font-body text-[#9A9A94]">
                    <span>Subtotal de productos</span>
                    <span className="text-[#F5F5F0]">{formatCOP(totalPrice())}</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px] font-body text-[#9A9A94]">
                    <span className="flex items-center gap-1"><Info className="w-3.5 h-3.5"/> Envío</span>
                    <span>Por coordinar</span>
                  </div>
                  <div className="h-px bg-white/10 my-2" />
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-heading tracking-widest text-[#F5F5F0] uppercase">TOTAL ESTIMADO</span>
                    <span className="text-2xl font-heading tracking-widest text-accent">{formatCOP(totalPrice())}</span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="space-y-4">
                  <button
                    onClick={handleCheckout}
                    disabled={processing}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary-dark disabled:bg-white/10 disabled:text-white/50 py-4 text-xs font-heading tracking-widest uppercase shadow-[2px_2px_0px_rgba(255,255,255,0.1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all"
                  >
                    
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

                  </button>

                  <div className="flex justify-center mt-4">
                    {confirmClear ? (
                      <div className="flex items-center gap-3 bg-white/5 px-4 py-2 border border-white/10">
                        <span className="text-[10px] font-heading uppercase text-[#F5F5F0] tracking-wider">¿Vaciar todo?</span>
                        <button onClick={clearCart} className="text-[10px] font-heading uppercase text-destructive hover:underline">
                          Sí, vaciar
                        </button>
                        <span className="text-white/20">|</span>
                        <button onClick={() => setConfirmClear(false)} className="text-[10px] font-heading uppercase text-[#9A9A94] hover:text-white">
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmClear(true)}
                        className="text-[10px] font-heading tracking-widest uppercase text-[#9A9A94] hover:text-destructive transition-colors"
                      >
                        Vaciar carrito
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

