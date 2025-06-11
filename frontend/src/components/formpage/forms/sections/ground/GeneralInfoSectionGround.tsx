import React from "react";

import FormDataType from "../../../../../context/formDataType";

import FormField from "../fields/FormField";
import InputField from "../fields/InputField";

interface GeneralInfoSectionProps {
  formData: FormDataType;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const GeneralInfoSectionGround: React.FC<GeneralInfoSectionProps> = ({
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

      <FormField label="m²-prijs Grond">
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
    </div>
  );
};

export default GeneralInfoSectionGround;
