"use client";

import { useState, useEffect, useCallback } from "react";
import { Ticket, Copy, Check, RefreshCcw, Lock } from "lucide-react";

type Coupon = {
  id: number;
  code: string;
  discountPercentage: number;
  isUsed: boolean;
  createdAt: string;
  usedAt: string | null;
};

const TIERS = [
  { percentage: 10, label: "$10.000 OFF", color: "text-blue-400 border-blue-400/30 bg-blue-400/10", btnColor: "bg-blue-500 hover:bg-blue-400" },
  { percentage: 20, label: "$20.000 OFF", color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10", btnColor: "bg-yellow-500 hover:bg-yellow-400" },
  { percentage: 30, label: "$30.000 OFF", color: "text-red-400 border-red-400/30 bg-red-400/10", btnColor: "bg-red-500 hover:bg-red-400" },
];

export default function CuponesPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<number | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [lastGenerated, setLastGenerated] = useState<Coupon | null>(null);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/coupons");
    const data = await res.json();
    setCoupons(data.coupons ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const generate = async (percentage: number) => {
    setGenerating(percentage);
    setLastGenerated(null);
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discountPercentage: percentage }),
    });
    const data = await res.json();
    if (data.coupon) {
      setLastGenerated(data.coupon);
      setCoupons((prev) => [data.coupon, ...prev]);
    }
    setGenerating(null);
  };

  const copy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const available = coupons.filter((c) => !c.isUsed);
  const used = coupons.filter((c) => c.isUsed);

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center">
          <Ticket className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h1 className="font-heading text-2xl uppercase tracking-widest text-foreground">Cupones de Descuento</h1>
          <p className="text-xs text-muted-foreground font-body mt-1">Genera códigos únicos de un solo uso para entregar personalmente a tus clientes.</p>
        </div>
      </div>

      {/* Último generado — Banner */}
      {lastGenerated && (
        <div className="bg-accent/10 border border-accent/30 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div>
            <p className="text-xs text-accent font-heading uppercase tracking-widest mb-1">✅ Código generado — Cópialo y envíalo ahora</p>
            <p className="text-3xl font-heading text-white tracking-widest">{lastGenerated.code}</p>
            <p className="text-xs text-muted-foreground mt-1">{lastGenerated.discountPercentage}% de descuento — 1 solo uso</p>
          </div>
          <button
            onClick={() => copy(lastGenerated.code)}
            className="flex items-center gap-2 bg-accent text-black font-heading text-sm px-6 py-3 uppercase tracking-widest hover:bg-accent/80 transition-all"
          >
            {copied === lastGenerated.code ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied === lastGenerated.code ? "¡Copiado!" : "Copiar código"}
          </button>
        </div>
      )}

      {/* Generadores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TIERS.map((tier) => (
          <div key={tier.percentage} className={`border rounded-2xl p-6 flex flex-col items-center gap-4 ${tier.color}`}>
            <p className="font-heading text-4xl tracking-widest">{tier.label}</p>
            <p className="text-xs text-center text-muted-foreground font-body">
              El cliente usa el código 1 sola vez. Luego queda quemado para siempre.
            </p>
            <button
              onClick={() => generate(tier.percentage)}
              disabled={generating !== null}
              className={`w-full text-black font-heading text-sm py-3 uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed ${tier.btnColor}`}
            >
              {generating === tier.percentage ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCcw className="w-4 h-4 animate-spin" /> Generando...
                </span>
              ) : (
                `Generar código ${tier.label}`
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Tabla — Disponibles */}
      <div>
        <h2 className="font-heading text-sm tracking-widest uppercase text-foreground mb-3">
          Disponibles ({available.length})
        </h2>
        {available.length === 0 ? (
          <p className="text-muted-foreground text-sm font-body">No hay cupones disponibles. Genera uno arriba.</p>
        ) : (
          <div className="border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/5">
            {available.map((c) => (
              <div key={c.id} className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="font-heading text-white tracking-widest text-sm">{c.code}</span>
                  <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-heading uppercase">${c.discountPercentage}.000 OFF</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-foreground font-body hidden md:block">
                    {new Date(c.createdAt).toLocaleDateString("es-CO")}
                  </span>
                  <button onClick={() => copy(c.code)} className="text-muted-foreground hover:text-accent transition-colors p-1">
                    {copied === c.code ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabla — Quemados */}
      {used.length > 0 && (
        <div>
          <h2 className="font-heading text-sm tracking-widest uppercase text-muted-foreground mb-3">
            Ya utilizados ({used.length})
          </h2>
          <div className="border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5 opacity-60">
            {used.map((c) => (
              <div key={c.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="font-heading text-muted-foreground tracking-widest text-sm line-through">{c.code}</span>
                  <span className="text-[10px] bg-white/5 text-muted-foreground px-2 py-0.5 rounded-full font-heading uppercase">${c.discountPercentage}.000 OFF</span>
                </div>
                <span className="text-[10px] text-muted-foreground font-body">
                  Usado {c.usedAt ? new Date(c.usedAt).toLocaleDateString("es-CO") : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
