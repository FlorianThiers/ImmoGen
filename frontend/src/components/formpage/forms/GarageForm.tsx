import React, { useState } from "react";
import FormDataType from "../../../context/formDataType";

import GeneralInfoSectionGarage from "./sections/garage/GeneralInfoSectionGarage";
import LocationSection from "./sections/LocationSection";
import ExtraSection from "./sections/ExtraSection";

import "../../../pages/Users/priceCalculator.css"; // Import the CSS for styling

interface GarageFormProps {
  formData: FormDataType;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const GarageForm: React.FC<GarageFormProps> = ({ formData, handleChange }) => {
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
          <GeneralInfoSectionGarage
            formData={formData}
            handleChange={handleChange}
          />
        )}

        {activeCategory === "location" && (
          <LocationSection formData={formData} handleChange={handleChange} />
        )}

        {activeCategory === "extras" && (
          <ExtraSection formData={formData} handleChange={handleChange} />
        )}
      </div>
    </div>
  );
};

export default GarageForm;
