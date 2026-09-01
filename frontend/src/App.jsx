//-----------------------------------------------------------

import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../src/App.css";

// Components
import Navbar from "./Components/User_Panel/Navbar/Navbar";
import AdminNavbar from "./Components/User_Panel/Navbar/AdminNavbar";
import Dashboard from "./Components/User_Panel/Dashboard/Dashboard";
import About_Us from "./Components/User_Panel/About_Us/About_Us";
import ContactUs from "./Components/User_Panel/Contact_Us/Contact_Us";
import FAQ from "./Components/User_Panel/FAQs.jsx/FAQs";
import LoginPage from "./Components/Pages/LoginPage/LoginPage";
import SignupPage from "./Components/Pages/SignupPage/SignupPage";

import { AuthProvider, AuthContext } from "./Components/AuthContext/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import AddMedicine from "./Components/User_Panel/Medicine/AddMedicine";
import MedicineList from "./Components/User_Panel/Medicine/MedicineList";
import UpdateStock from "./Components/User_Panel/Medicine/UpdateStock";
import Reports from "./Components/User_Panel/Medicine/Reports";
import ExpiryMedicines from "./Components/User_Panel/Medicine/ExpiryMedicines";
import ReportsGraph from "./Components/Admin_panel/ReportsGraph/ReportsGraph";
import Medicine_Admin from "./Components/Admin_panel/Medicine_Admin/Medicine_Admin";
import CustomerRecord from "./Components/Admin_panel/Customer-Record/CustomerRecord";
function App() {
  
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

//  Separate component so we can use AuthContext
function AppContent() {
  const { user } = useContext(AuthContext);

  console.log("Current User:", user);

  //  Case 1: Agar user null hai (login hi nahi kiya)
  if (!user) {
    return (
      <>
        <Navbar showLimited={true} />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/about" element={<About_Us />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<LoginPage />} /> {/* default redirect */}
        </Routes>
      </>
    );
  }

  //  Case 2: Agar user login hai & role == admin
  if (user.role === "admin") {
    return (
      <>
        <AdminNavbar />
        <Routes>
          <Route path="/contact" element={<ContactUs />} />
          
          <Route path="/" element={<ReportsGraph />} />
          <Route path="/update-delete" element={<Medicine_Admin />} />
          <Route path="/customer" element={<CustomerRecord />} />
        </Routes>
      </>
    );
  }

  //  Case 3: Agar user login hai & role == user
  if (user.role === "user") {
    return (
      <>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />All_event
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<About_Us />} />
          <Route path="/contact" element={<ContactUs />} />
           <Route path="/addmedicine" element={<AddMedicine />} />
            <Route path="/medicine-list" element={<MedicineList />} />
             <Route path="/update-stock" element={<UpdateStock />} />
              <Route path="/report" element={<Reports />} />
              <Route path="/expire" element={<ExpiryMedicines />} />
        </Routes>
      </>
    );
  }

  //  Case 4: Fallback (jab role undefined hai)
  return (
    <>
      <Navbar showLimited={true} />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;

