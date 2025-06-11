import React from "react";

import FormDataType from "../../../../context/formDataType";
import FormField from "./fields/FormField";
import InputField from "./fields/InputField";
import BooleanField from "./fields/BooleanField";
import SelectField from "./fields/SelectField";

interface GeneralInfoSectionProps {
  formData: FormDataType;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const OutdoorSection: React.FC<GeneralInfoSectionProps> = ({
  formData,
  handleChange,
}) => {
  return (
    <div className="grid-container">
      <FormField label="Aantal Gevels:">
        <SelectField
          name="number_of_facades"
          value={formData.number_of_facades.toString()}
          onChange={handleChange}
          title="Voer het aantal gevels in"
          options={[
            { value: "1", label: "1 of minder" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4 of meer" },
          ]}
        />
      </FormField>

      <FormField label="Front Gevelbreedte:">
        <InputField
          type="number"
          name="facade_width"
          value={formData.facade_width || ""}
          onChange={handleChange}
          title="Voer de gevelbreedte in"
          placeholder="Gevelbreedte"
          min={0}
          required
        />
      </FormField>

      <FormField label="Perceeldiepte:">
        <InputField
          type="number"
          name="plot_depth"
          value={formData.plot_depth || ""}
          onChange={handleChange}
          title="Voer de perceeldiepte in"
          placeholder="Perceeldiepte"
          min={0}
          required
        />
      </FormField>

      <FormField label="Aantal Verdiepingen:">
        <InputField
          type="number"
          name="number_of_floors"
          value={formData.number_of_floors || ""}
          onChange={handleChange}
          title="Voer het aantal verdiepingen in"
          placeholder="Aantal verdiepingen"
          min={0}
          required
        />
      </FormField>

      <FormField label="Heeft Terras:">
        <BooleanField
          name="terrace"
          value={formData.terrace}
          onChange={handleChange}
          title="Heeft de woning een terras?"
        />
      </FormField>

      {formData.terrace && (
        <>
          <FormField label="Terrasoppervlakte:">
            <InputField
              type="number"
              name="terrace_area"
              value={formData.terrace_area || ""}
              onChange={handleChange}
              title="Voer de terrasoppervlakte in"
              placeholder="Terrasoppervlakte"
              min={0}
              required
            />
          </FormField>

          <FormField label="Terrasbreedte:">
            <InputField
              type="number"
              name="terrace_front_width"
              value={formData.terrace_front_width || ""}
              onChange={handleChange}
              title="Voer de terrasbreedte in"
              placeholder="Terrasbreedte"
              min={0}
              required
            />
          </FormField>
        </>
      )}

      <FormField label="Heeft Riolering:">
        <BooleanField
          name="sewer_connection"
          value={formData.sewer_connection}
          onChange={handleChange}
          title="Heeft de woning riolering?"
        />
      </FormField>

      <FormField label="Heeft Waterleiding:">
        <BooleanField
          name="water_connection"
          value={formData.water_connection}
          onChange={handleChange}
          title="Heeft de woning waterleiding?"
        />
      </FormField>

      <FormField label="Heeft Tuin:">
        <BooleanField
          name="garden"
          value={formData.garden}
          onChange={handleChange}
          title="Heeft de woning een tuin?"
        />
      </FormField>

      {formData.garden && (
        <FormField label="Tuinoppervlakte:">
          <InputField
            type="number"
            name="garden_area"
            value={formData.garden_area || ""}
            onChange={handleChange}
            title="Voer de tuinoppervlakte in"
            placeholder="Tuinoppervlakte"
            min={0}
            required
          />
        </FormField>
      )}

      <FormField label="Heeft Zwembad:">
        <BooleanField
          name="swimming_pool"
          value={formData.swimming_pool}
          onChange={handleChange}
          title="Heeft de woning een zwembad?"
        />
      </FormField>

      {formData.swimming_pool && (
        <FormField label="Zwembadoppervlakte:">
          <InputField
            type="number"
            name="swimming_pool_area"
            value={formData.swimming_pool_area || ""}
            onChange={handleChange}
            title="Voer de zwembadoppervlakte in"
            placeholder="Zwembadoppervlakte"
            min={0}
            required
          />
        </FormField>
      )}
    </div>
  );
};

export default OutdoorSection;
