import fs from "fs";

const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/(store)/productos/page.tsx";
let code = fs.readFileSync(path, "utf-8");

const oldMeta = `export const metadata: Metadata = {
  title: "Catálogo — Equipo Táctico y Artículos Militares",
  description:
    "Explorá nuestra selección de uniformes tácticos, botas militares, mochilas, accesorios y réplicas para uso civil en Colombia.",
};`;

const newMeta = `export async function generateMetadata({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}): Promise<Metadata> {
  const categoriaSlug = searchParams.categoria ? String(searchParams.categoria) : null;
  
  if (categoriaSlug) {
    const cat = await db.query.categories.findFirst({
      where: eq(categories.slug, categoriaSlug)
    });
    
    if (cat) {
      return {
        title: \`\${cat.name} — Equipo Táctico | SGB Military\`,
        description: cat.description || \`Explora nuestra selección de \${cat.name.toLowerCase()} tácticos y militares en Colombia.\`,
        openGraph: {
          title: \`\${cat.name} — SGB Military\`,
          description: cat.description || \`Encuentra \${cat.name.toLowerCase()} al mejor precio.\`,
        }
      };
    }
  }

  return {
    title: "Catálogo — Equipo Táctico y Artículos Militares | SGB Military",
    description: "Explora nuestra selección de uniformes tácticos, botas militares, mochilas, accesorios y réplicas para uso civil en Colombia.",
    openGraph: {
      title: "Catálogo — SGB Military",
      description: "Equipamiento táctico premium en Colombia.",
    }
  };
}`;

code = code.replace(oldMeta, newMeta);
fs.writeFileSync(path, code, "utf-8");
console.log("Updated catalog metadata");
