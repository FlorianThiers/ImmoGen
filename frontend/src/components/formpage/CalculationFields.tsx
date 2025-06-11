import React, { useState, useEffect } from "react";
import "./CalculationFields.css";

// Typewriter hook voor individuele tekst elementen
const useTypewriter = (text="", speed = 50, startDelay = 0) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!text) return;
    
    const startTimer = setTimeout(() => {
      setHasStarted(true);
      let index = 0;
      
      const timer = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          setIsComplete(true);
          clearInterval(timer);
        }
      }, speed);

      return () => clearInterval(timer);
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [text, speed, startDelay]);

  return { displayedText: hasStarted ? displayedText : '', isComplete };
};

// Component voor een enkele berekening regel
const CalculationNote = ({ children, delay = 0, speed = 30 }: {
    children: React.ReactNode;
    delay?: number;
    speed?: number;
    }) => {
  // Converteer children naar platte tekst voor typewriter effect
  const getTextContent = (element: any): string => {
    if (typeof element === 'string') return element;
    if (typeof element === 'number') return element.toString();
    if (Array.isArray(element)) return element.map(getTextContent).join('');
    if (element?.props?.children) return getTextContent(element.props.children);
    return '';
  };

  const textContent = getTextContent(children);
  const { displayedText, isComplete } = useTypewriter(textContent, speed, delay);
  
  // Render de tekst met behoud van formatting
  const renderFormattedText = () => {
    if (!displayedText) return null;
    
    // Eenvoudige benadering: check waar we zijn in de tekst en render dienovereenkomstig
    let currentPos = 0;
    const result: React.ReactNode[] = [];
    
    React.Children.forEach(children, (child, index) => {
      if (typeof child === 'string') {
        const endPos = currentPos + child.length;
        if (displayedText.length > currentPos) {
          const visiblePart = displayedText.slice(currentPos, Math.min(endPos, displayedText.length));
          result.push(<span key={index}>{visiblePart}</span>);
        }
        currentPos = endPos;
      } else if (React.isValidElement(child) && child.type === 'b') {
        const boldText = getTextContent(child);
        const endPos = currentPos + boldText.length;
        if (displayedText.length > currentPos) {
          const visiblePart = displayedText.slice(currentPos, Math.min(endPos, displayedText.length));
          if (visiblePart) {
            result.push(<b key={index}>{visiblePart}</b>);
          }
        }
        currentPos = endPos;
      } else {
        const childText = getTextContent(child);
        const endPos = currentPos + childText.length;
        if (displayedText.length > currentPos) {
          const visiblePart = displayedText.slice(currentPos, Math.min(endPos, displayedText.length));
          result.push(<span key={index}>{visiblePart}</span>);
        }
        currentPos = endPos;
      }
    });
    
    return result;
  };

  return (
    <div className="calculation-note typewriter-note">
      {renderFormattedText()}
      {!isComplete && <span className="typewriter-cursor">|</span>}
    </div>
  );
};

const CalculationFields = ({
  formulaResult,
  formulaPrice,
  result,
  formData,
  isLoading = false
}: any) => {
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingText, setLoadingText] = useState("");
  const [showCalculations, setShowCalculations] = useState(false);

  const loadingSteps = [
    "Eigendom gegevens analyseren...",
    "Grondwaarde berekenen...",
    "Bouwkosten inschatten...",
    "Slijtage bepalen...",
    "Correctiefactoren toepassen...",
    "Eindberekening uitvoeren..."
  ];

  useEffect(() => {
    if (isLoading) {
      setLoadingStep(0);
      const interval = setInterval(() => {
        setLoadingStep(prev => {
          if (prev < loadingSteps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 1200);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) {
      setLoadingText(loadingSteps[loadingStep]);
    }
  }, [loadingStep, isLoading]);

  // Start de calculatie animaties na het tonen van de resultaten
  useEffect(() => {
    if (result && formulaResult && !isLoading) {
      const timer = setTimeout(() => {
        setShowCalculations(true);
      }, 1000); // Start na 1 seconde
      
      return () => clearTimeout(timer);
    } else if (isLoading) {
      setShowCalculations(false);
    }
  }, [result, formulaResult, isLoading]);

  const LoadingAnimation = () => (
    <div className="calculation-loading">
      <div className="loading-container">
        {/* Neural Network Visualization */}
        <div className="neural-network">
          <div className="neural-layer">
            <div className="neural-node node-1"></div>
            <div className="neural-node node-2"></div>
            <div className="neural-node node-3"></div>
          </div>
          <div className="neural-connections">
            <div className="connection connection-1"></div>
            <div className="connection connection-2"></div>
            <div className="connection connection-3"></div>
            <div className="connection connection-4"></div>
            <div className="connection connection-5"></div>
            <div className="connection connection-6"></div>
          </div>
          <div className="neural-layer">
            <div className="neural-node node-4"></div>
            <div className="neural-node node-5"></div>
          </div>
          <div className="neural-connections">
            <div className="connection connection-7"></div>
            <div className="connection connection-8"></div>
          </div>
          <div className="neural-layer">
            <div className="neural-node node-6 output-node"></div>
          </div>
        </div>

        {/* Holographic Data Streams */}
        <div className="data-streams">
          <div className="data-stream stream-1">
            <div className="data-packet">€</div>
            <div className="data-packet">m²</div>
            <div className="data-packet">%</div>
          </div>
          <div className="data-stream stream-2">
            <div className="data-packet">AI</div>
            <div className="data-packet">∑</div>
            <div className="data-packet">∆</div>
          </div>
        </div>

        {/* Quantum Computing Visualization */}
        <div className="quantum-processor">
          <div className="quantum-core">
            <div className="quantum-ring ring-1"></div>
            <div className="quantum-ring ring-2"></div>
            <div className="quantum-ring ring-3"></div>
            <div className="quantum-center"></div>
          </div>
        </div>

        {/* Advanced Progress Bar */}
        <div className="loading-progress">
          <div className="progress-container">
            <div className="progress-track">
              <div 
                className="progress-fill" 
                style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
              >
                <div className="progress-glow"></div>
              </div>
            </div>
            <div className="progress-percentage">
              {Math.round(((loadingStep + 1) / loadingSteps.length) * 100)}%
            </div>
          </div>
          <div className="loading-text">
            <span className="loading-icon">⚡</span>
            {loadingText}
          </div>
        </div>

        {/* Scanning Lines Effect */}
        <div className="scanner-overlay">
          <div className="scan-line"></div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="calculate-section">
      <h2>Berekening</h2>

      <div className="calculate-result">
        {isLoading ? (
          <LoadingAnimation />
        ) : (
          <>
            {result && (
              <div className="calculate-result-header">
                <h2 className="text-xl font-bold">Berekening Resultaat</h2>
                <p>De AI Prijs is berekend op basis van de ingevoerde gegevens.</p>
                <br />
                <h2 className="text-xl font-bold">Resultaat:</h2>
                <p>AI Prijs: €{result}</p>
                <p>Formule Prijs: €{formulaPrice?.toFixed(2)}</p>
                <br />
              </div>
            )}

            <h3>Formule</h3>
            {formulaResult && showCalculations && (
              <div className="calculation-explanation">
                {/* <h4>Uitleg van de berekening:</h4> */}
                <div className="calculation-notes">
                  <CalculationNote delay={0} speed={25}>
                    <b>Grondwaarde:</b> {formData.area} m² × €{formData.price_per_m2} = <b>€{(formulaResult?.landValue ?? 0).toLocaleString("nl-BE", {maximumFractionDigits: 0})}</b>
                  </CalculationNote>
                  
                  <CalculationNote delay={2000} speed={25}>
                    <b>Nieuwbouwkost:</b> {formData.livable_area} m² × €{formData.build_price} × {formData.grade_of_finish} = <b>€{typeof formulaResult?.newBuildCost === "number" ? formulaResult.newBuildCost.toLocaleString("nl-BE", { maximumFractionDigits: 0 }) : 0}</b>
                  </CalculationNote>
                  
                  <CalculationNote delay={4000} speed={25}>
                    <b>Slijtage (wear):</b> {formData.current_year} - {formData.renovation ? formData.renovation_year : formData.construction_year} = {formData.renovation ? formData.current_year - formData.renovation_year : formData.current_year - formData.construction_year} jaar → <b>{formData.renovation ? (() => { return Math.round(formulaResult.renovationWear * 100); })() : Math.round((formulaResult.wear || 0) * 100)}%</b>
                  </CalculationNote>
                  
                  <CalculationNote delay={6000} speed={25}>
                    <b>Woningwaarde na slijtage:</b> Nieuwbouwkost × (1 - slijtage) = <b>€{typeof formulaResult?.houseValue === "number" ? formulaResult.houseValue.toLocaleString("nl-BE", {maximumFractionDigits: 0}) : 0}</b>
                  </CalculationNote>
                  
                  <CalculationNote delay={8000} speed={25}>
                    <b>Totaal vóór correctie:</b> Grondwaarde + Woningwaarde = <b>€{typeof formulaResult?.totalBeforeCorrection === "number" ? formulaResult.totalBeforeCorrection.toLocaleString("nl-BE", {maximumFractionDigits: 0}) : 0}</b>
                  </CalculationNote>
                  
                  <CalculationNote delay={10000} speed={25}>
                    <b>Correctiefactor:</b> {formData.correction_percentage}% → <b>€{typeof formulaResult?.totalBeforeCorrection === "number" ? ((formulaResult.totalBeforeCorrection / 100) * formData.correction_percentage).toLocaleString("nl-BE", {maximumFractionDigits: 0}) : 0}</b>
                  </CalculationNote>
                  
                  <CalculationNote delay={12000} speed={25}>
                    <b>Eindresultaat:</b> Totaal vóór correctie + correctie = <b>€{typeof formulaResult?.totalCorrected === "number" ? formulaResult.totalCorrected.toLocaleString("nl-BE", {maximumFractionDigits: 0}) : 0}</b>
                  </CalculationNote>
                </div>
                <p className="calculation-note final-note">Alle bedragen zijn afgerond.</p>
              </div>
            )}
          </>
        )}
      </div>
      
      <div className="calculate-footer">
        <div className="calculate-last-updated">
          <span>↻ Geupdate</span>
          <span>Juni 4, 2025 om 16:38</span>
        </div>
      </div>
    </section>
  );
};

export default CalculationFields;