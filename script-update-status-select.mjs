import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/admin/(panel)/pedidos/[id]/StatusSelect.tsx";

const code = `"use client";

import { useState } from "react";
import { updateOrderStatus } from "./actions";
import { toast } from "sonner";
import { Loader2, X } from "lucide-react";
import type { OrderStatus } from "@/types";

interface StatusSelectProps {
  orderId: number;
  currentStatus: OrderStatus;
  trackingNumber?: string | null;
  shippingCompany?: string | null;
}

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pendiente_whatsapp", label: "Pendiente WhatsApp" },
  { value: "pendiente_pago", label: "Pendiente Wompi" },
  { value: "confirmado", label: "Confirmado" },
  { value: "enviado", label: "Enviado" },
  { value: "entregado", label: "Entregado" },
  { value: "cancelado", label: "Cancelado" },
];

export function StatusSelect({ orderId, currentStatus, trackingNumber, shippingCompany }: StatusSelectProps) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [loading, setLoading] = useState(false);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [company, setCompany] = useState(shippingCompany || "");
  const [tracking, setTracking] = useState(trackingNumber || "");

  const handleUpdate = async (newStatus: OrderStatus, trackingData?: { company: string; tracking: string }) => {
    setLoading(true);
    try {
      await updateOrderStatus(orderId, newStatus, trackingData);
      setStatus(newStatus);
      toast.success("Estado actualizado exitosamente");
      setShowModal(false);
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    
    if (currentStatus === "cancelado") {
      toast.error("No se puede cambiar el estado de un pedido cancelado.");
      return;
    }

    if (newStatus === "enviado") {
      setShowModal(true);
      return;
    }

    if (confirm(\`¿Cambiar estado a \${newStatus}?\`)) {
      handleUpdate(newStatus);
    } else {
      // Revert select visually
      e.target.value = status;
    }
  };

  const submitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !tracking.trim()) {
      toast.error("Por favor completa ambos campos");
      return;
    }
    handleUpdate("enviado", { company: company.trim(), tracking: tracking.trim() });
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={handleChange}
        disabled={loading || currentStatus === "cancelado"}
        className="bg-surface border border-border text-sm font-body text-foreground px-3 py-1.5 focus:outline-none focus:border-primary disabled:opacity-50 uppercase tracking-wider"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {loading && <Loader2 className="w-4 h-4 animate-spin text-accent" />}

      {/* Modal Envío */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border border-[#333] p-6 max-w-sm w-full relative shadow-2xl">
            <button 
              onClick={() => { setShowModal(false); setStatus(currentStatus); }} 
              className="absolute top-4 right-4 text-muted-foreground hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-heading tracking-widest uppercase text-xl mb-2 text-[#C2B280]">
              Detalles de Envío
            </h3>
            <p className="text-xs text-muted-foreground mb-6">
              Esta información se enviará automáticamente al correo del cliente.
            </p>

            <form onSubmit={submitShipping} className="space-y-4">
              <div>
                <label className="block text-[10px] font-heading uppercase tracking-widest text-muted-foreground mb-1">
                  Empresa Transportadora
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Servientrega, Inter Rapidísimo"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-[#111] border border-[#333] px-3 py-2 text-sm focus:border-[#C2B280] outline-none text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-heading uppercase tracking-widest text-muted-foreground mb-1">
                  Número de Guía
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 2004958302"
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                  className="w-full bg-[#111] border border-[#333] px-3 py-2 text-sm focus:border-[#C2B280] outline-none text-white"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-[#C2B280] text-black font-heading tracking-widest uppercase text-xs py-3 hover:bg-[#a69666] transition-colors disabled:opacity-50"
              >
                {loading ? "Guardando..." : "Confirmar Envío"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
`;
fs.writeFileSync(path, code, "utf-8");
console.log("Updated StatusSelect with shipping modal");
