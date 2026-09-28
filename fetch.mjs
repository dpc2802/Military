async function check() {
  const res = await fetch("https://military-eosin.vercel.app/terminos-y-condiciones");
  const text = await res.text();
  console.log(text.substring(0, 1000));
}
check();
