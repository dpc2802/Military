"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";

function WompiResultContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("id");
  const [status, setStatus] = useState<"loading" | "approved" | "declined" | "error">("loading");
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
          else setStatus("loading"); // PENDING
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [transactionId]);

  if (status === "loading") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-32 text-center flex flex-col items-center">
        <Loader2 className="w-16 h-16 animate-spin text-accent mb-6" />
        <h1 className="font-heading text-2xl tracking-widest uppercase mb-4">Verificando tu pago...</h1>
        <p className="text-muted-foreground font-body">Estamos confirmando la transacción con tu banco. Por favor no cierres esta ventana.</p>
      </div>
    );
  }

  if (status === "approved") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <CheckCircle2 className="w-20 h-20 text-[#25D366] mx-auto mb-6" />
        <h1 className="font-heading text-2xl md:text-3xl text-foreground tracking-widest uppercase mb-4">
          ¡Pago Exitoso!
        </h1>
        <p className="text-muted-foreground font-body text-sm md:text-base mb-8">
          Tu transacción se procesó correctamente y tu pedido <strong className="text-foreground">{orderNumber}</strong> está confirmado.
        </p>
        <Link
          href="/productos"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-primary-foreground px-8 py-4 text-sm font-heading tracking-widest uppercase transition-colors"
        >
          Seguir comprando
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <XCircle className="w-20 h-20 text-destructive mx-auto mb-6" />
      <h1 className="font-heading text-2xl md:text-3xl text-foreground tracking-widest uppercase mb-4">
        Transacción {status === "declined" ? "Rechazada" : "Fallida"}
      </h1>
      <p className="text-muted-foreground font-body text-sm md:text-base mb-8">
        Hubo un problema al procesar tu pago. No se han hecho cargos a tu tarjeta o cuenta.
      </p>
      <Link
        href="/checkout"
        className="inline-flex items-center gap-2 bg-accent hover:bg-accent/80 text-white px-8 py-4 text-sm font-heading tracking-widest uppercase transition-colors"
      >
        Intentar de nuevo
      </Link>
    </div>
  );
}

export default function WompiResultPage() {
  return (
    <div className="bg-background min-h-[80vh] flex flex-col justify-center border-t border-border">
      <Suspense fallback={
        <div className="max-w-2xl mx-auto px-4 py-32 text-center flex flex-col items-center">
          <Loader2 className="w-12 h-12 animate-spin text-muted-foreground mb-4" />
          <p className="text-muted-foreground font-body tracking-widest uppercase text-sm">Cargando...</p>
        </div>
      }>
        <WompiResultContent />
      </Suspense>
    </div>
  );
}
