import React, { useState } from "react";
import FormDataType from "../../../context/formDataType";

import GeneralInfoSectionBuildingPlot from "./sections/buildingplot/GeneralInfoSectionBuildingPlot";
import LocationSection from "./sections/LocationSection";
import OutdoorSectionGround from "./sections/ground/OutdoorSectionGround";
import ExtraSectionGround from "./sections/ground/ExtraSectionGround";

import "../../../pages/Users/priceCalculator.css"; // Import the CSS for styling

interface BuildingPlotFormProps {
  formData: FormDataType;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const BuildingPlotForm: React.FC<BuildingPlotFormProps> = ({
  formData,
  handleChange,
}) => {
  const categories = [
    { key: "generalInfo", label: "Algemeen" },
    { key: "location", label: "Locatie" },
    { key: "outdoor", label: "Buitenruimte" },
    { key: "extras", label: "Extra's" },
  ];
  const [activeCategory, setActiveCategory] = useState("generalInfo");

  return (
    <div className="villa-form">
      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`category-tab${
              activeCategory === cat.key ? " active" : ""
            }`}
            onClick={() => setActiveCategory(cat.key)}
            type="button"
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="category-content">
        {activeCategory === "generalInfo" && (
          <GeneralInfoSectionBuildingPlot
            formData={formData}
            handleChange={handleChange}
          />
        )}

        {activeCategory === "location" && (
          <LocationSection formData={formData} handleChange={handleChange} />
        )}

        {activeCategory === "outdoor" && (
          <OutdoorSectionGround
            formData={formData}
            handleChange={handleChange}
          />
        )}

        {activeCategory === "extras" && (
          <ExtraSectionGround formData={formData} handleChange={handleChange} />
        )}
      </div>
    </div>
  );
};

export default BuildingPlotForm;
