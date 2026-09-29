import fs from "fs";

function patchFile(filepath, search, replacement) {
  try {
    let c = fs.readFileSync(filepath, "utf-8");
    c = c.replace(search, replacement);
    fs.writeFileSync(filepath, c, "utf-8");
    console.log("Patched", filepath);
  } catch (e) {
    console.error("Error patching", filepath, e.message);
  }
}

const dir = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/";

patchFile(dir + "consultar-pedido/page.tsx", 'className="max-w-2xl mx-auto px-4 py-12 md:py-20"', 'className="max-w-2xl mx-auto px-4 pt-28 pb-12 md:pt-36 md:pb-20"');

patchFile(dir + "terminos-y-condiciones/page.tsx", 'className="max-w-4xl mx-auto px-4 py-12 md:py-20"', 'className="max-w-4xl mx-auto px-4 pt-28 pb-12 md:pt-36 md:pb-20"');

patchFile(dir + "politica-datos/page.tsx", 'className="max-w-4xl mx-auto px-4 py-12 md:py-20"', 'className="max-w-4xl mx-auto px-4 pt-28 pb-12 md:pt-36 md:pb-20"');

patchFile(dir + "politica-envios/page.tsx", 'className="max-w-4xl mx-auto px-4 py-12 md:py-20"', 'className="max-w-4xl mx-auto px-4 pt-28 pb-12 md:pt-36 md:pb-20"');

patchFile(dir + "checkout/page.tsx", 'className="bg-background min-h-screen"', 'className="bg-background min-h-screen pt-20 lg:pt-24"');

// And checkout/success/page.tsx might have this too
patchFile(dir + "checkout/success/page.tsx", 'className="min-h-screen bg-[#0A0A0A] flex items-center justify-center py-20 px-4 relative overflow-hidden"', 'className="min-h-screen bg-[#0A0A0A] flex items-center justify-center pt-32 pb-20 px-4 relative overflow-hidden"');

// wompi-result/page.tsx
patchFile(dir + "checkout/wompi-result/page.tsx", 'className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center py-20 px-4 relative overflow-hidden"', 'className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center pt-32 pb-20 px-4 relative overflow-hidden"');

