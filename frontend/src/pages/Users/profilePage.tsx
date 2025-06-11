import React, { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import Sidebar from "../../components/SideNavbar";
import Header from "../../components/Header";

import UserInfo from "../../components/profile/UserInfo";
import ProfileMap from "../../components/profile/ProfileMap";
import ProfileStats from "../../components/profile/ProfileStats";
import UserEstimates from "../../components/profile/UserEstimates";
import User from "../../context/User";

import "./profilePage.css";
interface ProfilePageProps {
  user?: User | null;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  const { isDarkTheme } = useTheme();
  const showOverlay = useState(false);
  const [overlayTheme, setOverlayTheme] = useState(isDarkTheme ? "dark" : "light");

    // Update overlay theme when isDarkTheme changes
    useEffect(() => {
      setOverlayTheme(isDarkTheme ? "dark" : "light");
    }, [isDarkTheme]);

  return (
    <div className="dashboard">
      {showOverlay && (
          <div className={`dashboard-bg-fade ${overlayTheme}`}></div>
      )}
      <div className={`dashboard-bg-fade ${isDarkTheme ? "dark" : "light"}`}></div>
      <Sidebar user={user || undefined} activePage="/profile"  />
      <main className="main-content">
        <Header title="Profiel" user={user || undefined}/>
        <div className="content-wrapper">
          <div className="bottom-section-profile">
            <div className="left-panel">
              <UserInfo/>
              <ProfileStats />
            </div>
            <div className="right-panel">
              <ProfileMap user={user || undefined}/>
              <UserEstimates />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
