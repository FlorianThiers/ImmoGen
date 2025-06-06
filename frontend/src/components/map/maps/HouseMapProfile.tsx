
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
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

const DEFAULT_CENTER: [number, number] = [4.4, 51.2]; 

const HouseMapProfile: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<{ id: number } | null>(null);  
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maptilersdk.Map | null>(null);
  const markersRef = useRef<maptilersdk.Marker[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedBaseMap, setSelectedBaseMap] = useState<BaseMapKey>("STREETS");
  const [immoGenHouses, setImmoGenHouses] = useState<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false); // Nieuwe state
  const [centerCoords, setCenterCoords] = useState<[number, number]>(DEFAULT_CENTER);

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
      if (!mapContainer.current || !centerCoords) return;

      maptilersdk.config.apiKey = MAP_TILER_KEY;

      mapRef.current = new maptilersdk.Map({
        container: mapContainer.current,
        style: maptilersdk.MapStyle.STREETS,
        center: centerCoords,
        zoom: 11,
      });
    
      // Verwijder oude markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
  
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

    }, [immoGenHouses, mapLoaded]);

  return <div ref={mapContainer} className="houseMap"/>;
};

export default HouseMapProfile;