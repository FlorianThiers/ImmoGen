import React, { useEffect, useState } from "react";
import axios from "axios";

type User = {
  id: number;
  estimates: Estimate[];
};

type Estimate = {
  user_id: number;
  type: string;
  region: string;
};

const ProfileStats = () => {
  const [user, setUser] = useState<User | null>(null);
  const [typeStats, setTypeStats] = useState<Record<string, number>>({});
  const [regionStats, setRegionStats] = useState<Record<string, number>>({});
  const [mostEstimatedRegion, setMostEstimatedRegion] = useState<string>("");

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

  useEffect(() => {
    const fetchEstimates = async () => {
      if (user) {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/estimates`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const userEstimates = res.data.filter(
            (e: Estimate) => e.user_id === user.id
          );
          setUser((prevUser) =>
            prevUser ? { ...prevUser, estimates: userEstimates } : null
          );

          // Calculate statistics
          const typeCount: Record<string, number> = {};
          const regionCount: Record<string, number> = {};

          userEstimates.forEach((estimate: Estimate) => {
            typeCount[estimate.type] = (typeCount[estimate.type] || 0) + 1;
            regionCount[estimate.region] =
              (regionCount[estimate.region] || 0) + 1;
          });

          setTypeStats(typeCount);
          setRegionStats(regionCount);

          // Find the most estimated region
          const mostEstimatedRegion = Object.entries(regionCount).reduce(
            (a, b) => (b[1] > a[1] ? b : a)
          )[0];
          setMostEstimatedRegion(mostEstimatedRegion);
        } catch (err) {
          console.error("Error fetching estimates:", err);
        }
      }
    };
    fetchEstimates();
  }, [user]);

//   const totalEstimates = user?.estimates.length || 0;
  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-stats">
      <h2>Statistieken</h2>
      <ul>
        <li>
          {/* <strong>Totaal aantal schattingen:</strong> {totalEstimates} */}
        </li>
        <li>
          <strong>Type woningen:</strong>
          <ul>
            {Object.entries(typeStats).map(([type, count]) => (
              <li key={type}>
                {type}: {count}
              </li>
            ))}
          </ul>
        </li>
        <li>
          <strong>Streken:</strong>
          <ul>
            {Object.entries(regionStats).map(([region, count]) => (
              <li key={region}>
                {region}: {count}
              </li>
            ))}
          </ul>
        </li>
        <li>
          <strong>Meest geschatte streek:</strong> {mostEstimatedRegion}
        </li>
      </ul>
    </div>
  );
};

export default ProfileStats;
