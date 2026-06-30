const url =
  "http://localhost:3000/api/download?url=%2Fpublic%2Fuploads%2Flinesheets%2FLotus%20Flower%20Diamond%20Bracelet.pdf";
console.log("Fetching from Next.js download API:", url);

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
