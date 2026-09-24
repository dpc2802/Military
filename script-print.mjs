import fs from "fs";
const content = fs.readFileSync("c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/CatalogClient.tsx", "utf-8");
const match = content.match(/const applyFiltersAndFetch = useCallback\([\s\S]*?\}\, \[[^\]]*\]\);/);
if (match) console.log(match[0]);
