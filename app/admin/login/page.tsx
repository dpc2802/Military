/**
 * Página de login del panel de administración.
 * Ruta: /admin/login
 * 
 * Acceso público (único punto de entrada al panel admin).
 * Diseño austero alineado con la estética táctica de SGB.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, User, AlertCircle, Loader2 } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Ingresá el usuario"),
  password: z.string().min(1, "Ingresá la contraseña"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json() as { error?: string };
        setError(body.error ?? "Error al iniciar sesión");
        return;
      }

      // Redirigir al dashboard tras login exitoso
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Error de conexión. Intentá de nuevo.");
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-primary mb-4 bg-surface">
            <Lock className="w-7 h-7 text-accent" />
          </div>
          <h1 className="font-heading text-2xl text-foreground tracking-widest">
            SGB MILITARY
          </h1>
          <p className="text-muted-foreground text-sm mt-1 uppercase tracking-wider font-body">
            Panel de Administración
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-surface border border-border p-6 space-y-5"
        >
          {/* Error general */}
          {error && (
            <div className="flex items-center gap-2 bg-destructive/10 border border-destructive text-destructive-foreground p-3 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Usuario */}
          <div className="space-y-1.5">
            <label
              htmlFor="username"
              className="block text-xs font-body uppercase tracking-widest text-muted-foreground"
            >
              Usuario
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="username"
                type="text"
                autoComplete="username"
                {...register("username")}
                className="w-full bg-background border border-input text-foreground pl-10 pr-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary transition-colors"
                placeholder="admin"
              />
            </div>
            {errors.username && (
              <p className="text-destructive text-xs">{errors.username.message}</p>
            )}
          </div>

          {/* Contraseña */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-body uppercase tracking-widest text-muted-foreground"
            >
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
                className="w-full bg-background border border-input text-foreground pl-10 pr-4 py-2.5 text-sm font-body focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="text-destructive text-xs">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-dark text-primary-foreground py-2.5 text-sm font-heading tracking-widest uppercase transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-4 font-body">
          ← <a href="/" className="hover:text-accent transition-colors">Volver a la tienda</a>
        </p>
      </div>
    </main>
  );
}
