const http = require("http");
const fs = require("fs");
const finalHandler = require("finalhandler");
const queryString = require("querystring");
const Router = require("router");
const bodyParser = require("body-parser");
const serveStatic = require("serve-static");
const uid = require("rand-token").uid;
const url = require("url");
const { findObject } = require("./utils");

const API_KEYS = [
  "88312679-04c9-4351-85ce-3ed75293b449",
  "1a5c45d3-8ce7-44da-9e78-02fb3c1a71b7"
];
const TOKEN_VALIDITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "Origin, X-Requested-With, Content-Type, Accept, X-Authentication"
};

const PORT = process.env.PORT || 8080;

//globals
let brands = [];
let products = [];
let users = [];

//user
let accessTokens = [];
let failedLoginAttempts = {};

//helper functions
const getUserFailedLogin = username => {
  const failedReq = failedLoginAttempts[username];
  return failedReq ? failedReq : 0;
};

const setUserFailedLogin = (username, numFails) => {
  failedLoginAttempts[username] = numFails;
};
//process access token
const getValidTokenFromReq = req => {
  const parsedUrl = url.parse(req.url, true);
  if (parsedUrl.query.accessToken) {
    const currentToken = accessTokens.find(
      ({ token, lastUpdated }) =>
        token === parsedUrl.query.accessToken &&
        new Date() - lastUpdated < TOKEN_VALIDITY_TIMEOUT
    );
    return currentToken ? currentToken : null;
  }
  return null;
};

//setup router
const router = Router();

//middleware
router.use(bodyParser.json());

const server = http
  .createServer((req, res) => {
    if (req.method === "OPTIONS") {
      response.writeHead(200, CORS_HEADERS);
      response.end();
    }
    //  res.writeHead(200, { ...CORS_HEADERS, "Content-Type": "application/json" });
    if (!API_KEYS.includes(req.headers["x-authentication"])) {
      response.writeHead(
        401,
        "You need to have a valid API key to use this API",
        CORS_HEADERS
      );
      response.end();
    }
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

//POST /api/login (login user)
router.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username && password && getUserFailedLogin[username] < 3) {
    const user = users.find(({ login }) => {
      login.username === username && login.password === password;
    });
    if (!user) {
      const loginAttempts = getUserFailedLogin(username);
      setUserFailedLogin(username, loginAttempts++);
      res.writeHead(401, "Invalid username or password");
      res.end();
    }
    //if user found, reset attempts
    setUserFailedLogin(username, 0);
    res.writeHead(200, { ...CORS_HEADERS, "Content-Type": "application/json" });

    //check for existing token
    const currentToken = accessTokens.find(({ username }) => {
      username === user.login.username;
    });

    if (currentToken) {
      currentToken.lastUpdated = new Date();
      res.end(JSON.stringify(currentToken.token));
    } else {
      const newToken = {
        username: user.login.username,
        lastUpdated: new Date(),
        token: uid(16)
      };
      accessTokens.push(newToken);
      res.end(JSON.stringify(newToken.token));
    }
  } else {
    res.writeHead(400, "Incorrectly formatted response");
    res.end();
  }
});

//GET /api/brands (all brands) -- PUBLIC
router.get("/api/brands", (req, res) => {
  if (!brands) {
    res.writeHead(404, "There aren't any brands");
    return res.end();
  }
  res.writeHead(200, { ...CORS_HEADERS, "Content-Type": "application/json" });
  res.end(JSON.stringify(brands));
});

//GET /api/products/:id (specific product)
router.get("/api/products/:id", (req, res) => {
  fs.readFile("initial-data/products.json", "utf-8", (err, data) => {
    if (err) throw err;
    const { id } = req.params;
    if (!products[id]) {
      res.writeHead(404, "That product does not exist!");
      return res.end();
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(products[id]));
  });
});

//GET /api/products (all products)
router.get("/api/products", (req, res) => {
  if (!products) {
    res.writeHead(404, "There aren't any products to display");
    res.end();
  }
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(products));
});

//GET /api/brands/:id/products (specific category/brand of product)
router.get("/api/brands/:id/products", (req, res) => {
  const { id } = req.params;
  const relatedProducts = products.filter(product => product.categoryId === id);
  if (!relatedProducts) {
    res.writeHead(404, "No products found for your given search");
    res.end();
  }
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(relatedProducts));
});

module.exports = server;
