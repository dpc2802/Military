import fs from "fs";
const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/CatalogClient.tsx";
let code = fs.readFileSync(path, "utf-8");

// We only need to remove the SECOND declaration
// Let's replace the block we added
const badBlock = `const [busqueda, setBusqueda] = useState(initialFilters.busqueda);
  // Sincronizar búsqueda global desde la URL
  const searchParams = useSearchParams();
  useEffect(() => {
    const q = searchParams.get("busqueda");`;

const goodBlock = `const [busqueda, setBusqueda] = useState(initialFilters.busqueda);
  // Sincronizar búsqueda global desde la URL
  useEffect(() => {
    const q = searchParams.get("busqueda");`;

code = code.replace(badBlock, goodBlock);

fs.writeFileSync(path, code, "utf-8");
console.log("Fixed searchParams redefinition");
