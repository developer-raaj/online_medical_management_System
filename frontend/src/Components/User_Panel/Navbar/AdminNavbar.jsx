import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext/AuthContext";
import "./AdminNavbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const AdminNavbarNew = () => {
  const { logout, token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isResponsive, setIsResponsive] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
    setIsResponsive(false);
  };

  const toggleResponsive = () => setIsResponsive(!isResponsive);
  const handleLinkClick = () => setIsResponsive(false);

  return (
    <div className="navbgr">
      <nav className={`navbar-new ${isResponsive ? "responsive" : ""}`}>
        <img style={{paddingLeft:"20px"}}
          className="navbar-brand-new"
          src="https://png.pngtree.com/png-clipart/20221028/original/pngtree-medicine-icon-png-image_8741000.png"
          alt="Logo"
        />

        {/* Left links */}
        <ul className="navlinks-new left-links">
          <div className="user-box-new">
            <img
              className="user-avatar-new"
              src="https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png"
              alt="user"
            />
            <h5 className="user-name-new">{user?.username || "Guest"}</h5>
          </div>

          {/* {token && <li><Link to="/" onClick={handleLinkClick}>Status Update</Link></li>} */}
          <li><Link to="/" onClick={handleLinkClick}>REPORT GRAPH</Link></li>
          <li><Link to="/update-delete" onClick={handleLinkClick}>UPDATE STOCK</Link></li>
          <li><Link to="/customer" onClick={handleLinkClick}> CUSTOMER </Link></li>

        </ul>

        {/* Right logout/login */}
        <ul className="navlinks-new right-links">
          {token ? (
            <li>
              <button onClick={handleLogout} className="logout-btn-new">
                LOGOUT
              </button>
            </li>
          ) : (
            <li><Link to="/login" onClick={handleLinkClick}>LOGIN</Link></li>
          )}
        </ul>

        {/* Hamburger */}
        <a href="#!" className="hamburger-new" onClick={toggleResponsive}>
          <FontAwesomeIcon icon={faBars} />
        </a>
      </nav>
    </div>
  );
};

export default AdminNavbarNew;
