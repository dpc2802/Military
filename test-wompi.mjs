const https = require("https");
https.get("https://docs.wompi.co/docs/es-co/web-checkout/", (res) => {
  let data = "";
  res.on("data", chunk => data += chunk);
  res.on("end", () => console.log(data.substring(0, 1000)));
});
