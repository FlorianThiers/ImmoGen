import React, { useEffect, useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, LineChart, Line } from "recharts";

// Mock data generator voor demo purposes
const generateMockData = () => {
  const cities = ["Antwerpen", "Gent", "Brussel", "Leuven", "Brugge", "Mechelen", "Hasselt"];
  const mockHouses = [];
  const mockScrapeHouses = [];
  
  // Generate mock houses (immoGen data)
  for (let i = 0; i < 150; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const basePrice = 200000 + Math.random() * 300000;
    mockHouses.push({
      id: i + 1,
      city,
      postal_code: `${Math.floor(Math.random() * 9000) + 1000}`,
      street: `Straat ${i + 1}`,
      title: `Huis ${i + 1}`,
      ai_price: Math.round(basePrice * (0.9 + Math.random() * 0.2)),
      price: Math.round(basePrice),
      created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      oppervlakte: Math.floor(80 + Math.random() * 200),
      bouwjaar: Math.floor(1920 + Math.random() * 100),
      epc: Math.floor(Math.random() * 500) + 50,
      ligging_score: Math.random() * 10,
      grondoppervlakte: Math.floor(100 + Math.random() * 1000),
      renovatie_nodig: Math.random() > 0.7
    });
  }
  
  // Generate mock scrape houses
  for (let i = 0; i < 200; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    mockScrapeHouses.push({
      id: i + 1,
      city,
      postal_code: `${Math.floor(Math.random() * 9000) + 1000}`,
      street: `Straat ${i + 1}`,
      title: `Scraped Huis ${i + 1}`,
      price: Math.round(200000 + Math.random() * 300000),
      oppervlakte: Math.floor(80 + Math.random() * 200),
      bouwjaar: Math.floor(1920 + Math.random() * 100),
      epc: Math.floor(Math.random() * 500) + 50,
      renovatie_nodig: Math.random() > 0.7
    });
  }
  
  return { mockHouses, mockScrapeHouses };
};

type House = {
  id: number;
  city: string;
  postal_code: string;
  street: string;
  title: string;
  ai_price: number;
  price: number;
  created_at: string;
  oppervlakte: number;
  bouwjaar: number;
  epc: number;
  ligging_score: number;
  grondoppervlakte: number;
  renovatie_nodig: boolean;
};

type ScrapeHouse = {
  id: number;
  city: string;
  postal_code: string;
  street: string;
  title: string;
  price: number;
  oppervlakte: number;
  bouwjaar: number;
  epc: number;
  renovatie_nodig: boolean;
};

const Stats1 = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [scrapehouses, setScrapeHouses] = useState<ScrapeHouse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls with mock data
    const { mockHouses, mockScrapeHouses } = generateMockData();
    setHouses(mockHouses);
    setScrapeHouses(mockScrapeHouses);
    setLoading(false);
  }, []);

  // 1. Data Overview & Volumes
  const dataOverview = useMemo(() => {
    return [
      { name: "ImmoGen Houses", value: houses.length, color: "#8884d8" },
      { name: "Scraped Houses", value: scrapehouses.length, color: "#82ca9d" }
    ];
  }, [houses, scrapehouses]);

  // Houses per city
  const housesPerCity = useMemo(() => {
    const cityCount: { [key: string]: number } = {};
    [...houses, ...scrapehouses].forEach(house => {
      cityCount[house.city] = (cityCount[house.city] || 0) + 1;
    });
    return Object.entries(cityCount).map(([city, count]) => ({ city, count }));
  }, [houses, scrapehouses]);

  // Houses per build year category
  const buildYearCategories = useMemo(() => {
    const categories = {
      "Voor 1945": 0,
      "1945-1970": 0,
      "1970-1990": 0,
      "1990-2010": 0,
      "Na 2010": 0
    };
    
    [...houses, ...scrapehouses].forEach(house => {
      const year = house.bouwjaar || 1980;
      if (year < 1945) categories["Voor 1945"]++;
      else if (year < 1970) categories["1945-1970"]++;
      else if (year < 1990) categories["1970-1990"]++;
      else if (year < 2010) categories["1990-2010"]++;
      else categories["Na 2010"]++;
    });
    
    return Object.entries(categories).map(([category, count]) => ({ category, count }));
  }, [houses, scrapehouses]);

  // 2. Feature Importance (mock data)
  const featureImportance = [
    { feature: "ligging_score", importance: 0.35, impact: "positive" },
    { feature: "oppervlakte", importance: 0.28, impact: "positive" },
    { feature: "epc", importance: -0.22, impact: "negative" },
    { feature: "grondoppervlakte", importance: 0.18, impact: "positive" },
    { feature: "bouwjaar", importance: 0.15, impact: "positive" },
    { feature: "renovatie_nodig", importance: -0.12, impact: "negative" },
    { feature: "stad_centrum_afstand", importance: -0.10, impact: "negative" },
    { feature: "aantal_kamers", importance: 0.08, impact: "positive" },
    { feature: "garage", importance: 0.06, impact: "positive" },
    { feature: "tuin", importance: 0.04, impact: "positive" }
  ];

  // 3. Correlation Matrix (mock data)
  const correlationData = [
    { feature1: "oppervlakte", feature2: "prijs", correlation: 0.75 },
    { feature1: "ligging_score", feature2: "prijs", correlation: 0.68 },
    { feature1: "epc", feature2: "prijs", correlation: -0.45 },
    { feature1: "bouwjaar", feature2: "prijs", correlation: 0.32 },
    { feature1: "grondoppervlakte", feature2: "prijs", correlation: 0.58 },
    { feature1: "renovatie_nodig", feature2: "prijs", correlation: -0.28 }
  ];

  // 4. Data Quality
  const dataQuality = [
    { feature: "prijs", missing: 2, total: houses.length + scrapehouses.length },
    { feature: "oppervlakte", missing: 15, total: houses.length + scrapehouses.length },
    { feature: "epc", missing: 8, total: houses.length + scrapehouses.length },
    { feature: "bouwjaar", missing: 12, total: houses.length + scrapehouses.length },
    { feature: "ligging_score", missing: 5, total: houses.length + scrapehouses.length }
  ].map(item => ({
    ...item,
    percentage: ((item.total - item.missing) / item.total * 100).toFixed(1)
  }));

  // 6. Price Comparison
  type PriceStatus = "Overpriced" | "Underpriced" | "Fair";

  const priceComparison = useMemo(() => {
    return houses.map(house => ({
      id: house.id,
      vraagprijs: house.price,
      ai_prijs: house.ai_price,
      verschil: house.price - house.ai_price,
      status: house.price > house.ai_price * 1.1 ? "Overpriced" as PriceStatus : 
              house.price < house.ai_price * 0.9 ? "Underpriced" as PriceStatus : "Fair" as PriceStatus
    }));
  }, [houses]);

  const overUnderPriced = useMemo(() => {
    const counts: Record<PriceStatus, number> = { Overpriced: 0, Underpriced: 0, Fair: 0 };
    priceComparison.forEach(house => counts[house.status]++);
    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  }, [priceComparison]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Real Estate Analytics Dashboard</h1>
      
      {/* 1. Data Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Data Volume Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dataOverview}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {dataOverview.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Houses per City</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={housesPerCity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="city" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Build Year Categories */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Houses per Build Year Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={buildYearCategories}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 2. Feature Importance */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Top 10 Feature Importance (ImmoGen Model)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={featureImportance}
            layout="horizontal"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="feature" type="category" />
            <Tooltip 
              formatter={(value, name) => {
                const numValue = typeof value === "number" ? value : parseFloat(value as string);
                return [
                  `${Math.abs(numValue).toFixed(3)}`,
                  numValue > 0 ? "Positive Impact" : "Negative Impact"
                ];
              }}
            />
            <Bar 
              dataKey="importance" 
              fill="#8884d8"
            >
              {featureImportance.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.impact === "positive" ? "#4ade80" : "#ef4444"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 3. Correlation Analysis */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Feature Correlations</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {correlationData.map((item, index) => (
            <div key={index} className="border rounded p-3">
              <div className="font-medium text-sm">{item.feature1} ↔ {item.feature2}</div>
              <div className={`text-lg font-bold ${item.correlation > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {item.correlation.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Data Quality */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Data Quality & Completeness</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataQuality}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="feature" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value}%`, "Completeness"]} />
            <Bar dataKey="percentage" fill="#fbbf24" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 6. Price Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Price Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={overUnderPriced}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, count }) => `${status}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {overUnderPriced.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={
                    entry.status === "Overpriced" ? "#ef4444" :
                    entry.status === "Underpriced" ? "#3b82f6" : "#10b981"
                  } />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Asking Price vs AI Price</h2>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={priceComparison.slice(0, 50)}>
              <CartesianGrid />
              <XAxis dataKey="vraagprijs" name="Asking Price" />
              <YAxis dataKey="ai_prijs" name="AI Price" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter dataKey="ai_prijs" fill="#8884d8" />
              <Line type="monotone" dataKey="vraagprijs" stroke="#ff7300" strokeDasharray="5 5" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-blue-600">{houses.length}</div>
          <div className="text-sm text-gray-600">ImmoGen Houses</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-green-600">{scrapehouses.length}</div>
          <div className="text-sm text-gray-600">Scraped Houses</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-purple-600">
            {priceComparison.length > 0 ? 
              Math.round(priceComparison.reduce((acc, h) => acc + Math.abs(h.verschil), 0) / priceComparison.length) : 0
            }€
          </div>
          <div className="text-sm text-gray-600">Avg Price Difference</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-orange-600">
            {dataQuality.length > 0 ? 
              Math.round(dataQuality.reduce((acc, item) => acc + parseFloat(item.percentage), 0) / dataQuality.length) : 0
            }%
          </div>
          <div className="text-sm text-gray-600">Avg Data Completeness</div>
        </div>
      </div>
    </div>
  );
};

export default Stats1;