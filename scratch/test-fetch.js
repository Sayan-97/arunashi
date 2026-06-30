const url =
  "http://localhost:8000/public/uploads/linesheets/Lotus Flower Diamond Bracelet.pdf";
console.log("Fetching:", url);

fetch(url)
  .then((res) => {
    console.log("Status:", res.status);
    console.log("Headers:", Object.fromEntries(res.headers.entries()));
    return res.text();
  })
  .then((text) => {
    console.log("Body snippet (first 100 chars):", text.substring(0, 100));
  })
  .catch((err) => {
    console.error("Error:", err);
  });
