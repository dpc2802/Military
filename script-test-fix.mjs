import fs from "fs";
const testRoutePath = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/api/test-email/route.ts";
let testCode = fs.readFileSync(testRoutePath, "utf-8");
testCode = testCode.replace(/clientHtml = render\(/, "clientHtml = await render(");
testCode = testCode.replace(/adminHtml = render\(/, "adminHtml = await render(");
fs.writeFileSync(testRoutePath, testCode, "utf-8");
console.log("Fixed test route");
