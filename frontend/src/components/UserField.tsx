import axios from 'axios';
import React, { useEffect, useState} from 'react';
import "../pages/Users/dashboard.css";

type UserFieldProps = {
  open: boolean;
  user?: { username: string; email: string };
  onClose: () => void;
};

const UserField = ({ open, user, onClose }: UserFieldProps) => {
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null); 

  if (!open) return null;

  return (
    <div className="user-panel-slide">
      <button className="close-btn" onClick={onClose}>×</button>
      <div className="user-panel-content">
        <img
          src="/profileImg.png"
          alt="Profile"
          className="profile-img"
          />
        <h2>User Info</h2>

        <div className="user-info">
          <p><strong>Username:</strong> {user?.username || "Loading..."}</p>
          <p><strong>Email:</strong> {user?.email || "Loading..."}</p>
          {/* <p><strong>Role:</strong> {user?.role || "Loading..."}</p> */}
        </div>
      </div>
    </div>
  );
};

export default UserField;