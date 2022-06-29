const fs = require("fs");
const http = require("http");
const url = require("url");

const replaceTemplate = require("./modules/replaceTemplate");

const { dirname } = require("path");

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
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    const cardsHtml = productData
      .map((element) => replaceTemplate(tempCard, element))
      .join("");

    const overview = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(overview);
  } else if (pathname === "/product") {
    const product = productData[query.id];
    const productPage = replaceTemplate(tempProduct, product);
    res.writeHead(200, { "Content-type": "text/html" });
    res.end(productPage);
  } else if (pathname === "/api") {
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
