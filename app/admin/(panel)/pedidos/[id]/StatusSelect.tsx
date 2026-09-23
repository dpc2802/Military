"use client";

import { useState } from "react";
import { updateOrderStatus } from "./actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { OrderStatus } from "@/types";

interface StatusSelectProps {
  orderId: number;
  currentStatus: OrderStatus;
}

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pendiente_whatsapp", label: "Pendiente WhatsApp" },
  { value: "confirmado", label: "Confirmado" },
  { value: "enviado", label: "Enviado" },
  { value: "entregado", label: "Entregado" },
  { value: "cancelado", label: "Cancelado" },
];

export function StatusSelect({ orderId, currentStatus }: StatusSelectProps) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    
    if (currentStatus === "cancelado") {
      toast.error("No se puede cambiar el estado de un pedido cancelado.");
      return;
    }

    if (
      currentStatus === "pendiente_whatsapp" &&
      newStatus !== "confirmado" &&
      newStatus !== "cancelado"
    ) {
      toast.error("De pendiente solo podés pasar a Confirmado o Cancelado.");
      return;
    }

    if (confirm(`¿Cambiar estado a ${newStatus}?`)) {
      setLoading(true);
      try {
        await updateOrderStatus(orderId, newStatus);
        setStatus(newStatus);
        toast.success("Estado actualizado");
      } catch (error: any) {
        toast.error(error.message || "Error al actualizar");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={handleChange}
        disabled={loading || currentStatus === "cancelado"}
        className="bg-surface border border-border text-sm font-body text-foreground px-3 py-1.5 focus:outline-none focus:border-primary disabled:opacity-50"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {loading && <Loader2 className="w-4 h-4 animate-spin text-accent" />}
    </div>
  );
}
