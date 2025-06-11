import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import User from "../context/User";
// import "../index.css"; // Zorg ervoor dat je de juiste CSS-bestanden hebt
import "../pages/Users/dashboard.css"; // Zorg ervoor dat je de juiste CSS-bestanden hebt
import { useTheme } from "../context/ThemeContext";

type Props = {
  user?: User | null;
  activePage?: string;
};

const Sidebar = ({ user, activePage }: Props) => {
  const { isDarkTheme, toggleTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSidebarToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleThemeToggle = () => {
    toggleTheme();

    document.body.classList.add("theme-switching");
    setTimeout(() => {
      document.body.classList.remove("theme-switching");
    }, 800);
  };

  const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // als je nog extra user info opslaat
      window.location.href = '/login'; // harde redirect, zeker dat alles herlaadt
  };

  const isActivePath = (path: string) => {
    return activePage === path;
  };

 return (
    <nav
      className={`sidebar${isExpanded ? " expanded" : ""}`}
    >
      <div className="sidebar-logo sidebar-animate delay-1">
        <a href="/">
          <span className="nav-icon logo-icon ">
            <img src="/logo.png" alt="Logo" className="sidebar-logo" />
          </span>
          <span className="nav-label logo-text">ImmoGen</span>
        </a>
      </div>
      {/* <span>{isExpanded ? "<" : ">"}</span> */}
      <ul className="nav-menu">
        <Link to="/dashboard">
          <li className={`nav-item sidebar-animate delay-2 ${isActivePath('/dashboard') ? 'active' : ''}`}>
            <span className="nav-icon dashboard-icon">
              <img
                src="/dashboard.png"
                alt="Dashboard"
                className="sidebar-icon"
              />
            </span>
            <span className="nav-label">Dashboard</span>
          </li>
        </Link>
        <Link to="/price-calculator">
          <li className={`nav-item sidebar-animate delay-3 ${isActivePath('/price-calculator') ? 'active' : ''}`}>
            <span className="nav-icon calculator-icon">
              <img
                src="/calculator.png"
                alt="Calculator"
                className="sidebar-icon"
              />
            </span>
            <span className="nav-label">Calculator</span>
          </li>
        </Link>
        <Link to="/statistics">
          <li className={`nav-item sidebar-animate delay-4 ${isActivePath('/statistics') ? 'active' : ''}`}>
            <span className="nav-icon transactions-icon">
              <img
                src="/layout.png"
                alt="Transactions"
                className="sidebar-icon"
              />
            </span>
            <span className="nav-label">Statistics</span>
          </li>
        </Link>
        <Link to="/map">
          <li className={`nav-item sidebar-animate delay-5 ${isActivePath('/map') ? 'active' : ''}`}>
            <span className="nav-icon map-icon">
              <img src="/map.png" alt="map" className="sidebar-icon" />
            </span>
            <span className="nav-label">Map</span>
          </li>
        </Link>
        <Link to="/profile">
          <li className={`nav-item sidebar-animate delay-6 ${isActivePath('/profile') ? 'active' : ''}`}>
            <span className="nav-icon exchange-icon">
              <img src="/user.png" alt="Exchange" className="sidebar-icon" />
            </span>
            <span className="nav-label">Profile</span>
          </li>
        </Link>

        {user?.is_admin === true && (
          <Link to="/admin-panel">
            <li className={`nav-item sidebar-animate delay-7 ${isActivePath('/admin-panel') ? 'active' : ''}`}>
              <span className="nav-icon analytics-icon">
                <img src="/admin.png" alt="Analytics" className="sidebar-icon" />
              </span>
              <span className="nav-label">Admin Panel</span>
            </li>
          </Link>
        )}
      </ul>
      <div className="sidebar-toggle" onClick={handleSidebarToggle}>
        <img
          src="/right-arrow.png"
          alt="Toggle Sidebar"
          className={`sidebar-toggle-arrow${isExpanded ? " expanded" : ""}`}
        />
      </div>
      <button
        id="theme-toggle"
        onClick={handleThemeToggle}
        className={`theme-toggle-button ${
          isDarkTheme ? "dark" : "light"
        }`}
        title={isDarkTheme ? "Switch to light mode" : "Switch to dark mode"}
      >
        <img
          src={isDarkTheme ? "/sun.png" : "/moon.png"}
          alt={isDarkTheme ? "Light mode" : "Dark mode"}
          // style={{ width: 24, height: 24 }}
        />
      </button>
      <div className="sidebar-bottom" onClick={logout}>
        <div className="exit-item">
          <span className="exit-icon logout-icon">
            <img src="/exit.png" alt="Logout" className="sidebar-icon" />
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
