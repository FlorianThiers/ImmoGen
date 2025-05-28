import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../index.css"; // Zorg ervoor dat je de juiste CSS-bestanden hebt

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => !prevTheme);

    if (document.body.classList.contains("dark-theme")) {
      document.body.classList.remove("dark-theme");
    } else {
      document.body.classList.add("dark-theme");
    }
  };

  useEffect(() => {
        // Detect system preference for light mode
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      document.body.classList.add("dark-theme");
      setIsDarkTheme(true);
    }
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">
        <a href="/home" onClick={closeMenu}>ImmoGen</a>
      </div>
      
      <div className="burger-icon" onClick={toggleMenu}>
        {/* Hamburger icon */}
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      <ul className={`nav-links ${isMenuOpen ? "open" : ""}`}>
        <li onClick={closeMenu} className="close-icon">X</li>
        <li><Link to="/price-calculator" onClick={closeMenu}>Calculator</Link></li>
        <li><Link to="/statistics" onClick={closeMenu}>Statistics</Link></li>
        <li><Link to="/profile" onClick={closeMenu}>Profiel</Link></li>
        <li><Link to="/admin-panel" onClick={closeMenu}>Admin</Link></li>
        
        <li>
          <button id="theme-toggle" onClick={toggleTheme}  className="theme-toggle-button">
            {isDarkTheme ? "Dark Mode" : "Light Mode"}
          </button>
        </li>
      </ul>


    </nav>
  );
};

export default Navbar;