import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useState, useEffect } from "react";
import StatisticsHouse from "../../context/StatisticsHouse";

interface FeatureImportanceData {
  feature: string;
  importance: number;
  impact: "positive" | "negative";
  displayName: string;
}

const FeatureImportance = (props: { houses: StatisticsHouse[] }) => {
  const { houses } = props;
  const [featureImportance, setFeatureImportance] = useState<FeatureImportanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [useBackend, setUseBackend] = useState(true); // Toggle tussen backend en frontend berekening

  // Feature display names mapping
  const featureDisplayNames: Record<string, string> = {
    area: "Oppervlakte",
    construction_year: "Bouwjaar",
    distance_to_center: "Afstand tot centrum",
    neighborhood_safety: "Buurt veiligheid",
    bedrooms: "Aantal slaapkamers",
    bathrooms: "Aantal badkamers",
    garden_area: "Tuin oppervlakte",
    garage: "Garage aanwezig",
    terrace: "Terras aanwezig",
    epc: "EPC label",
    livable_area: "Bewoonbare oppervlakte",
    number_of_facades: "Aantal gevels",
    swimming_pool: "Zwembad",
    solar_panels: "Zonnepanelen"
  };

  // Backend feature importance ophalen
  const fetchBackendFeatureImportance = async (): Promise<FeatureImportanceData[]> => {
    try {
      const response = await fetch('/api/feature-importance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          houses: houses.map(h => ({
            id: h.id,
            price: h.price,
            area: h.area,
            construction_year: h.construction_year,
            distance_to_center: h.distance_to_center,
            neighborhood_safety: h.neighborhood_safety,
            bedrooms: h.bedrooms,
            bathrooms: h.bathrooms,
            garden_area: h.garden_area,
            garage: h.garage,
            terrace: h.terrace,
            epc: h.epc,
            livable_area: h.livable_area,
            number_of_facades: h.number_of_facades,
            swimming_pool: h.swimming_pool,
            solar_panels: h.solar_panels
          }))
        })
      });
      
      if (!response.ok) throw new Error('Backend request failed');
      
      const data = await response.json();
      return data.feature_importance.map((item: any) => ({
        feature: item.feature,
        importance: item.importance,
        impact: item.importance > 0 ? "positive" : "negative",
        displayName: featureDisplayNames[item.feature] || item.feature
      }));
    } catch (error) {
      console.error('Backend feature importance failed:', error);
      throw error;
    }
  };

  // Frontend feature importance berekening (correlation-based)
  const calculateFrontendFeatureImportance = (): FeatureImportanceData[] => {
    if (houses.length < 2) return [];

    const features = [
      'area', 'construction_year', 'distance_to_center', 'neighborhood_safety',
      'bedrooms', 'bathrooms', 'garden_area', 'livable_area', 'number_of_facades'
    ];

    const correlations = features.map(feature => {
      const values = houses
        .map(h => ({ 
          price: h.price || 0, 
          feature: getFeatureValue(h, feature) 
        }))
        .filter(item => item.price > 0 && item.feature !== null);

      if (values.length < 2) return { feature, correlation: 0 };

      const correlation = calculateCorrelation(
        values.map(v => v.price),
        values.map(v => v.feature as number)
      );

      return { feature, correlation };
    });

    // Boolean features apart behandelen
    const booleanFeatures = ['garage', 'terrace', 'swimming_pool', 'solar_panels'];
    const booleanCorrelations = booleanFeatures.map(feature => {
      const withFeature = houses.filter(h => getFeatureValue(h, feature) === true && h.price);
      const withoutFeature = houses.filter(h => getFeatureValue(h, feature) === false && h.price);
      
      if (withFeature.length === 0 || withoutFeature.length === 0) {
        return { feature, correlation: 0 };
      }

      const avgWith = withFeature.reduce((sum, h) => sum + (h.price || 0), 0) / withFeature.length;
      const avgWithout = withoutFeature.reduce((sum, h) => sum + (h.price || 0), 0) / withoutFeature.length;
      
      // Normalize correlation naar -1 tot 1 range
      const maxPrice = Math.max(...houses.map(h => h.price || 0));
      const correlation = (avgWith - avgWithout) / maxPrice;

      return { feature, correlation };
    });

    const allCorrelations = [...correlations, ...booleanCorrelations]
      .sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))
      .slice(0, 10);

    return allCorrelations.map((item, index) => ({
      feature: item.feature,
      importance: item.correlation,
      impact: item.correlation > 0 ? "positive" : "negative",
      displayName: featureDisplayNames[item.feature] || item.feature
    }));
  };

  // Helper functions
  const getFeatureValue = (house: StatisticsHouse, feature: string): number | boolean | null => {
    switch (feature) {
      case 'area': return house.area;
      case 'construction_year': return house.construction_year;
      case 'distance_to_center': return house.distance_to_center;
      case 'neighborhood_safety': return house.neighborhood_safety;
      case 'bedrooms': return house.bedrooms;
      case 'bathrooms': return house.bathrooms;
      case 'garden_area': return house.garden_area;
      case 'garage': return house.garage;
      case 'terrace': return house.terrace;
      case 'livable_area': return house.livable_area;
      case 'number_of_facades': return house.number_of_facades;
      case 'swimming_pool': return house.swimming_pool;
      case 'solar_panels': return house.solar_panels;
      default: return null;
    }
  };

  const calculateCorrelation = (x: number[], y: number[]): number => {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  };

  useEffect(() => {
    const loadFeatureImportance = async () => {
      setLoading(true);
      try {
        let data: FeatureImportanceData[];
        
        if (useBackend) {
          try {
            data = await fetchBackendFeatureImportance();
          } catch (error) {
            console.log('Falling back to frontend calculation');
            data = calculateFrontendFeatureImportance();
            setUseBackend(false);
          }
        } else {
          data = calculateFrontendFeatureImportance();
        }
        
        setFeatureImportance(data);
      } catch (error) {
        console.error('Feature importance calculation failed:', error);
        setFeatureImportance([]);
      } finally {
        setLoading(false);
      }
    };

    if (houses.length > 0) {
      loadFeatureImportance();
    }
  }, [houses, useBackend]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Top 10 Feature Importance</h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading feature importance...</div>
        </div>
      </div>
    );
  }

  if (featureImportance.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Top 10 Feature Importance</h2>
        <div className="text-gray-500 text-center py-8">
          Niet genoeg data beschikbaar voor feature importance analyse
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Top 10 Feature Importance</h2>
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={() => setUseBackend(!useBackend)}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            {useBackend ? 'Backend ML' : 'Frontend Calc'}
          </button>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={featureImportance}
          layout="horizontal"
          margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="displayName" type="category" width={100} />
          <Tooltip 
            formatter={(value, name) => {
              const numValue = typeof value === "number" ? value : parseFloat(value as string);
              return [
                `${Math.abs(numValue).toFixed(3)}`,
                numValue > 0 ? "Positive Impact" : "Negative Impact"
              ];
            }}
          />
          <Bar dataKey="importance" fill="#8884d8">
            {featureImportance.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.impact === "positive" ? "#4ade80" : "#ef4444"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className="mt-4 text-sm text-gray-600">
        {useBackend ? 
          "✓ Gebaseerd op Random Forest model" : 
          "⚠ Gebaseerd op correlatie-analyse (fallback)"
        }
      </div>
    </div>
  );
};

export default FeatureImportance;