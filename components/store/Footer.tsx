import Image from "next/image";
import Link from "next/link";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { Shield, Info, Instagram, Facebook, ChevronDown } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  const footerLinks = {
    "Catálogo": [
      { href: "/productos?categoria=uniformes-ropa-tactica", label: "Uniformes y Ropa" },
      { href: "/productos?categoria=botas-calzado", label: "Botas" },
      { href: "/productos?categoria=mochilas-equipaje", label: "Mochilas" },
      { href: "/productos?categoria=accesorios-tacticos", label: "Accesorios" },
      { href: "/productos?categoria=replicas-airsoft", label: "Réplicas / Airsoft" },
    ],
    "Información": [
      { href: "/consultar-pedido", label: "Consultar mi pedido" },
      { href: "/faq", label: "Preguntas frecuentes" },
      { href: "/politica-envios", label: "Envíos y devoluciones" },
      { href: "/terminos-y-condiciones", label: "Términos y condiciones" },
      { href: "/politica-datos", label: "Política de datos (Ley 1581)" },
    ],
  };

  return (
    <footer className="bg-surface border-t border-white/5 mt-0 md:mt-16">
      {/* Disclaimer legal (Distinto y sutil) */}
      <div className="bg-[#121212] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-center md:justify-start gap-3">
          <Info className="w-5 h-5 text-accent flex-shrink-0" />
          <p className="text-[11px] md:text-xs text-[#9A9A94] font-body text-center md:text-left leading-relaxed">
            <span className="text-accent font-medium tracking-widest uppercase">Aviso Legal:</span>{" "}
            SGB Military Shop NO vende armas de fuego reales ni munición. 
            Todos los productos son de uso civil legal en Colombia (outdoor, airsoft, trabajo).
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          
          {/* Brand & CTA (Ocupa más espacio) */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="SGB Military Shop"
                width={54}
                height={54}
                className="object-contain drop-shadow-md brightness-0 invert opacity-90"
              />
              <div>
                <p className="font-heading text-lg tracking-widest text-[#F5F5F0]">SGB MILITARY</p>
                <p className="text-[10px] text-accent tracking-[0.2em] font-body uppercase">Shop — Colombia</p>
              </div>
            </div>
            
            <p className="text-[13px] text-[#9A9A94] font-body leading-relaxed max-w-sm">
              Especialistas en equipo táctico y artículos militares para uso civil. 
              Garantizamos la mejor calidad para tus misiones diarias.
            </p>

            {/* Badge Visual */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-sm">
              <Shield className="w-3.5 h-3.5 text-accent" />
              <span className="text-[10px] text-[#F5F5F0] font-heading tracking-widest uppercase">
                🇨🇴 Operación Nacional Segura
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <p className="text-[11px] text-[#9A9A94] uppercase tracking-wider font-body">
                Aceptamos: Nequi · Bancolombia · Contraentrega
              </p>
              {/* WhatsApp CTA (Solid) */}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20SGB%20Military%2C%20tengo%20una%20pregunta`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-black hover:bg-[#20bd5a] transition-all px-6 py-3 text-xs font-heading tracking-widest uppercase shadow-[2px_2px_0px_rgba(255,255,255,0.1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none"
              >
                <svg className="w-4 h-4 fill-black" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Contactar Asesor
              </a>
            </div>
          </div>

                    {/* Links (Responsive: Accordion en mobile, Grid en desktop) */}
          <div className="md:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 pt-4 md:pt-0">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                
                {/* VERSIÓN DESKTOP (Siempre visible) */}
                <div className="hidden md:block">
                  <h3 className="font-heading text-sm tracking-widest text-[#F5F5F0] uppercase mb-4">
                    {title}
                  </h3>
                  <ul className="space-y-3">
                    {links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-[13px] text-[#9A9A94] hover:text-accent transition-colors font-body flex items-center gap-2 group/link"
                        >
                          <span className="w-1 h-1 bg-white/10 rounded-full group-hover/link:bg-accent transition-colors" />
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* VERSIÓN MOBILE (Acordeón nativo) */}
                <details className="group md:hidden block border-b border-white/5">
                  <summary className="font-heading text-sm tracking-widest text-[#F5F5F0] uppercase cursor-pointer flex justify-between items-center py-4 list-none [&::-webkit-details-marker]:hidden">
                    {title}
                    <ChevronDown className="w-4 h-4 text-accent transition-transform group-open:rotate-180" />
                  </summary>
                  <ul className="space-y-3 pb-4">
                    {links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-[13px] text-[#9A9A94] hover:text-accent transition-colors font-body flex items-center gap-2"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
                
              </div>
            ))}
          </div>

          {/* Síguenos */}
          <div className="md:col-span-2 pt-4 md:pt-0">
            <h3 className="font-heading text-sm tracking-widest text-[#F5F5F0] uppercase mb-4 py-2 md:py-0 border-b border-white/5 md:border-none">
              Síguenos
            </h3>
            <div className="flex gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Síguenos en Instagram" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#F5F5F0] hover:bg-accent hover:text-black hover:border-accent transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Síguenos en Facebook" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#F5F5F0] hover:bg-accent hover:text-black hover:border-accent transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="Síguenos en TikTok" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#F5F5F0] hover:bg-accent hover:text-black hover:border-accent transition-all">
                {/* TikTok SVG Icon */}
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar (Copyright & Legal) - Add extra padding on mobile to avoid WhatsApp float overlap */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 pb-24 md:pb-0">
          <p className="text-[11px] md:text-xs text-[#9A9A94] font-body text-center md:text-left uppercase tracking-widest">
            © {year} SGB Military Shop. Todos los derechos reservados. <br className="md:hidden" /> Diseñado por <a href="https://wa.me/573148883214" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">DPALACIOS</a>
          </p>
          <div className="flex items-center gap-4 text-[11px] text-[#9A9A94] font-body uppercase tracking-wider">
            <Link href="/terminos-y-condiciones" className="hover:text-accent transition-colors">Términos</Link>
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            <Link href="/politica-datos" className="hover:text-accent transition-colors">Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}



