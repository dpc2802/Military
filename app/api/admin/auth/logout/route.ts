/**
 * API de logout para el panel admin.
 * POST /api/admin/auth/logout
 */

import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  const session = await getIronSession(request, response, sessionOptions);
  
  // Destruir la sesión (borra la cookie)
  session.destroy();
  
  return NextResponse.redirect(new URL("/admin/login", request.url));
}
