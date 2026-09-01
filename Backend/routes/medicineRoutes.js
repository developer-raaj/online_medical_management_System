import express from "express";
import {
  addMedicine,
  getMedicines,
  updateStock,
  checkExpiry,
  getReports,
  getMedicineByBatch,
  updateMedicine,
  deleteMedicine
} from "../Controller/medicineController.js";

import { addSale, getCustomerSales, getSalesAnalytics } from "../Controller/salesController.js";
import { authenticateUser } from "../Middleware/authentication.js";
import { loginUser, Signup } from "../Controller/authController.js";



const router = express.Router();


router.post("/signup", Signup);


router.post("/login", loginUser);


router.post("/add", addMedicine);
router.get("/", getMedicines);
router.put("/update-stock", updateStock);
router.get("/check-expiry", checkExpiry);
router.get("/reports", getReports);
router.get("/medicine-info/:batchNo", getMedicineByBatch);

router.post("/add-sales", addSale);
router.get("/analytics", getSalesAnalytics);


router.put("/update/:id", updateMedicine);
router.delete("/delete/:id", deleteMedicine);

// Route to get all customer-wise sales
router.get("/customer-sales", getCustomerSales);



export default router;
