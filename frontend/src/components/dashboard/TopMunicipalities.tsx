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

const TopMunicipalities = () => {
    const [houses, setHouses] = useState<House[]>([]);
    const [showAiPrice, setShowAiPrice] = useState(false);

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

    //bereken gemiddelde prijs
    // const averagePrice = houses.reduce((acc, house) => acc + house.price, 0) / houses.length || 0;
    //bereken gemiddelde AI prijs
    // const averageAiPrice = houses.reduce((acc, house) => acc + house.ai_price, 0) / houses.length || 0;
    //bereken gemiddelde prijs vandaag
    const today = new Date();
    const todayHouses = houses.filter(house => new Date(house.created_at).toDateString() === today.toDateString());
    const averagePriceToday = todayHouses.reduce((acc, house) => acc + house.price, 0) / todayHouses.length || 0;
    //bereken gemiddelde AI prijs vandaag
    const averageAiPriceToday = todayHouses.reduce((acc, house) => acc + house.ai_price, 0) / todayHouses.length || 0;

    //bereken verschil tussen gemiddelde prijs en gemiddelde AI prijs
    // const priceDifference = averagePrice - averageAiPrice;
    // const priceDifferenceToday = averagePriceToday - averageAiPriceToday;

    //bereken gemiddelde prijs deze week
    const startOfWeek = new Date();
    startOfWeek.setDate(today.getDate() - today.getDay()); // Maandag als start van de week
    const weekHouses = houses.filter(house => new Date(house.created_at) >= startOfWeek);
    const averagePriceWeek = weekHouses.reduce((acc, house) => acc + house.price, 0) / weekHouses.length || 0;
    //bereken gemiddelde AI prijs deze week
    const averageAiPriceWeek = weekHouses.reduce((acc, house) => acc + house.ai_price, 0) / weekHouses.length || 0;
    // const priceDifferenceWeek = averagePriceWeek - averageAiPriceWeek;

  // Hier later je fetch/useEffect voor backend data
  return (
    <section className="right-top-section">
        <h2>Gemiddelde schatting </h2>

        <div className="average-estimate">
            <div className="estimate-today">
                <span className="label">Vandaag</span>
                <span className="value">
                    € {showAiPrice
                        ? averageAiPriceToday.toLocaleString("nl-BE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                        : averagePriceToday.toLocaleString("nl-BE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                    }
                </span>                
                <span className="currency">EUR</span>
            </div>
            <div className="estimate-week">
                <span className="label">Deze week</span>
                <span className="value">
                    € {showAiPrice
                        ? averageAiPriceWeek.toLocaleString("nl-BE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                        : averagePriceWeek.toLocaleString("nl-BE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                    }
                </span>                
                <span className="currency">EUR</span>
                {/* <span className="diff up">+2.3%</span> */}
                {/* of <span className="diff down">-1.1%</span> */}
            </div>
        </div>
        {/* Optioneel: je kunt hier nog een kleine uitleg of grafiekje tonen */}
        
        <div className="estimate-footer">
            <button
                onClick={() => setShowAiPrice((prev) => !prev)}
            >
                {showAiPrice ? "Switch back" : "Switch to AI"}
            </button>
            <div className="last-updated">
                <span>↻ Geupdate</span>
                <span>Juni 3, 2025 om 23:07 </span>
            </div>
        </div>
    </section>
  );
};

export default TopMunicipalities;