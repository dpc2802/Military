import fs from "fs";
import path from "path";

function listFiles(dir, depth = 0, maxDepth = 4) {
  if (depth > maxDepth) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!fullPath.includes("node_modules") && !fullPath.includes(".next") && !fullPath.includes(".git")) {
        console.log("  ".repeat(depth) + "[DIR] " + file);
        listFiles(fullPath, depth + 1, maxDepth);
      }
    } else {
      console.log("  ".repeat(depth) + file);
    }
  }
}

listFiles("c:/Users/HP Core i5/Desktop/SGB MILITARY");
