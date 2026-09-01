import React, { useEffect, useState } from "react";
import API from "../Api/api";
import "./MedicineList.css";
import { Commet } from "react-loading-indicators"; //  Loader

function MedicineList() {
  const [medicines, setMedicines] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); //  Loading state
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await API.get("/");
        setMedicines(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // Stop loader
      }
    };
    fetchMedicines();
  }, []);

  // ---------- PAGINATION ----------
  const totalPages = Math.ceil(medicines.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = medicines.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="medicine-list-container">
      <h2 className="medicine-list-title">💊 All Medicines</h2>

      {loading ? (
        <div className="medicine-list-loader-overlay">
          <Commet color="#a35b81ff" size="large" text="" textColor="" />
        </div>
      ) : medicines.length === 0 ? (
        <p>No medicines available.</p>
      ) : (
        <>
          <table className="medicine-table">
            <thead className="medicine-thead">
              <tr>
                <th>Name</th>
                <th>Batch No</th>
                <th>Qty</th>
                <th>MRP</th>
                <th>Expiry</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((m) => (
                <tr key={m._id}>
                  <td>{m.name}</td>
                  <td>{m.batchNo}</td>
                  <td>{m.quantity}</td>
                  <td>₹{m.mrp}</td>
                  <td>{new Date(m.expiryDate).toLocaleDateString()}</td>
                  <td
                    className={
                      m.status === "Expired"
                        ? "status-expired"
                        : m.status === "Near Expiry"
                        ? "status-warning"
                        : "status-ok"
                    }
                  >
                    {m.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ PAGINATION CONTROLS */}
          <div className="pagination-container">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ⬅ Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`pagination-page ${
                  currentPage === page ? "active-page" : ""
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="pagination-btn"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next ➡
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default MedicineList;
