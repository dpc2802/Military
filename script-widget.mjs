import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/checkout/page.tsx";
let content = fs.readFileSync(path, "utf-8");

const widgetLogic = `
        if (result.wompiCheckoutUrl) {
          // Cargamos el script de Wompi dinámicamente y usamos el Widget Programático
          const script = document.createElement("script");
          script.src = "https://checkout.wompi.co/widget.js";
          script.onload = () => {
            const checkout = new (window as any).WidgetCheckout({
              currency: "COP",
              amountInCents: result.amountInCents,
              reference: result.orderNumber,
              publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || "pub_test_7ACX50PPzAW8WBB3ZQwqZRO6wMZaxB6R",
              redirectUrl: \`\${window.location.origin}/checkout/wompi-result\`
            });
            checkout.open((wompiResult: any) => {
              // Si el usuario cierra el modal, wompiResult es null o undefined, o transaction status
              if (wompiResult && wompiResult.transaction) {
                 window.location.href = \`/checkout/wompi-result?id=\${wompiResult.transaction.id}\`;
              } else {
                 setIsSubmitting(false);
              }
            });
          };
          document.body.appendChild(script);
        } else {
`;

content = content.replace(
  "if (result.wompiCheckoutUrl) {\n          window.location.href = result.wompiCheckoutUrl;\n        } else {",
  widgetLogic
);

fs.writeFileSync(path, content, "utf-8");
console.log("Updated to Wompi Widget");
