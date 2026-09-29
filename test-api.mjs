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
  paymentMethod: "wompi",
  items: [
    {
      variantId: 1, // hope variant 1 exists
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
.then(res => res.json().then(data => ({ status: res.status, data })))
.then(console.log)
.catch(console.error);
