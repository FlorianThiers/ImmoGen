import React, { useEffect, useState } from "react";
import axios from "axios";
import User from "../../context/User";

type Props = {
  user?: User | null;
};

type House = {
  id: number;
  title: string;
  image_url?: string;
  created_at: string;
  price?: string | number;
  city?: string;
  // ...andere velden
};

const RecentTypes = ({ user }: Props) => {
  const name = user
    ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
    : "Gebruiker";
  const [houses, setHouses] = useState<House[]>([]);
  // Sorteer op datum (recentste eerst)
  const sorted = [...houses].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Unieke types met het meest recente huis per type
  const uniqueTypes = sorted.filter(
    (house, idx, arr) => arr.findIndex((h) => h.title === house.title) === idx
  );

  const [page, setPage] = useState(0);
  const pageSize = 3;
  const pageCount = Math.ceil(uniqueTypes.length / pageSize);
  const paginatedTypes = uniqueTypes.slice(
    page * pageSize,
    (page + 1) * pageSize
  );

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

  // Hier later je fetch/useEffect voor backend data
  return (
    <section className="top-section">
      <div className="section-header">
        <h2>Recentste types</h2>
        <div className="welcome-text">
          <span>Welkom Terug, </span>
          <strong>{name}</strong>
        </div>
      </div>
        <div className="houses-grid">
          {paginatedTypes.map((house) => (
            <div
              className={`house ${(house.title || "").toLowerCase()}`}
              key={house.id}
            >
              {/* ...je bestaande kaartcode... */}
              <div className="house-header">
                <span className="house-type">{house.title}</span>
                <span className="house-menu">⋯</span>
              </div>
              {house["price"] && (
                <div className="house-price">
                  €
                  {typeof house.price === "number"
                    ? house.price.toLocaleString("nl-BE")
                    : house.price}
                </div>
              )}
              {house["city"] && (
                <div className="house-city">{house["city"]}</div>
              )}
            </div>
          ))}
        </div>

        {/* <div className="house villa">
            <div className="house-header">
              <span className="house-type">Villa</span>
              <span className="house-menu">⋯</span>
            </div>
            <div className="house-price">€ 900.450,00</div>
            <div className="house-city">Knokke</div>
            </div>
            
            <div className="house appartement">
            <div className="house-header">
            <span className="house-type">Appartement</span>
            <span className="house-menu">⋯</span>
            </div>
            <div className="house-price">€ 300.500,00</div>
            <div className="house-city">Gent</div>
            </div> */}
            <div>
                    <button
                className="types-button back"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                aria-label="Vorige"
              >
                &lt;
              </button>
              <button
                className="types-button more"
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={page >= pageCount - 1}
                aria-label="Volgende"
                >
                &gt;
              </button>
            </div>

    </section>
  );
};

export default RecentTypes;
