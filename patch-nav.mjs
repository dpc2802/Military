import fs from "fs";
const p = "c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/Header.tsx";
let c = fs.readFileSync(p, "utf-8");

if (!c.includes('href: "/consultar-pedido"')) {
  c = c.replace(
    'const navLinks = [\n    { href: "/productos", label: "Cat\u00E1logo" },\n    { href: "/productos?categoria=uniformes-ropa-tactica", label: "Ropa" },\n    { href: "/productos?categoria=botas-calzado", label: "Botas" },\n    { href: "/productos?categoria=mochilas-equipaje", label: "Mochilas" },\n    { href: "/productos?categoria=accesorios-tacticos", label: "Accesorios" },\n  ];',
    'const navLinks = [\n    { href: "/productos", label: "Cat\u00E1logo" },\n    { href: "/productos?categoria=uniformes-ropa-tactica", label: "Ropa" },\n    { href: "/productos?categoria=botas-calzado", label: "Botas" },\n    { href: "/productos?categoria=mochilas-equipaje", label: "Mochilas" },\n    { href: "/productos?categoria=accesorios-tacticos", label: "Accesorios" },\n    { href: "/consultar-pedido", label: "Rastrear Pedido" },\n  ];'
  );
  fs.writeFileSync(p, c, "utf-8");
  console.log("Added Consultar Pedido to Nav");
}
