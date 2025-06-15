import { useEffect, useState } from 'react';
import '../pages/Users/dashboard.css';
import SearchBar from './header/SearchBar';
import NotificationCenter from './header/Notifications';

type HeaderProps = {
    title: string;
    user?: { username: string; email: string };
    onUserClick?: () => void;
    logo?: React.ReactNode; // Voor het logo component
};

const Header = ({ title, user, logo }: HeaderProps) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 420);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const initials = user
        ? (() => {
            const parts = user.username.trim().split(" ");
            if (parts.length === 1) {
                return parts[0].substring(0, 2).toUpperCase();
            }
            return parts.map((n) => n[0]).join("").substring(0, 2).toUpperCase();
        })()
        : "US";

    // Mobile layout: header wordt onderdeel van een top bar met logo
    if (isMobile) {
        return (
            <div className="mobile-top-bar">
                <header className="header">
                    <div className="header-top">
                        <div className="sidebar-logo">
                            <a href="/">
                                <span className="nav-icon logo-icon ">
                                <img src="/logo.png" alt="Logo" className="sidebar-logo" />
                                </span>
                                {/* <span className="nav-label logo-text">ImmoGen</span> */}
                            </a>                
                        </div>
                        <div className="header-user">
                            <NotificationCenter />
                            <div
                                className="user-profile"
                                style={{ cursor: "pointer" }}
                            >
                                <span className="user-avatar">{initials}</span>
                            </div>
                        </div>
                    </div>
                    <div className="header-right">
                        <h1 className="page-title">{title}</h1>
                        <SearchBar />
                    </div>
                </header>
            </div>
        );
    }

    // Desktop layout: normale header
    return (
        <header className="header">
            <h1 className="page-title">{title}</h1>
            <div className="header-right">
                <SearchBar />
                <div className="header-user">
                    <NotificationCenter />
                    <div
                        className="user-profile"
                        style={{ cursor: "pointer" }}
                    >
                        <span className="user-avatar">{initials}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;