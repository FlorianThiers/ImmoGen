import axios from "axios";
import { useState, useEffect } from "react";

import Sidebar from "../../components/SideNavbar";
import Header from "../../components/Header";
import UserField from "../../components/UserField";

const AdminPanel = () => {
  const [scrapingStatus, setScrapingStatus] = useState<string | null>(null);
  const [trainingStatus, setTrainingStatus] = useState<string | null>(null);
  const [scrapePages, setScrapePages] = useState<number>(1);
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


  // Functie om scraping te starten
  const handleScrape = async () => {
    setScrapingStatus("Bezig met scrapen...");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/scrape`,
        { max_pages: scrapePages }
      );
      setScrapingStatus(`✅ Scraping voltooid: ${response.data.message}`);
    } catch (error) {
      console.error("Fout bij het scrapen:", error);
      setScrapingStatus("❌ Fout bij het scrapen.");
    }
  };

  // Functie om model te trainen
  const handleTraining = async () => {
    setTrainingStatus("Bezig met trainen...");
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/train`);
      setTrainingStatus(`✅ Training voltooid: ${response.data.message}`);
    } catch (error) {
      console.error("Fout bij het trainen:", error);
      setTrainingStatus("❌ Fout bij het trainen.");
    }
  };

  return (
    <div className="dashboard">
      {showOverlay && (<div className={`dashboard-bg-fade ${overlayTheme}`}></div>)}
      <div className={`dashboard-bg-fade ${isDarkTheme ? "dark" : "light"}`}></div>
      <Sidebar/>
      <main className="main-content">
        <Header title="Admin Panel" 
          user={user || undefined}
          onUserClick={() => setShowUserField(true)}
        />
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
          <h2 className="text-xl font-bold mt-6">Scraping Status</h2>
          <div className="flex items-center gap-2 mb-2">
            <label htmlFor="scrapePages" className="font-medium">Aantal pagina's:</label>
            <input
              id="scrapePages"
              type="number"
              min={1}
              value={scrapePages}
              onChange={e => setScrapePages(Number(e.target.value))}
              className="border px-2 py-1 rounded w-20"
            />
          </div>
          <button
            onClick={handleScrape}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Start Scraping
          </button>
          {scrapingStatus && <p className="mt-2">{scrapingStatus}</p>}

          <h2 className="text-xl font-bold mt-6">Model Trainer</h2>
          <button 
            onClick={handleTraining}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2">
            Train Model
          </button>
          {trainingStatus && <p className="mt-2">{trainingStatus}</p>}

          <h2 className="text-xl font-bold mt-6">Database Management</h2>
          <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-2">
            Verwijder alle gegevens
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2 ml-2">
            Voeg gegevens toe
          </button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mt-2 ml-2">
            Bekijk gegevens
          </button>
          <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 mt-2 ml-2">
            Exporteer gegevens
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mt-2 ml-2">
            Importeer gegevens
          </button>
          <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 mt-2 ml-2">
            Bekijk logs
          </button>
        
          
        </div>
      </main>
        <UserField open={showUserField} onClose={() => setShowUserField(false)} />
    </div>
  );
};

export default AdminPanel;