import fs from "fs";

const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/app/robots.ts";

const code = `import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://military-eosin.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/checkout/", "/api/", "/_next/"],
    },
    sitemap: \`\${BASE_URL}/sitemap.xml\`,
  };
}
`;

fs.writeFileSync(path, code, "utf-8");
console.log("Created robots.ts");
