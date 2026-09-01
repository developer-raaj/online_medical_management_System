import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  batchNo: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true },
  mrp: { type: Number, required: true },
  costPrice: { type: Number, default: 0 },
  purchaseDate: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  minThreshold: { type: Number, default: 10 },
  status: { type: String, enum: ["Available", "Near Expiry", "Expired", "Not for Sale"], default: "Available" },
  soldHistory: [
    {
      date: { type: Date, default: Date.now },
      quantity: Number
    }
  ]
}, { timestamps: true });

export default mongoose.model("Medicine", medicineSchema);
