import fs from "fs";
const actionPath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/admin/(panel)/pedidos/[id]/actions.ts";
let code = fs.readFileSync(actionPath, "utf-8");

// Change function signature
code = code.replace(
  /export async function updateOrderStatus\(orderId: number, newStatus: OrderStatus\) \{/,
  `export async function updateOrderStatus(orderId: number, newStatus: OrderStatus, trackingData?: { company: string; tracking: string }) {`
);

// Add tracking data to db.update
const dbUpdateOld = `await db
      .update(orders)
      .set({
        status: newStatus,
        confirmedAt: newStatus === "confirmado" ? new Date() : order.confirmedAt,
        shippedAt: newStatus === "enviado" ? new Date() : order.shippedAt,
        deliveredAt: newStatus === "entregado" ? new Date() : order.deliveredAt,
        cancelledAt: newStatus === "cancelado" ? new Date() : order.cancelledAt,
      })
      .where(eq(orders.id, orderId));`;

const dbUpdateNew = `await db
      .update(orders)
      .set({
        status: newStatus,
        confirmedAt: newStatus === "confirmado" ? new Date() : order.confirmedAt,
        shippedAt: newStatus === "enviado" ? new Date() : order.shippedAt,
        deliveredAt: newStatus === "entregado" ? new Date() : order.deliveredAt,
        cancelledAt: newStatus === "cancelado" ? new Date() : order.cancelledAt,
        ...(trackingData ? {
          shippingCompany: trackingData.company,
          trackingNumber: trackingData.tracking,
        } : {}),
      })
      .where(eq(orders.id, orderId));`;

code = code.replace(dbUpdateOld, dbUpdateNew);
fs.writeFileSync(actionPath, code, "utf-8");
console.log("Updated actions.ts");
