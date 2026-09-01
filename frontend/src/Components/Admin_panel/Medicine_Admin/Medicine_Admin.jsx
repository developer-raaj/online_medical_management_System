import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./Medicine.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../AuthContext/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Commet } from "react-loading-indicators";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useTypewriter } from "react-simple-typewriter";
import MedicineEditModal from "./MedicineEditModal";

const Medicine_Admin = () => {
  const { token } = useContext(AuthContext);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  // Typewriter placeholder
  const [text] = useTypewriter({
    words: ["Search medicine...", "Enter medicine name...", "Enter batch or MRP..."],
    loop: 0,
    delaySpeed: 1000,
  });

  // Fetch medicines
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios
      .get("http://localhost:8080/api/medicines/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMedicines(res.data))
      .catch((err) => toast.error("🚨 Error fetching medicines: " + err.message))
      .finally(() => setLoading(false));
  }, [token]);

  // Delete medicine
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this medicine?")) return;
    setLoading(true);
    axios
      .delete(`http://localhost:8080/api/medicines/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setMedicines(medicines.filter((m) => m._id !== id));
        toast.success("🗑 Medicine deleted successfully");
      })
      .catch((err) => toast.error("🚨 Error deleting medicine: " + err.message))
      .finally(() => setLoading(false));
  };

  // Open modal
  const handleUpdate = (medicine) => {
    setSelectedMedicine(medicine);
    setShowModal(true);
  };

  // Save updated medicine
  const handleSave = (updatedMedicine) => {
    if (!selectedMedicine) return;
    setLoading(true);
    axios
      .put(
        `http://localhost:8080/api/medicines/update/${selectedMedicine._id}`,
        updatedMedicine,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setMedicines(
          medicines.map((m) =>
            m._id === selectedMedicine._id ? res.data.medicine : m
          )
        );
        toast.success("✏️ Medicine updated successfully");
      })
      .catch((err) => toast.error("🚨 Error updating medicine: " + err.message))
      .finally(() => setLoading(false));
    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedMedicine(null);
  };

  // Filter medicines
  const filteredMedicines = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.batchNo.toLowerCase().includes(search.toLowerCase()) ||
      String(m.mrp).includes(search)
  );

  // Pagination
  const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);
  const paginatedMedicines = filteredMedicines.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // PDF download
  const generatePDF = () => {
    if (filteredMedicines.length === 0) {
      toast.warning("⚠️ No data to download!");
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Medicine Inventory", 14, 20);
    const tableColumn = ["Name", "Batch No", "MRP", "Quantity", "Purchase Date", "Expiry Date"];
    const tableRows = filteredMedicines.map((med) => [
      med.name,
      med.batchNo,
      med.mrp,
      med.quantity,
      new Date(med.purchaseDate).toLocaleDateString(),
      new Date(med.expiryDate).toLocaleDateString(),
    ]);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 12 },
      headStyles: { fillColor: [40, 40, 40] },
    });
    doc.save("medicine_inventory.pdf");
    toast.success("📄 PDF downloaded!");
  };

  return (
    <>
      {loading ? (
        <div className="admin-medicine-loader-overlay">
          <Commet color="#a35b81ff" size="large" text="" textColor="" />
        </div>
      ) : (
        <div className="medicine-admin-container">
          <h2>Manage Medicines</h2>

          <div className="top-bar">
            <input
              type="text"
              placeholder={text}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="medicine-search-input"
            />
            <button className="pdf-button" onClick={generatePDF}>
              <FontAwesomeIcon icon={faFilePdf} /> Download PDF
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Batch No</th>
                <th>MRP</th>
                <th>Quantity</th>
                <th>Purchase Date</th>
                <th>Expiry Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMedicines.length > 0 ? (
                paginatedMedicines.map((med) => (
                  <tr key={med._id}>
                    <td>{med.name}</td>
                    <td>{med.batchNo}</td>
                    <td>₹{med.mrp}</td>
                    <td>{med.quantity}</td>
                    <td>{new Date(med.purchaseDate).toLocaleDateString()}</td>
                    <td>{new Date(med.expiryDate).toLocaleDateString()}</td>
                    <td>
                      <FontAwesomeIcon
                        icon={faPencilAlt}
                        className="pencil-icon"
                        onClick={() => handleUpdate(med)}
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="delete-icon"
                        onClick={() => handleDelete(med._id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No medicines available.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* ✅ Pagination Section */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <button
                className="pagination-btn"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ⬅ Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => goToPage(i + 1)}
                  className={`pagination-page ${
                    currentPage === i + 1 ? "active-page" : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className="pagination-btn"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next ➡
              </button>
            </div>
          )}

          <ToastContainer position="top-center" autoClose={3000} />
        </div>
      )}

      <MedicineEditModal
        show={showModal}
        medicine={selectedMedicine}
        onClose={handleClose}
        onSave={handleSave}
      />
    </>
  );
};

export default Medicine_Admin;
