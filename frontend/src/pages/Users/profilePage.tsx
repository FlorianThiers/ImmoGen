import React, { useEffect, useState } from "react";
import HouseMapForm from "../../components/maps/HouseMapForm";
import "../../index.css";
import HouseMapProfile from "../../components/maps/HouseMapProfile";

// Dummy data voor demo
const user = {
  name: "Jan Jansen",
  email: "jan.jansen@email.com",
  estimates: [
    {
      id: 1,
      lat: 51.0543,
      lon: 3.7174,
      address: "Dummylaan 2, Gent",
      value: 450000,
      type: "Appartement",
      region: "Gent",
    },
    {
      id: 2,
      lat: 51.2194,
      lon: 4.4025,
      address: "Dummystraat 1, Antwerpen",
      value: 350000,
      type: "Woning",
      region: "Antwerpen",
    },
    {
      id: 3,
      lat: 51.05,
      lon: 3.72,
      address: "Voorbeeldstraat 3, Gent",
      value: 390000,
      type: "Appartement",
      region: "Gent",
    },
  ],
};

// Statistieken berekenen
const totalEstimates = user.estimates.length;
const typeStats = user.estimates.reduce<Record<string, number>>((acc, e) => {
  acc[e.type] = (acc[e.type] || 0) + 1;
  return acc;
}, {});
const regionStats = user.estimates.reduce<Record<string, number>>((acc, e) => {
  acc[e.region] = (acc[e.region] || 0) + 1;
  return acc;
}, {});
const mostEstimatedRegion =
  Object.entries(regionStats).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

const ProfilePage: React.FC = () => {
  const [centerCoords, setCenterCoords] = useState<[number, number] | null>(
    null
  );

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenterCoords([
            position.coords.longitude,
            position.coords.latitude,
          ]);
        },
        () => setCenterCoords(null) // fallback: geen locatie
      );
    }
  }, []);

  return (
    <div className="profile-container">
      <h1 className="profile-header">Profiel</h1>
      <div className="profile-info">
        <strong>Naam:</strong> {user.name} <br />
        <strong>E-mail:</strong> {user.email}
      </div>

      <div className="profile-flex">
        <div className="profile-stats">
          <h2>Statistieken</h2>
          <ul>
            <li>
              <strong>Totaal aantal schattingen:</strong> {totalEstimates}
            </li>
            <li>
              <strong>Type woningen:</strong>
              <ul>
                {Object.entries(typeStats).map(([type, count]) => (
                  <li key={type}>
                    {type}: {count}
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <strong>Streken:</strong>
              <ul>
                {Object.entries(regionStats).map(([region, count]) => (
                  <li key={region}>
                    {region}: {count}
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <strong>Meest geschatte streek:</strong> {mostEstimatedRegion}
            </li>
          </ul>
        </div>
        <div className="profile-map">
          <h2>Mijn schattingen op de kaart</h2>
          <HouseMapProfile
            houses={user.estimates.map((e) => ({
              lat: e.lat,
              lon: e.lon,
              ownEstimate: true,
              address: e.address,
              value: e.value,
            }))}
          />
        </div>
      </div>
      <div className="profile-table-container">
        <h2>Mijn schattingen</h2>
        <table className="profile-table">
          <thead>
            <tr>
              <th>Adres</th>
              <th className="right">Waarde</th>
              <th className="center">Type</th>
              <th className="center">Streek</th>
            </tr>
          </thead>
          <tbody>
            {user.estimates.map((e) => (
              <tr key={e.id}>
                <td>{e.address}</td>
                <td className="right">€{e.value.toLocaleString()}</td>
                <td className="center">{e.type}</td>
                <td className="center">{e.region}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfilePage;
