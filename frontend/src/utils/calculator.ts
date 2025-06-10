// utils/priceCalculator.ts

export type PriceInput = {
  constructionYear: number;
  currentYear: number;
  landArea: number; // in m²
  landPricePerM2: number; // €/m²

  livingArea: number; // in m²
  buildCostPerM2: number; // €/m²
  finishQuality: number; // e.g. 1.0 = normal, 0.85 = basic, 1.15 = luxury
  abexCurrent: number;
  abexLastRenovation: number;

  renovationYear?: number; // optioneel: jaar van laatste renovatie
  hasRenovation: boolean; // of er een renovatie is geweest
  correctionPercentage: number; // between 0 and 0.25 (e.g. 10% = 0.10)
  houseUnusable: boolean; // if true, deduct demolition cost
};

export function calculateWear(constructionYear: number, currentYear: number): number {
  const age = currentYear - constructionYear;
  return age > 10 ? Math.min(0.01 * (age - 10), 0.5) : 0;
}

export function calculateRenovationValue(
  livingArea: number,
  buildCostPerM2: number,
  finishQuality: number,
  renovationYear: number,
  currentYear: number
): { estimatedRenovationCost: number; renovationWear: number } {
  // Geschatte renovatiekost (aangepast naar huidige prijzen)
  const estimatedRenovationCost = livingArea * buildCostPerM2 * finishQuality * 0.7; // 70% van nieuwbouwkost
  
  // Afschrijving van renovatie (levensduur ~25 jaar)
  const renovationAge = currentYear - renovationYear;
  const effectiveWearYears = Math.max(0, renovationAge - 10); // Eerste 10 jaar geen slijtage
  const renovationWear = Math.min(effectiveWearYears / 50, 0.5); // Max 80% afschrijving
  
  return {
    estimatedRenovationCost: estimatedRenovationCost * (1 - renovationWear),
    renovationWear: renovationWear,
  };
}

export function calculateStructuralValue(
  livingArea: number,
  buildCostPerM2: number,
  finishQuality: number,
  constructionYear: number,
  currentYear: number
): { structuralValue: number; structuralWear: number } {
  // Basisstructuur (muren, fundatie, dak) - heeft langere levensduur
  const structuralCost = livingArea * buildCostPerM2 * finishQuality; // 40% van nieuwbouwkost
  let structuralWear = 0;
  const age = currentYear - constructionYear;
  let structuralValue;
  
  if (age > 100) {
    // Zeer oude gebouwen: minimale structurele waarde maar niet nul
    structuralValue = structuralCost * 0.15; // 15% restwaarde
    structuralWear = 0.85; // 85% afschrijving
  } else if (age > 50) {
    // Oude gebouwen: geleidelijke afschrijving
    const wearFactor = Math.min((age - 50) / 50 * 0.6, 0.75); // Max 75% afschrijving
    structuralValue = structuralCost * (1 - wearFactor);
    structuralWear = wearFactor; // Bewaar de slijtage voor rapportage
  } else {
    // Normale afschrijving voor gebouwen jonger dan 50 jaar
    const wear = calculateWear(constructionYear, currentYear);
    structuralValue = structuralCost * (1 - wear);
    structuralWear = wear; // Bewaar de slijtage voor rapportage
  }
  

  
  return {
    structuralValue: Math.max(structuralValue, structuralCost * 0.1),
    structuralWear,
  };
}

export function calculatePrice(input: PriceInput) {
  console.log("Input: ", input);
  console.log("Land Area: ", input.landArea);

  // const landValue = input.landArea * input.landPricePerM2;
  const totalArea = input.landArea
  const pricePerM2 = input.landPricePerM2
  // Eerste 750 m² tegen volle prijs
  const fullPriceArea = Math.min(totalArea, 750);
  const fullPriceValue = fullPriceArea * pricePerM2;
  
  // Rest tegen 1/3 prijs
  const reducedPriceArea = Math.max(0, totalArea - 750);
  const reducedPriceValue = reducedPriceArea * (pricePerM2 / 3);
  
  const landValue = fullPriceValue + reducedPriceValue;



  let houseValue = 0;
  let newBuildCost = 0;
  let wear = 0;
  let structuralValue = 0;
  let renovationValue = 0;
  let structuralWear = 0;
  let renovationWear = 0;

  if (input.houseUnusable) {
    houseValue = -25000; // demolition cost
  } else {
    newBuildCost = input.livingArea * input.buildCostPerM2 * input.finishQuality;
    console.log("New Build Cost (current prices): ", newBuildCost);

    if (input.hasRenovation && input.renovationYear) {
      // Voor gerenoveerde gebouwen: splits structuur en renovatie
      const { structuralValue: structValue, structuralWear: structWear} = calculateStructuralValue(
        input.livingArea,
        input.buildCostPerM2,
        input.finishQuality,
        input.constructionYear,
        input.currentYear
      );
      structuralValue = structValue;
      structuralWear = structWear;
      
      const { estimatedRenovationCost: renoCost, renovationWear: renoWear,} = calculateRenovationValue(
        input.livingArea,
        input.buildCostPerM2,
        input.finishQuality,
        input.renovationYear,
        input.currentYear
      );
      renovationValue = renoCost;
      renovationWear = renoWear;

      console.log("renovation wear:", renoWear)
      houseValue = newBuildCost * (1- renoWear);
      console.log("Structural Value: ", structuralValue);
      console.log("Renovation Value: ", renovationValue);
    } else {
      // Voor niet-gerenoveerde gebouwen: normale afschrijving
      wear = calculateWear(input.constructionYear, input.currentYear);
      houseValue = newBuildCost * (1 - wear);
      console.log("Wear: ", wear);
    }
    
    console.log("House Value: ", houseValue);
  }
  
  const totalBeforeCorrection = landValue + houseValue;
  console.log("Total Before Correction: ", totalBeforeCorrection);
  
  // Correctie toepassen (tussen -25% en +10%)
  const correctionAmount = (totalBeforeCorrection * input.correctionPercentage) / 100;
  const totalCorrected = totalBeforeCorrection + correctionAmount;
  
  console.log("Correction Percentage: ", input.correctionPercentage);
  console.log("Correction Amount: ", correctionAmount);
  console.log("Total Corrected: ", totalCorrected);
  
  
  return {
    landValue,
    newBuildCost,
    wear,
    houseValue,
    totalBeforeCorrection,
    correctionFactor: input.correctionPercentage,
    totalCorrected,
    structuralValue,
    renovationValue,
    renovationWear,
  };
}
