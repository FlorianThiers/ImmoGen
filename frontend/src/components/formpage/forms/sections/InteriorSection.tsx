import React, { useState } from "react";

import FormDataType from "../../../formDataType";
import FormField from "./fields/FormField";
import InputField from "./fields/InputField";
import BooleanField from "./fields/BooleanField";

interface GeneralInfoSectionProps {
  formData: FormDataType;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const InteriorSection: React.FC<GeneralInfoSectionProps> = ({
  formData,
  handleChange,
}) => {
  const [location, setLocation] = useState(formData.location || "");

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(event.target.value);
    handleChange(event);
  };

  return (
    <div className="grid-container">
      <FormField label="Oppervlakte Woonkamer:">
        <InputField
          type="number"
          name="living_room_area"
          value={formData.living_room_area || ""}
          onChange={handleChange}
          title="Voer de oppervlakte in voor de woonkamer"
          placeholder="Oppervlakte woonkamer"
          min={0}
          required
        />
      </FormField>

      <FormField label="Is Bemeubeld:">
        <BooleanField
          name="furnished"
          value={formData.furnished}
          onChange={handleChange}
          title="Is de woning bemeubeld?"
        />
      </FormField>

      <FormField label="Heeft Zolder:">
        <BooleanField
          name="attic"
          value={formData.attic}
          onChange={handleChange}
          title="Is er een zolder?"
        />
      </FormField>

      {formData.attic && (
        <FormField label="Zolderoppervlakte:">
          <InputField
            type="number"
            name="attic_area"
            value={formData.attic_area || ""}
            onChange={handleChange}
            title="Voer de zolderoppervlakte in"
            placeholder="Zolderoppervlakte"
            min={0}
            required
          />
        </FormField>
      )}

      <FormField label="Heeft Kelder:">
        <BooleanField
          name="basement"
          value={formData.basement}
          onChange={handleChange}
          title="Is er een kelder?"
        />
      </FormField>

      {formData.basement && (
        <FormField label="Kelderoppervlakte:">
          <InputField
            type="number"
            name="basement_area"
            value={formData.basement_area || ""}
            onChange={handleChange}
            title="Voer de kelderoppervlakte in"
            placeholder="Kelderoppervlakte"
            min={0}
            required
          />
        </FormField>
      )}

      <FormField label="Heeft Garage:">
        <BooleanField
          name="garage"
          value={formData.garage}
          onChange={handleChange}
          title="Is er een garage?"
        />
      </FormField>

      {formData.garage && (
        <>
          <FormField label="Garageoppervlakte:">
            <InputField
              type="number"
              name="garage_area"
              value={formData.garage_area || ""}
              onChange={handleChange}
              title="Voer de garageoppervlakte in"
              placeholder="Garageoppervlakte"
              min={0}
              required
            />
          </FormField>

          <FormField label="Aantal Garages:">
            <InputField
              type="number"
              name="number_of_garages"
              value={formData.number_of_garages || ""}
              onChange={handleChange}
              title="hoeveel garages zijn er?"
              placeholder="Aantal garages"
              min={0}
            />
          </FormField>
        </>
      )}

      <FormField label="Aantal parkeerplaatsen:">
        <InputField
          type="number"
          name="number_of_parking_spaces"
          value={formData.number_of_parking_spaces || ""}
          onChange={handleChange}
          title="hoeveel parkeerplaatsen zijn er?"
          placeholder="Aantal parkeerplaatsen"
          min={0}
        />
      </FormField>

      <FormField label="Aantal Slaapkamers:">
        <InputField
          type="number"
          name="bedrooms"
          value={formData.bedrooms || ""}
          onChange={handleChange}
          title="Voer het aantal slaapkamers in"
          placeholder="Aantal slaapkamers"
          min={0}
          required
        />
      </FormField>

      {Array.from({ length: Number(formData.bedrooms) || 0 }, (_, index) => (
        <div key={index} className="grid-container-bedroom">
          <FormField label={`Slaapkamer ${index + 1} Oppervlakte:`}>
            <InputField
              type="number"
              name={`bedroom_${index + 1}_area`}
              value={formData[`bedroom_${index + 1}_area`] || ""}
              onChange={handleChange}
              title={`Voer de oppervlakte in voor slaapkamer ${index + 1}`}
              placeholder={`Slaapkamer ${index + 1} Oppervlakte`}
              min={0}
              required
            />
          </FormField>
        </div>
      ))}
    </div>
  );
};

export default InteriorSection;
