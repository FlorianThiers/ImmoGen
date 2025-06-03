import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './loginPage.css';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simple validation
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        params,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      localStorage.setItem('token', response.data.access_token);
      navigate('/home');
    } catch (err: any) {
      setError('Invalid credentials');
    }
  };

  const handleForgotPassword = () => {
    alert('Forgot password functionality would be implemented here.');
  };

  const handleBackToPreview = () => {
    navigate(-1);
  };

  const handleSignUp = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <button className="back-btn" onClick={handleBackToPreview}>
        ← Back to preview
      </button>
      
      <button className="signup-btn" onClick={handleSignUp}>
        Not a member? Sign Up
      </button>

      <div className="form-container">
        <div className="login-header">
          <img src="/logo.png" alt="ImmoGen Logo" className='login-logo' />
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
                placeholder="Username of E-mail"
                className="with-icon"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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

          <div className="remember-me-container">
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe">Remember Me</label>
            </div>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          <div className="forgot-password">
            <button
              type="button"
              className="forgot-link"
              onClick={handleForgotPassword}
            >
              Forgot your Password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;