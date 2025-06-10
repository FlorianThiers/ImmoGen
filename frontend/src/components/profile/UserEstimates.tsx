import axios from 'axios';
import React, { useContext, useState, useEffect } from 'react';


const UserEstimates = () => {
    const [currentUser, setCurrentUser] = useState<{ id: number } | null>(null);  
    const [immoGenHouses, setImmoGenHouses] = useState<any[]>([]);
    
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

    useEffect(() => {
        const fetchImmoGenHouses = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/immogen_addresses`,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                    }
                );
                const data = response.data;
                if (Array.isArray(data) && data.length > 0) {
                    console.log('🏠 First house example:', data[0]);
                    setImmoGenHouses(data);
                } else {
                    console.warn('⚠️ No houses returned or invalid format');
                    setImmoGenHouses([]);
                }
            } catch (error) {
                console.error("❌ Failed to fetch ImmoGen houses:", error);
            }
        };
        fetchImmoGenHouses();
    }, []);

    // Filter direct in de render:
        const userHouses = currentUser
        ? immoGenHouses.filter(house => Number(house.user_id) === Number(currentUser.id))
        : [];

    // Sorteer op datum (recentste eerst)
        const sorted = [...userHouses].sort(
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
        {sorted.slice(0, 5).map((est) => (
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
        </div>
    </section>
    );
}

export default UserEstimates;

