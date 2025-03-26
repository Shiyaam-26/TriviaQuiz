import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Intro.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🟢 Handle Login
  const handleLogin = async () => {
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ Ensures session cookies are stored
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User logged in:", data);

        // ✅ Store user info in localStorage for quick access
        localStorage.setItem("username", data.user?.name || "Guest");
        localStorage.setItem("email", data.user?.email || "No email available");

        navigate("/"); // ✅ Redirect to home page
      } else {
        const data = await response.json();
        setError(data.msg || "Login failed!");
      }
    } catch (err) {
      setError("Server error, please try again later.");
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      {error && <p className="error">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <div className="auth-links">
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;
