import React, { memo, useState } from "react";
import FormDataType from "../formDataType";

import "../../index.css";
import HouseMapForm from "../HouseMapForm";

interface HouseFormProps {
  formData: FormDataType;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

// Create a separate component for input fields to prevent them from losing focus
const FormField = memo(({ 
  label, 
  children 
}: { 
  label: string; 
  children: React.ReactNode;
}) => (
  <>
    <label>{label}</label>
    {children}
  </>
));

// Create a separate component for each form field type
const InputField = memo(({ 
  name, 
  value, 
  onChange, 
  title, 
  placeholder, 
  type = "text",
  min,
  max,
  step
}: { 
  name: string; 
  value: string | number; 
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; 
  title: string; 
  placeholder: string;
  type?: string;
  min?: number;
  max?: number;
  step?: number;
}) => (
  <input
    type={type}
    name={name}
    value={value}
    onChange={onChange}
    title={title}
    placeholder={placeholder}
    min={min}
    max={max}
    step={step}
    style={type === "range" ? { width: "100%" } : undefined}
  />
));

const SelectField = memo(({ 
  name, 
  value, 
  onChange, 
  title, 
  options,
  customStyles 
}: { 
  name: string; 
  value: string; 
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void; 
  title: string; 
  options: { value: string; label: string; style?: React.CSSProperties }[];
  customStyles?: React.CSSProperties;
}) => (
  <select
    name={name}
    value={value}
    onChange={onChange}
    title={title}
    style={customStyles}
  >
    {options.map(option => (
      <option 
        key={option.value} 
        value={option.value}
        style={option.style}
      >
        {option.label}
      </option>
    ))}
  </select>
));

// FoldableSection component
const FoldableSection = memo(({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <div className="mb-6">
    <h2
      className="text-xl font-bold mt-4 cursor-pointer flex items-center"
      onClick={onToggle}
    >
      <span>{title}</span>
      <span className="ml-2">{isOpen ? "▲" : "▼"}</span>
    </h2>
    {isOpen && <div className="mt-3">{children}</div>}
  </div>
));

// Reusable boolean selector component
const BooleanField = memo(({
  name,
  value,
  onChange,
  title
}: {
  name: string;
  value: boolean;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  title: string;
}) => (
  <SelectField
    name={name}
    value={value.toString()}
    onChange={onChange}
    title={title}
    options={[
      { value: "false", label: "Nee" },
      { value: "true", label: "Ja" }
    ]}
  />
));

// Component for pollution type inputs 
const PollutionDetails = memo(({
  baseFieldName,
  typeValue,
  levelValue,
  onChange
}: {
  baseFieldName: string;
  typeValue: string;
  levelValue: number | string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="grid-container-extra">
    <FormField label="Type:">
      <InputField
        type="text"
        name={`${baseFieldName}_type`}
        value={typeValue || ""}
        onChange={onChange}
        title={`Voer de ${baseFieldName} type in`}
        placeholder={`${baseFieldName} Type`}
      />
    </FormField>
    <FormField label="last %:">
      <InputField
        type="number"
        name={`${baseFieldName}_level`}
        value={levelValue || ""}
        onChange={onChange}
        title={`Voer de ${baseFieldName} level in`}
        placeholder={`${baseFieldName} Level`}
      />
    </FormField>
  </div>
));

const HouseForm: React.FC<HouseFormProps> = ({ formData, handleChange }) => {
  // State for section toggles
  const [sections, setSections] = useState({
    generalInfo: true,
    location: true,
    interior: true,
    kitchen: true,
    energy: true,
    outdoor: true,
    extras: true
  });

  // Helper to toggle a specific section
  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Property condition options with their styles
  const conditionOptions = [
    { value: "Nieuw", label: "Nieuw", style: { backgroundColor: "green", color: "white" } },
    { value: "Goed", label: "Goed", style: { backgroundColor: "limegreen", color: "white" } },
    { value: "Gemiddeld", label: "Gemiddeld", style: { backgroundColor: "yellow", color: "black" } },
    { value: "Slecht", label: "Slecht", style: { backgroundColor: "orange", color: "white" } },
    { value: "Renoveren", label: "Te Renoveren", style: { backgroundColor: "red", color: "white" } }
  ];

  // Get background color based on property condition
  const getConditionStyle = () => {
    switch (formData.property_condition) {
      case "Nieuw": return { backgroundColor: "green", color: "white" };
      case "Goed": return { backgroundColor: "limegreen", color: "white" };
      case "Gemiddeld": return { backgroundColor: "yellow", color: "black" };
      case "Slecht": return { backgroundColor: "orange", color: "white" };
      case "Renoveren": return { backgroundColor: "red", color: "white" };
      default: return { backgroundColor: "green", color: "white" };
    }
  };

  // EPC options with their styles
  const epcOptions = [
    { value: "A+", label: "A+", style: { backgroundColor: "green", color: "white" } },
    { value: "A", label: "A", style: { backgroundColor: "limegreen", color: "white" } },
    { value: "B", label: "B", style: { backgroundColor: "yellowgreen", color: "white" } },
    { value: "C", label: "C", style: { backgroundColor: "yellow", color: "black" } },
    { value: "D", label: "D", style: { backgroundColor: "orange", color: "white" } },
    { value: "E", label: "E", style: { backgroundColor: "orangered", color: "white" } },
    { value: "F", label: "F", style: { backgroundColor: "red", color: "white" } },
    { value: "G", label: "G", style: { backgroundColor: "darkred", color: "white" } }
  ];

  // Get background color based on EPC
  const getEpcStyle = () => {
    switch (formData.epc) {
      case "A+": return { backgroundColor: "green", color: "white" };
      case "A": return { backgroundColor: "limegreen", color: "white" };
      case "B": return { backgroundColor: "yellowgreen", color: "white" };
      case "C": return { backgroundColor: "yellow", color: "black" };
      case "D": return { backgroundColor: "orange", color: "white" };
      case "E": return { backgroundColor: "orangered", color: "white" };
      case "F": return { backgroundColor: "red", color: "white" };
      case "G": return { backgroundColor: "darkred", color: "white" };
      default: return { backgroundColor: "green", color: "white" };
    }
  };

  return (
    <div className="house-form">
      <FoldableSection
        title="Algemene Informatie"
        isOpen={sections.generalInfo}
        onToggle={() => toggleSection('generalInfo')}
      >
        <div className="grid-container">
          <FormField label="Woningconditie:">
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
              min={1800}
              max={new Date().getFullYear()}
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
            />
          </FormField>

          <FormField label="Graad Van Afwerking">
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
          </FormField>
        </div>
      </FoldableSection>

      <FoldableSection
        title="Locatie"
        isOpen={sections.location}
        onToggle={() => toggleSection('location')}
      >
        <div className="grid-container">
          <FormField label="Land">
            <InputField
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              title="Voer het land in"
              placeholder="Land"
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
            />
          </FormField>
        </div>
        <HouseMapForm
          centerAddress={`${formData.street} ${formData.street_number}, ${formData.city}, ${formData.province}, ${formData.country}`}
          houses={[
            // Dummy data of echte huizen uit je database
            {
              lat: 51.0543,
              lon: 3.7174,
              address: "Dummylaan 2, Gent",
              value: 450000,
              ownEstimate: true,
            },
            {
              lat: 51.2194,
              lon: 4.4025,
              address: "Dummystraat 1, Antwerpen",
              value: 350000,
              ownEstimate: false,
            },
          ]}
        />
      </FoldableSection>

      {/* Interieur */}
      <FoldableSection
        title="Interieur"
        isOpen={sections.interior}
        onToggle={() => toggleSection('interior')}
      >
        <div className="grid-container">
          <FormField label="Woonoppervlakte:">
            <InputField
              type="number"
              name="livable_area"
              value={formData.livable_area || ""}
              onChange={handleChange}
              title="Voer de woonoppervlakte in"
              placeholder="Woonoppervlakte"
            />
          </FormField>

          <FormField label="Oppervlakte Woonkamer:">
            <InputField
              type="number"
              name="living_room_area"
              value={formData.living_room_area || ""}
              onChange={handleChange}
              title="Voer de oppervlakte in voor de woonkamer"
              placeholder="Oppervlakte woonkamer"
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
            />
          </FormField>
        </div>
        
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
              />
            </FormField>
          </div>
        ))}

        <div className="grid-container">
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
        </div>
      </FoldableSection>

      {/* Keuken en Sanitair */}
      <FoldableSection
        title="Keuken en Sanitair"
        isOpen={sections.kitchen}
        onToggle={() => toggleSection('kitchen')}
      >
        <div className="grid-container">
          <FormField label="Keukenoppervlakte:">
            <InputField
              type="number"
              name="kitchen_area"
              value={formData.kitchen_area || ""}
              onChange={handleChange}
              title="Voer de keukenoppervlakte in"
              placeholder="Keukenoppervlakte"
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
                { value: "Geen", label: "Geen" }
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
            />
          </FormField>
        </div>
      </FoldableSection>

      {/* Energie en Milieu */}
      <FoldableSection
        title="Energie en Milieu"
        isOpen={sections.energy}
        onToggle={() => toggleSection('energy')}
      >
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
                { value: "Geen", label: "Geen" }
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
                { value: "enkel", label: "Enkel glas"},
                { value: "dubbel", label: "Dubbel glas (HR)"},
                { value: "dubbelHR+", label: "Hoogrendementsglas (HR+)"},
                { value: "dubbelHR++", label: "Hoogrendementsglas (HR++)"},
                { value: "triple", label: "Hoogrendementsglas (HR+++ / driedubbel glas)"},
                { value: "gelaagd", label: "Gelaagd glas"},
                { value: "gehard", label: "Gehard glas"},
                { value: "inbraakwerend", label: "Inbraakwerend glas"},
                { value: "kogelwerend", label: "Kogelwerend glas"},
                { value: "matglas", label: "Matglas / gezandstraald glas"},
                { value: "lood", label: "Glas-in-lood"},
                { value: "spiegel", label: "Spiegelglas"},
                { value: "ornament", label: "Ornamentglas / structuurglas"},
                { value: "gekleurd", label: "Gekleurd glas / getint glas"},
                { value: "zonwerend", label: "Zonwerend glas"},
                { value: "geluidwerend", label: "Geluidwerend glas"},
                { value: "zelfreinigend", label: "Zelfreinigend glas"},
                { value: "brandwerend", label: "Brandwerend glas"},
                { value: "UV-werend", label: "UV-werend glas"},
                { value: "smart", label: "Smart glas"},

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
              />
            </FormField>
          )}
        </div>
      </FoldableSection>

      {/* Buitenruimte */}
      <FoldableSection
        title="Buitenruimte"
        isOpen={sections.outdoor}
        onToggle={() => toggleSection('outdoor')}
      >
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
                { value: "4", label: "4 of meer" }
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
              />
            </FormField>
          )}
        </div>
      </FoldableSection>

        {/* Extra's */}
        <FoldableSection
          title="Extra's"
          isOpen={sections.extras}
          onToggle={() => toggleSection('extras')}
        >
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
        </FoldableSection>
      </div>
    );
  };

export default HouseForm;
