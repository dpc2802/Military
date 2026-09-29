"use client";

import { useState } from "react";
import { Search, Package, Truck, CheckCircle, Clock, XCircle, ShoppingBag } from "lucide-react";
import { formatCOP } from "@/lib/format";

type OrderResult = {
  orderNumber: string;
  status: string;
  totalAmount: string;
  customerName: string;
  customerCity: string;
  trackingNumber?: string | null;
  shippingCompany?: string | null;
  createdAt: string;
  items: { productName: string; quantity: number; size?: string | null }[];
};

const STATUS_STEPS = [
  { key: "pendiente_whatsapp", label: "Pedido Recibido", icon: ShoppingBag, color: "text-accent" },
  { key: "confirmado",         label: "Confirmado",      icon: CheckCircle, color: "text-blue-400" },
  { key: "enviado",            label: "En Camino",       icon: Truck,       color: "text-yellow-400" },
  { key: "entregado",          label: "Entregado",       icon: CheckCircle, color: "text-green-400" },
];

function getStepIndex(status: string) {
  if (status === "pendiente_pago") return 0;
  return STATUS_STEPS.findIndex((s) => s.key === status);
}

export default function ConsultarPedidoPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OrderResult | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !contactInfo.trim()) {
      toast.error("Por favor ingresa ambos datos para buscar tu pedido.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`/api/orders/lookup?order=${encodeURIComponent(orderNumber.trim())}&contact=${encodeURIComponent(contactInfo.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No encontramos un pedido con esa información.");
      } else {
        setResult(data.order);
      }
    } catch {
      setError("Error al buscar el pedido. Intenta de nuevo.");
    }
    setLoading(false);
  };

  const currentStep = result ? getStepIndex(result.status) : -1;
  const isCancelled = result?.status === "cancelado";

  return (
    <div className="max-w-2xl mx-auto px-4 pt-28 pb-12 md:pt-36 md:pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-6">
        <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center">
          <Package className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h1 className="font-heading text-2xl md:text-3xl uppercase tracking-widest text-foreground">
            ¿Dónde está mi pedido?
          </h1>
          <p className="text-xs text-muted-foreground font-body mt-1">
            Ingresa tu número de pedido o número de teléfono para consultar el estado.
          </p>
        </div>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex flex-col gap-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Ej. SGB-0023"
              className="w-full bg-background border border-white/10 px-4 py-3 text-sm font-body text-white focus:outline-none focus:border-accent transition-colors"
              required
            />
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="Celular o Correo electrónico"
              className="w-full bg-background border border-white/10 px-4 py-3 text-sm font-body text-white focus:outline-none focus:border-accent transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto self-end flex items-center justify-center gap-2 bg-accent hover:bg-accent/80 text-black px-8 py-3 text-xs font-heading tracking-widest uppercase transition-all disabled:opacity-50"
          >
            {loading ? (
              <Package className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Rastrear Pedido
          </button>
        </form>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm font-body mb-6 flex gap-3 items-center">
          <XCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Order Header */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-1">
              <span className="font-heading text-2xl text-white tracking-widest">{result.orderNumber}</span>
              <span className="text-accent font-heading text-xl">{formatCOP(Number(result.totalAmount))}</span>
            </div>
            <p className="text-xs text-muted-foreground font-body">
              {result.customerName} · {result.customerCity} · {new Date(result.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>

          {/* Cancelled banner */}
          {isCancelled ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 flex gap-3 items-center">
              <XCircle className="w-6 h-6 text-red-400 shrink-0" />
              <div>
                <p className="font-heading text-red-400 uppercase tracking-widest text-sm">Pedido Cancelado</p>
                <p className="text-xs text-muted-foreground font-body mt-1">
                  Este pedido fue cancelado. Si crees que es un error, contáctanos por WhatsApp.
                </p>
              </div>
            </div>
          ) : (
            /* Progress Timeline */
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="font-heading text-sm tracking-widest uppercase text-foreground mb-6">Estado del Pedido</h2>
              <div className="relative">
                {/* Track line */}
                <div className="absolute left-5 top-0 bottom-0 w-px bg-white/10" />
                <div className="space-y-6">
                  {STATUS_STEPS.map((step, i) => {
                    const isCompleted = i <= currentStep;
                    const isCurrent = i === currentStep;
                    const Icon = step.icon;
                    return (
                      <div key={step.key} className={`flex gap-4 items-start relative ${!isCompleted ? "opacity-30" : ""}`}>
                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-all ${isCurrent ? "bg-accent border-accent" : isCompleted ? "bg-white/10 border-white/20" : "bg-transparent border-white/10"}`}>
                          <Icon className={`w-5 h-5 ${isCurrent ? "text-black" : isCompleted ? step.color : "text-muted-foreground"}`} />
                        </div>
                        <div className="pt-1.5">
                          <p className={`font-heading text-sm tracking-widest uppercase ${isCurrent ? "text-white" : "text-muted-foreground"}`}>
                            {step.label}
                          </p>
                          {isCurrent && <p className="text-xs text-accent font-body mt-0.5">Estado actual</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tracking Info */}
          {result.trackingNumber && (
            <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Truck className="w-5 h-5 text-accent" />
                <h3 className="font-heading text-sm tracking-widest uppercase text-accent">Información de Rastreo</h3>
              </div>
              <p className="text-sm text-foreground font-body">
                <strong>Transportadora:</strong> {result.shippingCompany}
              </p>
              <p className="text-sm text-foreground font-body mt-1">
                <strong>Guía:</strong> <span className="text-accent font-heading tracking-widest">{result.trackingNumber}</span>
              </p>
              <a
                href={`https://www.google.com/search?q=rastrear+envio+${result.shippingCompany}+${result.trackingNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 text-xs font-heading tracking-widest uppercase bg-accent text-black px-4 py-2 hover:bg-accent/80 transition-all"
              >
                <Truck className="w-3.5 h-3.5" />
                Rastrear Paquete
              </a>
            </div>
          )}

          {/* Items */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-heading text-sm tracking-widest uppercase text-foreground mb-4">Productos</h3>
            <ul className="space-y-2">
              {result.items.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm font-body text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  {item.quantity}x {item.productName} {item.size ? `(Talla: ${item.size})` : ""}
                </li>
              ))}
            </ul>
          </div>

          {/* WhatsApp Help */}
          <a
            href="https://wa.me/573226133232?text=Hola,%20necesito%20ayuda%20con%20mi%20pedido"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 border border-white/10 text-xs font-heading tracking-widest uppercase text-muted-foreground hover:text-accent hover:border-accent/30 transition-all"
          >
            ¿Necesitas ayuda? Escríbenos por WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
