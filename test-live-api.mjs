const url = "https://military-eosin.vercel.app/api/checkout";
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
      variantId: 1, 
      productId: 1,
      productName: "Test",
      productSlug: "test",
      quantity: 1,
      unitPrice: 50000
    }
  ]
};

fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload)
})
.then(async res => {
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Body:", text);
})
.catch(console.error);
