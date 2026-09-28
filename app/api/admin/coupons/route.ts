/**
 * API de Cupones — Solo accesible desde el panel de Admin.
 * GET  /api/admin/coupons       → Lista todos los cupones
 * POST /api/admin/coupons       → Genera un nuevo cupón único desechable
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { coupons } from "@/db/schema";
import { desc } from "drizzle-orm";
import { getAdminSession } from "@/lib/auth";
import { randomBytes } from "crypto";

function generateCode(percentage: number): string {
  const random = randomBytes(3).toString("hex").toUpperCase(); // ej: A3F9B2
  return `SGB-${percentage}-${random}`; // ej: SGB-30-A3F9B2
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const allCoupons = await db.query.coupons.findMany({
    orderBy: desc(coupons.createdAt),
  });

  return NextResponse.json({ coupons: allCoupons });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { discountPercentage } = body;

  if (![10, 20, 30].includes(discountPercentage)) {
    return NextResponse.json({ error: "Porcentaje inválido. Solo 10, 20 o 30." }, { status: 400 });
  }

  // Generar código único garantizado
  let code = generateCode(discountPercentage);
  let attempts = 0;
  while (attempts < 5) {
    try {
      const [newCoupon] = await db.insert(coupons).values({
        code,
        discountPercentage,
      }).returning();
      return NextResponse.json({ coupon: newCoupon }, { status: 201 });
    } catch {
      // Collision on unique code, try again with new random
      code = generateCode(discountPercentage);
      attempts++;
    }
  }

  return NextResponse.json({ error: "No se pudo generar el cupón, intenta de nuevo." }, { status: 500 });
}
