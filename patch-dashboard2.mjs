import fs from "fs";
const p1 = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/admin/(panel)/page.tsx";
let c = fs.readFileSync(p1, "utf-8");

const startStr = "{/* ── KPI CARDS ── */}";
const endStr = "{/* ── GRIDS PRINCIPALES ── */}";
const idxStart = c.indexOf(startStr);
const idxEnd = c.indexOf(endStr);

if (idxStart !== -1 && idxEnd !== -1) {
  const newJsx = `      <StatsPanel />\n\n      ` + endStr;
  c = c.substring(0, idxStart) + newJsx + c.substring(idxEnd + endStr.length);
  fs.writeFileSync(p1, c, "utf-8");
  console.log("Replaced old KPI cards with StatsPanel");
} else {
  console.log("Could not find markers");
}
