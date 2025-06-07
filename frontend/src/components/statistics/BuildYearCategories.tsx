import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type House = {
  id: number;
  construction_year: number;
};

const BuildYearCategories = (props: { houses: House[], color: string }) => {
  const { houses, color } = props;

  // Houses per build year category
  const buildYearCategories = useMemo(() => {
    const categories = {
      "Voor 1945": 0,
      "1945-1970": 0,
      "1970-1990": 0,
      "1990-2010": 0,
      "Na 2010": 0
    };
    
    [...houses].forEach(house => {
      const year = house.construction_year || 1980;
      if (year < 1945) categories["Voor 1945"]++;
      else if (year < 1970) categories["1945-1970"]++;
      else if (year < 1990) categories["1970-1990"]++;
      else if (year < 2010) categories["1990-2010"]++;
      else categories["Na 2010"]++;
    });
    
    return Object.entries(categories).map(([category, count]) => ({ category, count }));
  }, [houses]);

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Huizen per Categorie</h2>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={buildYearCategories}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill={color} />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default BuildYearCategories;