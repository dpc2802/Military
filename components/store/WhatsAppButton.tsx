"use client";

import { WHATSAPP_NUMBER } from "@/lib/constants";
import { MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  
  const message = encodeURIComponent(
    "Hola SGB Military Shop 👋 Tengo una pregunta sobre sus productos"
  );

  // Mostrar el botón después de un pequeño scroll para no invadir de entrada
  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className={`fixed bottom-6 right-6 z-30 flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.3)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.5)] transition-all duration-300 hover:-translate-y-1 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      <MessageCircle className="w-7 h-7" />
      {/* Ripple effect sutil */}
      <span className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-20" />
    </a>
  );
}
