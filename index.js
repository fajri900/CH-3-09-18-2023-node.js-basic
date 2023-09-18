const fs = require(`fs`);
const http = require(`http`);
const url = require(`url`);

// blocking code execution -> synchronous
// const textIn = fs.readFileSync(`./txt/read-this.txt`, `utf-8`);
// console.log(textIn);

// const textOut = `ini bukan penjelasan tentang cinta : ${textIn}`;
// fs.writeFileSync(`./txt/output-penjelasan.txt`, textOut);
// console.log(`sukses nyetak rasa sakit`);

// non-blocking code execution -> asynchronous
// const test = fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
//   fs.readFile(`./txt/${data}.txt`, "utf-8", (err, data2) => {
//     fs.readFile("./txt/final.txt", "utf-8", (err, data3) => {
//       fs.writeFile("./txt/gabungan2.txt", `${data2}\n${data3}`, (err) => {
//         console.log("sukses menggabungkan");
//       });
//     });
//   });
// });
// console.log("Hi,Fsw 2 nunggu file nya ?");
// console.log(test);

/////////////////////////
//server dengan http
const replaceTemplate = (template, product) => {
  let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, `not-organic`);
  return output;
};

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, `utf-8`);
const dataObj = JSON.parse(data);
const overviewPage = fs.readFileSync(`${__dirname}/templates/overview.html`, `utf-8`);
const productTemplate = fs.readFileSync(`${__dirname}/templates/product.html`, `utf-8`);
const productCardTemplate = fs.readFileSync(`${__dirname}/templates/template-card.html`, `utf-8`);

// =========================================================
const server = http.createServer((req, res) => {
  const { pathname: pathName, query } = url.parse(req.url, true);
  console.log(pathName);
  console.log(query);

  // hello page
  if (pathName === `/hello`) {
    res.end(`ini hello ke fsw 2`);

    // simple api
  } else if (pathName === `/api`) {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);

    // overview page
  } else if (pathName === `/overview`) {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const productCardsHtml = dataObj.map((el) => replaceTemplate(productCardTemplate, el));
    const output = overviewPage.replace("%PRODUCT_CARD%", productCardsHtml);

    res.end(output);

    // product page
  } else if (pathName === `/product`) {
    console.log(query);
    res.writeHead(200, {
      "Content-type": `text/html`,
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(productTemplate, product);
    res.end(output);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end(`<h1>url ini gk ada apa2</h1>`);
  }
});
server.listen(8000, `127.0.0.1`, () => {
  console.log(`hello server jalan`);
});
