const chai = require("chai");
const chaiHTTP = require("chai-http");
const server = require("../app/server");
const expect = chai.expect;
const assert = chai.assert;

chai.use(chaiHTTP);

//GET BRANDS
describe("/GET brands", () => {
  it.only("should GET all brands", done => {
    chai
      .request(server)
      .get("/api/brands")
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(res).to.have.status(200);
        expect("Content-Type", "application/json");
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.lengthOf(5);
        done();
      });
  });
  it.only("should limit results to those with a query string", done => {
    chai
      .request(server)
      .get("/api/brands?query=Ray")
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect("Content-Type", "application/json");
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.lengthOf(1);
        done();
      });
  });
  it.only("returns all brands if query is missing", done => {
    chai
      .request(server)
      //property doesn't exist
      .get("/api/brands?query=")
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect("Content-Type", "application/json");
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.lengthOf(5);
        done();
      });
  });
});

//GET PRODUCTS
describe("/GET products", () => {
  it.only("should GET all products", done => {
    chai
      .request(server)
      .get("/api/products")
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(res).to.have.status(200);
        expect("Content-Type", "application/json");
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.lengthOf(11);
        done();
      });
  });
  it.only("should limit results to those with a query string", done => {
    chai
      .request(server)
      .get("/api/products?query=normal")
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect("Content-Type", "application/json");
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.lengthOf(1);
        done();
      });
  });
  it.only("returns all brands if query is missing", done => {
    chai
      .request(server)
      //property doesn't exist
      .get("/api/products?query=")
      .end((err, res) => {
        assert.isNotNull(res.body);
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect("Content-Type", "application/json");
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.lengthOf(11);
        done();
      });
  });
});

//GET /api/products/:id (specific product)
describe("/GET specific product", () => {
  it.only("should GET 1 product", done => {
    chai
      .request(server)
      .get("/api/products/1")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect("Content-Type", "application/json");
        expect(res.body).to.have.keys([
          "id",
          "categoryId",
          "name",
          "description",
          "price",
          "imageUrls"
        ]);
        expect(res.body)
          .to.have.property("id")
          .that.is.a("string");
        expect(res.body)
          .to.have.property("categoryId")
          .that.is.a("string");
        expect(res.body)
          .to.have.property("name")
          .that.is.a("string");
        expect(res.body)
          .to.have.property("description")
          .that.is.a("string");
        expect(res.body)
          .to.have.property("price")
          .that.is.a("number");
        expect(res.body)
          .to.have.property("imageUrls")
          .that.is.an("array")
          .with.lengthOf(3);
        done();
      });
  });
});

//GET /api/brands/:id/products (specific category/brand of product)
describe("/GET specific category of product", () => {
  it.only("should GET 1 specific product category", done => {
    chai
      .request(server)
      .get("/api/brands/:id/products")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect("Content-Type", "application/json");
        expect(res.body).to.be.an("array");
        done();
      });
  });
});

describe("/POST login user", () => {
  it.only("should login the user", done => {
    chai
      .request(server)
      .post("/api/login")
      .end((err, res) => {
        assert.isNull(err);
        expect(res).to.have.status(200);
        expect(res.body).to.be.lengthOf(16);
        expect(res.body).to.be.a("string");
        done();
      });
  });
});
