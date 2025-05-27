import React, { useEffect, useRef, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "../../index.css";


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

const HouseMapLandingPage: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maptilersdk.Map | null>(null);
  const markersRef = useRef<maptilersdk.Marker[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedBaseMap, setSelectedBaseMap] = useState<BaseMapKey>("STREETS");
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [scrapeHouses, setScrapeHouses] = useState<any[]>([]);
  const [ImmoGenHouses, setImmoGenHouses] = useState<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false); // Nieuwe state

  
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
        const apiUrl = `${import.meta.env.VITE_API_URL}/immogen_addresses`;
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
    if (!mapRef.current || !mapLoaded) {
      return;
    }

    // Verwijder oude markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Voeg scrapeHouses toe (blauwe of rode marker afhankelijk van ownEstimate)
    scrapeHouses.forEach((house, index) => {
      if (!house.lat || !house.lon) return;
      const el = document.createElement("div");
      el.style.width = "32px";
      el.style.height = "32px";
      el.style.backgroundImage = house.ownEstimate ? "url('/red-marker.png')" : "url('/blue-marker.png')";
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

    // Voeg ImmoGenHouses toe (altijd rode marker)
    ImmoGenHouses.forEach((house, index) => {
      if (!house.lat || !house.lon) return;
      const el = document.createElement("div");
      el.style.width = "32px";
      el.style.height = "32px";
      el.style.backgroundImage = "url('/red-marker.png')";
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

  }, [scrapeHouses, ImmoGenHouses, mapLoaded]);
    
  const handleBaseMapSwitch = (key: keyof typeof BaseMaps) => {
    setSelectedBaseMap(key);
    setMapLoaded(false); // Reset map loaded state
    if (mapRef.current) {
      mapRef.current.setStyle(BaseMaps[key].style);
    }
  };

  const addTestMarkers = () => {
    const testHouses = [
      {
        id: 1,
        address: "Test Address 1, Amsterdam",
        lat: 52.3676,
        lon: 4.9041,
        ai_price: 500000
      },
      {
        id: 2, 
        address: "Test Address 2, Rotterdam",
        lat: 51.9244,
        lon: 4.4777,
        ai_price: 350000
      }
    ];
    
    console.log('🧪 Adding test markers');
    setScrapeHouses(testHouses);
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

export default HouseMapLandingPage;