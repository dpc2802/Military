import fs from "fs";

function replaceAwaits(path) {
  let code = fs.readFileSync(path, "utf-8");
  code = code.replace(/const (\w+)Html = render\(/g, "const $1Html = await render(");
  code = code.replace(/const html = render\(/g, "const html = await render(");
  code = code.replace(/const emailHtml = render\(/g, "const emailHtml = await render(");
  fs.writeFileSync(path, code, "utf-8");
}

replaceAwaits("c:/Users/HP Core i5/Desktop/SGB MILITARY/app/api/checkout/route.ts");
replaceAwaits("c:/Users/HP Core i5/Desktop/SGB MILITARY/app/api/checkout/wompi-verify/route.ts");
replaceAwaits("c:/Users/HP Core i5/Desktop/SGB MILITARY/app/admin/(panel)/pedidos/[id]/actions.ts");

console.log("Added await to all render() calls");
