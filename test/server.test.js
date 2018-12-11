const chai = require("chai");
const chaiHTTP = require("chai-http");
const server = require("../app/server");
const expect = chai.expect;

chai.use(chaiHTTP);
//GET BRANDS
describe("/GET brands", () => {
  it.only("should GET all brands", done => {
    chai
      .request(server)
      .get("/api/brands")
      .end((err, res) => {
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
        expect(res).to.have.status(200);
        expect("Content-Type", "application/json");
        expect(res.body).to.be.an("array");
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