import React, { useState } from 'react';
import '../pages/Users/dashboard.css';

type HeaderProps = {
    title: string;
};

const Header = ({ title }: HeaderProps) => {
    const [showUserPanel, setShowUserPanel] = useState(false);

    return (
        <>
            <header className="header">
                <h1 className="page-title">{title}</h1>
                <div className="header-right">
                    <div className="search-bar">
                        <span className="search-icon"></span>
                        <input type="text" placeholder="Search" />
                    </div>
                    <div className="notification">
                        <span className="notification-icon"></span>
                        <span className="notification-badge"></span>
                    </div>
                    <div
                        className="user-profile"
                        onClick={() => setShowUserPanel((prev) => !prev)}
                        style={{ cursor: "pointer" }}
                    >
                        <span className="user-avatar">RD</span>
                    </div>
                </div>
            </header>
            {showUserPanel && (
                <div className="user-panel-slide">
                    <div className="user-panel-content">
                        <button className="close-btn" onClick={() => setShowUserPanel(false)}>×</button>
                        <h2>User Info</h2>
                        <p>Naam: Ryan Danielson</p>
                        <p>Email: ryan@example.com</p>
                        {/* Voeg hier meer user info toe */}
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;