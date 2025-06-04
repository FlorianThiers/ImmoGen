import React, { useState } from "react";

import FormDataType from "../../../formDataType";
import FormField from "./fields/FormField";
import InputField from "./fields/InputField";
import BooleanField from "./fields/BooleanField";

interface ExtraSectionProps {
    formData: FormDataType;
    handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const ExtraSection: React.FC<ExtraSectionProps> = ({ formData, handleChange }) => {
    const [extraFeatures, setExtraFeatures] = useState(formData.extra_features || "");

    const handleExtraFeaturesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExtraFeatures(event.target.value);
        handleChange(event);
    };

    return (
         <div className="grid-container">
            <FormField label="Heeft Lift:">
              <BooleanField
                name="elevator"
                value={formData.elevator}
                onChange={handleChange}
                title="Heeft de woning een lift?"
              />
            </FormField>

            <FormField label="Rolstoeltoegankelijk:">
              <BooleanField
                name="wheelchair_accessible"
                value={formData.wheelchair_accessible}
                onChange={handleChange}
                title="Is de woning rolstoeltoegankelijk?"
              />
            </FormField>

            <FormField label="Geluidsoverlast:">
              <BooleanField
                name="noise_pollution"
                value={formData.noise_pollution}
                onChange={handleChange}
                title="Voer de geluidsoverlast in"
              />
            </FormField>

            {formData.noise_pollution && (
              <>
                <FormField label="Type:">
                  <InputField
                    type="text"
                    name="noise_pollution_type"
                    value={formData.noise_pollution_type || ""}
                    onChange={handleChange}
                    title="Voer de geluidsoverlast type in"
                    placeholder="Geluidsoverlast Type"
                  />
                </FormField>

                <FormField label="last %:">
                  <InputField
                    type="range"
                    name="noise_pollution_level"
                    value={formData.noise_pollution_level || ""}
                    onChange={handleChange}
                    title="Voer de geluidsoverlast level in"
                    placeholder="Geluidsoverlast Level"
                    min={1}
                    max={15}
                    step={1}
                  />
                </FormField>
              </>
            )}

            <FormField label="Geur Overlast:">
              <BooleanField
                name="smell_pollution"
                value={formData.smell_pollution}
                onChange={handleChange}
                title="Voer de geur overlast in"
              />
            </FormField>

            {formData.smell_pollution && (
              <>
                <FormField label="Type:">
                  <InputField
                    type="text"
                    name="smell_pollution_type"
                    value={formData.smell_pollution_type || ""}
                    onChange={handleChange}
                    title="Voer de geur overlast type in"
                    placeholder="Geur Overlast Type"
                  />
                </FormField>

                <FormField label="last %:">
                  <InputField
                    type="range"
                    name="smell_pollution_level"
                    value={formData.smell_pollution_level || ""}
                    onChange={handleChange}
                    title="Voer de geur overlast level in"
                    placeholder="Geur Overlast Level"
                    min={1}
                    max={15}
                    step={1}
                  />
                </FormField>
              </>
            )}

            <FormField label="Verkeersoverlast:">
              <BooleanField
                name="traffic_pollution"
                value={formData.traffic_pollution}
                onChange={handleChange}
                title="Voer de verkeersoverlast in"
              />
            </FormField>

            {formData.traffic_pollution && (
              <>
                <FormField label="Type:">
                  <InputField
                    type="text"
                    name="traffic_pollution_type"
                    value={formData.traffic_pollution_type || ""}
                    onChange={handleChange}
                    title="Voer de verkeersoverlast type in"
                    placeholder="Verkeers Overlast Type"
                  />
                </FormField>

                <FormField label="last %:">
                  <InputField
                    type="range"
                    name="traffic_pollution_level"
                    value={formData.traffic_pollution_level || ""}
                    onChange={handleChange}
                    title="Voer de verkeersoverlast level in"
                    placeholder="Verkeers Overlast Level"
                    min={1}
                    max={15}
                    step={1}
                  />
                </FormField>
              </>
            )}

            <FormField label="Luchtvervuiling:">
              <BooleanField
                name="air_pollution"
                value={formData.air_pollution}
                onChange={handleChange}
                title="Voer de luchtvervuiling in"
              />
            </FormField>

            {formData.air_pollution && (
              <>
                <FormField label="Type:">
                  <InputField
                    type="text"
                    name="air_pollution_type"
                    value={formData.air_pollution_type || ""}
                    onChange={handleChange}
                    title="Voer de luchtvervuiling type in"
                    placeholder="Luchtvervuiling Type"
                  />
                </FormField>

                <FormField label="last %:">
                  <InputField
                    type="range"
                    name="air_pollution_level"
                    value={formData.air_pollution_level || ""}
                    onChange={handleChange}
                    title="Voer de luchtvervuiling level in"
                    placeholder="Luchtvervuiling Level"
                    min={1}
                    max={15}
                    step={1}
                  />
                </FormField>
              </>
            )}

            <FormField label="Aparte Vormen:">
              <BooleanField
                name="special_shapes"
                value={formData.special_shapes}
                onChange={handleChange}
                title="Voer de aparte vormen in"
              />
            </FormField>

            {formData.special_shapes && (
              <>
                <FormField label="Type:">
                  <InputField
                    type="text"
                    name="special_shapes_type"
                    value={formData.special_shapes_type || ""}
                    onChange={handleChange}
                    title="Voer de aparte vormen type in"
                    placeholder="Aparte Vormen Type"
                  />
                </FormField>

                <FormField label="last %:">
                  <InputField
                    type="range"
                    name="special_shapes_level"
                    value={formData.special_shapes_level || ""}
                    onChange={handleChange}
                    title="Voer de aparte vormen level in"
                    placeholder="Aparte Vormen Level"
                    min={1}
                    max={15}
                    step={1}
                  />
                </FormField>
              </>
            )}

            <FormField label="Aparte Kleuren:">
              <BooleanField
                name="special_colors"
                value={formData.special_colors}
                onChange={handleChange}
                title="Voer de aparte kleuren in"
              />
            </FormField>

            {formData.special_colors && (
              <>
                <FormField label="Type:">
                  <InputField
                    type="text"
                    name="special_colors_type"
                    value={formData.special_colors_type || ""}
                    onChange={handleChange}
                    title="Voer de aparte kleuren type in"
                    placeholder="Aparte Kleuren Type"
                  />
                </FormField>

                <FormField label="last %:">
                  <InputField
                    type="range"
                    name="special_colors_level"
                    value={formData.special_colors_level || ""}
                    onChange={handleChange}
                    title="Voer de aparte kleuren level in"
                    placeholder="Aparte Kleuren Level"
                    min={1}
                    max={15}
                    step={1}
                  />
                </FormField>
              </>
            )}

            <FormField label="Aparte Materialen:">
              <BooleanField
                name="special_materials"
                value={formData.special_materials}
                onChange={handleChange}
                title="Voer de aparte materialen in"
              />
            </FormField>

            {formData.special_materials && (
              <>
                <FormField label="Type:">
                  <InputField
                    type="text"
                    name="special_materials_type"
                    value={formData.special_materials_type || ""}
                    onChange={handleChange}
                    title="Voer de aparte materialen type in"
                    placeholder="Aparte Materialen Type"
                  />
                </FormField>

                <FormField label="last %:">
                  <div className="range-field">
                    <InputField
                      type="range"
                      name="special_materials_level"
                      value={formData.special_materials_level || 1}
                      onChange={handleChange}
                      title="Voer de aparte materialen level in"
                      placeholder=""
                      min={1}
                      max={15}
                      step={1}
                    />
                    <span>{formData.special_materials_level || 1}</span>
                  </div>
                </FormField>
              </>
            )}
          </div>
    );
};

export default ExtraSection;