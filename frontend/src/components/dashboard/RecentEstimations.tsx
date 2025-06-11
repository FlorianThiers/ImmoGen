import { useEffect, useState } from "react";
import axios from "axios";

type House = {
  id: number;
  city: string;
  postal_code: string;
  street: string;
  title: string;
  ai_price: number;
  price: number;
  created_at: string;
  // voeg hier andere velden toe indien nodig
};

const RecentEstimations = () => {
    const [houses, setHouses] = useState<House[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

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

    // Sorteer op datum (recentste eerst)
    const sorted = [...houses].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  return (
    <section className="recent-astimations-section">
      <div className="section-header">
        <h2>Recente schattingen</h2>
        <span className="sort-icon"></span>
      </div>
      <div className="recent-astimations-table">
        <div className="table-header">
          <span>Adres schattingen</span>
          <span>Type</span>
          <span>AI prijs</span>
          <span>Prijs</span>
        </div>
        {sorted.slice((currentPage - 1) * 5, currentPage * 5).map((est) => (
          <div className="recent-astimation-row" key={est.id}>
            <div className="recent-astimation-name">
              <span className={`recent-astimation-icon ${est.title.toLowerCase()}`}></span>
              <div>
          <div className="name">{est.city} {est.postal_code} {est.street}</div>
          <div className="date">{new Date(est.created_at).toLocaleString()}</div>
              </div>
            </div>
            <span className="category">{est.title}</span>
            <span className="cashback">€ {est.ai_price.toLocaleString("nl-BE")}</span>
            <span className="amount">€ {est.price.toLocaleString("nl-BE")}</span>
          </div>
        ))}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Vorige
          </button>
          <span>
            Pagina {currentPage} van {Math.ceil(sorted.length / 5)}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(Math.ceil(sorted.length / 5), p + 1))}
            disabled={currentPage === Math.ceil(sorted.length / 5)}
          >
            Volgende
          </button>
        </div>
            {/* <div className="recent-astimation-row">
                <div className="recent-astimation-name">
                    <span className="recent-astimation-icon appartement"></span>
                    <div>
                        <div className="name">Gent 9000 Oost-Vlaanderen</div>
                        <div className="date">Today at 16:36 AM</div>
                    </div>
                </div>
                <span className="category">Appartement</span>
                <span className="cashback">€ 320.500,00</span>
                <span className="amount">€ 300.250,00 </span>
            </div>
            
            <div className="recent-astimation-row">
                <div className="recent-astimation-name">
                    <span className="recent-astimation-icon villa"></span>
                    <div>
                        <div className="name">Knokke 8300 West-Vlaanderen</div>
                        <div className="date">Today at 16:36 AM</div>
                    </div>
                </div>
                <span className="category">Villa</span>
                <span className="cashback">€ 900.450,00</span>
                <span className="amount">€ 900.450,00 </span>
            </div>

            <div className="recent-astimation-row">
                <div className="recent-astimation-name">
                    <span className="recent-astimation-icon huis"></span>
                    <div>
                        <div className="name">Beveren 9120 Oost-Vlaanderen</div>
                        <div className="date">Today at 16:36 AM</div>
                    </div>
                </div>
                <span className="category">Huis</span>
                <span className="cashback">€ 300.250,00</span>
                <span className="amount">€ 300.250,00 </span>
            </div>

            <div className="recent-astimation-row">
                <div className="recent-astimation-name">
                    <span className="recent-astimation-icon appartement"></span>
                    <div>
                        <div className="name">Antwerpen 2000 Antwerpen</div>
                        <div className="date">Today at 16:36 AM</div>
                    </div>
                </div>
                <span className="category">Appartement</span>
                <span className="cashback">€ 450.500,00</span>
                <span className="amount">€ 450.500,00 </span>
            </div> */}
        </div>
    </section>
  );
};

export default RecentEstimations;