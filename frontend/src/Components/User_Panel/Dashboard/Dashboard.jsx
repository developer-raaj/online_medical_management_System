import React, { useContext, useState, useEffect } from "react";
import "./Dashboard.css";
import { AuthContext } from "../../AuthContext/AuthContext";
import { Link } from "react-router-dom";
import { Commet } from "react-loading-indicators";  //  Loader Import

function Dashboard() {
  const { user } = useContext(AuthContext);

  // State to track which popup is open
  const [activePopup, setActivePopup] = useState(null);

  //  Loading state
  const [loading, setLoading] = useState(true);

  // Simulate loading effect (like fetching data)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5 sec fake delay

    return () => clearTimeout(timer);
  }, []);

  // Function to open a popup
  const openPopup = (card) => {
    setActivePopup(card);
  };

  // Function to close popup
  const closePopup = () => {
    setActivePopup(null);
  };

  return (
    <>
      {loading ? (
        <div className="dashboard-loader-overlay">
          <Commet color="#a35b81ff" size="large" text="" textColor="" />
        </div>
      ) : (
        <div className="container my-4">
          {/* Profile Header */}
          <div className="profile">
            <div className="profile-info">
              <img
                src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80"
                alt="User Profile"
              />
              <h5 className="Username">{user?.username || "Guest"}</h5>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="row g-4">
            {/* Notification Card */}
            <div className="col-md-6">
              <div className="dashboard-Card text-center p-3">
                <div className="dasboard-icon">🔔</div>
                <h5 className="mt-2">Notification</h5>
                <p>See all notifications</p>
                <button
                  className="dashboard-btn"
                  onClick={() => openPopup("notification")}
                >
                  Open Notification
                </button>
              </div>
            </div>

            {/* Pending Requests Card */}
            <div className="col-md-6">
              <div className="dashboard-Card text-center p-3">
                <div className="dasboard-icon">💊</div>
                <h5 className="mt-2">ADD MEDICINE</h5>
                <p>Add Medicine In Stock</p>
                <Link to="/addmedicine" className="btn-sm dashboard-btn">
                  Track Now
                </Link>
              </div>
            </div>

            {/* Services Card */}
            <div className="col-md-6">
              <div className="dashboard-Card text-center p-3">
                <div className="dasboard-icon">📝</div>
                <h5 className="mt-2">REPORT</h5>
                <p>Track Medicines quantity , Expiry Status</p>
                <Link to="/report" className="btn-sm dashboard-btn">
                  All Events
                </Link>
              </div>
            </div>

            {/* Contact Support Card */}
            <div className="col-md-6">
              <div className="dashboard-Card text-center p-3">
                <div className="dasboard-icon">📞</div>
                <h5 className="mt-2">Contact Now</h5>
                <p>Need help? Reach out to us</p>
                <Link to="/contact" className="btn-sm dashboard-btn">
                  Get Help
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup Overlay */}
      {activePopup && (
        <div className="modalOverlay">
          <div className="modalBox">
            <button className="close" onClick={closePopup}>
              &times;
            </button>
            <h2>{activePopup === "notification" && "Notification"}</h2>
            <div className="content">
              {activePopup === "notification" && (
                <ul className="notification-list">
                  <li>✅ Your service request #1234 has been completed.</li>
                  <li>⚠️ Payment pending for service #5678.</li>
                  <li>📅 Reminder: Upcoming appointment on 25th Aug.</li>
                  <li>🛠️ Service #4321 has been rescheduled to 26th Aug.</li>
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
