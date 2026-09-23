/**
 * Route Group (store) — Layout principal de la tienda pública.
 * Incluye Header con carrito, Footer, botón flotante de WhatsApp
 * y el disclaimer de uso civil.
 */

import type { Metadata } from "next";
import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import WhatsAppButton from "@/components/store/WhatsAppButton";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "SGB Military Shop — Equipo Táctico Colombia",
    template: "%s | SGB Military Shop",
  },
  description:
    "Tienda de artículos militares y equipo táctico en Colombia. Uniformes, botas, mochilas y accesorios tácticos para uso civil.",
  keywords: ["equipo táctico", "artículos militares", "airsoft Colombia", "uniformes militares", "botas tácticas"],
  openGraph: {
    siteName: "SGB Military Shop",
    locale: "es_CO",
    type: "website",
  },
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster
        position="bottom-center"
        duration={2000}
        toastOptions={{
          style: {
            background: "#2C2C2C",
            color: "#F5F5F0",
            border: "1px solid #3A3A3A",
            borderRadius: "0",
            fontFamily: "var(--font-body)",
            fontSize: "13px",
          },
        }}
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
      {/* Botón flotante de WhatsApp — posicionado para no tapar el carrito */}
      <WhatsAppButton />
    </>
  );
}
