import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect, useMemo } from "react";
import StatisticsHouse from "../../context/StatisticsHouse";

interface DataQualityItem {
  feature: string;
  displayName: string;
  missing: number;
  total: number;
  percentage: string;
  completeness: number;
}

const DataQuality = (props: { houses: StatisticsHouse[], color: string }) => {
  const { houses, color } = props;
  const [dataQuality, setDataQuality] = useState<DataQualityItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Feature display names mapping
  const featureDisplayNames: Record<string, string> = {
    price: "Prijs",
    area: "Oppervlakte",
    construction_year: "Bouwjaar",
    epc: "EPC Label",
    distance_to_center: "Afstand centrum",
    neighborhood_safety: "Buurt veiligheid",
    bedrooms: "Slaapkamers",
    bathrooms: "Badkamers",
    garden_area: "Tuin oppervlakte",
    livable_area: "Bewoonbare opp.",
    garage: "Garage",
    terrace: "Terras",
    kitchen_area: "Keuken oppervlakte",
    heating_type: "Verwarmingstype",
    solar_panels: "Zonnepanelen",
    swimming_pool: "Zwembad",
    number_of_facades: "Aantal gevels",
    property_condition: "Staat eigendom"
  };

  // Important features to analyze
  const importantFeatures = [
    'price', 'area', 'construction_year', 'epc', 'distance_to_center',
    'neighborhood_safety', 'bedrooms', 'bathrooms', 'livable_area',
    'garage', 'terrace', 'garden_area', 'heating_type', 'property_condition'
  ];

  // Helper function to get feature value
  const getFeatureValue = (house: StatisticsHouse, feature: string): any => {
    switch (feature) {
      case 'price': return house.price;
      case 'area': return house.area;
      case 'construction_year': return house.construction_year;
      case 'epc': return house.epc;
      case 'distance_to_center': return house.distance_to_center;
      case 'neighborhood_safety': return house.neighborhood_safety;
      case 'bedrooms': return house.bedrooms;
      case 'bathrooms': return house.bathrooms;
      case 'garden_area': return house.garden_area;
      case 'livable_area': return house.livable_area;
      case 'garage': return house.garage;
      case 'terrace': return house.terrace;
      case 'kitchen_area': return house.kitchen_area;
      case 'heating_type': return house.heating_type;
      case 'solar_panels': return house.solar_panels;
      case 'swimming_pool': return house.swimming_pool;
      case 'number_of_facades': return house.number_of_facades;
      case 'property_condition': return house.property_condition;
      default: return null;
    }
  };

  // Check if a value is considered missing
  const isMissing = (value: any): boolean => {
    return value === null || 
           value === undefined || 
           value === '' || 
           (typeof value === 'string' && value.trim() === '') ||
           (typeof value === 'number' && (isNaN(value) || value === 0));
  };

  // Calculate data quality metrics
  const calculateDataQuality = useMemo(() => {
    if (houses.length === 0) return [];

    const qualityData: DataQualityItem[] = [];

    importantFeatures.forEach(feature => {
      let missingCount = 0;
      let totalCount = houses.length;

      houses.forEach(house => {
        const value = getFeatureValue(house, feature);
        if (isMissing(value)) {
          missingCount++;
        }
      });

      const completeness = totalCount > 0 ? ((totalCount - missingCount) / totalCount) * 100 : 0;

      qualityData.push({
        feature,
        displayName: featureDisplayNames[feature] || feature,
        missing: missingCount,
        total: totalCount,
        percentage: completeness.toFixed(1),
        completeness: Math.round(completeness)
      });
    });

    // Sort by completeness (lowest first to highlight problematic features)
    return qualityData.sort((a, b) => a.completeness - b.completeness);
  }, [houses]);

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    if (dataQuality.length === 0) return { avgCompleteness: 0, criticalIssues: 0, goodFeatures: 0 };

    const avgCompleteness = Math.round(
      dataQuality.reduce((acc, item) => acc + item.completeness, 0) / dataQuality.length
    );

    const criticalIssues = dataQuality.filter(item => item.completeness < 50).length;
    const goodFeatures = dataQuality.filter(item => item.completeness >= 80).length;

    return { avgCompleteness, criticalIssues, goodFeatures };
  }, [dataQuality]);

  useEffect(() => {
    setLoading(true);
    const qualityData = calculateDataQuality;
    setDataQuality(qualityData);
    setLoading(false);
  }, [calculateDataQuality]);

  // Get color based on completeness percentage
  const getCompletenessColor = (completeness: number): string => {
    if (completeness >= 80) return "#22c55e"; // Green
    if (completeness >= 60) return "#eab308"; // Yellow
    if (completeness >= 40) return "#f97316"; // Orange
    return "#ef4444"; // Red
  };

  // Get quality status text
  const getQualityStatus = (completeness: number): string => {
    if (completeness >= 90) return "Uitstekend";
    if (completeness >= 80) return "Goed";
    if (completeness >= 60) return "Matig";
    if (completeness >= 40) return "Slecht";
    return "Kritiek";
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Data Quality & Completeness</h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Analyzing data quality...</div>
        </div>
      </div>
    );
  }

  if (houses.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Data Quality & Completeness</h2>
        <div className="text-gray-500 text-center py-8">
          Geen data beschikbaar voor kwaliteitsanalyse
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
      <h2 className="text-xl font-semibold mb-4">Data Quality & Completeness</h2>
      
      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">
            {overallStats.avgCompleteness}%
          </div>
          <div className="text-sm text-gray-600">Gemiddelde Volledigheid</div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">
            {overallStats.goodFeatures}
          </div>
          <div className="text-sm text-gray-600">Goede Features (≥80%)</div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600">
            {overallStats.criticalIssues}
          </div>
          <div className="text-sm text-gray-600">Kritieke Issues (&lt;50%)</div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={dataQuality} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="displayName" 
            angle={-45}
            textAnchor="end"
            height={100}
            fontSize={12}
          />
          <YAxis 
            label={{ value: 'Volledigheid (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value, name, props) => [
              `${value}%`,
              "Volledigheid"
            ]}
            labelFormatter={(label) => `Feature: ${label}`}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as DataQualityItem;
                return (
                  <div className="bg-white p-3 border rounded shadow">
                    <p className="font-semibold">{label}</p>
                    <p className="text-sm">
                      <span className="text-green-600">Compleet: {data.total - data.missing}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-red-600">Ontbrekend: {data.missing}</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Volledigheid: {data.percentage}%</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Status: {getQualityStatus(data.completeness)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="completeness" 
            fill={color}
            radius={[2, 2, 0, 0]}
          >
            {dataQuality.map((entry, index) => (
              <Bar 
                key={`cell-${index}`} 
                fill={getCompletenessColor(entry.completeness)}
                dataKey="completeness"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Detailed Quality Table */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Gedetailleerde Kwaliteitsoverzicht</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Feature</th>
                <th className="px-4 py-2 text-center">Compleet</th>
                <th className="px-4 py-2 text-center">Ontbrekend</th>
                <th className="px-4 py-2 text-center">Volledigheid</th>
                <th className="px-4 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {dataQuality.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2 font-medium">{item.displayName}</td>
                  <td className="px-4 py-2 text-center text-green-600">
                    {item.total - item.missing}
                  </td>
                  <td className="px-4 py-2 text-center text-red-600">
                    {item.missing}
                  </td>
                  <td className="px-4 py-2 text-center font-semibold">
                    {item.percentage}%
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span 
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        item.completeness >= 80 ? 'bg-green-100 text-green-800' :
                        item.completeness >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        item.completeness >= 40 ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {getQualityStatus(item.completeness)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quality Guidelines */}
      <div className="mt-6 text-xs text-gray-500 bg-gray-50 p-4 rounded">
        <h4 className="font-semibold mb-2">Kwaliteitsindicatoren:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <span>🟢 ≥90%: Uitstekend</span>
          <span>🟡 80-89%: Goed</span>
          <span>🟠 60-79%: Matig</span>
          <span>🔴 &lt;60%: Actie vereist</span>
        </div>
      </div>
    </div>
  );
};

export default DataQuality;