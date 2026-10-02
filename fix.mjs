import fs from "fs";
const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/Header.tsx";
let c = fs.readFileSync(p, "utf-8");
c = c.replace(
  '</Link>\n  \n            <motion.button',
  '</Link>\n            </motion.div>\n  \n            <motion.button'
);
fs.writeFileSync(p, c, "utf-8");
console.log("Fixed Header.tsx");
