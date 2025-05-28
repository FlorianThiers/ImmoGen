import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./components/Navbar";
import MainLayout from "./components/MainLayout";
import LoginPage from "./pages/Open/loginPage";
import RegisterPage from "./pages/Open/registerPage";
import LandingPage from "./pages/Open/landingPage3";
import LandingPage2 from "./pages/Open/landingPage";
import HomePage from "./pages/Users/homePage";
import PriceCalculator from "./pages/Users/priceCalculator";
import StatisticsPage from "./pages/Users/statisticsPage";
import ProfilePage from "./pages/Users/profilePage";
import AdminPanel from "./pages/Admin/adminPage";

import './App.css'

function App() {
  return (
    <div className="card">
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
          path="/home"
          element={
            <ProtectedRoute>
              <MainLayout>
                <HomePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/price-calculator"
          element={
            <ProtectedRoute>
              <MainLayout>
                <PriceCalculator />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/statistics"
          element={
            <ProtectedRoute>
              <MainLayout>
                <StatisticsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-panel"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AdminPanel />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;