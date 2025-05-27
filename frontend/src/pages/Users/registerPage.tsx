import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
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
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center">Registreren</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input
          type="text"
          placeholder="Gebruikersnaam"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full px-3 py-2 mb-4 border rounded"
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-3 py-2 mb-4 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Wachtwoord"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-3 py-2 mb-4 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Registreren
        </button>
        <p className="text-center mt-4">
          Al een account?{" "}
          <button
            type="button"
            className="text-blue-600 underline"
            onClick={() => navigate("/login")}
          >
            Log hier in
          </button>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;