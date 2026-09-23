import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/api/checkout/route.ts";
let content = fs.readFileSync(path, "utf-8");

content = content.replace(
  "wompiCheckoutUrl = `https://checkout.wompi.co/p/?public-key=${publicKey}&currency=COP&amount-in-cents=${amountInCents}&reference=${fullOrder.orderNumber}&redirect-url=${redirectUrl}`;",
  "wompiCheckoutUrl = `https://checkout.wompi.co/p/?public-key=${publicKey}&currency=COP&amount-in-cents=${amountInCents}&reference=${encodeURIComponent(fullOrder.orderNumber)}&redirect-url=${encodeURIComponent(redirectUrl)}`;"
);

fs.writeFileSync(path, content, "utf-8");
console.log("Fixed WAF block issue");
