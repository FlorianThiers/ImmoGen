import React, { useEffect, useRef, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "../index.css";

const MAP_TILER_KEY = import.meta.env.VITE_MAP_TILER_KEY;

const BaseMaps ={
  STREETS: {
    img: "/streets.png",
    style: maptilersdk.MapStyle.STREETS,
  },
  SATELITE: {
    img: "/satelite.png",
    style: maptilersdk.MapStyle.SATELLITE,
  }
}

const dummyHouses = [
  {
    id: 1,
    lat: 51.0543,
    lon: 3.7174,
    address: "Dummylaan 2, Gent",
    value: 450000,
    ownEstimate: true,
  },
  {
    id: 2,
    lat: 51.2194,
    lon: 4.4025,
    address: "Dummystraat 1, Antwerpen",
    value: 350000,
    ownEstimate: false,
  },
];

type BaseMapKey = keyof typeof BaseMaps;

const HouseMapLandingPage: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maptilersdk.Map | null>(null);
  const markersRef = useRef<maptilersdk.Marker[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedBaseMap, setSelectedBaseMap] = useState<BaseMapKey>("STREETS");
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]); // Stel de locatie in
        },
        () => setUserLocation([3.7, 51.06])
      );
    } else {
      setUserLocation([4.4, 51.2]);
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !userLocation) return;

    maptilersdk.config.apiKey = MAP_TILER_KEY;

    mapRef.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: BaseMaps[selectedBaseMap].style,
      center: userLocation, // Gebruik de locatie van de gebruiker
      zoom: 9,
    });

    return () => mapRef.current?.remove();
  }, [userLocation, selectedBaseMap]); // Wacht tot de locatie van de gebruiker beschikbaar is

  
  // MARKERS TOEVOEGEN
  useEffect(() => {
    if (!mapRef.current) return;

    // Verwijder oude markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Voeg markers toe
    dummyHouses.forEach((house) => {
      const el = document.createElement("img");
      el.src = house.ownEstimate ? "/red-marker.png" : "/blue-marker.png";
      el.style.width = "32px";
      el.style.height = "32px";
      el.style.transform = "translate(-50%, -100%)";
      el.style.cursor = "pointer";
      
      const marker = new maptilersdk.Marker({ element: el })
        .setLngLat([house.lon, house.lat])
        .setPopup(
          new maptilersdk.Popup().setHTML(
            `<strong>${house.address}</strong><br/>Geschatte waarde: €${house.value.toLocaleString()}`
          )
        )
        .addTo(mapRef.current!);

        markersRef.current.push(marker)
      });
    }, [selectedBaseMap, userLocation]);
    
  const handleBaseMapSwitch = (key: keyof typeof BaseMaps) => {
    setSelectedBaseMap(key);
    if (mapRef.current) {
      mapRef.current.setStyle(BaseMaps[key].style);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search) return;
    setSearchLoading(true);
    try {
      // Gebruik Nominatim voor gratis geocoding
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
          style={{ overflow: "visible" }}
        />
    </div>

  );
};

export default HouseMapLandingPage;