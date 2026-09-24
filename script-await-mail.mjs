import fs from "fs";

// 1. Update checkout API
const checkoutPath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/api/checkout/route.ts";
let checkoutCode = fs.readFileSync(checkoutPath, "utf-8");
checkoutCode = checkoutCode.replace(
  /mailer\.sendMail\(\{/g,
  `await mailer.sendMail({`
);
fs.writeFileSync(checkoutPath, checkoutCode, "utf-8");

// 2. Update wompi-verify API
const wompiPath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/api/checkout/wompi-verify/route.ts";
let wompiCode = fs.readFileSync(wompiPath, "utf-8");
wompiCode = wompiCode.replace(
  /mailer\.sendMail\(\{/g,
  `await mailer.sendMail({`
);
fs.writeFileSync(wompiPath, wompiCode, "utf-8");

// 3. Update actions.ts
const actionsPath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/admin/(panel)/pedidos/[id]/actions.ts";
let actionsCode = fs.readFileSync(actionsPath, "utf-8");
actionsCode = actionsCode.replace(
  /mailer\.sendMail\(\{/g,
  `await mailer.sendMail({`
);
fs.writeFileSync(actionsPath, actionsCode, "utf-8");

console.log("Added await to all mailer.sendMail calls");
