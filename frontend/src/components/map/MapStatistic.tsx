import { useEffect, useState } from "react";
import axios from "axios";

type House = {
    id: number;
    user_id: number;
    price: string | number;

};


const MapStatistic = () => {
    // haal current user data op
    const [currentUser, setCurrentUser] = useState<{ id: number } | null>(null);
    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCurrentUser(res.data);
            } catch (error) {
                console.error("Error fetching current user:", error);
                setCurrentUser(null);
            }
        };
        fetchCurrentUser();
    }, []);
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
    }
    , []);

    // Bereken de totaal aantal extrene schattingen
    const externalEstimates = houses.filter(house => house.user_id !== currentUser?.id).length;
    // Bereken de totaal aantal eigen schattingen
    const ownEstimates = houses.filter(house => house.user_id === currentUser?.id).length;

    // Bereken de totale waarde van alle huizen
    const totalValue = Math.floor(
        houses.reduce((acc, house) => {
            const price = typeof house.price === "number" ? house.price : parseFloat(house.price);
            return acc + (isNaN(price) ? 0 : price);
        }, 0) / 1_000_000
    );


    return (
         <section className="right-top-section">
            <div className="section-header">
                <h3>Kaart statistieken</h3>
            </div>

            <div className="statistics-grid">
                <div className="statistic-card">
                <div className="statistic-icon blue-marker"></div>
                <div className="statistic-content">
                    <div className="statistic-value">{externalEstimates}</div>
                    <div className="statistic-label">Externe schattingen</div>
                </div>
                </div>

                <div className="statistic-card">
                <div className="statistic-icon red-marker"></div>
                <div className="statistic-content">
                    <div className="statistic-value">{ownEstimates}</div>
                    <div className="statistic-label">Jouw schattingen</div>
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
}

export default MapStatistic;