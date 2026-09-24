import fs from "fs";

const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/productos/page.tsx";
let code = fs.readFileSync(path, "utf-8");

const oldHeader = `{/* Encabezado de sección */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl text-foreground tracking-widest">
          CATÁLOGO
        </h1>
        <p className="text-muted-foreground font-body text-sm mt-2">
          Equipo táctico y artículos militares para uso civil en Colombia
        </p>
      </div>`;

const newHeader = `{/* Encabezado de sección */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl md:text-4xl text-foreground tracking-widest uppercase">
          {initialFilters.categoria ? (activeCategories.find(c => c.slug === initialFilters.categoria)?.name || "CATÁLOGO") : "CATÁLOGO"}
        </h1>
        <p className="text-muted-foreground font-body text-sm mt-2">
          {initialFilters.categoria 
            ? (activeCategories.find(c => c.slug === initialFilters.categoria)?.description || \`Explora nuestra selección de \${initialFilters.categoria} tácticos y militares.\`)
            : "Equipo táctico y artículos militares para uso civil en Colombia"}
        </p>
      </div>`;

code = code.replace(oldHeader, newHeader);
fs.writeFileSync(path, code, "utf-8");
console.log("Updated catalog header");
