import React, { useEffect, useState } from "react";
import API from "../../User_Panel/Api/api";
import { Commet } from "react-loading-indicators"; // ✅ Loader import
import "./ReportsGraph.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function ReportsGraph() {
  const [salesData, setSalesData] = useState({});
  const [chartType, setChartType] = useState("Bar");
  const [timeFrame, setTimeFrame] = useState("Monthly");
  const [loading, setLoading] = useState(true); //  Loading state

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/medicines/analytics?timeFrame=${timeFrame}`);
      setSalesData(res.data);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeFrame]);

  const labels = Object.keys(salesData);
  const totalSold = labels.map((med) => salesData[med].totalSold || 0);
  const totalProfit = labels.map((med) => salesData[med].totalProfit || 0);
  const expiredLoss = labels.map((med) => salesData[med].expiredLoss || 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Sold Quantity",
        data: totalSold,
        backgroundColor: "#3498db",
        color: "white",
      },
      {
        label: "Profit (₹)",
        data: totalProfit,
        backgroundColor: "#2ecc71",
        color: "white",
      },
      {
        label: "Expired Loss (₹)",
        data: expiredLoss,
        backgroundColor: "#e74c3c",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "white" },
      },
      title: {
        display: true,
        text: `${timeFrame} Medicine Sales & Profit Analytics`,
        font: { size: 18 },
        color: "white",
      },
      tooltip: { titleColor: "white", bodyColor: "white" },
    },
    scales: {
      x: { ticks: { color: "white" }, grid: { color: "rgba(255,255,255,0.2)" } },
      y: { ticks: { color: "white" }, grid: { color: "rgba(255,255,255,0.2)" } },
    },
  };

  return (
    <div className="analytics-container">
      <h2 className="analytics-title">📊 Medicine Analytics</h2>

      {/* Controls */}
      <div className="analytics-controls">
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          className="analytics-select"
        >
          <option value="Bar">Bar Chart</option>
          <option value="Line">Line Chart</option>
          <option value="Pie">Pie Chart</option>
        </select>

        <select
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value)}
          className="analytics-select"
        >
          <option value="Monthly">Monthly</option>
          <option value="Yearly">Yearly</option>
          <option value="All">All Time</option>
        </select>
      </div>

      {/* ✅ Loading */}
      {loading ? (
        <div className="analytics-loader-overlay">
          <Commet color="#a35b81ff" size="large" text="" textColor="" />
        </div>
      ) : (
        <div className="analytics-chart">
          {chartType === "Bar" && <Bar options={chartOptions} data={chartData} />}
          {chartType === "Line" && <Line options={chartOptions} data={chartData} />}
          {chartType === "Pie" && (
            <Pie
              options={{ ...chartOptions, plugins: { legend: { position: "bottom" } } }}
              data={chartData}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default ReportsGraph;
