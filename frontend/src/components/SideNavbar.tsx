import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// import "../index.css"; // Zorg ervoor dat je de juiste CSS-bestanden hebt
import "../pages/Users/dashboard.css"; // Zorg ervoor dat je de juiste CSS-bestanden hebt

const Navbar = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSidebarToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => !prevTheme);

    document.body.classList.add("theme-switching");
    setTimeout(() => {
      document.body.classList.remove("theme-switching");
    }, 800); // tijd in ms, gelijk aan de langste delay
    if (document.body.classList.contains("dark-theme")) {
      document.body.classList.remove("dark-theme");
    } else {
      document.body.classList.add("dark-theme");
    }
  };

  useEffect(() => {
    // Detect system preference for light mode
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (prefersDark) {
      document.body.classList.add("dark-theme");
      setIsDarkTheme(true);
    }
  }, []);

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
          <li className="nav-item sidebar-animate delay-2">
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
          <li className="nav-item sidebar-animate delay-3">
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
          <li className="nav-item sidebar-animate delay-4">
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
          <li className="nav-item sidebar-animate delay-5">
            <span className="nav-icon map-icon">
              <img src="/map.png" alt="map" className="sidebar-icon" />
            </span>
            <span className="nav-label">Map</span>
          </li>
        </Link>
        <Link to="/profile">
          <li className="nav-item sidebar-animate delay-6">
            <span className="nav-icon exchange-icon">
              <img src="/user.png" alt="Exchange" className="sidebar-icon" />
            </span>
            <span className="nav-label">Profile</span>
          </li>
        </Link>
        <Link to="/admin-panel">
          <li className="nav-item sidebar-animate delay-7">
            <span className="nav-icon analytics-icon">
              <img src="/admin.png" alt="Analytics" className="sidebar-icon" />
            </span>
            <span className="nav-label">Admin Panel</span>
          </li>
        </Link>
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
        onClick={toggleTheme}
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
      <div className="sidebar-bottom">
        <li className="exit-item">
          <span className="exit-icon logout-icon">
            <img src="/exit.png" alt="Logout" className="sidebar-icon" />
          </span>
        </li>
      </div>
    </nav>
  );
};

export default Navbar;
