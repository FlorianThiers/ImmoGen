import React, { useEffect, useState } from "react";
import axios from "axios";

const CalculationFields = () => {
    // Placeholder state for result and formulaPrice
    const [result, setResult] = useState<number | null>(null);
    const [formulaPrice, setFormulaPrice] = useState<number | null>(null);

    return (
        <section className="right-top-section">
            <h2>Berekening </h2>

            {result && (
            <div className="mt-4">
                <h2 className="text-xl font-bold">Resultaat:</h2>
                <p>AI Prijs: €{result}</p>
                <p>Formule Prijs: €{formulaPrice?.toFixed(2)}</p>
                {/* <p>Verschil: €{result.verschil}</p>
            <p>Verschil Percentage: {result.verschil_percentage}%</p> */}
            </div>
            )}
            <div className="calculate-footer">

                <div className="last-updated">
                    <span>↻ Geupdate</span>
                    <span>Juni 4, 2025 om 23:07 </span>
                </div>
            </div>
        </section>
    );
};

export default CalculationFields;


