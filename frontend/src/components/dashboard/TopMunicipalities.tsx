import React from "react";

const TopMunicipalities = () => {
  // Hier later je fetch/useEffect voor backend data
  return (
    <section className="right-top-section">
        <h2>Gemiddelde schatting </h2>

        <div className="average-estimate">
            <div className="estimate-today">
                <span className="label">Vandaag</span>
                <span className="value">€ 350.000</span>
                <span className="currency">EUR</span>
            </div>
            <div className="estimate-week">
                <span className="label">Deze week</span>
                <span className="value">€ 342.000</span>
                <span className="currency">EUR</span>
                <span className="diff up">+2.3%</span>
                {/* of <span className="diff down">-1.1%</span> */}
            </div>
        </div>
        {/* Optioneel: je kunt hier nog een kleine uitleg of grafiekje tonen */}
        
        <div className="estimate-footer">
            <button className="convert-btn">Schat</button>
            <div className="last-updated">
                <span>↻ Geupdate</span>
                <span>Mei 5, 2024 om 20:20 </span>
            </div>
        </div>
    </section>
  );
};

export default TopMunicipalities;