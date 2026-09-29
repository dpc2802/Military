import fs from "fs";
const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/Header.tsx";
let c = fs.readFileSync(p, "utf-8");

const oldNavLinks = 'const navLinks = [\n    { href: "/productos", label: "Cat\u00E1logo" },\n    { href: "/productos?categoria=uniformes-ropa-tactica", label: "Ropa" },\n    { href: "/productos?categoria=botas-calzado", label: "Botas" },\n    { href: "/productos?categoria=mochilas-equipaje", label: "Mochilas" },\n    { href: "/productos?categoria=accesorios-tacticos", label: "Accesorios" },\n    { href: "/consultar-pedido", label: "Rastrear Pedido" },\n  ];';

const newNavLinks = 'const navLinks = [\n    { href: "/productos", label: "Cat\u00E1logo" },\n    { href: "/productos?categoria=gorras", label: "Gorras" },\n    { href: "/productos?categoria=pasamontanas", label: "Pasamonta\u00F1as" },\n    { href: "/productos?categoria=accesorios-tacticos", label: "Accesorios" },\n    { href: "/consultar-pedido", label: "Rastrear Pedido" },\n  ];';

if (c.includes('label: "Ropa"')) {
  c = c.replace(oldNavLinks, newNavLinks);
  fs.writeFileSync(p, c, "utf-8");
  console.log("Nav links updated successfully.");
} else {
  console.log("Could not find the exact oldNavLinks block. Checking file manually...");
}
