import React, { useEffect, useState } from "react";
import axios from "axios";

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
};


const UserInfo = () => {
    const [user, setUser] = useState<User | null>(null);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="user-info">
      <img
          src="/profileImg.png"
          alt="profielfoto"
          className="profile-img"
        />
      {user ? (
          <div className="profile-info">
            <h1 className="profile-name">
                {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
            </h1>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Rol:</strong> {user.role}</p>
            <button className="edit-profile-btn">Profiel bewerken</button>
          </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}   

export default UserInfo;