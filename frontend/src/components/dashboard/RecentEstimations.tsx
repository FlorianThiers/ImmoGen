import React from "react";

const RecentEstimations = () => {
  // Hier later je fetch/useEffect voor backend data
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
            
            <div className="recent-astimation-row">
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
            </div>
        </div>
    </section>
  );
};

export default RecentEstimations;