import fs from "fs";

const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/ProductDetailClient.tsx";
let code = fs.readFileSync(path, "utf-8");

const oldStockWarning = `className={\`text-xs font-heading tracking-widest uppercase \${
                selectedVariant.stock > 5 ? "text-accent" : "text-orange-400"
              }\`}`;
              
const newStockWarning = `className={\`text-xs font-heading tracking-widest uppercase flex items-center gap-2 \${
                selectedVariant.stock > 3 ? "text-accent" : "text-red-500 animate-pulse"
              }\`}`;
              
code = code.replace(oldStockWarning, newStockWarning);

const oldStockText = `{selectedVariant.stock > 5
                ? "EN STOCK"
                : \`Últimas \${selectedVariant.stock} unidades\`}`;

const newStockText = `{selectedVariant.stock > 3
                ? "EN STOCK"
                : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-ping mr-1" />
                    \`¡CUIDADO! SOLO QUEDAN \${selectedVariant.stock} UNIDADES\`
                  </>
                )}`;
code = code.replace(oldStockText, newStockText);

// Also let's add zooming to the main image
// Find "import Image from 'next/image';"
const importImage = `import Image from "next/image";`;
const importZoom = `import Image from "next/image";\nimport Zoom from "react-medium-image-zoom";\nimport "react-medium-image-zoom/dist/styles.css";`;
if (!code.includes("react-medium-image-zoom")) {
  code = code.replace(importImage, importZoom);
}

// Find main image wrapper
const oldMainImage = `<div className="aspect-[4/5] relative bg-[#111] overflow-hidden">
            <Image
              src={mainImage.url}
              alt={mainImage.altText || product.name}
              fill
              priority
              className="object-cover"
            />
          </div>`;
const newMainImage = `<div className="aspect-[4/5] relative bg-[#111] overflow-hidden group">
            <Zoom>
              <div className="aspect-[4/5] relative w-full h-full cursor-zoom-in">
                <Image
                  src={mainImage.url}
                  alt={mainImage.altText || product.name}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </Zoom>
          </div>`;
          
code = code.replace(oldMainImage, newMainImage);

fs.writeFileSync(path, code, "utf-8");
console.log("Updated ProductDetailClient with FOMO and Zoom");
