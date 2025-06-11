// In App.tsx of in een AuthProvider
import { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import LandingPage from "./pages/Open/landingPage";
import AboutPage from "./pages/Open/aboutPage";
import FeaturesPage from "./pages/Open/featuresPage";
import ContactPage from "./pages/Open/contactPage";
import LoginPage from "./pages/Open/loginPage";
import RegisterPage from "./pages/Open/registerPage";
import Dashboard from "./pages/Users/dashboard";
import PriceCalculator from "./pages/Users/priceCalculator";
import StatisticsPage from "./pages/Users/statisticsPage";
import MapPage from "./pages/Users/mapPage";
import ProfilePage from "./pages/Users/profilePage";
import AdminPanel from "./pages/Admin/adminPage";

import './App.css'

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get(`${import.meta.env.VITE_API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <ThemeProvider>
      <Routes>
        {/* Landing page met alleen Navbar */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/aboutPage" element={<AboutPage />} />
        <Route path="/featuresPage" element={<FeaturesPage />} />
        <Route path="/contactPage" element={<ContactPage />} />
        
        
        {/* Login/Register zonder navbar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Alle andere pagina's met SideNavbar */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute loading={loading}>
                <Dashboard user={user}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/price-calculator"
          element={
            <ProtectedRoute loading={loading}>
                <PriceCalculator user={user}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/statistics"
          element={
            <ProtectedRoute loading={loading}>
                <StatisticsPage user={user}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute loading={loading}>
                <MapPage user={user}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute loading={loading}>
                <ProfilePage user={user}/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-panel"
          element={
            <AdminRoute loading={loading} user={user}>
                <AdminPanel user={user}/>
            </AdminRoute>
          }
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;