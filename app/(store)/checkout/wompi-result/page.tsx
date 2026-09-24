"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, ArrowRight, RefreshCw } from "lucide-react";

function WompiResultContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("id");
  const [status, setStatus] = useState<"loading" | "approved" | "declined" | "error" | "pending">("loading");
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    if (!transactionId) {
      setStatus("error");
      return;
    }

    fetch(`/api/checkout/wompi-verify?id=${transactionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrderNumber(data.orderNumber);
          if (data.status === "APPROVED") setStatus("approved");
          else if (data.status === "DECLINED" || data.status === "VOIDED" || data.status === "ERROR") setStatus("declined");
          else if (data.status === "PENDING") setStatus("pending");
          else setStatus("loading");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [transactionId]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center gap-8">
        {/* Animated loader */}
        <div className="relative w-28 h-28">
          <div className="absolute inset-0 rounded-full border-2 border-accent/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-accent animate-pulse" />
            </div>
          </div>
        </div>

        <div className="text-center space-y-3">
          <h1 className="font-heading text-2xl md:text-3xl tracking-[0.3em] text-white uppercase">
            Verificando Pago
          </h1>
          <div className="flex items-center justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <p className="text-[#6A6A64] font-body text-sm tracking-wider max-w-xs">
            Confirmando la transacción con tu banco. No cierres esta ventana.
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-px bg-white/5 relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-accent animate-[progress_2s_ease-in-out_infinite]" style={{ width: '60%' }} />
        </div>
      </div>
    );
  }

  if (status === "approved") {
    return (
      <div className="flex flex-col items-center gap-8 w-full">
        {/* Animated checkmark */}
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-[#1a2e1a] border border-[#4a6c32]/40 flex items-center justify-center">
            <svg className="w-14 h-14" viewBox="0 0 52 52" fill="none">
              <style>{`
                .check-circle { stroke-dasharray: 166; stroke-dashoffset: 166; animation: drawCircle 0.6s ease forwards; }
                .check-mark { stroke-dasharray: 48; stroke-dashoffset: 48; animation: drawCheck 0.4s 0.5s ease forwards; }
                @keyframes drawCircle { to { stroke-dashoffset: 0; } }
                @keyframes drawCheck { to { stroke-dashoffset: 0; } }
              `}</style>
              <circle className="check-circle" cx="26" cy="26" r="25" stroke="#4a6c32" strokeWidth="2" fill="none"/>
              <polyline className="check-mark" points="14,27 22,35 38,18" stroke="#7fb554" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-[#4a6c32]/20 blur-xl scale-150 animate-pulse" />
        </div>

        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-[#7fb554] mb-2">
            <div className="h-px w-12 bg-[#7fb554]/40" />
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase">Transacción Aprobada</span>
            <div className="h-px w-12 bg-[#7fb554]/40" />
          </div>

          <h1 className="font-heading text-4xl md:text-5xl text-white tracking-widest uppercase leading-tight">
            ¡Pago<br />
            <span className="text-accent">Confirmado!</span>
          </h1>

          <p className="text-[#8A8A84] font-body text-sm max-w-xs mx-auto leading-relaxed">
            Tu transacción fue procesada exitosamente y el stock ha sido reservado.
          </p>
        </div>

        {/* Order badge */}
        {orderNumber && (
          <div className="bg-[#141414] border border-white/10 px-8 py-4 text-center w-full max-w-xs">
            <p className="font-mono text-[9px] tracking-[0.4em] text-accent uppercase mb-1">Número de Pedido</p>
            <p className="font-heading text-2xl text-white tracking-widest">{orderNumber}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <Link
            href="/productos"
            className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent/80 text-black py-3 text-xs font-heading tracking-widest uppercase transition-all"
          >
            SEGUIR COMPRANDO
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/productos"
            className="flex-1 flex items-center justify-center border border-white/20 hover:border-white/40 text-white py-3 text-xs font-heading tracking-widest uppercase transition-all"
          >
            IR A LA TIENDA
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex items-center gap-6 pt-2 border-t border-white/5 w-full max-w-xs justify-center">
          <div className="flex items-center gap-1.5 text-[#5A5A54]">
            <Lock className="w-3 h-3" />
            <span className="font-mono text-[9px] tracking-widest uppercase">SSL Cifrado</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-1.5 text-[#5A5A54]">
            <ShieldCheck className="w-3 h-3" />
            <span className="font-mono text-[9px] tracking-widest uppercase">Wompi Seguro</span>
          </div>
        </div>
      </div>
    );
  }

    if (status === "pending") {
    return (
      <div className="flex flex-col items-center gap-8 w-full">
        {/* Pending Icon */}
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-[#332511] border border-[#a67c00]/40 flex items-center justify-center">
            <RefreshCw className="w-10 h-10 text-[#f5b800] animate-spin" />
          </div>
          <div className="absolute inset-0 rounded-full bg-[#a67c00]/20 blur-xl scale-150 animate-pulse" />
        </div>

        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-[#f5b800] mb-2">
            <div className="h-px w-12 bg-[#f5b800]/40" />
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase">Transacción en Proceso</span>
            <div className="h-px w-12 bg-[#f5b800]/40" />
          </div>

          <h1 className="font-heading text-4xl md:text-5xl text-white tracking-widest uppercase leading-tight">
            Pago<br />
            <span className="text-[#f5b800]">Pendiente</span>
          </h1>

          <p className="text-[#8A8A84] font-body text-sm max-w-xs mx-auto leading-relaxed">
            Tu banco está procesando el pago. Recibirás un correo de confirmación en cuanto se apruebe. No necesitas hacer el pago de nuevo.
          </p>
        </div>

        {orderNumber && (
          <div className="bg-[#141414] border border-white/10 px-8 py-4 text-center w-full max-w-xs">
            <p className="font-mono text-[9px] tracking-[0.4em] text-accent uppercase mb-1">Número de Pedido</p>
            <p className="font-heading text-2xl text-white tracking-widest">{orderNumber}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 flex items-center justify-center gap-2 bg-[#f5b800] hover:bg-[#d69f00] text-black py-3 text-xs font-heading tracking-widest uppercase transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            ACTUALIZAR ESTADO
          </button>
          <Link
            href="/productos"
            className="flex-1 flex items-center justify-center border border-white/20 hover:border-white/40 text-white py-3 text-xs font-heading tracking-widest uppercase transition-all"
          >
            IR A LA TIENDA
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      {/* Animated X */}
      <div className="relative">
        <div className="w-28 h-28 rounded-full bg-[#2e1a1a] border border-red-900/40 flex items-center justify-center">
          <svg className="w-14 h-14" viewBox="0 0 52 52" fill="none">
            <style>{`
              .x-circle { stroke-dasharray: 166; stroke-dashoffset: 166; animation: drawCircle 0.6s ease forwards; }
              .x-line1 { stroke-dasharray: 40; stroke-dashoffset: 40; animation: drawCheck 0.3s 0.5s ease forwards; }
              .x-line2 { stroke-dasharray: 40; stroke-dashoffset: 40; animation: drawCheck 0.3s 0.7s ease forwards; }
              @keyframes drawCircle { to { stroke-dashoffset: 0; } }
              @keyframes drawCheck { to { stroke-dashoffset: 0; } }
            `}</style>
            <circle className="x-circle" cx="26" cy="26" r="25" stroke="#7f1d1d" strokeWidth="2" fill="none"/>
            <line className="x-line1" x1="16" y1="16" x2="36" y2="36" stroke="#f87171" strokeWidth="3" strokeLinecap="round"/>
            <line className="x-line2" x1="36" y1="16" x2="16" y2="36" stroke="#f87171" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="absolute inset-0 rounded-full bg-red-900/20 blur-xl scale-150" />
      </div>

      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-red-500/70 mb-2">
          <div className="h-px w-12 bg-red-500/30" />
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase">
            {status === "declined" ? "Transacción Rechazada" : "Error de Pago"}
          </span>
          <div className="h-px w-12 bg-red-500/30" />
        </div>

        <h1 className="font-heading text-4xl md:text-5xl text-white tracking-widest uppercase leading-tight">
          Pago No<br />
          <span className="text-red-400">Procesado</span>
        </h1>

        <p className="text-[#8A8A84] font-body text-sm max-w-xs mx-auto leading-relaxed">
          No se realizaron cargos a tu cuenta. Puedes intentar nuevamente con otro método de pago.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Link
          href="/checkout"
          className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent/80 text-black py-3 text-xs font-heading tracking-widest uppercase transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          INTENTAR NUEVAMENTE
        </Link>
        <Link
          href="/productos"
          className="flex-1 flex items-center justify-center border border-white/20 hover:border-white/40 text-white py-3 text-xs font-heading tracking-widest uppercase transition-all"
        >
          IR A LA TIENDA
        </Link>
      </div>
    </div>
  );
}

export default function WompiResultPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center py-20 px-4 relative overflow-hidden">
      {/* Background camo overlay muy sutil */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url('/camo-bg.png')", backgroundSize: "300px", backgroundRepeat: "repeat" }}
      />
      {/* Corner accent lines */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-accent/30 pointer-events-none" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-accent/30 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Top label */}
        <div className="text-center mb-10">
          <span className="font-mono text-[9px] tracking-[0.5em] text-[#4A4A44] uppercase">
            SGB MILITARY // ESTADO DE PAGO
          </span>
        </div>

        <Suspense fallback={
          <div className="flex flex-col items-center gap-6">
            <div className="w-24 h-24 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
            <p className="text-[#5A5A54] font-mono text-xs tracking-widest uppercase">Cargando...</p>
          </div>
        }>
          <WompiResultContent />
        </Suspense>
      </div>
    </div>
  );
}
