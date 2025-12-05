import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../service/ApiService";
import BrandMark from "../component/BrandMark";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const registerData = { name, email, password, phoneNumber };
      await ApiService.registerUser(registerData);
      setMessage("Registration successful");
      navigate("/login");
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Error Registering a User: " + error
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
          <button type="button" onClick={() => navigate("/login")}>
            Sign In
          </button>
          <button className="is-active" type="button">
            Register
          </button>
        </div>

        {message && <p className="message inline">{message}</p>}

        <form className="auth-form" onSubmit={handleRegister}>
          <label>
            Full Name
            <input
              type="text"
              placeholder="John Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Phone Number
            <input
              type="tel"
              placeholder="(555) 123-4567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              placeholder="john.smith@99lawncare.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="primary-btn">
            Create Account
          </button>
        </form>

        <p className="auth-helper">Employee ID will be automatically generated</p>
      </div>
    </div>
  );
};

export default RegisterPage;
