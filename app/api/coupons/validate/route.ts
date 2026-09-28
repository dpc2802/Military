/**
 * API pública para validar un cupón antes de mostrarlo en el carrito.
 * GET /api/coupons/validate?code=SGB-30-A3F9B2
 * No quema el cupón — solo verifica que existe y está disponible.
 * El quemado real ocurre en /api/checkout (con update atómico).
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")?.trim().toUpperCase();

  if (!code) {
    return NextResponse.json({ error: "Código requerido" }, { status: 400 });
  }

  const coupon = await db.query.coupons.findFirst({
    where: and(eq(coupons.code, code), eq(coupons.isUsed, false)),
  });

  if (!coupon) {
    return NextResponse.json({ error: "El cupón no existe o ya fue utilizado." }, { status: 404 });
  }

  return NextResponse.json({
    valid: true,
    code: coupon.code,
    discountPercentage: coupon.discountPercentage,
  });
}
