import fs from "fs";

const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/admin/(panel)/pedidos/[id]/page.tsx";
let code = fs.readFileSync(path, "utf-8");

const oldDni = `<p>{order.customerDni}</p>`;
const newDni = `<p className="font-mono text-sm blur-sm hover:blur-none transition-all cursor-pointer inline-block bg-white/5 px-2 py-0.5 rounded" title="Pasa el mouse para revelar">
                  {order.customerDni}
                </p>`;

code = code.replace(oldDni, newDni);
fs.writeFileSync(path, code, "utf-8");
console.log("Masked DNI");
