import React, { useEffect, useRef, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";

const MAP_TILER_KEY = import.meta.env.VITE_MAP_TILER_KEY;

interface HouseMapProfileProps {
  houses: { lat: number; lon: number; ownEstimate: boolean; address: string; value: number }[];
}

const DEFAULT_CENTER: [number, number] = [4.4, 51.2]; // fallback (bijv. België)

const HouseMapProfile: React.FC<HouseMapProfileProps> = ({ houses }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maptilersdk.Map | null>(null);
  const [centerCoords, setCenterCoords] = useState<[number, number]>(DEFAULT_CENTER);

  useEffect(() => {
    // Haal geolocatie van de gebruiker op
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenterCoords([position.coords.longitude, position.coords.latitude]);
        },
        () => setCenterCoords(DEFAULT_CENTER) // fallback
      );
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !centerCoords) return;

    maptilersdk.config.apiKey = MAP_TILER_KEY;

    mapRef.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: centerCoords,
      zoom: 11,
    });

    // Voeg markers toe
    houses.forEach((house) => {
      const el = document.createElement("img");
      el.src = house.ownEstimate ? "/red-marker.png" : "/blue-marker.png";
      el.style.width = "24px";
      el.style.height = "24px";
      el.style.transform = "translate(-50%, -100%)";
      el.style.cursor = "pointer";

      new maptilersdk.Marker({ element: el })
        .setLngLat([house.lon, house.lat])
        .setPopup(
          new maptilersdk.Popup().setHTML(
            `<strong>${house.address}</strong><br/>Geschatte waarde: €${house.value.toLocaleString()}`
          )
        )
        .addTo(mapRef.current!);
    });

    return () => {
      mapRef.current?.remove();
    };
  }, [centerCoords, houses]);

  return <div ref={mapContainer} style={{ width: "100%", height: 300, borderRadius: 8, marginTop: 16 }} />;
};

export default HouseMapProfile;