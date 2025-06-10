import React, { useState } from "react";
import FormDataType from "../../formDataType";

import GeneralInfoSection from "./sections/GeneralInfoSection";
import LocationSection from "./sections/LocationSection";
import InteriorSection from "./sections/InteriorSection";
import SanitairSection from "./sections/SanitairSection";
import EnergySection from "./sections/EnergySection";
import OutdoorSection from "./sections/OutdoorSection";
import ExtraSection from "./sections/ExtraSection";

import "../../../pages/Users/priceCalculator.css"; // Import the CSS for styling

interface HouseFormProps {
  formData: FormDataType;
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  categories: { key: string; label: string }[];
  hasCategoryErrors: (category: string, formData: FormDataType) => boolean;
}

const HouseForm: React.FC<HouseFormProps> = ({ formData, handleChange, categories, hasCategoryErrors  }) => {
  const [activeCategory, setActiveCategory] = useState("generalInfo");

  return (
    <div className="house-form">
      <div className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`category-tab${activeCategory === cat.key ? " active" : ""}`}
            onClick={() => setActiveCategory(cat.key)}
            type="button"
            style={{ position: "relative" }}
          >
            {cat.label}
            {hasCategoryErrors(cat.key, formData) && (
              <span className="tab-error-dot" />
            )}
          </button>
        ))}
      </div>

      <div className="category-content">
        {activeCategory === "generalInfo" && (
          <GeneralInfoSection formData={formData} handleChange={handleChange} />
        )}

        {activeCategory === "location" && (
          <LocationSection formData={formData} handleChange={handleChange}/>
        )}

        {activeCategory === "interior" && (
          <InteriorSection formData={formData} handleChange={handleChange} />
        )}

        {activeCategory === "kitchen" && (
          <SanitairSection formData={formData} handleChange={handleChange} />
        )}

        {activeCategory === "energy" && (
          <EnergySection formData={formData} handleChange={handleChange}/>
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

export default HouseForm;
