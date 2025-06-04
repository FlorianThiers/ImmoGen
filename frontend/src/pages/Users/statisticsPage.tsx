import axios from "axios";
import { useEffect, useState } from "react";

import Sidebar from "../../components/SideNavbar";
import Header from "../../components/Header";
const StatisticsPage = () => {
  const [featureImportance, setFeatureImportance] = useState([]);
  const [correlations, setCorrelations] = useState<Record<string, number>>({});
  const isDarkTheme = useState(
    typeof document !== "undefined" &&
      document.body.classList.contains("dark-theme")
  );
  const showOverlay = useState(false);
  const overlayTheme = useState(isDarkTheme ? "dark" : "light");
  const [showUserField, setShowUserField] = useState(false);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/statistics`);
        setFeatureImportance(response.data.feature_importance);
        setCorrelations(response.data.correlations);
      } catch (error) {
        console.error("Fout bij het ophalen van statistieken:", error);
      }
    };
    fetchStatistics();
  }, []);

  return (
    <div className="dashboard">
    {showOverlay && (<div className={`dashboard-bg-fade ${overlayTheme}`}></div>)}
    <div className={`dashboard-bg-fade ${isDarkTheme ? "dark" : "light"}`}></div>
    <Sidebar/>
      <main className="main-content">
      <Header title="Statistics" 
        user={user || undefined}
        onUserClick={() => setShowUserField(true)}
      />

        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Statistieken</h1>

          <h2 className="text-xl font-bold mt-4">Belangrijkste Eigenschappen</h2>
          <table className="table-auto border-collapse border border-gray-400 w-full mt-2">
            <thead>
              <tr>
                <th className="border border-gray-400 px-4 py-2">Eigenschap</th>
                <th className="border border-gray-400 px-4 py-2">Belang</th>
              </tr>
            </thead>
            <tbody>
              {featureImportance.map((item: any, index: number) => (
                <tr key={index}>
                  <td className="border border-gray-400 px-4 py-2">{item.feature}</td>
                  <td className="border border-gray-400 px-4 py-2">{item.importance.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="text-xl font-bold mt-4">Correlaties met Prijs</h2>
          <table className="table-auto border-collapse border border-gray-400 w-full mt-2">
            <thead>
              <tr>
                <th className="border border-gray-400 px-4 py-2">Eigenschap</th>
                <th className="border border-gray-400 px-4 py-2">Correlatie</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(correlations).map(([key, value], index: number) => (
                <tr key={index}>
                  <td className="border border-gray-400 px-4 py-2">{key}</td>
                  <td className="border border-gray-400 px-4 py-2">{value.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default StatisticsPage;