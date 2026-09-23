/**
 * Página de error 404 personalizada con estética táctica.
 */

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <p className="text-accent font-heading text-8xl tracking-widest">404</p>
          <h1 className="font-heading text-2xl text-foreground tracking-widest">
            POSICIÓN NO ENCONTRADA
          </h1>
          <p className="text-muted-foreground font-body text-sm max-w-sm mx-auto">
            La página que buscás no existe o fue movida. Verificá el URL o volvé a la base.
          </p>
        </div>
        <div className="w-16 h-px bg-accent mx-auto" />
        <Link
          href="/"
          className="inline-block bg-primary hover:bg-primary-dark text-primary-foreground px-6 py-2.5 text-sm font-heading tracking-widest uppercase transition-colors"
        >
          VOLVER A LA TIENDA
        </Link>
      </div>
    </main>
  );
}
