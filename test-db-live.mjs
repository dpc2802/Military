import { neon } from "@neondatabase/serverless";

const sql = neon("postgresql://neondb_owner:npg_Q5LcKC9DkyAU@ep-hidden-surf-b4knv0ue-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require");

async function run() {
  const rows = await sql`
    SELECT pv.id as variant_id, p.id as product_id, p.name, p.slug, p.price, pv.stock, pv.reserved_stock
    FROM product_variants pv
    JOIN products p ON pv.product_id = p.id
    WHERE pv.is_active = true AND p.is_active = true AND (pv.stock - pv.reserved_stock) > 0
    LIMIT 1;
  `;
  
  if (rows.length === 0) {
    console.log("No valid variants found");
    process.exit(1);
  }

  const v = rows[0];
  console.log("Found variant:", v);

  const payload = {
    customerEmail: "test@test.com",
    customerName: "Juan Test",
    customerDni: "1010123456",
    customerPhone: "3001234567",
    customerDepartment: "Antioquia",
    customerCity: "Medellin",
    customerAddress: "Calle falsa 123",
    acceptTerms: true,
    paymentMethod: "whatsapp",
    items: [
      {
        variantId: v.variant_id, 
        productId: v.product_id,
        productName: v.name,
        productSlug: v.slug,
        quantity: 1,
        unitPrice: Number(v.price)
      }
    ]
  };

  const fetchRes = await fetch("https://military-eosin.vercel.app/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const text = await fetchRes.text();
  console.log("Response Status:", fetchRes.status);
  console.log("Response Body:", text);
  process.exit(0);
}

run();
