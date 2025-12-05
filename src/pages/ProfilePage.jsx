import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";

const profileIcons = {
  name: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 12c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5Zm0 3c-3.3 0-6 2.1-6 4.7V22h12v-2.3C18 17.1 15.3 15 12 15Z"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        stroke="currentColor"
      />
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 6h16v12H4V6Zm0 0 8 6 8-6"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        stroke="currentColor"
      />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6.5 3h2.8l1.4 4.5-2 1a11.7 11.7 0 0 0 4.3 4.3l1-2 4.5 1.4V18.5a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 3.5 7a2 2 0 0 1 3-2Z"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        stroke="currentColor"
      />
    </svg>
  ),
  role: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3 3 7l9 4 9-4-9-4Zm0 8-9-4v10l9 4 9-4V7l-9 4Z"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        stroke="currentColor"
      />
    </svg>
  ),
};

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await ApiService.getLoggedInUsesInfo();
        setUser(userInfo);
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error fetching user profile: " + error
        );
      }
    };
    fetchUserInfo();
  }, []);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  const infoItems = user
    ? [
        { label: "Name", value: user.name, icon: profileIcons.name },
        { label: "Email", value: user.email, icon: profileIcons.email },
        { label: "Phone Number", value: user.phoneNumber, icon: profileIcons.phone },
        { label: "Role", value: user.role, icon: profileIcons.role },
      ]
    : [];

  return (
    <Layout>
      {message && <div className="message in-page">{message}</div>}
      <div className="page-shell profile-page">
        <div className="page-header">
          <p className="eyebrow-text">Profile</p>
          <h1>View your account information</h1>
          <p className="subtitle-text">
            Account details, personal info, and access level for your Lawncare Inventory System profile.
          </p>
        </div>

        {user && (
          <section className="profile-card">
            <header className="profile-card-header">
              <div>
                <p className="eyebrow-text">Account Details</p>
                <h2>Your personal and role information</h2>
              </div>
              <span className="status-badge success">{user.role}</span>
            </header>
            <div className="profile-grid">
              {infoItems.map((item) => (
                <div key={item.label} className="profile-row">
                  <div className="profile-label">
                    <span className="profile-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <span className="profile-value">{item.value || "—"}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
