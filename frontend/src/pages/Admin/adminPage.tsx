import axios from "axios";
import { useState, useEffect } from "react";

import Sidebar from "../../components/SideNavbar";
import Header from "../../components/Header";
import UserField from "../../components/UserField";
import User from "../../context/User";

import MandelbrotZoom from "../../components/admin/MandelbrotZoom";

import "./AdminPanel.css" // Nieuwe CSS file voor admin panel styles

interface AdminPanelProps {
  user?: User | null;
}

interface SystemStats {
  totalUsers: number;
  totalScrapedPages: number;
  lastTrainingDate: string;
  systemHealth: 'healthy' | 'warning' | 'error';
  storageUsed: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ user }) => {
  const [scrapingStatus, setScrapingStatus] = useState<string | null>(null);
  const [trainingStatus, setTrainingStatus] = useState<string | null>(null);
  const [scrapePages, setScrapePages] = useState<number>(1);
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalUsers: 0,
    totalScrapedPages: 0,
    lastTrainingDate: 'Nooit',
    systemHealth: 'healthy',
    storageUsed: '0 MB'
  });
  const [isScrapingActive, setIsScrapingActive] = useState(false);
  const [isTrainingActive, setIsTrainingActive] = useState(false);
  const [showMandelbrot, setShowMandelbrot] = useState(false);
  
  const isDarkTheme = useState(
    typeof document !== "undefined" &&
      document.body.classList.contains("dark-theme")
  );
  const showOverlay = useState(false);
  const overlayTheme = useState(isDarkTheme ? "dark" : "light");
  const [showUserField, setShowUserField] = useState(false);

  // Systeem statistieken ophalen
  useEffect(() => {
    const fetchSystemStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSystemStats(response.data);
      } catch (error) {
        console.error("Fout bij ophalen statistieken:", error);
      }
    };
    
    fetchSystemStats();
    const interval = setInterval(fetchSystemStats, 30000); // Update elke 30 seconden
    return () => clearInterval(interval);
  }, []);



  // Functie om scraping te starten
  const handleScrape = async () => {
    setScrapingStatus("🔄 Bezig met scrapen...");
    setIsScrapingActive(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/scrape`,
        { max_pages: scrapePages },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setScrapingStatus(`✅ Scraping voltooid: ${response.data.message}`);
    } catch (error) {
      console.error("Fout bij het scrapen:", error);
      setScrapingStatus("❌ Fout bij het scrapen.");
    } finally {
      setIsScrapingActive(false);
    }
  };

  // Functie om model te trainen
  const handleTraining = async () => {
    setTrainingStatus("🔄 Bezig met trainen...");
    setIsTrainingActive(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/train`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrainingStatus(`✅ Training voltooid: ${response.data.message}`);
    } catch (error) {
      console.error("Fout bij het trainen:", error);
      setTrainingStatus("❌ Fout bij het trainen.");
    } finally {
      setIsTrainingActive(false);
    }
  };

  // Database operaties
  const handleDatabaseOperation = async (operation: string) => {
    const confirmMessage = operation === 'clear' ? 
      'Weet je zeker dat je alle gegevens wilt verwijderen? Dit kan niet ongedaan worden gemaakt!' :
      `Weet je zeker dat je deze ${operation} operatie wilt uitvoeren?`;
    
    if (operation === 'clear' && !confirm(confirmMessage)) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/admin/database/${operation}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`✅ ${operation} operatie voltooid: ${response.data.message}`);
    } catch (error) {
      console.error(`Fout bij ${operation}:`, error);
      alert(`❌ Fout bij ${operation} operatie.`);
    }
  };

  const getHealthClass = (health: string) => {
    switch (health) {
      case 'healthy': return 'status-healthy';
      case 'warning': return 'status-warning';
      case 'error': return 'status-error';
      default: return 'status-unknown';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy': return '🟢';
      case 'warning': return '🟡';
      case 'error': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="dashboard">
      {showOverlay && (<div className={`dashboard-bg-fade ${overlayTheme}`}></div>)}
      <div className={`dashboard-bg-fade ${isDarkTheme ? "dark" : "light"}`}></div>
      <Sidebar user={user || undefined} activePage="/admin-panel"/>
      
      <main className="main-content">
        <Header title="Admin Panel" 
          user={user || undefined}
          onUserClick={() => setShowUserField(true)}
        />

        <div className="content-wrapper">
          {/* Systeem Overzicht Dashboard */}
          <div className="stats-grid">
            <div className="stat-card stat-card-blue">
              <div className="stat-content">
                <div className="stat-info">
                  <p className="stat-label">Totaal Gebruikers</p>
                  <p className="stat-value">{systemStats.totalUsers}</p>
                </div>
                <div className="stat-icon">👥</div>
              </div>
            </div>

            <div className="stat-card stat-card-green">
              <div className="stat-content">
                <div className="stat-info">
                  <p className="stat-label">Gescrapte Pagina's</p>
                  <p className="stat-value">{systemStats.totalScrapedPages}</p>
                </div>
                <div className="stat-icon">📄</div>
              </div>
            </div>

            <div className="stat-card stat-card-purple">
              <div className="stat-content">
                <div className="stat-info">
                  <p className="stat-label">Systeemstatus</p>
                  <p className={`stat-status ${getHealthClass(systemStats.systemHealth)}`}>
                    {getHealthIcon(systemStats.systemHealth)} {systemStats.systemHealth}
                  </p>
                </div>
                <div className="stat-icon">⚡</div>
              </div>
            </div>

            <div className="stat-card stat-card-orange">
              <div className="stat-content">
                <div className="stat-info">
                  <p className="stat-label">Opslag Gebruikt</p>
                  <p className="stat-value">{systemStats.storageUsed}</p>
                </div>
                <div className="stat-icon">💾</div>
              </div>
            </div>
          </div>

          {/* Bestaande Admins Component */}
          {/* <div className="admin-section">
            <Admins user={user || undefined}/>
          </div> */}

          {/* Hoofdfunctionaliteit Sectie */}
          <div className="main-actions-grid">
            {/* Scraping Sectie */}
            <div className="action-card">
              <div className="action-header">
                <div className="action-icon">🕷️</div>
                <h2 className="action-title">Web Scraping</h2>
              </div>
              
              <div className="action-content">
                <div className="input-group">
                  <label htmlFor="scrapePages" className="input-label">
                    Aantal pagina's:
                  </label>
                  <input
                    id="scrapePages"
                    type="number"
                    min={1}
                    max={1000}
                    value={scrapePages}
                    onChange={e => setScrapePages(Number(e.target.value))}
                    className="number-input"
                    disabled={isScrapingActive}
                  />
                </div>
                
                <button
                  onClick={handleScrape}
                  disabled={isScrapingActive}
                  className={`action-button ${isScrapingActive ? 'button-disabled' : 'button-primary'}`}
                >
                  {isScrapingActive ? '🔄 Bezig met scrapen...' : '🚀 Start Scraping'}
                </button>
                
                {scrapingStatus && (
                  <div className={`status-message ${
                    scrapingStatus.includes('✅') ? 'status-success' :
                    scrapingStatus.includes('❌') ? 'status-error' :
                    'status-info'
                  }`}>
                    {scrapingStatus}
                  </div>
                )}
              </div>
            </div>

            {/* Training Sectie */}
            <div className="action-card">
              <div className="action-header">
                <div className="action-icon">🧠</div>
                <h2 className="action-title">AI Model Training</h2>
              </div>
              
              <div className="action-content">
                <div className="training-info">
                  <p>Laatste training: {systemStats.lastTrainingDate}</p>
                </div>
                
                <button 
                  onClick={handleTraining}
                  disabled={isTrainingActive}
                  className={`action-button ${isTrainingActive ? 'button-disabled' : 'button-success'}`}
                >
                  {isTrainingActive ? '🔄 Model aan het trainen...' : '🎯 Train Model'}
                </button>
                
                {trainingStatus && (
                  <div className={`status-message ${
                    trainingStatus.includes('✅') ? 'status-success' :
                    trainingStatus.includes('❌') ? 'status-error' :
                    'status-info'
                  }`}>
                    {trainingStatus}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Database Management */}
          <div className="database-section">
            <div className="section-header">
              <div className="section-icon">🗄️</div>
              <h2 className="section-title">Database Management</h2>
            </div>
            
            <div className="database-actions">
              <button 
                onClick={() => handleDatabaseOperation('view')}
                className="db-action-btn db-btn-view"
              >
                <span className="db-btn-icon">👁️</span>
                <span className="db-btn-text">Bekijk Data</span>
              </button>
              
              <button 
                onClick={() => handleDatabaseOperation('add')}
                className="db-action-btn db-btn-add"
              >
                <span className="db-btn-icon">➕</span>
                <span className="db-btn-text">Voeg Toe</span>
              </button>
              
              <button 
                onClick={() => handleDatabaseOperation('export')}
                className="db-action-btn db-btn-export"
              >
                <span className="db-btn-icon">📤</span>
                <span className="db-btn-text">Exporteer</span>
              </button>
              
              <button 
                onClick={() => handleDatabaseOperation('import')}
                className="db-action-btn db-btn-import"
              >
                <span className="db-btn-icon">📥</span>
                <span className="db-btn-text">Importeer</span>
              </button>
              
              <button 
                onClick={() => handleDatabaseOperation('logs')}
                className="db-action-btn db-btn-logs"
              >
                <span className="db-btn-icon">📋</span>
                <span className="db-btn-text">Logs</span>
              </button>
              
              <button 
                onClick={() => handleDatabaseOperation('clear')}
                className="db-action-btn db-btn-danger"
              >
                <span className="db-btn-icon">🗑️</span>
                <span className="db-btn-text">Verwijder Alles</span>
              </button>
            </div>
          </div>

          {/* Extra Tools Sectie */}
          <div className="tools-section">
            <div className="section-header">
              <div className="section-icon">🛠️</div>
              <h2 className="section-title">Developer Tools</h2>
            </div>
            
            <div className="tools-grid">
              <button 
                onClick={() => setShowMandelbrot(!showMandelbrot)}
                className="tool-btn tool-btn-mandelbrot"
              >
                <span className="tool-icon">🌀</span>
                <span className="tool-text">Mandelbrot Visualizer</span>
              </button>
              
              <button 
                onClick={() => handleDatabaseOperation('backup')}
                className="tool-btn tool-btn-backup"
              >
                <span className="tool-icon">💾</span>
                <span className="tool-text">Maak Backup</span>
              </button>
              
              <button 
                onClick={() => handleDatabaseOperation('optimize')}
                className="tool-btn tool-btn-optimize"
              >
                <span className="tool-icon">⚡</span>
                <span className="tool-text">Optimaliseer DB</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Mandelbrot Overlay */}
      {showMandelbrot && (
        <div className="mandelbrot-overlay">
          <div className="mandelbrot-modal">
            <div className="mandelbrot-header">
              <h3 className="mandelbrot-title">Mandelbrot Set Visualizer</h3>
              <button 
                onClick={() => setShowMandelbrot(false)}
                className="mandelbrot-close"
              >
                ×
              </button>
            </div>
            <div className="mandelbrot-content">
              <MandelbrotZoom />
            </div>
          </div>
        </div>
      )}

      <UserField 
        open={showUserField} 
        user={user || undefined} 
        onClose={() => setShowUserField(false)} 
      />
    </div>
  );
};

export default AdminPanel;