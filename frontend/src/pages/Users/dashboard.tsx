import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/SideNavbar';
import Header from '../../components/Header';
import UserField from '../../components/UserField';
import RecentTypes from '../../components/dashboard/RecentTypes';
import RecentEstimations from '../../components/dashboard/RecentEstimations';
import TopMunicipalities from '../../components/dashboard/TopMunicipalities';
import AverageEstimate from '../../components/dashboard/AverageEstimate';



import './dashboard.css'; // Assuming you have a CSS file for styling

const dashboard = () => {
    const isDarkTheme = useState(
        typeof document !== "undefined" && document.body.classList.contains("dark-theme")
    );
    const showOverlay = useState(false);
    const overlayTheme = useState(isDarkTheme ? "dark" : "light");
    const [showUserField, setShowUserField] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/me`, {
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
        <Sidebar/>
        <main className="main-content">
            <Header title="Dashboard" user={user|| undefined} onUserClick={() => setShowUserField(true)}/>

            <div className="content-wrapper">
                <RecentTypes />    

                <div className="bottom-section">
                    <RecentEstimations />    

                    <div className="right-panel">
                        <TopMunicipalities />    
                        <AverageEstimate />
                        
                    </div>
                </div>
            </div>
        </main>
        <UserField open={showUserField}  onClose={() => setShowUserField(false)} />

    </div>

  );
};

export default dashboard;