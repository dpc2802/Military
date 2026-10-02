import fs from "fs";
const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/CartDrawer.tsx";
let c = fs.readFileSync(p, "utf-8");
c = c.replace(
  '<Trash2 className="w-4 h-4" />\n              </button>',
  '<Trash2 className="w-4 h-4" />\n              </motion.button>'
);
fs.writeFileSync(p, c, "utf-8");
console.log("Fixed CartDrawer.tsx");
