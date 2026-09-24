import fs from "fs";

const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/next.config.mjs";
let code = fs.readFileSync(path, "utf-8");

const headersBlock = `
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' }
        ],
      },
    ];
  },
`;

if (!code.includes("async headers()")) {
  code = code.replace(/const nextConfig = \{/, `const nextConfig = {${headersBlock}`);
  fs.writeFileSync(path, code, "utf-8");
  console.log("Added security headers");
} else {
  console.log("Headers already exist");
}
