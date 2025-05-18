import React, { useState } from "react";
import "../../index.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Dummy login logic, vervang door echte API-call
    if (email === "test@example.com" && password === "wachtwoord") {
      alert("Succesvol ingelogd!");
      // Redirect of set auth state hier
    } else {
      setError("Ongeldige e-mail of wachtwoord.");
    }
    setLoading(false);
  };

  return (
    <div className="login-bg">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Inloggen</h2>
        <div className="login-field">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="login-field">
          <label htmlFor="password">Wachtwoord</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        {error && (
          <div className="login-error">{error}</div>
        )}
        <button type="submit" disabled={loading}>
          {loading ? "Bezig met inloggen..." : "Inloggen"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;