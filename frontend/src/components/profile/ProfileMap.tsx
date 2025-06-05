import React, { useEffect, useState } from "react";
import axios from "axios";

import HouseMapProfile from "../map/maps/HouseMapProfile";

const ProfileMap = () => {
  return (
    <div className="profile-flex">
      <div className="profile-map">
        <h2>Mijn schattingen op de kaart</h2>
        <HouseMapProfile />
      </div>
    </div>
  );
};

export default ProfileMap;
