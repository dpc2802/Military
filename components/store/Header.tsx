"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, ChevronRight } from "lucide-react";
import { useCartStore } from "@/lib/stores/cart";
import { AnimatePresence, motion } from "framer-motion";
import CartDrawer from "./CartDrawer";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { totalItems } = useCartStore();

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/productos", label: "Catálogo" },
    { href: "/productos?categoria=uniformes-ropa-tactica", label: "Ropa" },
    { href: "/productos?categoria=botas-calzado", label: "Botas" },
    { href: "/productos?categoria=mochilas-equipaje", label: "Mochilas" },
    { href: "/productos?categoria=accesorios-tacticos", label: "Accesorios" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-b border-white/10 shadow-lg py-3"
            : "bg-background/50 backdrop-blur-sm border-b border-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 z-50 group">
            <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0 transition-transform group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="SGB Military Shop"
                fill
                className="object-contain brightness-0 invert"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg md:text-xl text-foreground tracking-widest leading-none drop-shadow-sm">
                SGB MILITARY
              </span>
              <span className="text-[10px] text-accent tracking-[0.2em] font-body uppercase mt-1 drop-shadow-sm">
                Shop Colombia
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-heading text-muted-foreground hover:text-foreground tracking-widest uppercase transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4 lg:gap-6 z-50">
            <button 
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors group"
              aria-label="Abrir carrito"
            >
              <ShoppingCart className="w-5 h-5 transition-transform group-hover:scale-110" />
              {isMounted && totalItems() > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-background text-[10px] font-bold flex items-center justify-center rounded-full shadow-lg">
                  {totalItems()}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-foreground focus:outline-none"
              aria-label="Menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl lg:hidden pt-24 px-4 pb-6 flex flex-col"
          >
            <nav className="flex flex-col gap-2 mt-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-4 border-b border-white/5 text-lg font-heading tracking-widest uppercase text-foreground hover:text-accent transition-colors"
                  >
                    {link.label}
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </Link>
                </motion.div>
              ))}
            </nav>
            
            <div className="mt-auto pb-8">
              <p className="text-xs text-center text-muted-foreground font-body uppercase tracking-widest">
                Equipo Táctico de Uso Civil
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
