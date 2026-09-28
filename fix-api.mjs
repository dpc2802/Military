import fs from "fs";
const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/api/checkout/route.ts";
let c = fs.readFileSync(p, "utf-8");

c = c.replace(
`    const shippingCost = subtotalAmount >= 300000 ? 0 : 25000;
    const totalAmount = subtotalAmount + shippingCost - discountAmount;

    // 2b. Quemar cupón atómicamente (Race-condition safe)
    let discountAmount = 0;
    let validatedCouponCode: string | undefined = undefined;`,
`    // 2b. Quemar cupón atómicamente (Race-condition safe)
    let discountAmount = 0;
    let validatedCouponCode: string | undefined = undefined;

    const shippingCost = subtotalAmount >= 300000 ? 0 : 25000;`
);

c = c.replace(
`      const pct = burned[0].discountPercentage;
      discountAmount = Math.round(subtotalAmount * (pct / 100));
      validatedCouponCode = burned[0].code;
    }

    // 3. Crear el pedido`,
`      const pct = burned[0].discountPercentage;
      discountAmount = Math.round(subtotalAmount * (pct / 100));
      validatedCouponCode = burned[0].code;
    }

    const totalAmount = subtotalAmount + shippingCost - discountAmount;

    // 3. Crear el pedido`
);

fs.writeFileSync(p, c, "utf-8");
console.log("route.ts fixed");
