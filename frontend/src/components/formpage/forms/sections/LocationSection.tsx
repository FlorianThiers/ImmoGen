import React from "react";

import FormDataType from "../../../../context/formDataType";
import FormField from "./fields/FormField";
import InputField from "./fields/InputField";
import HouseMapForm from "../../../map/maps/HouseMapForm";

interface GeneralInfoSectionProps {
  formData: FormDataType;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const LocationSection: React.FC<GeneralInfoSectionProps> = ({
  formData,
  handleChange,
}) => {
  return (
    <div className="grid-container">
      <div className="location-container">
        <FormField label="Land">
          <InputField
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            title="Voer het land in"
            placeholder="Land"
            required
          />
        </FormField>

        <FormField label="Provincie">
          <InputField
            type="text"
            name="province"
            value={formData.province}
            onChange={handleChange}
            title="Voer de provincie in"
            placeholder="Provincie"
            required
          />
        </FormField>

        <FormField label="Stad">
          <InputField
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            title="Voer de stad in"
            placeholder="Stad"
            required
          />
        </FormField>

        <FormField label="Postcode">
          <InputField
            type="text"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleChange}
            title="Voer de postcode in"
            placeholder="Postcode"
            min={0}
            required
          />
        </FormField>

        <FormField label="Straat">
          <InputField
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            title="Voer de straat in"
            placeholder="Straat"
            required
          />
        </FormField>

        <FormField label="Straatnummer">
          <InputField
            type="number"
            name="street_number"
            value={formData.street_number || ""}
            onChange={handleChange}
            title="Voer het straatnummer in"
            placeholder="Straatnummer"
            min={0}
            required
          />
        </FormField>
      </div>
      <HouseMapForm
        centerAddress={`${formData.street} ${formData.street_number}, ${formData.city}, ${formData.province}, ${formData.country}`}
      />
    </div>
  );
};

export default LocationSection;
