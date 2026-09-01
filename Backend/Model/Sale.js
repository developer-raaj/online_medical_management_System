import mongoose from "mongoose";

const saleSchema = new mongoose.Schema({
  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", required: true },
  medicineName: { type: String, required: true },
  batchNo: { type: String, required: true },
  quantity: { type: Number, required: true },
  saleDate: { type: Date, default: Date.now },
  mrp: { type: Number, required: true },
  costPrice: { type: Number, required: true },
   customerName: { type: String, required: true }, // ✅ added
}, { timestamps: true });

export default mongoose.model("Sale", saleSchema);
