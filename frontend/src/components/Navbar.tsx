import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../index.css"; // Zorg ervoor dat je de juiste CSS-bestanden hebt

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
        // Detect system preference for light mode
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      document.body.classList.add("dark-theme");
    }
  }, []);

  return (
    <nav className="navbar">
      <Link to="/dashboard" onClick={closeMenu}>
        <div className="logo">
          <img src="/logo.png" alt="ImmoGen Logo" style={{ height: "30px", marginRight: "8px" }} />
          <p className="logo-text">
            ImmoGen 
          </p>
        </div>
      </Link>
      
      <div className="burger-icon" onClick={toggleMenu}>
        {/* Hamburger icon */}
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      <ul className={`nav-links ${isMenuOpen ? "open" : ""}`}>
        <li onClick={closeMenu} className="close-icon">X</li>
        <li><Link to="/price-calculator" onClick={closeMenu}>Home</Link></li>
        <li><Link to="/statistics" onClick={closeMenu}>About</Link></li>
        <li><Link to="/profile" onClick={closeMenu}>Features</Link></li>
        <li><Link to="/admin-panel" onClick={closeMenu}>Contact Us</Link></li>
        
        <li>
          <button className="btn-primary" onClick={() => window.location.href = "/login"}>
            Login
          </button>
        </li>
      </ul>


    </nav>
  );
};

export default Navbar;