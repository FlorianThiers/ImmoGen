import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";


const MAP_TILER_KEY = import.meta.env.VITE_MAP_TILER_KEY;

const BaseMaps = {
  STREETS: {
    img: "/streets.png",
    style: maptilersdk.MapStyle.STREETS,
  },
  SATELITE: {
    img: "/satelite.png",
    style: maptilersdk.MapStyle.SATELLITE,
  }
}
type BaseMapKey = keyof typeof BaseMaps;


interface HouseMapFormProps {
  centerAddress: string;
}

async function geocodeAddress(address: string): Promise<[number, number] | null> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
  );
  const data = await res.json();
  if (data && data.length > 0) {
    return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
  }
  return null;
}

const HouseMapForm: React.FC<HouseMapFormProps> = ({ centerAddress }) => {
  const [currentUser, setCurrentUser] = useState<{ id: number } | null>(null);  
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maptilersdk.Map | null>(null);
  const markersRef = useRef<maptilersdk.Marker[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedBaseMap, setSelectedBaseMap] = useState<BaseMapKey>("STREETS");
  const [scrapeHouses, setScrapeHouses] = useState<any[]>([]);
  const [immoGenHouses, setImmoGenHouses] = useState<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false); // Nieuwe state

  useEffect(() => {
    const fetchCurrentUser = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCurrentUser(res.data);
        } catch (error) {
            console.error("Error fetching current user:", error);
            setCurrentUser(null);
        }
    };
    fetchCurrentUser();
  }, []);
  

    useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]);
        },
        () => setUserLocation([3.7, 51.06])
      );
    } else {
      setUserLocation([4.4, 51.2]);
    }

    const fetchScrapeHouses = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_API_URL}/scrape_addresses`;
        console.log('🔄 Fetching from:', apiUrl);
        
        const res = await fetch(apiUrl); 
        console.log('📡 Response status:', res.status, res.statusText);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('📋 Raw API response:', data);
        console.log('📊 Houses count:', Array.isArray(data) ? data.length : 'Not an array');
        
        if (Array.isArray(data) && data.length > 0) {
          console.log('🏠 First house example:', data[0]);
          setScrapeHouses(data);
        } else {
          console.warn('⚠️ No houses returned or invalid format');
          setScrapeHouses([]);
        }
      } catch (error) {
        console.error("❌ Failed to fetch houses:", error);
        console.error("❌ Error details:", {
          // message: error.message,
          // stack: error.stack
        });
      }
    };
    fetchScrapeHouses();

    const fetchImmoGenHouses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/immogen_addresses`,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        const data = response.data;
        if (Array.isArray(data) && data.length > 0) {
          console.log('🏠 First house example:', data[0]);
          setImmoGenHouses(data);
        } else {
          console.warn('⚠️ No houses returned or invalid format');
          setImmoGenHouses([]);
        }
      } catch (error) {
        console.error("❌ Failed to fetch ImmoGen houses:", error);
      }
    };
    fetchImmoGenHouses();

  }, []);


  useEffect(() => {
    let cancelled = false;

    async function setupMap() {
      if (!mapContainer.current || !centerAddress) return;
      maptilersdk.config.apiKey = MAP_TILER_KEY;
      const center = await geocodeAddress(centerAddress);
      if (!center || cancelled) return;

      // Verwijder oude map instance
      if (mapRef.current) {
        mapRef.current.remove();
      }

      mapRef.current = new maptilersdk.Map({
        container: mapContainer.current,
        style: BaseMaps[selectedBaseMap].style,
        center: center,
        zoom: 9,
      });

      // Wacht tot de map volledig geladen is
      mapRef.current.on('load', () => {
        console.log('Map loaded');
        setMapLoaded(true);
      });

      // Reset mapLoaded bij style change
      mapRef.current.on('styledata', () => {
        setMapLoaded(true);
      });
    }

    setupMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      setMapLoaded(false);
    };
  }, [centerAddress, selectedBaseMap]);

  
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) {
      return;
    }

    // Verwijder oude markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Voeg scrapeHouses toe (altijd paarse markere)
    scrapeHouses.forEach((house, index) => {
      if (!house.lat || !house.lon) return;
      const el = document.createElement("div");
      el.style.width = "22px";
      el.style.height = "22px";
      el.style.backgroundImage = "url('/purple-marker.png')";
      el.style.backgroundSize = "contain";
      el.style.backgroundRepeat = "no-repeat";
      el.style.cursor = "pointer";

      const marker = new maptilersdk.Marker({ element: el })
        .setLngLat([house.lon, house.lat])
        .setPopup(
          new maptilersdk.Popup().setHTML(
            `<strong>${house.address || "Onbekend adres"}</strong><br/>Geschatte waarde: €${house.ai_price?.toLocaleString() || "?"}`
          )
        )
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });

    // Voeg ImmoGenHouses toe ( blauwe of rode marker afhankelijk van ownEstimat)
    immoGenHouses.forEach((house, index) => {
      console.log(immoGenHouses[0]);
      console.log("Current user:", currentUser);
      if (!house.lat || !house.lon) return;
      const el = document.createElement("div");
      el.style.width = "32px";
      el.style.height = "32px";
      el.style.backgroundImage = currentUser && Number(house.user_id) === Number(currentUser.id) ? "url('/red-marker.png')" : "url('/blue-marker.png')";
      el.style.backgroundSize = "contain";
      el.style.backgroundRepeat = "no-repeat";
      el.style.cursor = "pointer";

      const marker = new maptilersdk.Marker({ element: el })
        .setLngLat([house.lon, house.lat])
        .setPopup(
          new maptilersdk.Popup().setHTML(
            `<strong>${house.address || "Onbekend adres"}</strong><br/>Geschatte waarde: €${house.ai_price?.toLocaleString() || "?"}`
          )
        )
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });

  }, [scrapeHouses, immoGenHouses, mapLoaded]);
    
  const handleBaseMapSwitch = (key: keyof typeof BaseMaps) => {
    setSelectedBaseMap(key);
    setMapLoaded(false); // Reset map loaded state
    if (mapRef.current) {
      mapRef.current.setStyle(BaseMaps[key].style);
    }
  };

   return (
    <div className="map-container">
        <div className="map-buttons">
          {Object.entries(BaseMaps).map(([key, value]) => (
            <button
              className="map-button"
              key={key}
              onClick={() => handleBaseMapSwitch(key as keyof typeof BaseMaps)}
              style={{
                border: selectedBaseMap === key ? "2px solid #000dff" : "1px solid #ccc",
                borderRadius: 4,
                background: "#fff",
                padding: 1,
                cursor: "pointer",
              }}
              title={key}
            >
              <img src={value.img} alt={key} style={{ width: 40, height: 40 }} />
            </button>
          ))}
        </div>
        <div
          ref={mapContainer}
          className="map"
        />
    </div>
   );
};

export default HouseMapForm;