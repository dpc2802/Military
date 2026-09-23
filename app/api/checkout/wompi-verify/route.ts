import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get("id");

  if (!transactionId) {
    return NextResponse.json({ error: "Missing transaction ID" }, { status: 400 });
  }

  try {
    // 1. Check with Wompi API (test environment)
    const wompiRes = await fetch(`https://sandbox.wompi.co/v1/transactions/${transactionId}`);
    
    if (!wompiRes.ok) {
      return NextResponse.json({ error: "Transaction not found in Wompi" }, { status: 404 });
    }

    const wompiData = await wompiRes.json();
    const transaction = wompiData.data;

    // 2. Find the order in our DB
    const orderNumber = transaction.reference;
    const order = await db.query.orders.findFirst({
      where: eq(orders.orderNumber, orderNumber),
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 3. Update the order status based on Wompi status
    let newStatus = order.status;
    
    if (transaction.status === "APPROVED") {
      newStatus = "confirmado";
    } else if (transaction.status === "DECLINED" || transaction.status === "ERROR" || transaction.status === "VOIDED") {
      // Devolvemos el estado a algo que el admin pueda ver, o cancelado
      newStatus = "cancelado";
    }
    
    if (order.status !== newStatus) {
      await db.update(orders)
        .set({ 
          status: newStatus,
          paymentId: transactionId,
          confirmedAt: newStatus === "confirmado" ? new Date() : order.confirmedAt
        })
        .where(eq(orders.id, order.id));
    }

    return NextResponse.json({ 
      success: true, 
      orderNumber, 
      status: transaction.status,
      dbStatus: newStatus
    });

  } catch (error) {
    console.error("[WOMPI VERIFY] Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
