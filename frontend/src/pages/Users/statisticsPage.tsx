import axios from "axios";
import { useEffect, useState } from "react";

import Sidebar from "../../components/SideNavbar";
import Header from "../../components/Header";
const StatisticsPage = () => {
  const [featureImportance, setFeatureImportance] = useState([]);
  const [correlations, setCorrelations] = useState<Record<string, number>>({});
  const isDarkTheme = useState(
    typeof document !== "undefined" &&
      document.body.classList.contains("dark-theme")
  );
  const showOverlay = useState(false);
  const overlayTheme = useState(isDarkTheme ? "dark" : "light");
  const [showUserField, setShowUserField] = useState(false);
  const [user, setUser] = useState(null);
  
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
    <div className="dashboard">
      {showOverlay && (
          <div className={`dashboard-bg-fade ${overlayTheme}`}></div>
      )}
      <div className={`dashboard-bg-fade ${isDarkTheme ? "dark" : "light"}`}></div>
      <Sidebar />
      <main className="main-content">
        <Header title="Profiel" user={user || undefined}/>
        <div className="content-wrapper">
          <div className="bottom-section-profile">
            <div className="left-panel">

            </div>
            <div className="right-panel">

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StatisticsPage;