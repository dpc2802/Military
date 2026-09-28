import fs from "fs";
const p1 = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/admin/(panel)/page.tsx";
let c = fs.readFileSync(p1, "utf-8");
const start = c.indexOf("{/* ── KPI CARDS ── */}");
console.log(c.substring(start, start + 1200));
