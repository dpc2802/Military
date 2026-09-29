const url = "https://military-eosin.vercel.app/api/products";
fetch(url)
.then(res => res.json())
.then(data => {
  console.log(data[0].id, data[0].name, data[0].variants[0]);
})
.catch(console.error);
