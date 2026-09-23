"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/productos", label: "Productos", icon: Package, exact: false },
  { href: "/admin/categorias", label: "Categorías", icon: FolderOpen, exact: false },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag, exact: false },
];

export default function AdminSidebar({ username }: { username: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Cerrar en mobile al navegar
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <ShieldCheck className="w-8 h-8 text-accent" />
        <div>
          <h2 className="font-heading text-lg text-foreground tracking-widest uppercase">
            SGB MILITARY
          </h2>
          <p className="text-[10px] text-muted-foreground font-heading uppercase tracking-[0.2em]">
            Panel Admin
          </p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-3 text-sm font-heading tracking-wider uppercase transition-colors group relative",
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent" />
              )}
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                {item.label}
              </div>
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-accent opacity-50" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-4">
        <div className="px-3">
          <p className="text-[10px] text-muted-foreground font-heading uppercase tracking-widest mb-1">
            Sesión Activa
          </p>
          <p className="text-sm font-body text-foreground truncate">{username}</p>
        </div>
        
        <form action="/api/admin/auth/logout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-heading tracking-widest uppercase text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Cerrar sesión
          </button>
        </form>
        
        <Link
          href="/"
          target="_blank"
          className="block px-3 py-2 text-[10px] font-heading tracking-widest uppercase text-muted-foreground hover:text-accent transition-colors"
        >
          ← Ver tienda pública
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* ── MOBILE HEADER FIX ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[#111] border-b border-white/5 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
           <ShieldCheck className="w-6 h-6 text-accent" />
           <span className="font-heading text-sm text-foreground tracking-widest uppercase">SGB Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Abrir menú"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-[280px] bg-[#111] border-r border-white/5 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-[#111] border-r border-white/5 flex-col sticky top-0 h-screen">
        <SidebarContent />
      </aside>
    </>
  );
}
