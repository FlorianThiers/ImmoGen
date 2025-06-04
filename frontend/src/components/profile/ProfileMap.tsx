import React, { useEffect, useState } from "react";
import axios from "axios";

import HouseMapProfile from "../../components/maps/HouseMapProfile";

type User = {
  id: number;
  estimates: Estimate[];
};

type Estimate = {
  user_id: number;
  lat: number;
  lon: number;
  address: string;
  value: number;
};

const ProfileMap = () => {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser({ ...res.data, estimates: [] });
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  //zoek alle huizen met de user_id van de user
  useEffect(() => {
    const fetchEstimates = async () => {
      if (user) {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/estimates`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const userEstimates = res.data.filter((e: Estimate) => e.user_id === user.id);
          setUser((prevUser) => prevUser ? { ...prevUser, estimates: userEstimates } : null);
        } catch (err) {
          console.error("Error fetching estimates:", err);
        }
      }
    };
    fetchEstimates();
  }, [user]);



  return (
    <div className="profile-flex">
        <div className="profile-map">
        <h2>Mijn schattingen op de kaart</h2>
        <HouseMapProfile
            houses={
            user
                ? user.estimates.map((e) => ({
                    lat: e.lat,
                    lon: e.lon,
                    ownEstimate: true,
                    address: e.address,
                    value: e.value,
                }))
                : []
            }
        />
        </div>
    </div>
  );
};

export default ProfileMap;