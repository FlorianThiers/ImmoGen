import React, { useState } from "react";
import FormDataType from "../../../context/formDataType";

import GeneralInfoSectionGarage from "./sections/garage/GeneralInfoSectionGarage";
import LocationSection from "./sections/LocationSection";
import InteriorSectionOffice from "./sections/office/InteriorSectionOffice";
import SanitairSection from "./sections/SanitairSection";
import EnergySection from "./sections/EnergySection";
import OutdoorSection from "./sections/OutdoorSection";
import ExtraSection from "./sections/ExtraSection";

import "../../../pages/Users/priceCalculator.css"; // Import the CSS for styling

interface OfficeFormProps {
  formData: FormDataType;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const OfficeForm: React.FC<OfficeFormProps> = ({ formData, handleChange }) => {
  const categories = [
    { key: "generalInfo", label: "Algemeen" },
    { key: "location", label: "Locatie" },
    { key: "interior", label: "Interieur" },
    { key: "kitchen", label: "Sanitair" },
    { key: "energy", label: "Energie" },
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
          <GeneralInfoSectionGarage
            formData={formData}
            handleChange={handleChange}
          />
        )}

        {activeCategory === "location" && (
          <LocationSection formData={formData} handleChange={handleChange} />
        )}

        {activeCategory === "interior" && (
          <InteriorSectionOffice
            formData={formData}
            handleChange={handleChange}
          />
        )}

        {activeCategory === "kitchen" && (
          <SanitairSection formData={formData} handleChange={handleChange} />
        )}

        {activeCategory === "energy" && (
          <EnergySection formData={formData} handleChange={handleChange} />
        )}

        {activeCategory === "outdoor" && (
          <OutdoorSection formData={formData} handleChange={handleChange} />
        )}

        {activeCategory === "extras" && (
          <ExtraSection formData={formData} handleChange={handleChange} />
        )}
      </div>
    </div>
  );
};

export default OfficeForm;
