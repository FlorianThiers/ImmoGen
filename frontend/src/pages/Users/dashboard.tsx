import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

import Sidebar from "../../components/SideNavbar";
import Header from "../../components/Header";
import UserField from "../../components/UserField";
import RecentTypes from "../../components/dashboard/RecentTypes";
import RecentEstimations from "../../components/dashboard/RecentEstimations";
import TopMunicipalities from "../../components/dashboard/TopMunicipalities";
import AverageEstimate from "../../components/dashboard/AverageEstimate";

import User from "../../context/User";

import "./dashboard.css";
interface DashboardProps {
  user?: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const { isDarkTheme } = useTheme();
  const showOverlay = useState(false);
  const [overlayTheme, setOverlayTheme] = useState(isDarkTheme ? "dark" : "light");
  const [showUserField, setShowUserField] = useState(false);

  // Update overlay theme when isDarkTheme changes
  useEffect(() => {
    setOverlayTheme(isDarkTheme ? "dark" : "light");
  }, [isDarkTheme]);

  return (
    <div className="dashboard">
      {showOverlay && (<div className={`dashboard-bg-fade ${overlayTheme}`}></div>)}
      <div className={`dashboard-bg-fade ${isDarkTheme ? "dark" : "light"}`}></div>
      <Sidebar user={user || undefined} activePage="/dashboard"/>
      <main className="main-content">
        <Header
          title="Dashboard"
          user={user || undefined}
          onUserClick={() => setShowUserField(true)}
        />

        <div className="content-wrapper">
          <RecentTypes user={user || undefined} />

          <div className="bottom-section">
            <RecentEstimations />

            <div className="right-panel">
              <TopMunicipalities />
              <AverageEstimate />
            </div>
          </div>
        </div>
      </main>
      <UserField open={showUserField} user={user || undefined} onClose={() => setShowUserField(false)} />
    </div>
  );
};

export default Dashboard;
