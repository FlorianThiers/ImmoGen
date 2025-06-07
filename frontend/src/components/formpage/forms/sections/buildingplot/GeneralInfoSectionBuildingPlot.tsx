import React, { useState } from "react";

import FormDataType from "../../../../formDataType";

import FormField from "../fields/FormField";
import InputField from "../fields/InputField";

interface GeneralInfoSectionProps {
  formData: FormDataType;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const GeneralInfoSectionBuildingPlot: React.FC<GeneralInfoSectionProps> = ({
  formData,
  handleChange,
}) => {
  return (
    <div className="grid-container">
      <FormField label="Totale Oppervlakte:">
        <InputField
          type="number"
          name="area"
          value={formData.area || ""}
          onChange={handleChange}
          title="Voer de totale oppervlakte in"
          placeholder="Totale oppervlakte"
          min={0}
          required
        />
      </FormField>

      <FormField label="Woonoppervlakte:">
        <InputField
          type="number"
          name="livable_area"
          value={formData.livable_area || ""}
          onChange={handleChange}
          title="Voer de woonoppervlakte in"
          placeholder="Woonoppervlakte"
          min={0}
          required
        />
      </FormField>

      <FormField label="m²-prijs Bouwgrond">
        <InputField
          type="number"
          name="price_per_m2"
          value={formData.price_per_m2 || ""}
          onChange={handleChange}
          title="Voer de m²-prijs bouwgrond in"
          placeholder="m²-prijs Bouwgrond"
          min={0}
          required
        />
      </FormField>

      <FormField label="Bouwkost/m²">
        <InputField
          type="number"
          name="build_price"
          value={formData.build_price || ""}
          onChange={handleChange}
          title="Voer de bouwkost/m² in"
          placeholder="Bouwkost/m²"
          min={0}
          required
        />
      </FormField>
    </div>
  );
};

export default GeneralInfoSectionBuildingPlot;
