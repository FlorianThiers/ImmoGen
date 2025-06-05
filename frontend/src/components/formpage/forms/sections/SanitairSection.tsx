import React, { useState } from "react";

import FormDataType from "../../../formDataType";
import FormField from "./fields/FormField";
import InputField from "./fields/InputField";
import SelectField from "./fields/SelectField";

interface GeneralInfoSectionProps {
    formData: FormDataType;
    handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const SanitairSection: React.FC<GeneralInfoSectionProps> = ({ formData, handleChange }) => {
    const [location, setLocation] = useState(formData.location || "");

    const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocation(event.target.value);
        handleChange(event);
    };

    return (
                  <div className="grid-container">
            <FormField label="Keukenoppervlakte:">
              <InputField
                type="number"
                name="kitchen_area"
                value={formData.kitchen_area || ""}
                onChange={handleChange}
                title="Voer de keukenoppervlakte in"
                placeholder="Keukenoppervlakte"
                min={0}
                required
              />
            </FormField>

            <FormField label="Keukenuitrusting:">
              <SelectField
                name="kitchen_equipment"
                value={formData.kitchen_equipment}
                onChange={handleChange}
                title="Voer de keukenuitrusting in"
                options={[
                  { value: "Volledig ingericht", label: "Volledig ingericht" },
                  { value: "Deels ingericht", label: "Deels ingericht" },
                  { value: "Geen", label: "Geen" },
                ]}
              />
            </FormField>

            <FormField label="Aantal Badkamers:">
              <InputField
                type="number"
                name="bathrooms"
                value={formData.bathrooms || ""}
                onChange={handleChange}
                title="Voer het aantal badkamers in"
                placeholder="Aantal badkamers"
                min={0}
                required
              />
            </FormField>

            <FormField label="Aantal Douches:">
              <InputField
                type="number"
                name="number_of_shower_cabins"
                value={formData.number_of_shower_cabins || ""}
                onChange={handleChange}
                title="Voer het aantal douches in"
                placeholder="Aantal douches"
                min={0}
                required
              />
            </FormField>

            <FormField label="Aantal Badkuipen:">
              <InputField
                type="number"
                name="number_of_baths"
                value={formData.number_of_baths || ""}
                onChange={handleChange}
                title="Voer het aantal badkuipen in"
                placeholder="Aantal badkuipen"
                min={0}
              />
            </FormField>

            <FormField label="Aantal Toiletten:">
              <InputField
                type="number"
                name="number_of_toilets"
                value={formData.number_of_toilets || ""}
                onChange={handleChange}
                title="Voer het aantal toiletten in"
                placeholder="Aantal toiletten"
                min={0}
                required

              />
            </FormField>
          </div>
    );
};

export default SanitairSection;