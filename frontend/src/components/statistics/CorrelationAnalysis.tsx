import { useEffect, useState, useMemo } from "react";
import StatisticsHouse from "../../context/StatisticsHouse";

interface CorrelationData {
  feature1: string;
  feature2: string;
  correlation: number;
  displayName1: string;
  displayName2: string;
}

const CorrelationAnalysis = (props: { houses: StatisticsHouse[] }) => {
  const { houses } = props;
  const [correlationData, setCorrelationData] = useState<CorrelationData[]>([]);
  const [loading, setLoading] = useState(true);

  // Feature display names mapping
  const featureDisplayNames: Record<string, string> = {
    price: "Prijs",
    area: "Oppervlakte",
    construction_year: "Bouwjaar",
    distance_to_center: "Afstand tot centrum",
    neighborhood_safety: "Buurt veiligheid",
    bedrooms: "Aantal slaapkamers",
    bathrooms: "Aantal badkamers",
    garden_area: "Tuin oppervlakte",
    livable_area: "Bewoonbare oppervlakte",
    number_of_facades: "Aantal gevels",
    epc_score: "EPC Score"
  };

  // Features to analyze
  const features = [
    'area', 'construction_year', 'distance_to_center', 'neighborhood_safety',
    'bedrooms', 'bathrooms', 'garden_area', 'livable_area', 'number_of_facades'
  ];

  // Helper function to get feature value
  const getFeatureValue = (house: StatisticsHouse, feature: string): number | null => {
    switch (feature) {
      case 'price': return house.price;
      case 'area': return house.area;
      case 'construction_year': return house.construction_year;
      case 'distance_to_center': return house.distance_to_center;
      case 'neighborhood_safety': return house.neighborhood_safety;
      case 'bedrooms': return house.bedrooms;
      case 'bathrooms': return house.bathrooms;
      case 'garden_area': return house.garden_area;
      case 'livable_area': return house.livable_area;
      case 'number_of_facades': return house.number_of_facades;
      case 'epc_score': return convertEpcToScore(house.epc);
      default: return null;
    }
  };

  // Convert EPC label to numeric score
  const convertEpcToScore = (epc: string | null): number | null => {
    if (!epc) return null;
    const epcMapping: Record<string, number> = {
      'A+': 1, 'A': 2, 'B': 3, 'C': 4, 'D': 5, 'E': 6, 'F': 7, 'G': 8
    };
    return epcMapping[epc.toUpperCase()] || null;
  };

  // Calculate Pearson correlation coefficient
  const calculateCorrelation = (x: number[], y: number[]): number => {
    const n = x.length;
    if (n < 2) return 0;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  };

  // Calculate correlations between features and price
  const calculateCorrelations = useMemo(() => {
    if (houses.length < 2) return [];

    const correlations: CorrelationData[] = [];

    // Get price data
    const priceData = houses
      .map(h => getFeatureValue(h, 'price'))
      .filter((price): price is number => price !== null && price > 0);

    if (priceData.length < 2) return [];

    // Calculate correlation with price for each feature
    features.forEach(feature => {
      const pairs = houses
        .map(h => ({
          price: getFeatureValue(h, 'price'),
          feature: getFeatureValue(h, feature)
        }))
        .filter(pair => 
          pair.price !== null && pair.price > 0 && 
          pair.feature !== null
        ) as { price: number; feature: number }[];

      if (pairs.length >= 2) {
        const correlation = calculateCorrelation(
          pairs.map(p => p.price),
          pairs.map(p => p.feature)
        );

        if (!isNaN(correlation) && Math.abs(correlation) > 0.01) {
          correlations.push({
            feature1: 'price',
            feature2: feature,
            correlation,
            displayName1: featureDisplayNames['price'],
            displayName2: featureDisplayNames[feature] || feature
          });
        }
      }
    });

    // Add EPC correlation if available
    if (houses.some(h => h.epc)) {
      const epcPairs = houses
        .map(h => ({
          price: getFeatureValue(h, 'price'),
          epc: getFeatureValue(h, 'epc_score')
        }))
        .filter(pair => 
          pair.price !== null && pair.price > 0 && 
          pair.epc !== null
        ) as { price: number; epc: number }[];

      if (epcPairs.length >= 2) {
        const correlation = calculateCorrelation(
          epcPairs.map(p => p.price),
          epcPairs.map(p => p.epc)
        );

        if (!isNaN(correlation) && Math.abs(correlation) > 0.01) {
          correlations.push({
            feature1: 'price',
            feature2: 'epc_score',
            correlation,
            displayName1: featureDisplayNames['price'],
            displayName2: featureDisplayNames['epc_score']
          });
        }
      }
    }

    // Calculate some inter-feature correlations (most interesting ones)
    const interFeatureCorrelations = [
      ['area', 'livable_area'],
      ['area', 'bedrooms'],
      ['bedrooms', 'bathrooms'],
      ['construction_year', 'epc_score'],
      ['distance_to_center', 'neighborhood_safety']
    ];

    interFeatureCorrelations.forEach(([feature1, feature2]) => {
      const pairs = houses
        .map(h => ({
          f1: getFeatureValue(h, feature1),
          f2: getFeatureValue(h, feature2)
        }))
        .filter(pair => 
          pair.f1 !== null && pair.f2 !== null
        ) as { f1: number; f2: number }[];

      if (pairs.length >= 2) {
        const correlation = calculateCorrelation(
          pairs.map(p => p.f1),
          pairs.map(p => p.f2)
        );

        if (!isNaN(correlation) && Math.abs(correlation) > 0.3) {
          correlations.push({
            feature1,
            feature2,
            correlation,
            displayName1: featureDisplayNames[feature1] || feature1,
            displayName2: featureDisplayNames[feature2] || feature2
          });
        }
      }
    });

    // Sort by absolute correlation value (strongest first)
    return correlations
      .sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))
      .slice(0, 12); // Top 12 correlations

  }, [houses]);

  useEffect(() => {
    setLoading(true);
    const correlations = calculateCorrelations;
    setCorrelationData(correlations);
    setLoading(false);
  }, [calculateCorrelations]);

  // Get correlation strength description
  const getCorrelationStrength = (correlation: number): string => {
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return "Sterke";
    if (abs >= 0.5) return "Matige";
    if (abs >= 0.3) return "Zwakke";
    return "Zeer zwakke";
  };

  // Get correlation color
  const getCorrelationColor = (correlation: number): string => {
    const abs = Math.abs(correlation);
    if (correlation > 0) {
      if (abs >= 0.7) return "text-green-700 bg-green-50";
      if (abs >= 0.5) return "text-green-600 bg-green-50";
      return "text-green-500 bg-green-50";
    } else {
      if (abs >= 0.7) return "text-red-700 bg-red-50";
      if (abs >= 0.5) return "text-red-600 bg-red-50";
      return "text-red-500 bg-red-50";
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Feature Correlatie</h2>
        <div className="flex justify-center items-center h-32">
          <div className="text-gray-500">Calculatie correlatie...</div>
        </div>
      </div>
    );
  }

  if (correlationData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Feature Correlatie</h2>
        <div className="text-gray-500 text-center py-8">
          Niet genoeg data beschikbaar voor correlatie analyse
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h2 className="text-xl font-semibold mb-4">Feature Correlatie</h2>
      <div className="mb-4 text-sm text-gray-600">
        Correlaties tussen kenmerken en prijzen (gebaseerd op {houses.length} huizen)
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {correlationData.map((item, index) => (
          <div 
            key={index} 
            className={`border rounded-lg p-4 ${getCorrelationColor(item.correlation)}`}
          >
            <div className="font-medium text-sm mb-2">
              {item.displayName1} ↔ {item.displayName2}
            </div>
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold">
                {item.correlation.toFixed(3)}
              </div>
              <div className="text-xs opacity-75">
                {getCorrelationStrength(item.correlation)} correlatie
              </div>
            </div>
            <div className="mt-2 text-xs opacity-75">
              {item.correlation > 0 ? "Positief verband" : "Negatief verband"}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-xs text-gray-500">
        <div className="flex flex-wrap gap-4">
          <span>📊 Correlatie: -1.0 (perfect negatief) tot +1.0 (perfect positief)</span>
          <span>🟢 Positief: hogere waarde = hogere prijs</span>
          <span>🔴 Negatief: hogere waarde = lagere prijs</span>
        </div>
      </div>
    </div>
  );
};

export default CorrelationAnalysis;