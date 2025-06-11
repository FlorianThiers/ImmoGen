import React from "react";

import FormDataType from "../../../../context/formDataType";
import FormField from "./fields/FormField";
import InputField from "./fields/InputField";
import SelectField from "./fields/SelectField";
import BooleanField from "./fields/BooleanField";

interface ExtraSectionProps {
  formData: FormDataType;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const ExtraSection: React.FC<ExtraSectionProps> = ({
  formData,
  handleChange,
}) => {
  // EPC options with their styles
  const epcOptions = [
    {
      value: "A+",
      label: "A+",
      style: { backgroundColor: "green", color: "white" },
    },
    {
      value: "A",
      label: "A",
      style: { backgroundColor: "limegreen", color: "white" },
    },
    {
      value: "B",
      label: "B",
      style: { backgroundColor: "yellowgreen", color: "white" },
    },
    {
      value: "C",
      label: "C",
      style: { backgroundColor: "yellow", color: "black" },
    },
    {
      value: "D",
      label: "D",
      style: { backgroundColor: "orange", color: "white" },
    },
    {
      value: "E",
      label: "E",
      style: { backgroundColor: "orangered", color: "white" },
    },
    {
      value: "F",
      label: "F",
      style: { backgroundColor: "red", color: "white" },
    },
    {
      value: "G",
      label: "G",
      style: { backgroundColor: "darkred", color: "white" },
    },
  ];

  // Get background color based on EPC
  const getEpcStyle = () => {
    switch (formData.epc) {
      case "A+":
        return { backgroundColor: "green", color: "white" };
      case "A":
        return { backgroundColor: "limegreen", color: "white" };
      case "B":
        return { backgroundColor: "yellowgreen", color: "white" };
      case "C":
        return { backgroundColor: "yellow", color: "black" };
      case "D":
        return { backgroundColor: "orange", color: "white" };
      case "E":
        return { backgroundColor: "orangered", color: "white" };
      case "F":
        return { backgroundColor: "red", color: "white" };
      case "G":
        return { backgroundColor: "darkred", color: "white" };
      default:
        return { backgroundColor: "green", color: "white" };
    }
  };

  return (
    <div className="grid-container">
      <FormField label="EPC:">
        <SelectField
          name="epc"
          value={formData.epc}
          onChange={handleChange}
          title="Voer de EPC in"
          options={epcOptions}
          customStyles={getEpcStyle()}
        />
      </FormField>

      <FormField label="Type Verwarming:">
        <SelectField
          name="heating_type"
          value={formData.heating_type}
          onChange={handleChange}
          title="Voer het type verwarming in"
          options={[
            { value: "CV", label: "CV" },
            { value: "Vloerverwarming", label: "Vloerverwarming" },
            { value: "Infrarood", label: "Infrarood" },
            { value: "Houtkachel", label: "Houtkachel" },
            { value: "Pelletkachel", label: "Pelletkachel" },
            { value: "Zonneboiler", label: "Zonneboiler" },
            { value: "Warmtepomp", label: "Warmtepomp" },
            { value: "Geen", label: "Geen" },
          ]}
        />
      </FormField>

      <FormField label="Heeft Gasleiding:">
        <BooleanField
          name="gas_connection"
          value={formData.gas_connection}
          onChange={handleChange}
          title="Heeft de woning een gasleiding?"
        />
      </FormField>

      <FormField label="Type Glas:">
        <SelectField
          name="glass_type"
          value={formData.glass_type}
          onChange={handleChange}
          title="Voer het type glas in"
          options={[
            { value: "enkel", label: "Enkel glas" },
            { value: "dubbel", label: "Dubbel glas (HR)" },
            { value: "dubbelHR+", label: "Hoogrendementsglas (HR+)" },
            { value: "dubbelHR++", label: "Hoogrendementsglas (HR++)" },
            {
              value: "triple",
              label: "Hoogrendementsglas (HR+++ / driedubbel glas)",
            },
            { value: "gelaagd", label: "Gelaagd glas" },
            { value: "gehard", label: "Gehard glas" },
            { value: "inbraakwerend", label: "Inbraakwerend glas" },
            { value: "kogelwerend", label: "Kogelwerend glas" },
            { value: "matglas", label: "Matglas / gezandstraald glas" },
            { value: "lood", label: "Glas-in-lood" },
            { value: "spiegel", label: "Spiegelglas" },
            { value: "ornament", label: "Ornamentglas / structuurglas" },
            { value: "gekleurd", label: "Gekleurd glas / getint glas" },
            { value: "zonwerend", label: "Zonwerend glas" },
            { value: "geluidwerend", label: "Geluidwerend glas" },
            { value: "zelfreinigend", label: "Zelfreinigend glas" },
            { value: "brandwerend", label: "Brandwerend glas" },
            { value: "UV-werend", label: "UV-werend glas" },
            { value: "smart", label: "Smart glas" },
          ]}
        />
      </FormField>

      <FormField label="Heeft Zonnepanelen:">
        <BooleanField
          name="solar_panels"
          value={!!Number(formData.solar_panels)}
          onChange={handleChange}
          title="Heeft de woning zonnepanelen?"
        />
      </FormField>

      {Number(formData.solar_panels) === 1 && (
        <FormField label="Zonnepaneeloppervlakte:">
          <InputField
            type="number"
            name="solar_panel_area"
            value={formData.solar_panel_area || ""}
            onChange={handleChange}
            title="Voer de zonnepaneeloppervlakte in"
            placeholder="Zonnepaneeloppervlakte"
            min={0}
            required
          />
        </FormField>
      )}
    </div>
  );
};

export default ExtraSection;
