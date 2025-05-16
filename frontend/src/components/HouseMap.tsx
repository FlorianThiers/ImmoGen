import React, { useEffect, useRef, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "../index.css";

const MAP_TILER_KEY = import.meta.env.VITE_MAP_TILER_KEY;

const HouseMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maptilersdk.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Vraag de huidige locatie van de gebruiker op
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("User location:", { latitude, longitude });
          setUserLocation([longitude, latitude]); // Stel de locatie in
        },
        (error) => {
          console.error("Error getting user location:", error);
          // Gebruik een standaardlocatie als fallback (bijvoorbeeld Gent, België)
          setUserLocation([3.7, 51.06]);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Gebruik een standaardlocatie als fallback
      setUserLocation([4.4, 51.2]);
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !userLocation) return;

    maptilersdk.config.apiKey = MAP_TILER_KEY;

    // Initialiseer de kaart met de locatie van de gebruiker
    mapRef.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: userLocation, // Gebruik de locatie van de gebruiker
      zoom: 9,
    });

    // Opruimen bij unmounten
    return () => mapRef.current?.remove();
  }, [userLocation]); // Wacht tot de locatie van de gebruiker beschikbaar is

  return (
    <div className="map-container">
        <h1 className="map-title">Map</h1>
        <p className="map-text">Hier is een kaart met huisgegevens van de voorbije schattingen.</p>
        <div
        ref={mapContainer}
        className="map"
        style={{ overflow: "visible" }}
        />
    </div>

  );
};

export default HouseMap;