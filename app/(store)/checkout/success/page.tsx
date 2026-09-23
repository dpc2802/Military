"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, MessageCircle, Copy, ArrowRight } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { toast } from "sonner";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!orderNumber) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground font-body">No se encontró información del pedido.</p>
        <Link href="/productos" className="text-accent hover:underline mt-4 inline-block">Volver a la tienda</Link>
      </div>
    );
  }

  const message = `Hola SGB Military! Acabo de hacer el pedido ${orderNumber}. Aquí te envío el comprobante de pago:`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  const copyOrder = () => {
    navigator.clipboard.writeText(orderNumber);
    toast.success("Número de pedido copiado");
  };

  return (
    <div className="bg-background min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-surface border border-border p-8 text-center space-y-6">
        
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>

        <div>
          <h1 className="font-heading text-2xl tracking-widest uppercase text-foreground mb-2">
            ¡Pedido Reservado!
          </h1>
          <p className="text-sm font-body text-muted-foreground">
            Tus productos han sido reservados por 24 horas.
          </p>
        </div>

        <div className="bg-background border border-border p-4 flex flex-col items-center gap-2">
          <span className="text-xs font-body text-muted-foreground uppercase tracking-wider">
            Número de pedido
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-heading text-accent tracking-widest">
              {orderNumber}
            </span>
            <button onClick={copyOrder} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <p className="text-sm font-body text-foreground">
            Para finalizar tu compra:
          </p>
          <ol className="text-left text-sm font-body text-muted-foreground space-y-2 list-decimal list-inside">
            <li>Escribinos por WhatsApp</li>
            <li>Envianos el comprobante de pago</li>
            <li>Coordinamos el envío</li>
          </ol>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 text-sm font-heading tracking-widest uppercase transition-colors mt-6"
          >
            <MessageCircle className="w-4 h-4" />
            Enviar WhatsApp Ahora
          </a>
        </div>

        <div className="pt-6">
          <Link href="/productos" className="inline-flex items-center gap-2 text-xs font-body text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors">
            Volver a la tienda
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

      </div>
    </div>
  );
}
