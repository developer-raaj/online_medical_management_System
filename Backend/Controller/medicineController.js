import Medicine from "../Model/Medicine.js";
import Sale from "../Model/Sale.js";
import moment from "moment";

// Add new medicine
export const addMedicine = async (req, res) => {
  try {
    const medicine = new Medicine(req.body);
    await medicine.save();
    res.status(201).json({ message: "Medicine added successfully", medicine });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all medicines
export const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update stock
export const updateStock = async (req, res) => {
  try {
    const { batchNo, soldQuantity } = req.body;
    const medicine = await Medicine.findOne({ batchNo });
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    const qty = Number(soldQuantity);
    if (qty <= 0) return res.status(400).json({ message: "Invalid sold quantity" });

    medicine.quantity -= qty;
    medicine.soldHistory.push({ date: new Date(), quantity: qty });
    if (medicine.quantity < medicine.minThreshold) {
      console.log(`⚠️ Low stock alert: ${medicine.name} (Batch: ${medicine.batchNo})`);
    }

    await medicine.save();
    res.json({ message: "Stock updated", medicine });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Check expiry
export const checkExpiry = async (req, res) => {
  try {
    const today = moment().startOf('day');
    const medicines = await Medicine.find();

    const nearExpiry = [];
    const expired = [];

    for (let med of medicines) {
      const expiry = moment(med.expiryDate).startOf('day');
      const daysToExpire = expiry.diff(today, "days");

      if (daysToExpire < 0) {
        med.status = "Expired";
        expired.push(med);
      } else if (daysToExpire <= 30) {
        med.status = "Near Expiry";
        nearExpiry.push(med);
      } else {
        med.status = "Available";
      }

      await med.save();
    }

    res.json({ nearExpiry, expired });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get reports
export const getReports = async (req, res) => {
  try {
    const currentStock = await Medicine.find({ status: "Available" });
    const nearExpiry = await Medicine.find({ status: "Near Expiry" });
    const expired = await Medicine.find({ status: "Expired" });

    const allMedicines = await Medicine.find();
    const purchaseHistory = allMedicines.map(med => ({
      name: med.name,
      batchNo: med.batchNo,
      purchaseDate: med.purchaseDate,
      quantity: med.quantity,
      expiryDate: med.expiryDate
    }));
    const salesHistory = allMedicines.flatMap(med =>
      med.soldHistory.map(sale => ({
        name: med.name,
        batchNo: med.batchNo,
        date: sale.date,
        quantity: sale.quantity
      }))
    );
    const expiryHistory = allMedicines.filter(med => med.status === "Expired").map(med => ({
      name: med.name,
      batchNo: med.batchNo,
      expiryDate: med.expiryDate,
      quantity: med.quantity
    }));

    res.json({
      stockReport: currentStock,
      expiryReport: { nearExpiry, expired },
      historyReport: {
        purchases: purchaseHistory,
        sales: salesHistory,
        expiries: expiryHistory
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get medicine info by batch number
export const getMedicineByBatch = async (req, res) => {
  try {
    const { batchNo } = req.params;
    const medicine = await Medicine.findOne({ batchNo });
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    res.json({
      name: medicine.name,
      purchaseDate: medicine.purchaseDate,
      expiryDate: medicine.expiryDate,
      quantity: medicine.quantity
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
//admin
// Delete medicine
export const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findByIdAndDelete(id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    res.json({ message: "Medicine deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update medicine details
export const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMedicine = await Medicine.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedMedicine) return res.status(404).json({ message: "Medicine not found" });

    res.json({ message: "Medicine updated successfully", medicine: updatedMedicine });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

