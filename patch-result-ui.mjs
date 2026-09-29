import fs from "fs";
const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/checkout/wompi-result/page.tsx";
let c = fs.readFileSync(p, "utf-8");

// Add state for amountInCents and signature
c = c.replace(
  'const [orderNumber, setOrderNumber] = useState("");',
  'const [orderNumber, setOrderNumber] = useState("");\n  const [retryData, setRetryData] = useState<{ amountInCents: number, signature: string } | null>(null);\n  const [isRetrying, setIsRetrying] = useState(false);'
);

// Capture in fetch
c = c.replace(
  'setOrderNumber(data.orderNumber);',
  'setOrderNumber(data.orderNumber);\n          if (data.amountInCents && data.signature) {\n            setRetryData({ amountInCents: data.amountInCents, signature: data.signature });\n          }'
);

// Add handleRetry function
c = c.replace(
  '  if (status === "loading") {',
  `
  const handleRetryPayment = () => {
    if (!retryData || !orderNumber) return;
    setIsRetrying(true);
    const script = document.createElement("script");
    script.src = "https://checkout.wompi.co/widget.js";
    script.onerror = () => {
      setIsRetrying(false);
      alert("No se pudo cargar la pasarela de pago. Intenta de nuevo.");
    };
    script.onload = () => {
      const checkout = new (window as any).WidgetCheckout({
        currency: "COP",
        amountInCents: retryData.amountInCents,
        reference: orderNumber,
        publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || "pub_test_7ACX50PPzAW8WBB3ZQwqZRO6wMZaxB6R",
        signature: { integrity: retryData.signature }
      });
      checkout.open((wompiResult: any) => {
        setIsRetrying(false);
        if (wompiResult && wompiResult.transaction) {
          window.location.href = \`/checkout/wompi-result?id=\${wompiResult.transaction.id}\`;
        }
      });
    };
    document.body.appendChild(script);
  };

  if (status === "loading") {`
);

// Update button
c = c.replace(
  '<Link\n          href="/checkout"\n          className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent/80 text-black py-3 text-xs font-heading tracking-widest uppercase transition-all"\n        >\n          <RefreshCw className="w-3.5 h-3.5" />\n          INTENTAR NUEVAMENTE\n        </Link>',
  `<button\n          onClick={handleRetryPayment}\n          disabled={isRetrying || !retryData}\n          className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent/80 text-black py-3 text-xs font-heading tracking-widest uppercase transition-all disabled:opacity-50"\n        >\n          <RefreshCw className={\`w-3.5 h-3.5 \${isRetrying ? "animate-spin" : ""}\`} />\n          {isRetrying ? "PROCESANDO..." : "INTENTAR NUEVAMENTE"}\n        </button>`
);

fs.writeFileSync(p, c, "utf-8");
console.log("Patched wompi-result page UI");
