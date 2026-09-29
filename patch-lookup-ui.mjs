import fs from "fs";
const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/consultar-pedido/page.tsx";
let c = fs.readFileSync(p, "utf-8");

c = c.replace(
  'const [query, setQuery] = useState("");',
  'const [orderNumber, setOrderNumber] = useState("");\n  const [contactInfo, setContactInfo] = useState("");'
);

c = c.replace(
  'if (!query.trim()) return;',
  'if (!orderNumber.trim() || !contactInfo.trim()) {\n      toast.error("Por favor ingresa ambos datos para buscar tu pedido.");\n      return;\n    }'
);

c = c.replace(
  'fetch(`/api/orders/lookup?q=${encodeURIComponent(query)}`)',
  'fetch(`/api/orders/lookup?order=${encodeURIComponent(orderNumber)}&contact=${encodeURIComponent(contactInfo)}`)'
);

const formRegex = /<form onSubmit=\{handleSearch\} className="flex gap-2 mb-8">[\s\S]*?<\/form>/;
const newForm = `<form onSubmit={handleSearch} className="flex flex-col gap-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Ej. SGB-0023"
              className="w-full bg-background border border-white/10 px-4 py-3 text-sm font-body text-white focus:outline-none focus:border-accent transition-colors"
              required
            />
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="Celular o Correo electrónico"
              className="w-full bg-background border border-white/10 px-4 py-3 text-sm font-body text-white focus:outline-none focus:border-accent transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto self-end flex items-center justify-center gap-2 bg-accent hover:bg-accent/80 text-black px-8 py-3 text-xs font-heading tracking-widest uppercase transition-all disabled:opacity-50"
          >
            {loading ? (
              <Package className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Rastrear Pedido
          </button>
        </form>`;
c = c.replace(formRegex, newForm);

fs.writeFileSync(p, c, "utf-8");
console.log("Patched order lookup UI");
