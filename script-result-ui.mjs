import fs from "fs";

const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/checkout/wompi-result/page.tsx";
let code = fs.readFileSync(path, "utf-8");

// Change status union
code = code.replace(
  /const \[status, setStatus\] = useState<\s*"loading"\s*\|\s*"approved"\s*\|\s*"declined"\s*\|\s*"error"\s*>\("loading"\);/,
  `const [status, setStatus] = useState<"loading" | "approved" | "declined" | "error" | "pending">("loading");`
);

// Update fetch
const oldFetch = `if (data.status === "APPROVED") setStatus("approved");
          else if (data.status === "DECLINED" || data.status === "VOIDED" || data.status === "ERROR") setStatus("declined");
          else setStatus("loading");`;
const newFetch = `if (data.status === "APPROVED") setStatus("approved");
          else if (data.status === "DECLINED" || data.status === "VOIDED" || data.status === "ERROR") setStatus("declined");
          else if (data.status === "PENDING") setStatus("pending");
          else setStatus("loading");`;
code = code.replace(oldFetch, newFetch);

// Add Pending UI below approved block
const pendingUI = `  if (status === "pending") {
    return (
      <div className="flex flex-col items-center gap-8 w-full">
        {/* Pending Icon */}
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-[#332511] border border-[#a67c00]/40 flex items-center justify-center">
            <RefreshCw className="w-10 h-10 text-[#f5b800] animate-spin" />
          </div>
          <div className="absolute inset-0 rounded-full bg-[#a67c00]/20 blur-xl scale-150 animate-pulse" />
        </div>

        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-[#f5b800] mb-2">
            <div className="h-px w-12 bg-[#f5b800]/40" />
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase">Transacción en Proceso</span>
            <div className="h-px w-12 bg-[#f5b800]/40" />
          </div>

          <h1 className="font-heading text-4xl md:text-5xl text-white tracking-widest uppercase leading-tight">
            Pago<br />
            <span className="text-[#f5b800]">Pendiente</span>
          </h1>

          <p className="text-[#8A8A84] font-body text-sm max-w-xs mx-auto leading-relaxed">
            Tu banco está procesando el pago. Recibirás un correo de confirmación en cuanto se apruebe. No necesitas hacer el pago de nuevo.
          </p>
        </div>

        {orderNumber && (
          <div className="bg-[#141414] border border-white/10 px-8 py-4 text-center w-full max-w-xs">
            <p className="font-mono text-[9px] tracking-[0.4em] text-accent uppercase mb-1">Número de Pedido</p>
            <p className="font-heading text-2xl text-white tracking-widest">{orderNumber}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 flex items-center justify-center gap-2 bg-[#f5b800] hover:bg-[#d69f00] text-black py-3 text-xs font-heading tracking-widest uppercase transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            ACTUALIZAR ESTADO
          </button>
          <Link
            href="/productos"
            className="flex-1 flex items-center justify-center border border-white/20 hover:border-white/40 text-white py-3 text-xs font-heading tracking-widest uppercase transition-all"
          >
            IR A LA TIENDA
          </Link>
        </div>
      </div>
    );
  }
`;

code = code.replace(/if \(status === "error"\) \{/g, pendingUI + "\n  if (status === \"error\") {");
// Wait, the original code had: "if (status === "approved") { ... } return ( div for declined/error )"
// Let's replace the top of the declined/error return
code = code.replace(/return \(\s*<div className="flex flex-col items-center gap-8 w-full">\s*{\/\* Animated X \*\/}/, pendingUI + '\n  return (\n    <div className="flex flex-col items-center gap-8 w-full">\n      {/* Animated X */}');


fs.writeFileSync(path, code, "utf-8");
console.log("Updated result UI");
