import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Users/homePage";
import PriceCalculator from "./pages/Users/priceCalculator";
import StatisticsPage from "./pages/Users/statisticsPage";
import AdminPanel from "./pages/Admin/AdminPanel";

import './App.css'


function App() {
  return (
      <div className="card">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/price-calculator" element={<PriceCalculator />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
        </Routes>
      </div>
  )
}

export default App
