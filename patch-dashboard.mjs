import fs from "fs";
const p1 = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/admin/(panel)/page.tsx";
let c = fs.readFileSync(p1, "utf-8");

const markerStart = `{/* ── KPI CARDS ── */}`;
const markerEnd = `{/* STOCK CRÍTICO */}`;

const idxStart = c.indexOf(markerStart);
const idxEnd = c.indexOf(markerEnd);

if (idxStart !== -1 && idxEnd !== -1) {
  const newJsx = `
      {/* ── KPI CARDS & CHARTS ── */}
      <StatsPanel />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        `;
  
  c = c.substring(0, idxStart) + newJsx + c.substring(idxEnd);
  fs.writeFileSync(p1, c, "utf-8");
  console.log("Replaced old KPI cards with StatsPanel");
} else {
  console.log("Could not find markers");
}
