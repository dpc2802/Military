import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/CatalogClient.tsx";
let code = fs.readFileSync(path, "utf-8");

const useEffectToAdd = `
  // Sincronizar búsqueda global desde la URL
  const searchParams = useSearchParams();
  useEffect(() => {
    const q = searchParams.get("busqueda");
    if (q !== null && q !== busqueda) {
      setBusqueda(q);
    }
  }, [searchParams]);
`;

code = code.replace(/const \[busqueda\, setBusqueda\] = useState\(initialFilters\.busqueda\);/, `const [busqueda, setBusqueda] = useState(initialFilters.busqueda);${useEffectToAdd}`);

fs.writeFileSync(path, code, "utf-8");
console.log("Fixed CatalogClient search sync");
