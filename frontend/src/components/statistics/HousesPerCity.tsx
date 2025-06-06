import { Color } from "@maptiler/sdk";
import React, { useEffect, useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, Line } from "recharts";

type House = {
  id: number;
  city: string;
};


const DataOverview = (props: { houses: House[], color: string }) => {
  const { houses, color } = props;

  // Houses per city
  const housesPerCity = useMemo(() => {
    const cityCount: { [key: string]: number } = {};
    [...houses].forEach(house => {
      cityCount[house.city] = (cityCount[house.city] || 0) + 1;
    });
    return Object.entries(cityCount).map(([city, count]) => ({ city, count }));
  }, [houses]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Houses per City</h2>
            <ResponsiveContainer width="100%" height={300}>
            <BarChart data={housesPerCity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="city" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={color} />
            </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};

export default DataOverview;