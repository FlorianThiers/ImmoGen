import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const HomePage = () => {
    const [titles, setTitles] = useState<string[]>([]);
    const [niuewbouw, setNiuewbouw] = useState<string[]>([]);

    useEffect(() => {

      // Haal statistieken op van de backend
      const fetchHouseTitles = async () => {
        try {
          const response = await axios.get("http://localhost:8000/house_titles");
          setTitles(response.data.titles);
          setNiuewbouw(response.data.nieuwbouw);
        } catch (error) {
          console.error("Fout bij het ophalen van woningtitels:", error);
        }
      };
      fetchHouseTitles();
    }, []);
    



  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-6">ImmoGen</h1>
      
      {/* Knop om naar de HouseFormPage te gaan */}
      <Link to="/house-form">
        <button className="bg-blue-500 text-white p-2 rounded">Voeg een huis toe</button>
      </Link>

      <Link to="/price-calculator">
        <button className="bg-blue-500 text-white p-2 rounded ml-4">Bereken woningprijs</button>
      </Link>

      <Link to="/statistics">
        <button className="bg-blue-500 text-white p-2 rounded ml-4">Statistieken</button>
      </Link>

      <Link to="/admin-panel">
        <button className="bg-blue-500 text-white p-2 rounded ml-4">Admin Panel</button>  
      </Link>

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
    </div>
  );
};

export default HomePage;
