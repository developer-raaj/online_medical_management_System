import Medicine from "../Model/Medicine.js";
import Sale from "../Model/Sale.js";
import moment from "moment";

// Record a sale
export const addSale = async (req, res) => {
  try {
    const { batchNo, quantity, customerName } = req.body; // ✅ include customerName
    const soldQty = Number(quantity);

    const medicine = await Medicine.findOne({ batchNo });
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });
    if (medicine.quantity < soldQty) return res.status(400).json({ message: "Not enough stock available" });

    // Update medicine stock
    medicine.quantity -= soldQty;
    medicine.soldHistory.push({ date: new Date(), quantity: soldQty });
    await medicine.save();

    // Save sale in Sale collection
    const sale = new Sale({
      medicineId: medicine._id,
      medicineName: medicine.name,
      batchNo: medicine.batchNo,
      quantity: soldQty,
      mrp: medicine.mrp,
      costPrice: medicine.costPrice || 0,
      customerName, //  now this works
    });

    await sale.save();
    res.status(201).json({ message: "Sale recorded", medicine, sale });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sales analytics
export const getSalesAnalytics = async (req, res) => {
  try {
    const { timeFrame } = req.query;
    const today = moment();
    let startDate = new Date(0);

    if (timeFrame === "Monthly") startDate = today.startOf("month").toDate();
    else if (timeFrame === "Yearly") startDate = today.startOf("year").toDate();

    const sales = await Sale.find({ saleDate: { $gte: startDate } });

    const analytics = {};
    sales.forEach(sale => {
      if (!analytics[sale.medicineName]) analytics[sale.medicineName] = { totalSold: 0, totalRevenue: 0, totalCost: 0, totalProfit: 0 };

      analytics[sale.medicineName].totalSold += sale.quantity;
      analytics[sale.medicineName].totalRevenue += sale.quantity * sale.mrp;
      analytics[sale.medicineName].totalCost += sale.quantity * sale.costPrice;
      analytics[sale.medicineName].totalProfit += sale.quantity * (sale.mrp - sale.costPrice);
    });

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Get all customer-wise sales
export const getCustomerSales = async (req, res) => {
  try {
    // Fetch all sales, sorted by customer and sale date
    const sales = await Sale.find().sort({ customerName: 1, saleDate: -1 });

    // Group by customer
    const customerSales = {};
    sales.forEach(sale => {
      if (!customerSales[sale.customerName]) customerSales[sale.customerName] = [];
      customerSales[sale.customerName].push({
        medicineName: sale.medicineName,
        batchNo: sale.batchNo,
        quantity: sale.quantity,
        mrp: sale.mrp,
        total: sale.quantity * sale.mrp,
        saleDate: sale.saleDate
      });
    });

    res.json(customerSales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
