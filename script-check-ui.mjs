import fs from "fs";

const uiPath = "C:/Users/HP Core i5/Desktop/SGB MILITARY/app/admin/(panel)/pedidos/[id]/page.tsx";
let uiCode = fs.readFileSync(uiPath, "utf-8");

// Change status selection form to include tracking info conditionally
const formHtml = `<form action={updateStatus} className="flex flex-col sm:flex-row gap-3">
              <input type="hidden" name="orderId" value={order.id} />
              <select
                name="status"
                defaultValue={order.status}
                className="bg-background border border-white/10 text-foreground px-4 py-2 font-body text-sm rounded-none focus:border-accent outline-none"
              >
                <option value="pendiente_whatsapp">Pendiente (Manual)</option>
                <option value="pendiente_pago">Pendiente (Pasarela)</option>
                <option value="confirmado">Confirmado / Pagado</option>
                <option value="enviado">Enviado</option>
                <option value="entregado">Entregado</option>
                <option value="cancelado">Cancelado</option>
              </select>
              <button
                type="submit"
                className="bg-accent text-background px-6 py-2 font-heading text-sm uppercase tracking-widest hover:bg-accent/90 transition-colors"
              >
                Actualizar Estado
              </button>
            </form>`;

const newFormHtml = `"use client";
// Convertimos este componente a Client Component para manejar el estado del form o simplemente lo hacemos con un wrapper
// Actually, it's easier to create a Client Component wrapper for the Status Updater if we want interactivity.
// But we can also just render a pure HTML form with optional inputs that are revealed with some basic JS or CSS, or just always show them if "enviado" is selected.`;

