import React from "react";

import HouseMapProfile from "../map/maps/HouseMapProfile";

import User from "../../context/User";


interface StatisticsPageProps {
  user?: User | null;
}


const ProfileMap: React.FC<StatisticsPageProps> = ({ user }) => {
  return (
    <div className="profile-flex">
      <div className="profile-map">
        <h2>Mijn schattingen op de kaart</h2>
        <HouseMapProfile user={user || undefined}/>
      </div>
    </div>
  );
};

export default ProfileMap;
