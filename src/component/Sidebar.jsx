import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ApiService from "../service/ApiService";
import BrandMark from "./BrandMark";

const Sidebar = () => {
  const isAuth = ApiService.isAuthenticated();
  const isAdmin = ApiService.isAdmin();
  const navigate = useNavigate();

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path
            d="M4 13v7h6v-7H4Zm10 0v7h6v-7h-6ZM4 4v7h6V4H4Zm10 0v7h6V4h-6Z"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      visible: isAuth,
    },
    {
      label: "Equipment",
      path: "/equipment",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path
            d="m5 9 7-4 7 4m-14 0 7 4 7-4m-14 0v6l7 4 7-4V9"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      visible: isAdmin,
    },
    {
      label: "Check-in and Check-out",
      path: "/checkOutEquipment",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path
            d="M5 12h14m-5-5 5 5-5 5"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 7 4 12l5 5"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      visible: isAuth,
    },
    {
      label: "Supplies",
      path: "/supply",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path
            d="M4 7h16M4 12h16M4 17h16"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
      visible: isAdmin,
    },
    {
      label: "Maintenance Log",
      path: "/equipmentTransactions",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path
            d="m4 13 6 6 10-12"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      visible: isAuth,
    },
    {
      label: "Reports",
      path: "/supplyTransactions",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path
            d="M5 19V5h3v14H5Zm5 0V10h3v9h-3Zm5 0v-6h3v6h-3Z"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      visible: isAuth,
    },
    {
      label: "Profile",
      path: "/profile",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
          <path
            d="M12 12c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5Zm0 3c-3.3 0-6 2.1-6 4.7V22h12v-2.3C18 17.1 15.3 15 12 15Z"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      visible: isAuth,
    },
  ].filter((item) => item.visible);

  const handleLogout = () => {
    ApiService.logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <BrandMark orientation="inline" showTagline tagline="Inventory System" />
      <nav className="nav-links">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      {isAuth && (
        <button className="signout-button" onClick={handleLogout}>
          Sign Out
        </button>
      )}
    </aside>
  );
};

export default Sidebar;