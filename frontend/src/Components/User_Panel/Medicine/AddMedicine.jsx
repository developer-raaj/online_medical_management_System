import React, { useState } from "react";
import API from "../Api/api";
import "./AddMedicine.css";
import { Commet } from "react-loading-indicators"; // Loader import
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddMedicine() {
  const [form, setForm] = useState({
    name: "",
    batchNo: "",
    quantity: "",
    mrp: "",
    purchaseDate: "",
    expiryDate: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/add", form);
      toast.success("✅ Medicine Added Successfully!", {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: true,
      });

      setForm({
        name: "",
        batchNo: "",
        quantity: "",
        mrp: "",
        purchaseDate: "",
        expiryDate: "",
      });
    } catch (err) {
      toast.error("❌ Error: " + err.message, {
        position: "top-right",
        autoClose: 3000,
        pauseOnHover: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-medicine-container">
      {loading && (
        <div className="add-medicine-loader-overlay">
          <Commet color="#a35b81ff" size="large" text="" textColor="" />
        </div>
      )}

      <h2 className="form-title">Add Medicine</h2>
      <form onSubmit={handleSubmit} className="add-medicine-form">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="batchNo"
          placeholder="Batch No"
          value={form.batchNo}
          onChange={handleChange}
          required
        />
        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          required
        />
        <input
          name="mrp"
          type="number"
          placeholder="MRP"
          value={form.mrp}
          onChange={handleChange}
          required
        />

        <label>
          Purchase Date:
          <input
            name="purchaseDate"
            type="date"
            value={form.purchaseDate}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Expiry Date:
          <input
            name="expiryDate"
            type="date"
            value={form.expiryDate}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </button>
      </form>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default AddMedicine;
