import React, { useState } from "react";

import FormDataType from "../../../../formDataType";

import FormField from "../fields/FormField";
import InputField from "../fields/InputField";
import SelectField from "../fields/SelectField";
import BooleanField from "../fields/BooleanField";



interface GeneralInfoSectionProps {
    formData: FormDataType;
    handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}  
  
const conditionOptions = [
    {
    value: "Uitstekend",
    label: "Uitstekend",
    style: { backgroundColor: "blue", color: "white" },
    },
    {
    value: "Nieuw",
    label: "Nieuw",
    style: { backgroundColor: "green", color: "white" },
    },
    {
    value: "Goed",
    label: "Goed",
    style: { backgroundColor: "limegreen", color: "white" },
    },
    {
    value: "Gemiddeld",
    label: "Gemiddeld",
    style: { backgroundColor: "yellow", color: "black" },
    },
    {
    value: "Slecht",
    label: "Slecht",
    style: { backgroundColor: "orange", color: "white" },
    },
    {
    value: "Renoveren",
    label: "Te Renoveren",
    style: { backgroundColor: "red", color: "white" },
    },
];


const GeneralInfoSectionGarage: React.FC<GeneralInfoSectionProps> = ({ formData, handleChange }) => {

    // Get background color based on property condition
    const getConditionStyle = () => {
        switch (formData.property_condition) {
            case "Uitstekend":
                return { backgroundColor: "blue", color: "white" };
            case "Nieuw":
                return { backgroundColor: "green", color: "white" };
            case "Goed":
                return { backgroundColor: "limegreen", color: "white" };
            case "Gemiddeld":
                return { backgroundColor: "yellow", color: "black" };
            case "Slecht":
                return { backgroundColor: "orange", color: "white" };
            case "Renoveren":
                return { backgroundColor: "red", color: "white" };
            default:
                return { backgroundColor: "green", color: "white" };
        }
    };

    return (
        <div className="grid-container">
        <FormField label="Staat:">
            <SelectField
            name="property_condition"
            value={formData.property_condition}
            onChange={handleChange}
            title="Voer de woningconditie in"
            options={conditionOptions}
            customStyles={getConditionStyle()}
            />
        </FormField>

        <FormField label="Bouwjaar:">
            <InputField
            type="number"
            name="construction_year"
            value={formData.construction_year || ""}
            onChange={handleChange}
            title="Voer het bouwjaar in"
            placeholder="Bouwjaar"
            min={1700}
            max={new Date().getFullYear()}
            required
            />
        </FormField>

        <FormField label="Gerenoveerd?">
            <BooleanField
            name="renovation"
            value={formData.renovation}
            onChange={handleChange}
            title="Is er gerenoveerd?"
            />
        </FormField>

        {formData.renovation && (
            <FormField label="Laatste Renovatie:">
            <InputField
                type="number"
                name="renovation_year"
                value={formData.renovation_year || ""}
                onChange={handleChange}
                title="Voer het laatste renovatie jaar in"
                placeholder="Renovatie jaar"
                min={1800}
            />
            </FormField>
        )}

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

        <FormField label="Renovatie Kosten">
            <InputField
            type="number"
            name="renovation_price"
            value={formData.renovation_price || ""}
            onChange={handleChange}
            title="Voer de renovatiekosten in"
            placeholder="Renovatiekosten"
            min={0}
            />
        </FormField>

        <FormField label="Afbraakkost">
            <InputField
            type="number"
            name="demolition_cost"
            value={formData.demolition_cost || ""}
            onChange={handleChange}
            title="Voer de afbraakkost in"
            placeholder="Afbraakkost"
            min={0}
            />
        </FormField>

        <FormField label="Graad Van Afwerking ">
            <InputField
            type="range"
            name="grade_of_finish"
            value={formData.grade_of_finish || ""}
            onChange={handleChange}
            title="Voer de graad van afwerking in"
            placeholder=""
            min={0.5}
            max={1.5}
            step={0.1}
            />
            <span>{formData.grade_of_finish}</span>
        </FormField>
    </div>
    );
};

export default GeneralInfoSectionGarage;