import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../index.css"; // Zorg ervoor dat je de juiste CSS-bestanden hebt

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleTheme = () => {
    setIsLightTheme((prevTheme) => !prevTheme);

    if (document.body.classList.contains("light-theme")) {
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
    }
  };

  useEffect(() => {
        // Detect system preference for light mode
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    if (prefersLight) {
      document.body.classList.add("light-theme");
      setIsLightTheme(true);
    }
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">
        <a href="/" onClick={closeMenu}>ImmoGen</a>
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
            {isLightTheme ? "Dark Mode" : "Light Mode"}
          </button>
        </li>
      </ul>


    </nav>
  );
};

export default Navbar;