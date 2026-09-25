require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../src/app");
const Product = require("../src/models/product.model");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/productdb";

jest.setTimeout(30000);

describe("Product CRUD API", () => {
  beforeAll(async () => {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    await Product.deleteMany({});
  });

  afterAll(async () => {
    await Product.deleteMany({});

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  test("should create, read, update and delete a product", async () => {
    const product = {
      pid: "P001",
      pname: "CI Test Product",
      price: 100000,
      quantity: 10,
    };

    // CREATE
    let response = await request(app).post("/api/products").send(product);

    expect(response.status).toBe(201);
    expect(response.body.pid).toBe("P001");

    // GET ALL
    response = await request(app).get("/api/products");

    expect(response.status).toBe(200);
    expect(response.body.some((item) => item.pid === "P001")).toBe(true);

    // GET BY PID
    response = await request(app).get("/api/products/P001");

    expect(response.status).toBe(200);
    expect(response.body.pid).toBe("P001");
    expect(response.body.pname).toBe("CI Test Product");

    // UPDATE
    response = await request(app).put("/api/products/P001").send({
      pname: "CI Updated Product",
      price: 120000,
      quantity: 20,
    });

    expect(response.status).toBe(200);
    expect(response.body.pname).toBe("CI Updated Product");
    expect(response.body.price).toBe(120000);
    expect(response.body.quantity).toBe(20);

    // GET BY PID - kiểm tra sau UPDATE
    response = await request(app).get("/api/products/P001");

    expect(response.status).toBe(200);
    expect(response.body.pname).toBe("CI Updated Product");
    expect(response.body.price).toBe(120000);
    expect(response.body.quantity).toBe(20);

    // DELETE
    response = await request(app).delete("/api/products/P001");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Product deleted successfully");

    // GET BY PID - xác nhận đã xóa
    response = await request(app).get("/api/products/P001");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Product not found");
  });
});
