import fs from "fs";
import path from "path";

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!fullPath.includes("node_modules") && !fullPath.includes(".next") && !fullPath.includes(".git")) {
        searchDir(fullPath);
      }
    } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".ts")) {
      const content = fs.readFileSync(fullPath, "utf-8");
      if (content.includes("Ã")) {
        console.log(`Found in: ${fullPath}`);
      }
    }
  }
}

searchDir("c:/Users/HP Core i5/Desktop/SGB MILITARY");
