import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Atom } from "react-loading-indicators"; // ✅ spinner
import "./SignupPage.css";

const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle signup submit
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, username, password } = formData;

    if (!name || !email || !username || !password) {
      toast.error("⚠️ Please fill all fields");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/medicines/signup", {
        name,
        email,
        username,
        password,
      });

      const msg = res.data.message?.toLowerCase() || "";

      if (res.data.success) {
        toast.success("🎉 Signup successful!");
        setTimeout(() => navigate("/login"), 2000);
      } else if (msg.includes("exists")) {
        toast.error("⚠️ User already registered! Please login.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(res.data.message || "❌ Signup failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("⚠️ User already registered!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ring">
      <i style={{ "--clr": "#9900ff91" }}></i>
      <i style={{ "--clr": "#60148bff" }}></i>
      <i style={{ "--clr": "#e11ba684" }}></i>

      {/* ✅ Full-page loading overlay */}
      {loading && (
        <div className="signup-loading-overlay">
          <Atom color="#a35b81ff" size="large" />
        </div>
      )}

      <div
        className="signup"
        style={{
          opacity: loading ? 0.5 : 1,
          pointerEvents: loading ? "none" : "auto",
        }}
      >
        <h2>Signup</h2>

        <form onSubmit={handleSignup}>
          <div className="inputBx">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="inputBx">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="inputBx">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="inputBx">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="inputBx">
            <input
              type="submit"
              value={loading ? "Signing up..." : "Sign Up"}
              disabled={loading}
            />
          </div>

          <div className="links" style={{ color: "white" }}>
            <a onClick={() => navigate("/login")}>Already have an account?</a>
          </div>
        </form>
      </div>

      <ToastContainer
        position="top-center"
        style={{ marginTop: "50px" }}
        autoClose={2000}
      />
    </div>
  );
};

export default SignupPage;
