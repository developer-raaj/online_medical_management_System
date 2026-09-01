import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext/AuthContext";
import "../../../App.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const { token, logout } = useContext(AuthContext); // ✅ fixed
  const navigate = useNavigate();
  const [isResponsive, setIsResponsive] = useState(false);

  const handleLogout = () => {
    logout(); // ✅ use context logout
    navigate("/login", { replace: true });
    setIsResponsive(false);
  };

  const toggleResponsive = () => {
    setIsResponsive(!isResponsive);
  };

  const handleLinkClick = () => {
    setIsResponsive(false);
  };

  return (
    <div className="bgr">
      <nav className={`navbar ${isResponsive ? "responsive" : ""}`}>
        <img
          className="navbar-brand"
          src="https://png.pngtree.com/png-clipart/20221028/original/pngtree-medicine-icon-png-image_8741000.png"
          alt="Logo"
        />
        

        {/* Left links */}
        <ul className="nav-links left-links">
          {token && <li><Link to="/" onClick={handleLinkClick}>DASHBOARD</Link></li>}
          {token && <li><Link to="/addmedicine" onClick={handleLinkClick}>ADD MEDICINE</Link></li>}
          {token && <li><Link to="/medicine-list" onClick={handleLinkClick}>MEDICINE LIST</Link></li>}
          {token && <li><Link to="/update-stock" onClick={handleLinkClick}>UPDATE STOCK</Link></li>}
           {token && <li><Link to="/report" onClick={handleLinkClick}>REPORT</Link></li>}
            {token && <li><Link to="/expire" onClick={handleLinkClick}>EXPIRE</Link></li>}


                    {!token && <li><Link to="/about" onClick={handleLinkClick}>ABOUT US</Link></li>}

          {!token && <li><Link to="/contact" onClick={handleLinkClick}>CONTACT US</Link></li>}
                    {!token && <li><Link to="/faq" onClick={handleLinkClick}>FAQS</Link></li>}

        </ul>

        {/* Right logout/login */}
        <ul className="nav-links right-links">
          {token ? (
            <li>
              <button onClick={handleLogout} className="animated-logout-btn">
                LOGOUT
              </button>
             
            </li>
          ) : (
            <li><Link to="/login" onClick={handleLinkClick}>LOGIN</Link></li>
          )}
        </ul>

        {/* Hamburger icon for mobile */}
        <a href="#!" className="icon" onClick={toggleResponsive}>
          <FontAwesomeIcon className="FabarFontAwesomeIcon" icon={faBars}  />
        </a>
      </nav>
    </div>
  );
}

export default Navbar;
