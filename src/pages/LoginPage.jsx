import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../service/ApiService";
import BrandMark from "../component/BrandMark";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const loginData = { email, password };
      const res = await ApiService.loginUser(loginData);

      if (res.status === 200) {
        ApiService.saveToken(res.token);
        ApiService.saveRole(res.role);
        setMessage(res.message);
        navigate("/profile");
      }
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error Logging in a User: " + error
      );
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <BrandMark
          orientation="stacked"
          showTagline
          tagline="Equipment Inventory & Tracking System"
        />

        <div className="auth-tabs">
          <button className="is-active" type="button">
            Sign In
          </button>
          <button type="button" onClick={() => navigate("/register")}>
            Register
          </button>
        </div>

        {message && <p className="message inline">{message}</p>}

        <form className="auth-form" onSubmit={handleLogin}>
          <label>
            Employee ID or Username
            <input
              type="text"
              placeholder="Enter your username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="primary-btn">
            Sign In
          </button>
        </form>

        <p className="auth-helper">
          Demo Credentials: <strong>john.smith / any password</strong>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
