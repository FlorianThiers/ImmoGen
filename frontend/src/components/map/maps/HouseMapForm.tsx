import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import User from "../../../context/User";


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
  user?: User | null;
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

const HouseMapForm: React.FC<HouseMapFormProps> = ({ user, centerAddress }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maptilersdk.Map | null>(null);
  const markersRef = useRef<maptilersdk.Marker[]>([]);
  const [center, setCenter] = useState<[number, number] | null>(null);
  const [selectedBaseMap, setSelectedBaseMap] = useState<BaseMapKey>("STREETS");
  const [scrapeHouses, setScrapeHouses] = useState<any[]>([]);
  const [immoGenHouses, setImmoGenHouses] = useState<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false); // Nieuwe state
  

  useEffect(() => {

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
    async function fetchCenter() {
      if (!centerAddress) return;
      const geo = await geocodeAddress(centerAddress);
      if (!cancelled) setCenter(geo);
    }
    fetchCenter();
    return () => { cancelled = true; };
  }, [centerAddress]);

  useEffect(() => {
    if (!mapContainer.current || !center) return;
    maptilersdk.config.apiKey = MAP_TILER_KEY;

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

    mapRef.current.on('load', () => {
      setMapLoaded(true);
    });

    mapRef.current.on('styledata', () => {
      setMapLoaded(true);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      setMapLoaded(false);
    };
  }, [center, selectedBaseMap]);

  
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
            `<div style="color: black;">
            <strong>${house.address || "Onbekend adres"}</strong><br/>Geschatte waarde: €${house.price?.toLocaleString() || "?"}
            </div>`
          )
        )
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });

    // Voeg ImmoGenHouses toe ( blauwe of rode marker afhankelijk van ownEstimat)
    immoGenHouses.forEach((house, index) => {
      console.log(immoGenHouses[0]);
      console.log("Current user:", user);
      if (!house.lat || !house.lon) return;
      const el = document.createElement("div");
      el.style.width = "32px";
      el.style.height = "32px";
      el.style.backgroundImage = user && Number(house.user_id) === Number(user.id) ? "url('/red-marker.png')" : "url('/blue-marker.png')";
      el.style.backgroundSize = "contain";
      el.style.backgroundRepeat = "no-repeat";
      el.style.cursor = "pointer";

      const marker = new maptilersdk.Marker({ element: el })
        .setLngLat([house.lon, house.lat])
        .setPopup(
          new maptilersdk.Popup().setHTML(
            `<div style="color: black;">
            <strong>${house.address || "Onbekend adres"}</strong><br/>Geschatte waarde: €${house.price?.toLocaleString() || "?"}
            </div>`
          )
        )
        .addTo(mapRef.current!);

      markersRef.current.push(marker);
    });

  }, [scrapeHouses, immoGenHouses, mapLoaded, centerAddress]);
    
  const handleBaseMapSwitch = (key: keyof typeof BaseMaps) => {
    setSelectedBaseMap(key);
    setMapLoaded(false); // Reset map loaded state
    if (mapRef.current) {
      mapRef.current.setStyle(BaseMaps[key].style);
    }
  };

   return (
    <div className="map-container">
        <div className="map-buttons-form">
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