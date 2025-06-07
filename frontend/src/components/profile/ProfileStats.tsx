import { useEffect, useState } from "react";
import axios from "axios";

type User = {
  id: number;
};

type Houses = {
  id: number;
  user_id: number;
  title: string;
  city: string;
  postal_code: string;
};

const ProfileStats = () => {
  const [user, setUser] = useState<User | null>(null);
  const [totalEstimates, setTotalEstimates] = useState<number>(0);
  const [typeStats, setTypeStats] = useState<Record<string, number>>({});
  const [mostEstimatedType, setMostEstimatedType] = useState<string>("");
  const [regionStats, setRegionStats] = useState<Record<string, number>>({});
  const [mostEstimatedRegion, setMostEstimatedRegion] = useState<string>("");
  const [cityCount, setCityCount] = useState<Record<string, number>>({});
  const [mostEstimatedCity, setMostEstimatedCity] = useState<string>("");
  const [totalValue, setTotalValue] = useState<string>("0");

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
    const fetchImmoGenHouses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/immogen_addresses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filter alleen de huizen van de huidige user
        const houses = response.data.filter((house: Houses) => house.user_id === user?.id);

        if (houses && Array.isArray(houses)) {
          //totaal aantal schattingen
          const totalEstimates = houses.length;
          setTotalEstimates(totalEstimates);
          
          // Zet de user in de state
          const typeCount: Record<string, number> = {};
          const regionCount: Record<string, number> = {};

          houses.forEach((house) => {
            if (house.title) {
              typeCount[house.title] = (typeCount[house.title] || 0) + 1;
            }
            if (house.postal_code) {
              regionCount[house.postal_code] = (regionCount[house.postal_code] || 0) + 1;
            }
            if (house.city) {
              cityCount[house.city] = (cityCount[house.city] || 0) + 1;
            }
          });


          setTypeStats(typeCount);
          setRegionStats(regionCount);
          setCityCount(cityCount);

          // Bepaal de meest geschatte type
          const mostEstimatedType = Object.entries(typeCount).reduce(
            (a, b) => (b[1] > a[1] ? b : a),
            ["", 0]
          )[0];
          setMostEstimatedType(mostEstimatedType);

          // Bepaal de meest geschatte streek
          const mostEstimatedRegion = Object.entries(regionCount).reduce(
            (a, b) => (b[1] > a[1] ? b : a),
            ["", 0]
          )[0];
          setMostEstimatedRegion(mostEstimatedRegion);

          // Bepaal de meest geschatte stad
          const mostEstimatedCity = Object.entries(cityCount).reduce(
            (a, b) => (b[1] > a[1] ? b : a),
            ["", 0]
          )[0];
          setMostEstimatedCity(mostEstimatedCity);

          // totaal waarde user scatchtingen
          const totalValue = houses.reduce((acc, house) => {
            // Assuming house.price exists and is a number or string
            const price = parseFloat((house as any).price) || 0;
            return acc + price;
          }, 0);
          setTotalValue((totalValue / 1000000).toFixed(2)); 
        }
      } catch (error) {
        console.error("Error fetching ImmoGen houses:", error);
      }
    };
    fetchImmoGenHouses();
  }, [user]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <section className="right-top-section">
        <div className="section-header">
            <h3>Gebruikers statistieken</h3>
        </div>

        <div className="statistics-grid">
            <div className="statistic-card">
            <div className="statistic-content">
                <div className="statistic-value">{totalEstimates}</div>
                <div className="statistic-label">Totale aantal schattingen</div>
            </div>
            </div>

            <div className="statistic-card">
            <div className="statistic-content">
                <div className="statistic-value">{mostEstimatedType}</div>
                <div className="statistic-label">Meest geschatte type</div>
            </div>
            </div>

            <div className="statistic-card">
            <div className="statistic-content">
              <div className="statistic-value">Type's</div>
                <div className="statistic-label">
                  {Object.entries(typeStats).map(([type, count]) => (
                    <div key={type}>
                      {type}: <strong>{count}</strong>
                    </div>
                  ))}
                </div>
            </div>
            </div>

            <div className="statistic-card">
            <div className="statistic-content">
                <div className="statistic-value">{mostEstimatedRegion}</div>
                <div className="statistic-label">Meest geschatte Regio</div>
            </div>
            </div>

            <div className="statistic-card">
            <div className="statistic-content">
              <div className="statistic-value">Regio's</div>
                <div className="statistic-label">
                  {Object.entries(regionStats).map(([region, count]) => (
                    <div key={region}>
                      {region}: <strong>{count}</strong>
                    </div>
                  ))}
                </div>
            </div>
            </div>

            <div className="statistic-card">
            <div className="statistic-content">
                <div className="statistic-value">{mostEstimatedCity}</div>
                <div className="statistic-label">Meest geschatte Stad</div>
            </div>
            </div>

            <div className="statistic-card">
            <div className="statistic-content">
                <div className="statistic-value">Steden</div>
                <div className="statistic-label">
                  {Object.entries(cityCount).map(([city, count]) => (
                    <div key={city}>
                      {city}: <strong>{count}</strong>
                    </div>
                  ))}
                </div>
            </div>
            </div>

            <div className="statistic-card">
            <div className="statistic-icon total-marker"></div>
            <div className="statistic-content">
                <div className="statistic-value">€ {totalValue}M</div>
                <div className="statistic-label">Totale waarde</div>
            </div>
            </div>
        </div>
    </section>
  );
};

export default ProfileStats;
