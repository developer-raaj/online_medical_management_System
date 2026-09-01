import React, { useState, useEffect } from "react";
import "./MedicineEditModal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const MedicineEditModal = ({ show, medicine, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    batchNo: "",
    mrp: "",
    quantity: "",
    purchaseDate: "",
    expiryDate: ""
  });

  useEffect(() => {
    if (medicine) {
      setFormData({
        name: medicine.name || "",
        batchNo: medicine.batchNo || "",
        mrp: medicine.mrp || "",
        quantity: medicine.quantity || "",
        purchaseDate: medicine.purchaseDate ? new Date(medicine.purchaseDate).toISOString().split("T")[0] : "",
        expiryDate: medicine.expiryDate ? new Date(medicine.expiryDate).toISOString().split("T")[0] : ""
      });
    }
  }, [medicine]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(formData);
  };

  if (!show) return null;

  return (
    <div className="medicine-container">
    <div className="medicine-modal-overlay">
      <div className="medicine-modal">
        <div className="modal-header">
          <h5>Update Medicine</h5>
          <button className="close-btn" onClick={onClose}><FontAwesomeIcon icon={faTimes} /></button>
        </div>
        <div className="modal-body">
          {["name", "batchNo", "mrp", "quantity", "purchaseDate", "expiryDate"].map((field) => (
            <div className="form-group" key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type={field.includes("Date") ? "date" : field === "mrp" || field === "quantity" ? "number" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button className="btn-primary" onClick={handleSave}>Save Changes</button>
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default MedicineEditModal;
