
import React from "react";

import "./CalculationFields.css"; // Assuming you have a CSS file for styling

const CalculationFields = ({
  formulaResult,
  formulaPrice,
  result,
  formData,
  abexCurrentYear,
  abexLastRenovation
}: any) => {
    return (
        <section className="calculate-section">
            <h2>Berekening </h2>

            <div className="calculate-result">
                {result && (
                    
                    <div className="calculate-result-header">
                        <h2 className="text-xl font-bold">Berekening Resultaat</h2>
                        <p>De AI Prijs is berekend op basis van de ingevoerde gegevens.</p>
                        <br />
                        <h2 className="text-xl font-bold">Resultaat:</h2>
                        <p>AI Prijs: €{result}</p>
                        <p>Formule Prijs: €{formulaPrice?.toFixed(2)}</p>
                        {/* <p>Verschil: €{result.verschil}</p>
                    <p>Verschil Percentage: {result.verschil_percentage}%</p> */}
                    <br />
                    </div>
                )}

                <h3>Formule</h3>
                {formulaResult && (
                    <div className="calculation-explanation">
                        <h4>Uitleg van de berekening:</h4>
                        <div className="calculation-notes">
                            <div className="calculation-note">
                                <b>Grondwaarde:</b> {formData.area} m² × €{formData.price_per_m2} = <b>€{(formulaResult?.landValue ?? 0).toLocaleString("nl-BE", {maximumFractionDigits: 0})}</b>
                            </div>
                            <div className="calculation-note">
                                <b>Nieuwbouwkost:</b> {formData.livable_area} m² × €{formData.build_price} × {formData.grade_of_finish} × (Abex {abexCurrentYear} / Abex {abexLastRenovation}) 
                                = <b>
                                    €{typeof formulaResult?.newBuildCost === "number"
                                    ? formulaResult.newBuildCost.toLocaleString("nl-BE", { maximumFractionDigits: 0 })
                                    : 0}
                                </b>                            
                            </div>
                            <div className="calculation-note">
                                <b>Slijtage (wear):</b> {formData.current_year} - {formData.construction_year} = {formData.current_year - formData.construction_year} jaar → {Math.round((formulaResult.wear || 0) * 100)}%
                            </div>
                            <div className="calculation-note">
                                <b>Woningwaarde na slijtage:</b> Nieuwbouwkost × (1 - slijtage) = <b>€{typeof formulaResult?.houseValue === "number" ? formulaResult.houseValue.toLocaleString("nl-BE", {maximumFractionDigits: 0}) : 0}</b>
                            </div>
                            <div className="calculation-note">
                                <b>Totaal vóór correctie:</b> Grondwaarde + Woningwaarde = <b>€{typeof formulaResult?.totalBeforeCorrection === "number" ? formulaResult.totalBeforeCorrection.toLocaleString("nl-BE", {maximumFractionDigits: 0}) : 0}</b>
                            </div>
                            <div className="calculation-note">
                                <b>Correctiefactor:</b> {formData.correction_percentage}% → <b>€{typeof formulaResult?.totalBeforeCorrection === "number" ? ((formulaResult.totalBeforeCorrection / 100) * formData.correction_percentage).toLocaleString("nl-BE", {maximumFractionDigits: 0}) : 0}</b>
                            </div>
                            <div className="calculation-note">
                                <b>Eindresultaat:</b> Totaal vóór correctie + correctie = <b>€{typeof formulaResult?.totalCorrected === "number" ? formulaResult.totalCorrected.toLocaleString("nl-BE", {maximumFractionDigits: 0}) : 0}</b>
                            </div>
                        </div>
                        <p className="calculation-note">Alle bedragen zijn afgerond.</p>
                    </div>
                )}
            </div>
            <div className="calculate-footer">

                <div className="calculate-last-updated">
                    <span>↻ Geupdate</span>
                    <span>Juni 4, 2025 om 16:38 </span>
                </div>
            </div>
        </section>
    );
};

export default CalculationFields;


