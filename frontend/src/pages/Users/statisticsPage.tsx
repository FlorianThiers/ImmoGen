import axios from "axios";
import { useEffect, useState } from "react";

import Sidebar from "../../components/SideNavbar";
import Header from "../../components/Header";
import UserField from "../../components/UserField";
import DataOverview from "../../components/statistics/DataOverview";
import HousesPerCity from "../../components/statistics/HousesPerCity";
import BuildYearCategories from "../../components/statistics/BuildYearCategories";
import FeatureImportance from "../../components/statistics/FeatureImportance";
import CorrelationAnalysis from "../../components/statistics/CorrelationAnalysis";
import PriseComparison from "../../components/statistics/PriceComparison";
import DataQuality from "../../components/statistics/DataQuality";
import AskingPriceVSAIPerice from "../../components/statistics/AskingPriceVSAIPerice"

import FadeInSection from "../../components/FadeInSection";

import House from "../../context/House"
import ScrapeHouse from "../../context/ScrapeHouse"

import "./statisticsPage.css"


const StatisticsPage = () => {
  const isDarkTheme = useState(
    typeof document !== "undefined" &&
      document.body.classList.contains("dark-theme")
  );
  const showOverlay = useState(false);
  const overlayTheme = useState(isDarkTheme ? "dark" : "light");
  const [showUserField, setShowUserField] = useState(false);
  const [user, setUser] = useState(null);
  const [scrapeHouses, setScrapeHouses] = useState<ScrapeHouse[]>([]);
  const [houses, setHouses] = useState<House[]>([]);

  useEffect(() => {
      const fetchHouses = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/scrape_houses`, {
          headers: { Authorization: `Bearer ${token}` },
      });
      setScrapeHouses(res.data);
      console.log(res)
      };
      fetchHouses();
  }, []);  

  useEffect(() => {
      const fetchHouses = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/houses`, {
          headers: { Authorization: `Bearer ${token}` },
      });
      setHouses(res.data);
      };
      fetchHouses();
  }, []);
  
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



  return (
    <div className="dashboard">
      {showOverlay && (
          <div className={`dashboard-bg-fade ${overlayTheme}`}></div>
      )}
      <div className={`dashboard-bg-fade ${isDarkTheme ? "dark" : "light"}`}></div>
      <Sidebar />
      <main className="main-content">
        <Header title="Statistieken" user={user || undefined} onUserClick={() => setShowUserField(true)}/>
        <div className="content-wrapper">
          <DataOverview houses={houses} scrapehouses={scrapeHouses}/>
          <div className="bottom-section-statistics">
            <FadeInSection>
              <div className="Statistic-section-1">
                <div className="left-panel-statistics">
                  <h1 className="text-3xl font-bold mb-8 text-gray-800">ImmoGen</h1>
                  <div className="p-6 bg-gray-50 min-h-screen">
                    <HousesPerCity houses={houses} color={"#82ca9d"}/>
                  </div>
                </div>
                <div className="right-panel-statistics">
                  <h1 className="text-3xl font-bold mb-8 text-gray-800">Scrapings</h1>        
                  <div className="p-6 bg-gray-50 min-h-screen">
                    <HousesPerCity houses={scrapeHouses} color={"#8884d8"}/>
                  </div>
                </div>
              </div>
            </FadeInSection>
            <FadeInSection>
              <div className="Statistic-section-1">
                <div className="left-panel-statistics">
                  <div className="p-6 bg-gray-50 min-h-screen">
                    <BuildYearCategories houses={houses} color={"#82ca9d"}/>
                  </div>
                </div>
                <div className="right-panel-statistics">
                  <div className="p-6 bg-gray-50 min-h-screen">
                    <BuildYearCategories houses={scrapeHouses} color={"#8884d8"}/>
                  </div>
                </div>
              </div>
            </FadeInSection>
            <FadeInSection>
              <div className="Statistic-section-1">
                <div className="left-panel-statistics">
                  <div className="p-6 bg-gray-50 min-h-screen">
                    <DataQuality houses={houses}  color={"#82ca9d"}/>
                  </div>
                </div>
                <div className="right-panel-statistics">
                  <div className="p-6 bg-gray-50 min-h-screen">
                    <DataQuality houses={scrapeHouses}  color={"#8884d8"}/>
                  </div>
                </div>
              </div>
            </FadeInSection>
            {/* <div className="Statistic-section-1">
              <div className="left-panel-statistics">
                <div className="p-6 bg-gray-50 min-h-screen">
                  <FeatureImportance houses={houses}/>
                  <CorrelationAnalysis houses={houses}/>
                </div>
              </div>
              <div className="right-panel-statistics">
                <div className="p-6 bg-gray-50 min-h-screen">
                  <FeatureImportance houses={scrapeHouses}/>
                  <CorrelationAnalysis houses={scrapeHouses}/>
                </div>
              </div>
            </div> */}
          </div>
          <FadeInSection>
            <PriseComparison houses={houses}/>
          </FadeInSection>
          {/* <AskingPriceVSAIPerice houses={houses}/> */}
        </div>
          <UserField open={showUserField} onClose={() => setShowUserField(false)} />
      </main>
    </div>
  );
};

export default StatisticsPage;