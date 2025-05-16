// hooks/useHouseData.ts
import { useEffect, useState } from "react";
import axios from "axios";

export interface HouseLocation {
  id: number;
  latitude: number;
  longitude: number;
  address: string;
  value: number;
}

export const useHouseData = () => {
  const [houses, setHouses] = useState<HouseLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const res = await axios.get("http://localhost:8000/houses");
        setHouses(res.data);
      } catch (err) {
                console.error("Failed to fetch houses, using fallback data.");
        // Gebruik dummy-data als fallback
        setHouses([
          {
            id: 1,
            latitude: 51.2194,
            longitude: 4.4025,
            address: "Dummystraat 1, Antwerpen",
            value: 350000,
          },
          {
            id: 2,
            latitude: 51.0543,
            longitude: 3.7174,
            address: "Dummylaan 2, Gent",
            value: 450000,
          },
        ]);
        console.log("Houses:", houses);
        console.log("Error:", error);
        setError("Failed to fetch houses");
      } finally {
        setLoading(false);
      }
    };

    fetchHouses();
  }, []);

  return { houses, loading, error };
};
