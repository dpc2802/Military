/**
 * Middleware de Next.js para proteger las rutas /admin
 * 
 * Si la cookie de sesión no existe o no es válida, redirige a /admin/login.
 * La ruta /admin/login queda siempre pública.
 */

import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, type AdminSessionData } from "@/lib/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger solo rutas /admin (excepto /admin/login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const response = NextResponse.next();
    
    const session = await getIronSession<AdminSessionData>(request, response, sessionOptions);

    if (!session.admin?.isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Aplica el middleware a todas las rutas /admin y /api/admin
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
