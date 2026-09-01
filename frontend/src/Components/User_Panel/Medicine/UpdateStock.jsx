import React, { useState } from "react";
import API from "../Api/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Commet } from "react-loading-indicators"; //  Loader import
import "./UpdateStock.css";

function UpdateStock() {
  const [customerName, setCustomerName] = useState("");
  const [batchNo, setBatchNo] = useState("");
  const [soldQuantity, setSoldQuantity] = useState("");
  const [mrp, setMrp] = useState("");
  const [loading, setLoading] = useState(false); //  Loading state

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!mrp || Number(mrp) <= 0) {
      toast.error("❌ Please enter a valid MRP");
      return;
    }

    if (!customerName.trim()) {
      toast.error("❌ Please enter customer name");
      return;
    }

    setLoading(true); // Start loader

    const printWin = window.open("", "_blank", "width=600,height=700");
    if (!printWin) {
      toast.error("❌ Popup blocked! Allow popups for this site.");
      setLoading(false);
      return;
    }

    try {
      await API.post("/add-sales", {
        batchNo,
        quantity: Number(soldQuantity),
        mrp: Number(mrp),
        customerName,
      });

      const { data } = await API.get(`/medicine-info/${batchNo}`);
      const total = Number(soldQuantity) * Number(mrp);

      const content = `
        <html>
        <head>
          <title>Medicine Bill</title>
          <style>
            body { font-family: Arial; padding: 20px; background: #f9f9f9; }
            .bill-container { max-width: 500px; margin: auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
            h2 { text-align: center; color: #2c3e50; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            td, th { padding: 8px; border-bottom: 1px solid #ddd; text-align: left; }
            th { background: #f0f0f0; }
            .total { font-weight: bold; font-size: 18px; text-align: right; color: #e74c3c; }
          </style>
        </head>
        <body>
          <div class="bill-container">
            <h2>💊 Medicine Bill</h2>
            <p><strong>Customer Name:</strong> ${customerName}</p>
            <hr />
            <table>
              <tr><th>Medicine Name</th><td>${data.name}</td></tr>
              <tr><th>Batch No</th><td>${batchNo}</td></tr>
              <tr><th>Quantity</th><td>${soldQuantity}</td></tr>
              <tr><th>MRP per unit</th><td>₹${mrp}</td></tr>
              <tr><th>Purchase Date</th><td>${new Date(data.purchaseDate).toLocaleDateString()}</td></tr>
              <tr><th>Expiry Date</th><td>${new Date(data.expiryDate).toLocaleDateString()}</td></tr>
            </table>
            <p class="total">Total: ₹${total}</p>
          </div>
        </body>
        </html>
      `;

      printWin.document.write(content);
      printWin.document.close();
      printWin.focus();
      printWin.print();
      printWin.close();

      toast.success("✅ Stock updated & bill generated successfully!");

      // Reset form
      setCustomerName("");
      setBatchNo("");
      setSoldQuantity("");
      setMrp("");
    } catch (err) {
      printWin.close();
      toast.error("❌ Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false); // ✅ Stop loader
    }
  };

  return (
    <div className="update-stock-container">
      {loading && (
        <div className="update-stock-loader-overlay">
          <Commet color="#a35b81ff" size="large" text="" textColor="" />
        </div>
      )}

      <h2 className="update-stock-title">Update Stock & Generate Bill</h2>
      <form onSubmit={handleUpdate} className="update-stock-form">
        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="text"
          placeholder="Batch No"
          value={batchNo}
          onChange={(e) => setBatchNo(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="number"
          placeholder="Sold Quantity"
          value={soldQuantity}
          onChange={(e) => setSoldQuantity(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="number"
          placeholder="MRP per unit"
          value={mrp}
          onChange={(e) => setMrp(e.target.value)}
          className="input-field"
          required
        />
        <button type="submit" className="submit-btn">
          Update & Print Bill
        </button>
      </form>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}

export default UpdateStock;
