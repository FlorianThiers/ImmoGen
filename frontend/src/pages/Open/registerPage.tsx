import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './loginPage.css';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  
  const handleSubmit = async (e: React.FormEvent) => {
    if (password == repassword) {
      e.preventDefault();
      setError("");
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/register`, {
          username,
          email,
          password,
        });
        navigate("/login");
      } catch (err: any) {
          setError(err?.response?.data?.detail || "Registratie mislukt. Probeer een andere gebruikersnaam of e-mail.");
      }
      
    } else {
      alert('Passwoord is niet gelijk')
    }
  };

  const handleBackToPreview = () => {
    navigate(-1);
  };

  const handleSignUp = () => {
    navigate('/login');
  };


  return (
    <div className="login-container">
      <button className="back-btn" onClick={handleBackToPreview}>
        ← Back to preview
      </button>
      
      <button className="signup-btn" onClick={handleSignUp}>
        Allreacy a member? Log In
      </button>

      <div className="form-container">
        <div className="login-header">
          <img src="/logo.png" alt="ImmoGen Logo" className="login-logo"/>
          <div className="login-logo-text">ImmoGen</div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <div className="icon">👤</div>
              <input
                type="text"
                id="username"
                placeholder="Username"
                className="with-icon"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
          </div>

          <div className="form-group">
            <div className="icon">📧</div>
            <input
              type="email"
              id="email"
              placeholder="E-mail"
              className="with-icon"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div className="icon">🔒</div>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="with-icon"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <div className="icon">🔒</div>
            <input
              type="password"
              id="herhaal-password"
              placeholder="Herhaal Password"
              className="with-icon"
              value={repassword}
              onChange={(e) => setRepassword(e.target.value)}
              required
            />
          </div>

         <button type="submit" className="login-btn">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;