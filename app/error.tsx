/**
 * Página de error global de Next.js.
 */

"use client";

import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <p className="text-destructive font-heading text-6xl tracking-widest">ERROR</p>
          <h1 className="font-heading text-xl text-foreground tracking-widest">
            ALGO FALLÓ EN LA OPERACIÓN
          </h1>
          <p className="text-muted-foreground font-body text-sm max-w-sm mx-auto">
            Ocurrió un error inesperado. Podés intentar de nuevo o volver a la tienda.
          </p>
          {process.env.NODE_ENV === "development" && (
            <p className="text-xs text-destructive font-mono bg-surface px-3 py-2 max-w-md mx-auto text-left mt-2">
              {error.message}
            </p>
          )}
        </div>
        <div className="w-16 h-px bg-destructive mx-auto" />
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="bg-surface border border-border hover:border-primary text-foreground px-5 py-2.5 text-sm font-heading tracking-widest uppercase transition-colors"
          >
            REINTENTAR
          </button>
          <Link
            href="/"
            className="bg-primary hover:bg-primary-dark text-primary-foreground px-5 py-2.5 text-sm font-heading tracking-widest uppercase transition-colors"
          >
            IR A LA TIENDA
          </Link>
        </div>
      </div>
    </main>
  );
}
