"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCartStore } from "@/lib/stores/cart";
import { formatCOP } from "@/lib/format";
import { toast } from "sonner";
import { ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";

// Esquema de validación Zod
const checkoutFormSchema = z.object({
  customerName: z.string().min(2, "Ingresá tu nombre completo"),
  customerPhone: z.string().min(7, "Ingresá un teléfono válido"),
  customerCity: z.string().min(2, "Ingresá tu ciudad"),
  customerAddress: z.string().min(5, "Ingresá la dirección de envío"),
  customerNotes: z.string().optional(),
  paymentMethod: z.enum(['whatsapp', 'wompi']).default('wompi'),
});

type CheckoutForm = z.infer<typeof checkoutFormSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutFormSchema),
  });

  // Si el carrito está vacío, redirigir a catálogo
  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="font-heading text-2xl tracking-widest uppercase mb-4">
          Tu carrito está vacío
        </h1>
        <p className="text-muted-foreground font-body mb-8">
          No hay productos para procesar el pedido.
        </p>
        <Link
          href="/productos"
          className="bg-primary hover:bg-primary-dark text-primary-foreground px-6 py-3 text-sm font-heading tracking-widest uppercase transition-colors"
        >
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutForm) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items: items.map(i => ({
            variantId: i.variantId,
            productId: i.productId,
            productName: i.productName,
            productSlug: i.productSlug,
            size: i.variantSize,
            color: i.variantColor,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Error al procesar el pedido");
      }

      // Vaciar carrito
      clearCart();

      // Elegir flujo según método de pago elegido por el cliente
      if (data.paymentMethod === "wompi") {
        // Cargar el Widget Programático de Wompi
        const script = document.createElement("script");
        script.src = "https://checkout.wompi.co/widget.js";
        script.onerror = () => {
          toast.error("No se pudo cargar la pasarela de pago. Intenta de nuevo.");
          setIsSubmitting(false);
        };
        script.onload = () => {
          const checkout = new (window as any).WidgetCheckout({
            currency: "COP",
            amountInCents: result.amountInCents,
            reference: result.orderNumber,
            publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || "pub_test_7ACX50PPzAW8WBB3ZQwqZRO6wMZaxB6R",
            signature: { integrity: result.signature }
          });
          checkout.open((wompiResult: any) => {
            if (wompiResult && wompiResult.transaction) {
              window.location.href = `/checkout/wompi-result?id=${wompiResult.transaction.id}`;
            } else {
              // El cliente cerró el modal sin pagar
              setIsSubmitting(false);
            }
          });
        };
        document.body.appendChild(script);
      } else {
        // Flujo WhatsApp: ir a la pantalla de éxito con instrucciones de transferencia
        router.push(`/checkout/success?order=${result.orderNumber}`);
      }

    } catch (error: any) {
      toast.error(error.message || "Ocurrió un error inesperado.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header simple */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/productos" className="flex items-center gap-2 text-xs font-body text-muted-foreground hover:text-foreground uppercase tracking-widest">
            <ArrowLeft className="w-4 h-4" />
            Volver a la tienda
          </Link>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span className="text-xs font-body text-muted-foreground uppercase tracking-wider">
              Checkout Seguro
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-heading text-2xl md:text-3xl text-foreground tracking-widest uppercase mb-8">
          Finalizar Pedido
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Formulario */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-surface border border-border p-6">
              <h2 className="font-heading text-lg tracking-widest text-foreground uppercase mb-4">
                Datos de Envío
              </h2>
              
              <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-body uppercase tracking-widest text-muted-foreground">
                    Correo Electrónico *
                  </label>
                  <input
                    {...register("customerEmail")}
                    type="email"
                    className="w-full bg-background border border-border px-3 py-2 text-sm font-body focus:outline-none focus:border-primary"
                    placeholder="Ej. juan@gmail.com (Para enviarte la factura)"
                  />
                  {errors.customerEmail && <p className="text-xs text-destructive mt-1">{errors.customerEmail.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-body uppercase tracking-widest text-muted-foreground">
                      Nombre completo *
                    </label>
                    <input
                      {...register("customerName")}
                      className="w-full bg-background border border-border px-3 py-2 text-sm font-body focus:outline-none focus:border-primary"
                      placeholder="Ej. Juan Pérez"
                    />
                    {errors.customerName && <p className="text-xs text-destructive mt-1">{errors.customerName.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-body uppercase tracking-widest text-muted-foreground">
                      Cédula (Para el envío) *
                    </label>
                    <input
                      {...register("customerDni")}
                      type="text"
                      className="w-full bg-background border border-border px-3 py-2 text-sm font-body focus:outline-none focus:border-primary"
                      placeholder="Ej. 1010123456"
                    />
                    {errors.customerDni && <p className="text-xs text-destructive mt-1">{errors.customerDni.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-body uppercase tracking-widest text-muted-foreground">
                      Departamento *
                    </label>
                    <input
                      {...register("customerDepartment")}
                      className="w-full bg-background border border-border px-3 py-2 text-sm font-body focus:outline-none focus:border-primary"
                      placeholder="Ej. Antioquia"
                    />
                    {errors.customerDepartment && <p className="text-xs text-destructive mt-1">{errors.customerDepartment.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-body uppercase tracking-widest text-muted-foreground">
                      Ciudad *
                    </label>
                    <input
                      {...register("customerCity")}
                      className="w-full bg-background border border-border px-3 py-2 text-sm font-body focus:outline-none focus:border-primary"
                      placeholder="Ej. Medellín"
                    />
                    {errors.customerCity && <p className="text-xs text-destructive mt-1">{errors.customerCity.message}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-body uppercase tracking-widest text-muted-foreground">
                      Dirección exacta *
                    </label>
                    <input
                      {...register("customerAddress")}
                      className="w-full bg-background border border-border px-3 py-2 text-sm font-body focus:outline-none focus:border-primary"
                      placeholder="Ej. Calle 123 # 45-67 Apto 8"
                    />
                    {errors.customerAddress && <p className="text-xs text-destructive mt-1">{errors.customerAddress.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-body uppercase tracking-widest text-muted-foreground">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      {...register("customerPhone")}
                      type="tel"
                      className="w-full bg-background border border-border px-3 py-2 text-sm font-body focus:outline-none focus:border-primary"
                      placeholder="Ej. 3001234567"
                    />
                    {errors.customerPhone && <p className="text-xs text-destructive mt-1">{errors.customerPhone.message}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-body uppercase tracking-widest text-muted-foreground">
                    Notas adicionales (opcional)
                  </label>
                  <textarea
                    {...register("customerNotes")}
                    className="w-full bg-background border border-border px-3 py-2 text-sm font-body focus:outline-none focus:border-primary h-20 resize-none"
                    placeholder="Instrucciones especiales de entrega..."
                  />
                </div>
              
                <div className="pt-6 border-t border-border">
                  <h3 className="font-heading text-md tracking-widest text-foreground uppercase mb-4">Método de Pago</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 p-4 border border-border bg-background cursor-pointer hover:border-primary transition-colors">
                      <input 
                        type="radio" 
                        value="wompi" 
                        {...register("paymentMethod")}
                        className="mt-1"
                      />
                      <div>
                        <p className="text-sm font-heading tracking-widest uppercase text-foreground">Tarjetas / PSE / Bancolombia</p>
                        <p className="text-xs text-muted-foreground font-body mt-1">Pago 100% seguro procesado por Wompi.</p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-4 border border-border bg-background cursor-pointer hover:border-primary transition-colors">
                      <input 
                        type="radio" 
                        value="whatsapp" 
                        {...register("paymentMethod")}
                        className="mt-1"
                      />
                      <div>
                        <p className="text-sm font-heading tracking-widest uppercase text-foreground">Transferencia Manual (WhatsApp)</p>
                        <p className="text-xs text-muted-foreground font-body mt-1">Acuerda el pago por transferencia bancaria directa (Nequi, Daviplata, Bancolombia).</p>
                      </div>
                    </label>
                  </div>
                </div>

              </form>
            </div>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-5">
            <div className="bg-surface border border-border p-6 sticky top-24">
              <h2 className="font-heading text-lg tracking-widest text-foreground uppercase mb-4">
                Resumen del pedido
              </h2>

              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-3">
                    <div className="w-16 h-16 bg-background border border-border flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.imageUrl || "/logo.png"}
                        alt={item.imageAlt || item.productName}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body text-foreground truncate">{item.productName}</p>
                      <p className="text-xs text-muted-foreground font-body mt-0.5">
                        {item.variantSize && `Talla: ${item.variantSize}`}
                        {item.variantColor && ` / ${item.variantColor}`}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Cant: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-heading text-foreground">
                        {formatCOP(item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm font-body text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatCOP(totalPrice())}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-body text-muted-foreground">
                  <span>Envío</span>
                  <span>Por calcular</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border mt-2">
                  <span className="text-base font-body tracking-wider uppercase text-foreground">Total</span>
                  <span className="text-xl font-heading text-accent">{formatCOP(totalPrice())}</span>
                </div>
              </div>

              <div className="bg-background border border-border p-3 mb-6 text-xs text-muted-foreground font-body">
                Al confirmar, se reservará el stock y te redirigiremos a WhatsApp para enviar el comprobante de pago y coordinar el envío.
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground py-4 text-sm font-heading tracking-widest uppercase transition-colors"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Procesando...</>
                ) : (
                  watch("paymentMethod") === "wompi" ? "Ir a Pagar Seguro" : "Confirmar y Pagar vía WhatsApp"
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
