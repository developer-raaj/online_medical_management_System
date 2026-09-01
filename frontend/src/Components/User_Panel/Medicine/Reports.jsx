import React, { useEffect, useState } from "react";
import API from "../Api/api";
import { Commet } from "react-loading-indicators"; // ✅ Loader import
import "./Reports.css";

function Reports() {
  const [reports, setReports] = useState({
    stockReport: [],
    expiryReport: { nearExpiry: [], expired: [] },
    historyReport: { purchases: [], sales: [], expiries: [] },
  });

  const [loading, setLoading] = useState(true); // ✅ Loading state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  useEffect(() => {
    API.get("/reports")
      .then((res) => setReports(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false)); // ✅ Stop loading
  }, []);

  const mergedData = [
    ...reports.stockReport.map((m) => ({
      type: "Stock",
      name: m.name,
      batchNo: m.batchNo,
      date: "-",
      quantity: m.quantity,
      status: "Available",
    })),
    ...reports.expiryReport.nearExpiry.map((m) => ({
      type: "Near Expiry",
      name: m.name,
      batchNo: m.batchNo,
      date: new Date(m.expiryDate).toLocaleDateString(),
      quantity: m.quantity || "-",
      status: "Near Expiry",
    })),
    ...reports.expiryReport.expired.map((m) => ({
      type: "Expired",
      name: m.name,
      batchNo: m.batchNo,
      date: new Date(m.expiryDate).toLocaleDateString(),
      quantity: m.quantity || "-",
      status: "Expired",
    })),
    ...reports.historyReport.purchases.map((h) => ({
      type: "Purchase",
      name: h.name,
      batchNo: h.batchNo,
      date: new Date(h.purchaseDate).toLocaleDateString(),
      quantity: h.quantity,
      status: "Purchased",
    })),
    ...reports.historyReport.sales.map((h) => ({
      type: "Sale",
      name: h.name,
      batchNo: h.batchNo,
      date: new Date(h.date).toLocaleDateString(),
      quantity: h.quantity,
      status: "Sold",
    })),
    ...reports.historyReport.expiries.map((h) => ({
      type: "Expiry History",
      name: h.name,
      batchNo: h.batchNo,
      date: new Date(h.expiryDate).toLocaleDateString(),
      quantity: h.quantity,
      status: "Expired History",
    })),
  ];

  // ---------- PAGINATION ----------
  const totalPages = Math.ceil(mergedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = mergedData.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="reports-container">
      <h2 className="reports-title">📊 Medical Management Reports</h2>

      {loading ? (
        <div className="reports-loader-overlay">
          <Commet color="#a35b81ff" size="large" text="" textColor="" />
        </div>
      ) : mergedData.length > 0 ? (
        <>
          <div className="reports-table-wrapper">
            <table className="reports-table">
              <thead>
                <tr className="table-header">
                  <th className="table-col">Type</th>
                  <th className="table-col">Medicine</th>
                  <th className="table-col">Batch No</th>
                  <th className="table-col">Date</th>
                  <th className="table-col">Quantity</th>
                  <th className="table-col">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((row, idx) => (
                  <tr key={idx} className="table-row">
                    <td className="table-cell">{row.type}</td>
                    <td className="table-cell">{row.name}</td>
                    <td className="table-cell">{row.batchNo}</td>
                    <td className="table-cell">{row.date}</td>
                    <td className="table-cell">{row.quantity}</td>
                    <td
                      className={`table-cell status ${row.status
                        .replace(/\s+/g, "-")
                        .toLowerCase()}`}
                    >
                      {row.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
                className={`pagination-page ${currentPage === page ? "active-page" : ""}`}
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
      ) : (
        <p className="no-records">No records available</p>
      )}
    </div>
  );
}

export default Reports;
