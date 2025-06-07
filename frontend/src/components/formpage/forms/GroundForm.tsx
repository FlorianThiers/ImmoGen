import React, { useState } from "react";
import FormDataType from "../../formDataType";

import GeneralInfoSectionGround from "./sections/ground/GeneralInfoSectionGround";
import LocationSection from "./sections/LocationSection";
import ExtraSectionGround from "./sections/ground/ExtraSectionGround";

import "../../../pages/Users/priceCalculator.css"; // Import the CSS for styling

interface GroundFormProps {
  formData: FormDataType;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const GroundForm: React.FC<GroundFormProps> = ({ formData, handleChange }) => {
  const categories = [
    { key: "generalInfo", label: "Algemeen" },
    { key: "location", label: "Locatie" },
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
          <GeneralInfoSectionGround
            formData={formData}
            handleChange={handleChange}
          />
        )}

        {activeCategory === "location" && (
          <LocationSection formData={formData} handleChange={handleChange} />
        )}

        {activeCategory === "extras" && (
          <ExtraSectionGround formData={formData} handleChange={handleChange} />
        )}
      </div>
    </div>
  );
};

export default GroundForm;
