const fs = require("fs");
const http = require("http");
const { dirname } = require("path");

const replaceTemplate = (template, product) => {
  let output = template;
  output = output.replace(/{%ID%}/g, product.id);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRODUCTNAME%}/g, product.productName);
  product.organic
    ? (output = output.replace(/{%NOT_ORGANIC%}/g, ""))
    : (output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic"));
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  return output;
};

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const productData = JSON.parse(data);

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  // Overview page
  if (pathName === "/" || pathName === "/overview") {
    const cardsHtml = productData
      .map((element) => replaceTemplate(tempCard, element))
      .join("");

    const overview = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(overview);
  } else if (pathName === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(productPage);
  } else if (pathName === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening on port 8000");
});
