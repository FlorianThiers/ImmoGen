import React, { useState } from "react";

import Sidebar from "../../components/SideNavbar";
import Header from "../../components/Header";
import UserField from "../../components/UserField";
import MapStatistic from "../../components/map/MapStatistic";
import HouseMapLandingPage from "../../components/map/maps/HouseMapLandingPage";
import User from "../../context/User";

import "./mapPage.css";
interface ProfilePageProps {
  user?: User | null;
}

const MapPage: React.FC<ProfilePageProps> = ({ user }) => {
  const isDarkTheme = useState(
    typeof document !== "undefined" &&
      document.body.classList.contains("dark-theme")
  );
  const showOverlay = useState(false);
  const overlayTheme = useState(isDarkTheme ? "dark" : "light");
  const [showUserField, setShowUserField] = useState(false);

  return (
    <div className="mappage">
      {showOverlay && (
        <div className={`dashboard-bg-fade ${overlayTheme}`}></div>
      )}

      <div
        className={`dashboard-bg-fade ${isDarkTheme ? "dark" : "light"}`}
      ></div>
      <Sidebar user={user || undefined} activePage="/map"/>
      <main className="main-content">
        <Header
          title="Kaart"
          user={user || undefined}
          onUserClick={() => setShowUserField(true)}
        />

        <div className="content-wrapper">
          <div className="bottom-section">
            <section className="map-main-section">
              <div className="map-content-wrapper">
                <HouseMapLandingPage user={user || undefined}/>
              </div>
            </section>

            <div className="right-panel">
                <MapStatistic />
             
              <section className="right-bottom-section">
                <div className="section-header">
                  <h3>Legenda</h3>
                </div>

                <div className="legend-items">
                  <div className="legend-item">
                    <div className="legend-marker blue"></div>
                    <div className="legend-text">
                      <span className="legend-title">Externe schattingen</span>
                      <span className="legend-description">
                        Eigenschappen geschat door andere gebruikers
                      </span>
                    </div>
                  </div>

                  <div className="legend-item">
                    <div className="legend-marker red"></div>
                    <div className="legend-text">
                      <span className="legend-title">Jouw schattingen</span>
                      <span className="legend-description">
                        Eigenschappen die je zelf hebt geschat
                      </span>
                    </div>
                  </div>

                  <div className="legend-item">
                    <div className="legend-marker immogen"></div>
                    <div className="legend-text">
                      <span className="legend-title">ImmoGen data</span>
                      <span className="legend-description">
                        AI-gegenereerde vastgoedschattingen
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <UserField open={showUserField} user={user || undefined} onClose={() => setShowUserField(false)} />
    </div>
  );
};

export default MapPage;
