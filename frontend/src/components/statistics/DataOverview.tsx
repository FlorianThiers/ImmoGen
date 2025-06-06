import { useMemo } from "react";
import {Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

type House = {
  id: number;
};

type ScrapeHouse = {
  id: number;
};

const DataOverview = (props: { houses: House[], scrapehouses: ScrapeHouse[] }) => {
  const { houses } = props;
  const { scrapehouses } = props

  // 1. Data Overview & Volumes
  const dataOverview = useMemo(() => {
    return [
      { name: "ImmoGen Houses", value: houses.length, color: "#82ca9d" },
      { name: "Scraped Houses", value: scrapehouses.length, color: "#8884d8" }
    ];
  }, [houses, scrapehouses]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Data Volume Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
              data={[...dataOverview].reverse()}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#82ca9d"
              dataKey="value"
              >
              {[...dataOverview].reverse().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              </Pie>
              <Tooltip />
            </PieChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};

export default DataOverview;