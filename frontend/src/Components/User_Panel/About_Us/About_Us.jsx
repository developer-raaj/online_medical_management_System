import React from 'react'
import "./About_Us.css"
import { useNavigate } from "react-router-dom";

function About_Us() {

  const navigate = useNavigate();
  
    const handle_Book_Ass = (e) => {
      e.preventDefault();
      // TODO: Add login logic here
      console.log("Login submitted");
      // Example: navigate to dashboard after login
      navigate("/addmedicine");
    };
  return (
    <div className='About_Us lh-1'>
        <h2 className='text-center mb-3'>Medical Management system</h2>
        <h4 lh-3>We are available 24×7 – How can we help you today?</h4>
        <hr />
        <h4 lh-3> Manage Your medical    <button className='Book_Now_Button' onClick={() => navigate("/addmedicine")}>Add Medicine</button></h4>
       
        <hr />
        
        <div className='Services mt-2 fw-semibold '>
        <h4 className='text-center'>Events</h4>
       <p>New Medicine Arrival – 💊 New Stock, 🏷️ Labels,  </p>
<p>Expiry Alert – ⏳ Near Expiry, ⚠️ Alerts, 📝 Records</p>
<p>Stock Update – 📦 Inventory, ➕ Add, ➖ Reduce </p>
<p>Other – 📁 Miscellaneous, ➕ More Options & 📊 Reports</p>

        </div>
    </div>
  )
}

export default About_Us
