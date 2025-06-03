import React from "react";

const RecentTypes = () => {
  // Hier later je fetch/useEffect voor backend data
  return (
    <section className="top-section">
        <div className="section-header">
            <h2>Recentste types</h2>
            <div className="welcome-text">
                <span>Welkom Terug, </span>
                <strong>Ryan Danielson</strong>
            </div>
        </div>
        
        <div className="houses-grid">
            <div className="house villa">
                <div className="house-header">
                    <span className="house-type">Villa</span>
                    <span className="house-menu">⋯</span>
                </div>
                <div className="house-price">€ 900.450,00</div>
                <div className="house-city">Knokke</div>
                {/* <div className="house-logo masterhouse"></div> */}
            </div>
            
            <div className="house appartement">
                <div className="house-header">
                    <span className="house-type">Appartement</span>
                    <span className="house-menu">⋯</span>
                </div>
                <div className="house-price">€ 300.500,00</div>
                <div className="house-city">Gent</div>
                {/* <div className="house-logo visa"></div> */}
            </div>
            
            <div className="house huis">
                <div className="house-header">
                    <span className="house-type">Huis</span>
                    <span className="house-menu">⋯</span>
                </div>
                <div className="house-price">€ 300.250,00</div>
                <div className="house-city">Beveren</div>
                {/* <div className="house-logo masterhouse"></div> */}
            </div>
        </div>
    </section>
  );
};

export default RecentTypes;