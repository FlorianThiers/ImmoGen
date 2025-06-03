import React, { useState } from 'react';
import '../pages/Users/dashboard.css';

type HeaderProps = {
    title: string;
    user?: { username: string; email: string };
    onUserClick?: () => void;

};

const Header = ({ title, user, onUserClick }: HeaderProps) => {
    const initials = user
        ? user.username
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()
        : "US";

    return (
            <header className="header">
                <h1 className="page-title">{title}</h1>
                <div className="header-right">
                    <div className="search-bar">
                        <span className="search-icon"></span>
                        <input type="text" placeholder="Zoek" />
                    </div>
                    <div className="notification">
                        <span className="notification-icon"></span>
                        <span className="notification-badge"></span>
                    </div>
                    <div
                        className="user-profile"
                        onClick={onUserClick}
                        style={{ cursor: "pointer" }}
                    >
                        <span className="user-avatar">{initials}</span>
                    </div>
                </div>
            </header>
    );
};

export default Header;