import React from "react";
import { NavLink } from "react-router-dom";

const tabs = [
  { key: "checkout-equipment", label: "Check-Out Equipment", path: "/checkOutEquipment" },
  { key: "checkin-equipment", label: "Check-In Equipment", path: "/checkInEquipment" },
  { key: "checkout-supply", label: "Check-Out Supply", path: "/checkOutSupply" },
  { key: "checkin-supply", label: "Check-In Supply", path: "/checkInSupply" },
];

const CheckInTabs = ({
  title = "Check-in and Check-out",
  subtitle = "Manage equipment and supply inventory",
}) => {
  return (
    <div className="checkio-header">
      <div className="checkio-hero">
        <p className="eyebrow-text">Operations</p>
        <h1>{title}</h1>
        <p className="subtitle-text">{subtitle}</p>
      </div>
      <div className="checkio-tabs">
        {tabs.map((tab) => (
          <NavLink
            key={tab.key}
            to={tab.path}
            className={({ isActive }) =>
              `checkio-tab ${isActive ? "active" : ""}`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default CheckInTabs;
