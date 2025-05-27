import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Users/homePage";
import PriceCalculator from "./pages/Users/priceCalculator";
import StatisticsPage from "./pages/Users/statisticsPage";
import ProfilePage from "./pages/Users/profilePage";
import AdminPanel from "./pages/Admin/adminPage";
import LoginPage from "./pages/Users/loginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./pages/Users/registerPage";

import './App.css'

function App() {
  return (
    <div className="card">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
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
    </div>
  );
}

export default App
