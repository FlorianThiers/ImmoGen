import React from "react";

const AverageEstimate = () => {
  // Hier later je fetch/useEffect voor backend data
  return (
    <section className="right-bottom-section">
        <div className="section-header">
            <h3>Top 3 populairste gemeenten</h3>
            <span className="date-range">Laatste 30 dagen</span>
        </div>
        <div className="municipality-list">
            <div className="municipality-row">
            <span className="municipality-name">Gent</span>
            <span className="municipality-count">12 schattingen</span>
            <span className="municipality-avg">€ 320.500</span>
            </div>
            <div className="municipality-row">
            <span className="municipality-name">Antwerpen</span>
            <span className="municipality-count">9 schattingen</span>
            <span className="municipality-avg">€ 450.500</span>
            </div>
            <div className="municipality-row">
            <span className="municipality-name">Knokke</span>
            <span className="municipality-count">7 schattingen</span>
            <span className="municipality-avg">€ 900.450</span>
            </div>
        </div>
    </section>
  );
};

export default AverageEstimate;