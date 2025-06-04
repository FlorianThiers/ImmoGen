import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/SideNavbar';
import Header from '../../components/Header';
import UserField from '../../components/UserField';
import HouseMapLandingPage from '../../components/maps/HouseMapLandingPage';

import './mappage.css';

const MapPage = () => {
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
        <div className="mappage">
            {showOverlay && (
                <div className={`dashboard-bg-fade ${overlayTheme}`}></div>
            )}

            <div className={`dashboard-bg-fade ${isDarkTheme ? "dark" : "light"}`}></div>
            <Sidebar/>
            <main className="main-content">
                <Header title="Kaart" 
                    user={user || undefined}
                    onUserClick={() => setShowUserField(true)}
                />
                
                <div className="content-wrapper">
                    <div className="bottom-section">
                        <section className="map-main-section">
                            <div className="map-content-wrapper">
                                <HouseMapLandingPage />
                            </div>
                        </section>

                        <div className="right-panel">
                            <section className="right-top-section">
                                <div className="section-header">
                                    <h3>Kaart statistieken</h3>
                                </div>
                                
                                <div className="statistics-grid">
                                    <div className="statistic-card">
                                        <div className="statistic-icon blue-marker"></div>
                                        <div className="statistic-content">
                                            <div className="statistic-value">247</div>
                                            <div className="statistic-label">Externe schattingen</div>
                                        </div>
                                    </div>
                                    
                                    <div className="statistic-card">
                                        <div className="statistic-icon red-marker"></div>
                                        <div className="statistic-content">
                                            <div className="statistic-value">32</div>
                                            <div className="statistic-label">Jouw schattingen</div>
                                        </div>
                                    </div>
                                    
                                    <div className="statistic-card">
                                        <div className="statistic-icon total-marker"></div>
                                        <div className="statistic-content">
                                            <div className="statistic-value">€ 428M</div>
                                            <div className="statistic-label">Totale waarde</div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section className="right-bottom-section">
                                <div className="section-header">
                                    <h3>Legenda</h3>
                                </div>
                                
                                <div className="legend-items">
                                    <div className="legend-item">
                                        <div className="legend-marker blue"></div>
                                        <div className="legend-text">
                                            <span className="legend-title">Externe schattingen</span>
                                            <span className="legend-description">Eigenschappen geschat door andere gebruikers</span>
                                        </div>
                                    </div>
                                    
                                    <div className="legend-item">
                                        <div className="legend-marker red"></div>
                                        <div className="legend-text">
                                            <span className="legend-title">Jouw schattingen</span>
                                            <span className="legend-description">Eigenschappen die je zelf hebt geschat</span>
                                        </div>
                                    </div>
                                    
                                    <div className="legend-item">
                                        <div className="legend-marker immogen"></div>
                                        <div className="legend-text">
                                            <span className="legend-title">ImmoGen data</span>
                                            <span className="legend-description">AI-gegenereerde vastgoedschattingen</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
            <UserField open={showUserField} onClose={() => setShowUserField(false)} />
        </div>
    );
};

export default MapPage;