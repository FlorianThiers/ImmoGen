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

  correctionPercentage: number; // between 0 and 0.25 (e.g. 10% = 0.10)
  houseUnusable: boolean; // if true, deduct demolition cost
};

export function calculateWear(constructionYear: number, currentYear: number): number {
  const age = currentYear - constructionYear;
  return age > 10 ? Math.min(0.01 * (age - 10), 0.5) : 0;
}

export function calculatePrice(input: PriceInput) {
  console.log("Input: ", input);
  const landValue = input.landArea * input.landPricePerM2;
  console.log("Land Area: ", input.landArea);
  console.log("Land Price per m²: ", input.landPricePerM2);
  console.log("Land Value: ", landValue);
  let houseValue = 0;


  if (input.houseUnusable) {
    houseValue = -25000; // demolition cost
  } else {
    const newBuildCost =
      input.livingArea *
      input.buildCostPerM2 *
      input.finishQuality *
      (input.abexCurrent / input.abexLastRenovation);
    console.log("New Build Cost: ", newBuildCost);
    const wear = calculateWear(input.constructionYear, input.currentYear);
    console.log("Wear: ", wear);
    houseValue = newBuildCost * (1 - wear);
    console.log("House Value: ", houseValue);
  }

  const totalBeforeCorrection = landValue + houseValue;
  const correctionFactor = input.correctionPercentage;

  let totalCorrected: number = 0;
  if (correctionFactor == 1) {
    totalCorrected = totalBeforeCorrection;
  } else {
    totalCorrected = totalBeforeCorrection + ((totalBeforeCorrection / 100) * correctionFactor);
  }
  console.log("Total Before Correction: ", totalBeforeCorrection);
  console.log("Correction Factor: ", correctionFactor);
  console.log("Total Corrected: ", totalCorrected);
  return {
    landValue,
    houseValue,
    totalBeforeCorrection,
    correctionFactor,
    totalCorrected,
  };
}
