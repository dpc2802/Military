import fs from "fs";
const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/Header.tsx";
let c = fs.readFileSync(p, "utf-8");
let lines = c.split("\n");
for(let i=80; i<110; i++) {
  console.log(`${i+1}: ${lines[i]}`);
}
