import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./db/index";
import { products } from "./db/schema";
import { eq } from "drizzle-orm";

async function forceCleanText() {
  const fixes = [
    {
      id: 7,
      name: "Gorra Táctica Kryptek Highlander",
      desc: "Gorra táctica estilo Kryptek con panel frontal de velcro para parches. Material resistente al desgaste, ideal para outdoor y uso civil."
    },
    {
      id: 8,
      name: "Gorra Táctica Digital Pink",
      desc: "Gorra táctica camuflaje digital rosa con panel frontal de velcro para parches. Material resistente al desgaste, ideal para outdoor y uso civil."
    },
    {
      id: 9,
      name: "Gorra Táctica Urban Diamond",
      desc: "Gorra táctica camuflaje geométrico urbano con panel frontal de velcro. Material resistente al desgaste, ideal para outdoor y uso civil."
    },
    {
      id: 10,
      name: "Gorra Táctica Digital Woodland",
      desc: "Gorra táctica camuflaje digital pixelado verde con panel frontal de velcro. Diseño clásico y resistente."
    },
    {
      id: 11,
      name: "Gorra Táctica Kryptek Typhon",
      desc: "Gorra táctica camuflaje oscuro tipo Typhon con panel frontal de velcro oscuro. Discreta y elegante."
    },
    {
      id: 12,
      name: "Balaclava Táctica Digital Woodland",
      desc: "Balaclava pasamontañas táctico en camuflaje digital pixelado verde. Ideal para protección facial completa en outdoor, airsoft y uso táctico civil."
    }
  ];

  for (const fix of fixes) {
    await db.update(products).set({
      name: fix.name,
      description: fix.desc
    }).where(eq(products.id, fix.id));
    console.log(`Forced update on ID ${fix.id}`);
  }

  console.log("All text forced clean!");
  process.exit(0);
}

forceCleanText().catch(console.error);
