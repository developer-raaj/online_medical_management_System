import React, { useEffect, useState } from "react";
import API from "../Api/api";
import { Commet } from "react-loading-indicators"; //  Loader import
import "./ExpiryMedicines.css"; // External CSS

function ExpiryMedicines() {
  const [expiryData, setExpiryData] = useState({ nearExpiry: [], expired: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); //  Loading state
  const rowsPerPage = 6;

  useEffect(() => {
    API.get("/check-expiry")
      .then((res) => setExpiryData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false)); //  Stop loading
  }, []);

  // Combine nearExpiry and expired for single table
  const combinedData = [
    ...expiryData.nearExpiry.map((m) => ({ ...m, type: "Near Expiry" })),
    ...expiryData.expired.map((m) => ({ ...m, type: "Expired" })),
  ];

  // ---------- PAGINATION ----------
  const totalPages = Math.ceil(combinedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = combinedData.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="expiry-table-container">
      <h2 className="title">⏳ Expiry Medicines</h2>

      {loading ? (
        <div className="expiry-loader-overlay">
          <Commet color="#a35b81ff" size="large" text="" textColor="" />
        </div>
      ) : combinedData.length === 0 ? (
        <p>No medicines found.</p>
      ) : (
        <>
          <table className="expiry-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Batch No</th>
                <th>Expiry Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((m) => (
                <tr
                  key={m._id}
                  className={m.type === "Expired" ? "expired" : "near-expiry"}
                >
                  <td>{m.name}</td>
                  <td>{m.batchNo}</td>
                  <td>{new Date(m.expiryDate).toLocaleDateString()}</td>
                  <td>{m.type}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/*  PAGINATION CONTROLS */}
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

export default ExpiryMedicines;
