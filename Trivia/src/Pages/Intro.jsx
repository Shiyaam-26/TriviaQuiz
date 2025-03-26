import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Intro.css";

const Intro = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🟢 Fetch user info from the server
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/user", {
          credentials: "include", // ✅ Ensure authentication cookies are sent
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched User:", data);

          setUser(data.user);
          localStorage.setItem("username", data.user?.name || "Guest");
          localStorage.setItem("email", data.user?.email || "No email available");
        } else {
          console.log("No user found, falling back to localStorage");
          setUser({
            name: localStorage.getItem("username") || "Guest",
            email: localStorage.getItem("email") || "No email available",
          });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // 🟢 Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
      localStorage.removeItem("username");
      localStorage.removeItem("email");

      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="intro-main">
      <div className="intro-head">
        <h1>Trivia Quiz</h1>
        <p className="intro-subtitle">Test your knowledge</p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : !user ? (
        <div className="auth-container">
          <h2>Welcome! Please Login or Register</h2>
          <div className="auth-buttons">
            <button onClick={() => navigate("/login")} className="auth-button">
              Login
            </button>
            <button onClick={() => navigate("/register")} className="auth-button">
              Register
            </button>
          </div>
        </div>
      ) : (
        <div className="intro-category">
          <h2>Welcome, {user.name}!</h2>

          <p>Select Category:</p>
          <div className="category-container">
            <Link to="/sports" className="category-link">Sports</Link>
            <Link to="/cpp" className="category-link">C++</Link>
            <Link to="/gk" className="category-link">General Knowledge</Link>
            <Link to="/css" className="category-link">CSS</Link>
            <Link to="/java" className="category-link">Java</Link>
          </div>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      )}
    </div>
  );
};

export default Intro;
