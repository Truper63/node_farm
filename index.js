const fs = require('fs');
const http = require('http');
const { dirname } = require('path');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const productData = JSON.parse(data);

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const server = http.createServer((req, res) => {
    const pathName = req.url;
    if (pathName === '/' || pathName === '/overview') {
        const cardHtml = productData.map(element => replaceTemplate(tempCard, element));

        var productCards = '';
        var card = '';
        productData.forEach(element => {
            card = tempCard;
            card.replace('{%ID%}', element.id);
            card.replace('{%IMAGE%}', element.image);
            card.replace('{%PRODUCTNAME%}', element.productName);
            element.organic ? card.replace('{%NOT_ORGANIC%}', 'card__detail--organic') 
                            : card.replace('{%NOT_ORGANIC%}', '');
            card.replace('{%QUANTITY%}', element.quantity);
            card.replace('{%PRICE%}', element.price);
            productCards += card;
        });
        const overview = tempOverview.replace('{%PRODUCT_CARDS%}', productCards);
        res.writeHead(200, {'Content-type': 'text/html'});
        res.end(overview);
    } else if (pathName === '/product') {
        res.writeHead(200, {'Content-type': 'text/html'});
        res.end(productPage);
    } else if (pathName === '/api') {
        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(data);
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening on port 8000');
})