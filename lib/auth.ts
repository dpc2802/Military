/**
 * Validación de la sesión del admin del lado del servidor.
 * Útil para Server Actions y Route Handlers que necesitan verificar
 * que el usuario esté logueado sin repetir el código.
 */

import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, type AdminSessionData } from "./session";
import { redirect } from "next/navigation";

export async function requireAdminSession() {
  const session = await getIronSession<AdminSessionData>(await cookies(), sessionOptions);

  if (!session.admin?.isLoggedIn) {
    redirect("/admin/login");
  }

  return session.admin;
}

/**
 * Versión que devuelve null en lugar de redirigir
 * (útil en Route Handlers que retornan JSON)
 */
export async function getAdminSession() {
  const session = await getIronSession<AdminSessionData>(await cookies(), sessionOptions);

  if (!session.admin?.isLoggedIn) {
    return null;
  }

  return session.admin;
}
