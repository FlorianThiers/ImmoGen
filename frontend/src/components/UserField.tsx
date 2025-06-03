import React from "react";
import "../pages/Users/dashboard.css";

type UserFieldProps = {
  open: boolean;
  onClose: () => void;
};

const UserField = ({ open, onClose }: UserFieldProps) => {
  if (!open) return null;

  return (
    <div className="user-panel-slide">
      <div className="user-panel-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>User Info</h2>
        <p>Naam: Ryan Danielson</p>
        <p>Email: ryan@example.com</p>
        {/* Voeg hier meer user info toe */}
      </div>
    </div>
  );
};

export default UserField;