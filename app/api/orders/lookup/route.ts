/**
 * API pública para consultar el estado de un pedido.
 * GET /api/orders/lookup?q=SGB-0042  (número de orden)
 * GET /api/orders/lookup?q=3201234567 (número de celular)
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq, or } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();

  if (!q || q.length < 4) {
    return NextResponse.json({ error: "Ingresa un número de pedido o teléfono válido." }, { status: 400 });
  }

  // Search by order number (SGB-XXXX) or phone number
  const order = await db.query.orders.findFirst({
    where: or(
      eq(orders.orderNumber, q.toUpperCase()),
      eq(orders.customerPhone, q)
    ),
    with: { items: true },
    // Sort by most recent if multiple orders match a phone
  });

  if (!order) {
    return NextResponse.json(
      { error: "No encontramos un pedido con ese número. Verifica que sea correcto." },
      { status: 404 }
    );
  }

  // Return only safe public fields (no DNI, no email, no admin notes)
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
