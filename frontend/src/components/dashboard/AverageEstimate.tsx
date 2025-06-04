import React, { useEffect, useState } from "react";
import axios from "axios";

type House = {
  id: number;
  title: string;
  image_url?: string;
  created_at: string;
  price: string | number;
  city: string;
  // ...andere velden
};

const AverageEstimate = () => {
  const [houses, setHouses] = useState<House[]>([]);

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

  // geef de populairste gemeenten weer
  const municipalities = houses.reduce((acc: Record<string, { count: number; avgPrice: number }>, house) => {
    const city = house.city || "Onbekend";
    if (!acc[city]) {
      acc[city] = { count: 0, avgPrice: 0 };
    }
    acc[city].count += 1;
    acc[city].avgPrice += (typeof house.price === "number" ? house.price : parseFloat(house.price)) || 0;
    return acc;
  }, {});

  // Bereken gemiddelde prijs per gemeente
  const municipalityList = Object.entries(municipalities).map(([city, data]) => ({
    name: city,
    count: data.count,
    avgPrice: data.avgPrice / data.count
  }));

  // Sorteer op aantal schattingen (hoog naar laag)
  municipalityList.sort((a, b) => b.count - a.count);
  // Neem de top 3
  const topMunicipalities = municipalityList.slice(0, 3);
  
  if (topMunicipalities.length === 0) {
    return <div className="no-data">Geen gegevens beschikbaar</div>;
  }
  // Render de top 3 populairste gemeenten
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nl-BE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price);
  }
  const renderMunicipalityRow = (municipality: { name: string; count: number; avgPrice: number }) => (
    <div className="municipality-row" key={municipality.name}>
      <span className="municipality-name">{municipality.name}</span>
      <span className="municipality-count">{municipality.count} schattingen</span>
      <span className="municipality-avg">{formatPrice(municipality.avgPrice)}</span>
    </div>
  );


  return (
    <section className="right-bottom-section">
        <div className="section-header">
            <h3>Top 3 populairste gemeenten</h3>
            <span className="date-range">Laatste 30 dagen</span>
        </div>
        <div className="municipality-list">
            {topMunicipalities.map(renderMunicipalityRow)}
        </div>
    </section>
  );
};

export default AverageEstimate;