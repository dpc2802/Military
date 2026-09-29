import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, and, or } from "drizzle-orm";

// Sencillo Rate Limiter en memoria (útil en serverless para frenar ráfagas al mismo contenedor)
const rateLimitMap = new Map<string, { count: number, resetAt: number }>();
const RATE_LIMIT = 10; // max 10 requests
const WINDOW_MS = 60 * 1000; // per minute

export async function GET(req: NextRequest) {
  // 1. Basic Rate Limiting
  const ip = req.headers.get("x-forwarded-for") || "unknown_ip";
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (record) {
    if (now > record.resetAt) {
      rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    } else {
      record.count += 1;
      if (record.count > RATE_LIMIT) {
        return NextResponse.json({ error: "Demasiadas solicitudes. Por favor, intenta más tarde." }, { status: 429 });
      }
    }
  } else {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  }

  // Clear old entries occasionally to prevent memory leak
  if (Math.random() < 0.1) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now > val.resetAt) rateLimitMap.delete(key);
    }
  }

  // 2. Extract and Validate Params
  const orderParam = req.nextUrl.searchParams.get("order")?.trim().toUpperCase();
  const contactParam = req.nextUrl.searchParams.get("contact")?.trim();

  if (!orderParam || !contactParam || orderParam.length < 4 || contactParam.length < 4) {
    return NextResponse.json({ error: "Ingresa un número de pedido y un método de contacto válido." }, { status: 400 });
  }

  // 3. Database Query
  const order = await db.query.orders.findFirst({
    where: and(
      eq(orders.orderNumber, orderParam),
      or(
        eq(orders.customerEmail, contactParam),
        eq(orders.customerPhone, contactParam)
      )
    ),
    with: { items: true },
  });

  if (!order) {
    return NextResponse.json(
      { error: "No encontramos un pedido que coincida con esos datos. Verifica el número de pedido y tu celular o correo." },
      { status: 404 }
    );
  }

  // 4. Return sanitized data
  return NextResponse.json({
    order: {
      orderNumber: order.orderNumber,
      status: order.status,
      totalAmount: order.totalAmount,
      customerName: order.customerName,
      customerCity: order.customerCity,
      trackingNumber: order.trackingNumber,
      shippingCompany: order.shippingCompany,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        productName: item.productName,
        quantity: item.quantity,
        size: item.size,
      })),
    },
  });
}
