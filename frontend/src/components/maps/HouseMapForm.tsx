import React, { useEffect, useRef } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";

const MAP_TILER_KEY = import.meta.env.VITE_MAP_TILER_KEY;

interface HouseMapFormProps {
  centerAddress: string;
  houses: { lat: number; lon: number; ownEstimate: boolean; address: string; value: number }[];
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

const HouseMapForm: React.FC<HouseMapFormProps> = ({ centerAddress, houses }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maptilersdk.Map | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function setupMap() {
      if (!mapContainer.current) return;
      maptilersdk.config.apiKey = MAP_TILER_KEY;
      const center = await geocodeAddress(centerAddress);
      if (!center || !isMounted) return;
      
      // Zorg ervoor dat we geen nieuwe map aanmaken als er al een bestaat
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      try {
        mapRef.current = new maptilersdk.Map({
          container: mapContainer.current,
          style: maptilersdk.MapStyle.STREETS,
          center,
          zoom: 13,
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
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    }
    setupMap();
    return () => {
      isMounted = false;
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (error) {
          console.error("Error cleaning up map:", error);
        }
        mapRef.current = null;
      }
    };
  }, [centerAddress, houses]);

  return <div ref={mapContainer} className="houseMap" />;
};

export default HouseMapForm;