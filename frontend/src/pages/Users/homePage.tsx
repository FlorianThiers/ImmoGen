import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import HouseMapLandingPage from "../../components/maps/HouseMapLandingPage";

const HomePage = () => {
  const [titles, setTitles] = useState<string[]>([]);
  const [niuewbouw, setNiuewbouw] = useState<string[]>([]);
  const [featureImportance, setFeatureImportance] = useState([]);
  const [correlations, setCorrelations] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchHouseTitles = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/house_titles`
        );
        setTitles(response.data.titles);
        setNiuewbouw(response.data.nieuwbouw);
      } catch (error) {
        console.error("Fout bij het ophalen van woningtitels:", error);
      }
    };
    fetchHouseTitles();

    const fetchStatistics = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/statistics`
        );
        setFeatureImportance(response.data.feature_importance);
        setCorrelations(response.data.correlations);
      } catch (error) {
        console.error("Fout bij het ophalen van statistieken:", error);
      }
    };
    fetchStatistics();
  }, []);

  return (
    <div className="p-4 text-center">
      <div className="hero">
        <h1>Welkom bij ImmoGen</h1>
        <p>
          hier kun je de woningprijs berekenen.
        </p>
        <div className="buttons">
          <Link to="/price-calculator">
            <button className="calculate-button">Bereken woningprijs</button>
          </Link>
        </div>
      </div>

      {/* Lijst van titels */}
      <h2 className="text-xl font-bold mt-6">Beschikbare Woningtypes</h2>
      <ul>
        {titles.map((title, index) => (
          <li key={index}>{title}</li>
        ))}
      </ul>
      <ul>
        {niuewbouw.map((title, index) => (
          <li key={index}>{title}</li>
        ))}
      </ul>

      <HouseMapLandingPage />
    </div>
  );
};

export default HomePage;
