import fs from "fs";
const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/Header.tsx";
let c = fs.readFileSync(p, "utf-8");
console.log(c.substring(c.indexOf("Right Actions") - 30, c.indexOf("Mobile Menu Toggle") + 30));
