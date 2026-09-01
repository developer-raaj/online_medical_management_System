import React, { useEffect, useState } from "react";
import API from "../../User_Panel/Api/api";
import "./CustomerRecord.css";
import { Commet } from "react-loading-indicators"; // ✅ spinner

function CustomerRecord() {
  const [customerSales, setCustomerSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const { data } = await API.get("/customer-sales");
        const mergedSales = [];
        Object.entries(data).forEach(([customer, sales]) => {
          sales.forEach((sale) => mergedSales.push({ ...sale, customer }));
        });
        setCustomerSales(mergedSales);
      } catch (error) {
        console.error("Error fetching customer sales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  // Pagination
  const totalPages = Math.ceil(customerSales.length / recordsPerPage);
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = customerSales.slice(indexOfFirst, indexOfLast);

  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

  if (loading)
    return (
      <div className="customer-loading-overlay">
        <Commet color="#a35b81ff" size="large" text="Loading..." textColor="#fff" />
      </div>
    );

  return (
    <div className="customer-record-container">
      <h2 className="customer-record-title">Customer Sales Record</h2>

      {customerSales.length === 0 ? (
        <p className="customer-no-data">No sales found</p>
      ) : (
        <>
          <div className={`customer-table-wrapper ${loading ? "disabled" : ""}`}>
            <table className="customer-table">
              <thead>
                <tr className="customer-table-header-row">
                  <th className="customer-table-th">Customer</th>
                  <th className="customer-table-th">Medicine</th>
                  <th className="customer-table-th">Batch No</th>
                  <th className="customer-table-th">Quantity</th>
                  <th className="customer-table-th">MRP</th>
                  <th className="customer-table-th">Total</th>
                  <th className="customer-table-th">Sale Date</th>
                </tr>
              </thead>
              <tbody className="customer-table-body">
                {currentRecords.map((sale, idx) => (
                  <tr key={idx} className="customer-table-row">
                    <td className="customer-table-td">{sale.customer}</td>
                    <td className="customer-table-td">{sale.medicineName}</td>
                    <td className="customer-table-td">{sale.batchNo}</td>
                    <td className="customer-table-td">{sale.quantity}</td>
                    <td className="customer-table-td">₹{sale.mrp}</td>
                    <td className="customer-table-td">₹{sale.total}</td>
                    <td className="customer-table-td">
                      {new Date(sale.saleDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="customer-pagination">
            <button
              className="customer-page-btn"
              onClick={handlePrev}
              disabled={currentPage === 1 || loading}
            >
              Prev
            </button>

            <span className="customer-page-info">
              Page {currentPage} of {totalPages}
            </span>

            <button
              className="customer-page-btn"
              onClick={handleNext}
              disabled={currentPage === totalPages || loading}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CustomerRecord;
