import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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
      navigate('/'); // or wherever you want to redirect after login
    } catch (err: any) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Username of E-mail"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 mb-4 border rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 mb-4 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Login
        </button>

        <p className="text-center mt-4">
          Nog geen account?{" "}
          <button
            type="button"
            className="text-blue-600 underline"
            onClick={() => navigate("/register")}
          >
            Registreer hier
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
