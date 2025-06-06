import { useMemo } from "react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, Line } from "recharts";

import House from "../../context/House"

const PriseComparison = (props: { houses: House[] }) => {
  const { houses } = props;

  // 6. Price Comparison
  type PriceStatus = "Overpriced" | "Underpriced" | "Fair";

  const priceComparison = useMemo(() => {
    return houses.map(house => ({
      id: house.id,
      vraagprijs: house.price,
      ai_prijs: house.ai_price,
      verschil: house.price - house.ai_price,
      status: house.price > house.ai_price * 1.1 ? "Overpriced" as PriceStatus : 
              house.price < house.ai_price * 0.9 ? "Underpriced" as PriceStatus : "Fair" as PriceStatus
    }));
  }, [houses]);

  const overUnderPriced = useMemo(() => {
    const counts: Record<PriceStatus, number> = { Overpriced: 0, Underpriced: 0, Fair: 0 };
    priceComparison.forEach(house => counts[house.status]++);
    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  }, [priceComparison]);

  return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Price Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={overUnderPriced}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, count }) => `${status}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {overUnderPriced.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={
                    entry.status === "Overpriced" ? "#ef4444" :
                    entry.status === "Underpriced" ? "#3b82f6" : "#10b981"
                  } />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Asking Price vs AI Price</h2>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={priceComparison.slice(0, 50)}>
              <CartesianGrid />
              <XAxis dataKey="vraagprijs" name="Asking Price" />
              <YAxis dataKey="ai_prijs" name="AI Price" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter dataKey="ai_prijs" fill="#8884d8" />
              <Line type="monotone" dataKey="vraagprijs" stroke="#ff7300" strokeDasharray="5 5" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
  );
};

export default PriseComparison;