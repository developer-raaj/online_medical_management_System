import request from "supertest";
import mongoose from "mongoose";
import app from "../../server.js";
import User from "../../Model/Signup.js";
import Medicine from "../../Model/Medicine.js";
import Sale from "../../Model/Sale.js";

describe("Auth & Medical API + Model Tests", () => {
  let token;
  let userId;
  let medicineId;
  let batchNo = "BATCH123";

  // -------------------- SETUP --------------------
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);

    // Clean previous test users, medicines, and sales
    await User.deleteMany({ username: { $in: ["meduser", "testuser"] } });
    await Medicine.deleteMany({ batchNo });
    await Sale.deleteMany({});

    // Create a test user for API
    const testUser = await User.create({
      name: "Med User",
      email: "meduser@example.com",
      username: "meduser",
      password: "123456",
    });
    userId = testUser._id;

    // Login test user to get token
    const res = await request(app)
      .post("/api/medicines/login")
      .send({ username: "meduser", password: "123456" });

    token = res.body.token;
  });

  afterAll(async () => {
    await User.deleteMany({ username: { $in: ["meduser", "testuser"] } });
    await Medicine.deleteMany({ batchNo });
    await Sale.deleteMany({});
    await mongoose.connection.close();
  });

  // -------------------- AUTH TESTS --------------------
  describe("Auth API", () => {
    it("POST /signup => fail if user exists", async () => {
      const res = await request(app)
        .post("/api/medicines/signup")
        .send({
          name: "Med User",
          email: "meduser@example.com",
          username: "meduser",
          password: "123456",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("User already exists");
    });

    it("POST /login => login existing user", async () => {
      const res = await request(app)
        .post("/api/medicines/login")
        .send({ username: "meduser", password: "123456" });

      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
    });
  });

  // -------------------- MEDICINE MODEL TESTS --------------------
  describe("Medicine Model Test", () => {
    it("should create a medicine successfully", async () => {
      const medicine = await Medicine.create({
        name: "Paracetamol",
        batchNo,
        quantity: 100,
        mrp: 10,
        costPrice: 5,
        purchaseDate: new Date(),
        expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      });

      expect(medicine._id).toBeDefined();
      expect(medicine.name).toBe("Paracetamol");
      expect(medicine.batchNo).toBe(batchNo);

      medicineId = medicine._id;
    });

    it("should fail if name is missing", async () => {
      let error;
      try {
        await Medicine.create({ batchNo: "BATCHX", quantity: 10, mrp: 5 });
      } catch (err) {
        error = err;
      }
      expect(error).toBeDefined();
      expect(error.errors.name).toBeDefined();
    });

    it("should use default values if not provided", async () => {
      const medicine = await Medicine.create({
        name: "DefaultMed",
        batchNo: "BATCHDEFAULT",
        quantity: 20,
        mrp: 15,
        purchaseDate: new Date(),
        expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180),
      });

      expect(medicine.minThreshold).toBe(10);
      expect(medicine.status).toBe("Available");
    });
  });

  // -------------------- MEDICINE API TESTS --------------------
  describe("Medicine API", () => {
    it("POST /add => create medicine via API", async () => {
      const res = await request(app)
        .post("/api/medicines/add")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Ibuprofen",
          batchNo: "BATCH456",
          quantity: 50,
          mrp: 20,
          costPrice: 10,
          purchaseDate: new Date(),
          expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 200),
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.medicine._id).toBeDefined();
    });

    it("GET / => get all medicines", async () => {
      const res = await request(app)
        .get("/api/medicines/")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it("PUT /update/:id => update medicine details", async () => {
      const res = await request(app)
        .put(`/api/medicines/update/${medicineId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Paracetamol 500mg" });

      expect(res.statusCode).toBe(200);
      expect(res.body.medicine.name).toBe("Paracetamol 500mg");
    });

    it("DELETE /delete/:id => delete medicine", async () => {
      const res = await request(app)
        .delete(`/api/medicines/delete/${medicineId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Medicine deleted successfully");
    });
  });

  // -------------------- SALES API TESTS --------------------
  describe("Sales API", () => {
    it("POST /add-sales => record a sale", async () => {
      // Create a medicine to sell
      const med = await Medicine.create({
        name: "Amoxicillin",
        batchNo: "BATCH789",
        quantity: 100,
        mrp: 15,
        costPrice: 7,
        purchaseDate: new Date(),
        expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      });

      const res = await request(app)
        .post("/api/medicines/add-sales")
        .set("Authorization", `Bearer ${token}`)
        .send({
          batchNo: med.batchNo,
          quantity: 10,
          customerName: "John Doe",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.sale._id).toBeDefined();
      expect(res.body.medicine.quantity).toBe(90);
    });

    it("GET /customer-sales => get all customer-wise sales", async () => {
      const res = await request(app)
        .get("/api/medicines/customer-sales")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body["John Doe"]).toBeDefined();
      expect(res.body["John Doe"][0].medicineName).toBe("Amoxicillin");
    });
  });
});
