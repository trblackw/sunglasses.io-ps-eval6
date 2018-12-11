const http = require("http");
const fs = require("fs");
const finalHandler = require("finalhandler");
const queryString = require("querystring");
const Router = require("router");
const bodyParser = require("body-parser");
const serveStatic = require("serve-static");
const uid = require("rand-token").uid;

// const serve = serveStatic("public/ftp", { index: ["index.html", "index.htm"] });

const PORT = process.env.PORT || 8080;

//globals
let brands = [];
let products = [];
let users = [];

//setup router
const router = Router();

//middleware
router.use(bodyParser.json());

const server = http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    router(req, res, finalHandler(req, res));
  })
  .listen(PORT, err => {
    if (err) throw err;
    console.log(`server runnin on port ${PORT}`);
    //populate brands
    fs.readFile("initial-data/brands.json", "utf-8", (err, data) => {
      if (err) throw err;
      brands = JSON.parse(data);
    });
    //populate products
    fs.readFile("initial-data/products.json", "utf-8", (err, data) => {
      if (err) throw err;
      products = JSON.parse(data);
    });
  });

// router.get("/", (req, res) => {
//   res.sendFile("index.html");
// });

//TODO ROUTES:
//GET /api/brands (all brands)
router.get("/api/brands", (req, res) => {
  res.end(JSON.stringify(brands));
});

//GET /api/products/:id (specific product)
router.get("/api/products/:id", (req, res) => {
  fs.readFile("initial-data/products.json", "utf-8", (err, data) => {
    if (err) throw err;
    const { id } = req.params;
    res.end(JSON.stringify(products[id]));
  });
});

//GET /api/products (all products)
router.get("/api/products", (req, res) => {
  res.end(JSON.stringify(products));
});

//GET /api/brands/:id/products (specific category/brand of product)
router.get("/api/brands/:id/products", (req, res) => {
  const { id } = req.params;
  const relatedProducts = products.filter(product => product.categoryId === id);
  res.end(JSON.stringify(relatedProducts));
});

//POST /api/login (login user)
router.post("/api/login", (req, res) => {});

module.exports = server;
