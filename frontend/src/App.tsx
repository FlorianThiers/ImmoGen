import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/Open/loginPage";
import RegisterPage from "./pages/Open/registerPage";
import LandingPage from "./pages/Open/landingPage";
import LandingPage3 from "./pages/Open/landingPage3";
import Dashboard from "./pages/Users/dashboard";
import PriceCalculator from "./pages/Users/priceCalculator";
import StatisticsPage from "./pages/Users/statisticsPage";
import MapPage from "./pages/Users/mapPage";
import ProfilePage from "./pages/Users/profilePage";
import AdminPanel from "./pages/Admin/adminPage";

import './App.css'

function App() {
  return (
    <Routes>
      {/* Landing page met alleen Navbar */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <LandingPage />
          </>
        }
      />
      {/* Login/Register zonder navbar */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Alle andere pagina's met SideNavbar */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
              <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/price-calculator"
        element={
          <ProtectedRoute>
              <PriceCalculator />
          </ProtectedRoute>
        }
      />
      <Route
        path="/statistics"
        element={
          <ProtectedRoute>
              <StatisticsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/map"
        element={
          <ProtectedRoute>
              <MapPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
              <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-panel"
        element={
          <ProtectedRoute>
              <AdminPanel />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;