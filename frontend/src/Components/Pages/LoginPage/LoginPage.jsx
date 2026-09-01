import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginPage.css";
import { Commet } from "react-loading-indicators"; // ✅ spinner

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!username || !password) {
      toast.error("⚠️ Please enter both username and password");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/medicines/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Invalid credentials");
      const data = await res.json();

      if (data.token) {
        login(data.token, data.user, navigate);
        toast.success("✅ Login successful!");
      } else {
        throw new Error("Login failed: Token not received");
      }
    } catch (err) {
      toast.error(`🚨 ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ring">
      <i style={{ "--clr": "#9900ff91" }}></i>
      <i style={{ "--clr": "#60148bff" }}></i>
      <i style={{ "--clr": "#e11ba684" }}></i>

      {loading && (
        <div className="login-loading-overlay">
          <Commet color="#a35b81ff" size="large"   />
        </div>
      )}

      <div className="login" style={{ opacity: loading ? 0.5 : 1, pointerEvents: loading ? "none" : "auto" }}>
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <div className="inputBx">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="inputBx">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="inputBx">
            <input
              type="submit"
              value={loading ? "Logging in..." : "Sign in"}
              disabled={loading}
            />
          </div>

          <div className="links" style={{ color: "white" }}>
            <a href="#">Forget Password</a>
            <a onClick={() => navigate("/signup")}>Signup</a>
          </div>
        </form>
      </div>

      <ToastContainer position="top-center" style={{ marginTop: "50px" }} autoClose={2000} />
    </div>
  );
};

export default LoginPage;
