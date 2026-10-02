import fs from "fs";
const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/ProductDetailClient.tsx";
let c = fs.readFileSync(p, "utf-8");

const reviewsHTML = `
      {/* ── RESEÑAS SIMULADAS (REVIEWS) ── */}
      <div className="mt-20 pt-16 border-t border-white/5">
        <h2 className="text-2xl font-heading tracking-widest uppercase mb-10 flex items-center gap-3">
          Reseñas de Clientes
          <span className="text-sm bg-accent/10 text-accent px-3 py-1 rounded-full border border-accent/20">
            4.9/5
          </span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Carlos M.",
              date: "Hace 1 semana",
              title: "Excelente calidad t\u00E1ctica",
              content: "Me sorprendi\u00F3 la resistencia del material. Lo he usado en terreno agreste y ha aguantado perfecto. El env\u00EDo fue r\u00E1pido.",
              rating: 5,
              verified: true
            },
            {
              name: "Andr\u00E9s P.",
              date: "Hace 3 semanas",
              title: "Muy c\u00F3modo y preciso",
              content: "Las medidas corresponden exactamente a la descripci\u00F3n. El ajuste es firme pero permite movilidad. Recomendado 100%.",
              rating: 5,
              verified: true
            },
            {
              name: "Javier R.",
              date: "Hace 1 mes",
              title: "Cumple su funci\u00F3n",
              content: "Buen producto, el color es ligeramente m\u00E1s oscuro que en las fotos pero la calidad es innegable. Volver\u00E9 a comprar.",
              rating: 4,
              verified: true
            }
          ].map((review, i) => (
            <div key={i} className="bg-[#0A0A0A] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-heading tracking-widest uppercase text-sm flex items-center gap-2">
                    {review.name}
                    {review.verified && (
                      <span className="text-[#25D366]" title="Compra Verificada">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{review.date}</p>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={\`w-3.5 h-3.5 \${star <= review.rating ? "fill-accent text-accent" : "fill-white/5 text-white/5"}\`} />
                  ))}
                </div>
              </div>
              <h4 className="font-bold text-sm mb-2">{review.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">"{review.content}"</p>
            </div>
          ))}
        </div>
      </div>
`;

// Insert it right before the related products section or at the bottom before closing </div>
if (c.includes('{/* ── RELACIONADOS ── */}')) {
  c = c.replace('{/* ── RELACIONADOS ── */}', reviewsHTML + '\n\n      {/* ── RELACIONADOS ── */}');
} else {
  c = c.replace('</>  \n    );\n  }\n', reviewsHTML + '\n      </div>\n    </>\n  );\n}\n');
}

fs.writeFileSync(p, c, "utf-8");
console.log("Reviews section injected into ProductDetailClient.tsx");
