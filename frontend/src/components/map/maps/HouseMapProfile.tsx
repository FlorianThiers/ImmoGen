import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";

import User from "../../../context/User";

interface MapProps {
  user?: User | null;
}

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

const HouseMapProfile: React.FC<MapProps> = ({ user }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maptilersdk.Map | null>(null);
  const markersRef = useRef<maptilersdk.Marker[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedBaseMap, setSelectedBaseMap] = useState<BaseMapKey>("STREETS");
   const [search, setSearch] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);
  const [immoGenHouses, setImmoGenHouses] = useState<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false); // Nieuwe state

  useEffect(() => {
    // Haal geolocatie van de gebruiker op
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
      if (!mapContainer.current || !userLocation) return;
  
      maptilersdk.config.apiKey = MAP_TILER_KEY;
  
      // Verwijder oude map instance
      if (mapRef.current) {
        mapRef.current.remove();
      }
  
      mapRef.current = new maptilersdk.Map({
        container: mapContainer.current,
        style: BaseMaps[selectedBaseMap].style,
        center: userLocation,
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
  
      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
        setMapLoaded(false);
      };
    }, [userLocation, selectedBaseMap]);
  
    
    useEffect(() => {
      if (!mapContainer.current || !userLocation) return;

      maptilersdk.config.apiKey = MAP_TILER_KEY;
      
      // Verwijder oude map instance
      if (mapRef.current) {
        mapRef.current.remove();
      }

      mapRef.current = new maptilersdk.Map({
        container: mapContainer.current,
        style: BaseMaps[selectedBaseMap].style,
        center: userLocation,
        zoom: 10,
      });
    
      // Verwijder oude markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
  
      // Voeg ImmoGenHouses toe ( blauwe of rode marker afhankelijk van ownEstimat)
      immoGenHouses.forEach((house) => {
        // console.log(immoGenHouses[0]);
        // console.log("Current user:", user);
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
              `<strong>${house.address || "Onbekend adres"}</strong><br/>Geschatte waarde: €${house.ai_price?.toLocaleString() || "?"}`
            )
          )
          .addTo(mapRef.current!);

        markersRef.current.push(marker);
      });

    }, [immoGenHouses, mapLoaded]);

    const handleBaseMapSwitch = (key: keyof typeof BaseMaps) => {
      setSelectedBaseMap(key);
      setMapLoaded(false); // Reset map loaded state
      if (mapRef.current) {
        mapRef.current.setStyle(BaseMaps[key].style);
      }
    };

    const handleSearch = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!search) return;
      setSearchLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`
        );
        const data = await res.json();
        if (data && data.length > 0) {
          const lon = parseFloat(data[0].lon);
          const lat = parseFloat(data[0].lat);
          setUserLocation([lon, lat]);
          if (mapRef.current) {
            mapRef.current.setCenter([lon, lat]);
            mapRef.current.setZoom(13);
          }
        } else {
          alert("Locatie niet gevonden.");
        }
      } catch {
        alert("Er ging iets mis bij het zoeken.");
      }
      setSearchLoading(false);
    };    

  return (
    <div className="map-container">
        <h1 className="map-title">Map</h1>
        <p className="map-text">Hier is een kaart met huisgegevens van de voorbije schattingen.</p>
        
        {/* Debug info
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
          Houses loaded: {houses.length} | Map loaded: {mapLoaded ? 'Yes' : 'No'} | Markers: {markersRef.current.length}
          <br />
          API URL: {import.meta.env.VITE_API_URL}
          <button 
            onClick={addTestMarkers}
            style={{ marginLeft: '10px', padding: '4px 8px', fontSize: '10px' }}
          >
            🧪 Test Markers
          </button>
        </div> */}
        
        <form onSubmit={handleSearch} style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Zoek een locatie..."
            style={{ flex: 1, padding: "0.5rem", borderRadius: 4, border: "1px solid #ccc" }}
          />
          <button type="submit" disabled={searchLoading} style={{ padding: "0.5rem 1rem" }}>
            {searchLoading ? "Zoeken..." : "Zoek"}
          </button>
        </form>
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

export default HouseMapProfile;