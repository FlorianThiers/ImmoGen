import React, { memo, useState } from "react";
import FormDataType from "../formDataType";

import "../../index.css";

interface HouseFormProps {
  formData: FormDataType;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const HouseForm: React.FC<HouseFormProps> = memo(
  ({ formData, handleChange }) => {
    const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({});
    
    const toggleSection = (key: string) => {
      setOpenSections((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    };

    const FoldableSection = memo(
      ({
        title,
        sectionKey,
        isOpen,
        toggleSection,
        children,
      }: {
        title: string;
        sectionKey: string;
        isOpen: boolean;
        toggleSection: (key: string) => void;
        children: React.ReactNode;
      }) => {
        return (
          <div>
            <h2
              className="text-xl font-bold mt-4 cursor-pointer"
              onClick={() => toggleSection(sectionKey)}
            >
              {title} {isOpen ? "▲" : "▼"}
            </h2>
            {isOpen && <div>{children}</div>}
          </div>
        );
      }
    );

    return (
      <>
        <FoldableSection
          title="Algemene Informatie"
          sectionKey="generalInfo"
          isOpen={openSections["generalInfo"] || false}
          toggleSection={toggleSection}
        >
            <div className="grid-container">
            <label>Woningconditie:</label>
            <select
              name="property_condition"
              value={formData.property_condition}
              onChange={handleChange}
              title="Voer de woningconditie in"
              style={{
              backgroundColor: (() => {
                switch (formData.property_condition) {
                case "Nieuw":
                  return "green";
                case "Goed":
                  return "limegreen";
                case "Gemiddeld":
                  return "yellow";
                case "Slecht":
                  return "orange";
                case "Renoveren":
                  return "red";
                default:
                  return "green";
                }
              })(),
              color: ["Gemiddeld", "yellow"].includes(formData.property_condition) ? "black" : "white",
              }}
            >
              <option value="Nieuw" style={{ backgroundColor: "green", color: "white" }}>Nieuw</option>
              <option value="Goed" style={{ backgroundColor: "limegreen", color: "white" }}>Goed</option>
              <option value="Gemiddeld" style={{ backgroundColor: "yellow", color: "black" }}>Gemiddeld</option>
              <option value="Slecht" style={{ backgroundColor: "orange", color: "white" }}>Slecht</option>
              <option value="Renoveren" style={{ backgroundColor: "red", color: "white" }}>Te Renoveren</option>
            </select>

            <label>Bouwjaar:</label>
            <input
              type="number"
              name="construction_year"
              value={formData.construction_year || ""}
              onChange={handleChange}
              title="Voer het bouwjaar in"
              placeholder="Bouwjaar"
              min={1800}
              max={new Date().getFullYear()}
            />

            <label>Totale Oppervlakte:</label>
            <input
              type="number"
              name="area"
              value={formData.area || ""}
              onChange={handleChange}
              title="Voer de totale oppervlakte in"
              placeholder="Totale oppervlakte"
            />

            <label>m²-prijs Bouwgrond</label>
            <input
              type="number"
              name="price_per_m2"
              value={formData.price_per_m2 || ""}
              onChange={handleChange}
              title="Voer de m²-prijs bouwgrond in"
              placeholder="m²-prijs Bouwgrond"
            />

            <label>Bouwkost/m²</label>
            <input
              type="number"
              name="build_price"
              value={formData.build_price || ""}
              onChange={handleChange}
              title="Voer de bouwkost/m² in"
              placeholder="Bouwkost/m²"
            />

            <label>Renovatie Kosten</label>
            <input
              type="number"
              name="renovation_price"
              value={formData.renovation_price || ""}
              onChange={handleChange}
              title="Voer de afbraakkost in"
              placeholder="Afbraakkost"
            />

            <label>Afbraakkost</label>
            <input
              type="number"
              name="demolition_cost"
              value={formData.demolition_cost || ""}
              onChange={handleChange}
              title="Voer de afbraakkost in"
              placeholder="Afbraakkost"
            />

            <label>Graad Van Afwerking</label>
            {/* slider */}
            <input
              type="range"
              name="grade_of_finish"
              value={formData.grade_of_finish || ""}
              onChange={handleChange}
              title="Voer de graad van afwerking in"
              min={0}
              max={100}
              step={1}
              style={{ width: "100%" }}
            />


          </div>
        </FoldableSection>

        <FoldableSection
          title="Locatie"
          sectionKey="Locatie"
          isOpen={openSections["Locatie"] || false}
          toggleSection={toggleSection}
        >
          <div className="grid-container">
            <label>Land</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              title="Voer het land in"
              placeholder="Land"
            />

            <label>Provincie</label>
            <input
              type="text"
              name="province"
              value={formData.province}
              onChange={handleChange}
              title="Voer de provincie in"
              placeholder="Provincie"
            />

            <label>Stad</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              title="Voer de stad in"
              placeholder="Stad"
            />

            <label>Postcode</label>
            <input
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              title="Voer de postcode in"
              placeholder="Postcode"
            />

            <label>Straat</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              title="Voer de straat in"
              placeholder="Straat"
            />

            <label>Straatnummer</label>
            <input
              type="number"
              name="street_number"
              value={formData.street_number || ""}
              onChange={handleChange}
              title="Voer het straatnummer in"
              placeholder="Straatnummer"
            />
          </div>
        </FoldableSection>

        {/* Interieur */}
        <FoldableSection
          title="Interieur"
          sectionKey="Interieur"
          isOpen={openSections["Interieur"] || false}
          toggleSection={toggleSection}
        >
          <div className="grid-container">
            <label>Woonoppervlakte: </label>
            <input
              type="number"
              name="livable_area"
              value={formData.livable_area || ""}
              onChange={handleChange}
              title="Voer de woonoppervlakte in"
              placeholder="Woonoppervlakte"
            />

            <label>Oppervlakte Woonkamer: </label>
            <input
              type="number"
              name="living_room_area"
              value={formData.living_room_area || ""}
              onChange={handleChange}
              title="Voer de oppervlakte in voor de woonkamer"
              placeholder="Oppervlakte woonkamer"
            />

            <label>Aantal Slaapkamers: </label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms || ""}
              onChange={handleChange}
              title="Voer het aantal slaapkamers in"
              placeholder="Aantal slaapkamers"
            />
          </div>
          {Array.from({ length: formData.bedrooms }, (_, index) => (
            <div key={index} className="grid-container-bedroom">
              <label>Slaapkamer {index + 1} Oppervlakte:</label>
              <input
                type="number"
                name={`bedroom_${index + 1}_area`}
                value={formData[`bedroom_${index + 1}_area`] || ""}
                onChange={(e) =>
                  handleChange({
                    ...e,
                    target: {
                      ...e.target,
                      name: `bedroom_${index + 1}_area`,
                      value: e.target.value,
                    },
                  })
                }
                title={`Voer de oppervlakte in voor slaapkamer ${index + 1}`}
                placeholder={`Slaapkamer ${index + 1} Oppervlakte`}
              />
            </div>
          ))}

          <div className="grid-container">
            <label>Heeft Zolder: </label>
            <select
              name="attic"
              value={formData.attic.toString()}
              onChange={handleChange}
              title="Is er een zolder?"
            >
              <option value="false">Nee</option>
              <option value="true">Ja</option>
            </select>

            {formData.attic && (
              <>
                <label>Zolderoppervlakte: </label>
                <input
                  type="number"
                  name="attic_area"
                  value={formData.attic_area || ""}
                  onChange={handleChange}
                  title="Voer de zolderoppervlakte in"
                  placeholder="Zolderoppervlakte"
                />
              </>
            )}

            <label>Heeft Kelder: </label>
            <select
              name="basement"
              value={formData.basement.toString()}
              onChange={handleChange}
              title="Is er een kelder?"
            >
              <option value="false">Nee</option>
              <option value="true">Ja</option>
            </select>

            {formData.basement && (
              <>
                <label>Kelderoppervlakte: </label>
                <input
                  type="number"
                  name="basement_area"
                  value={formData.basement_area || ""}
                  onChange={handleChange}
                  title="Voer de kelderoppervlakte in"
                  placeholder="Kelderoppervlakte"
                />
              </>
            )}

            <label>Heeft Garage: </label>
            <select
              name="garage"
              value={formData.garage.toString()}
              onChange={handleChange}
              title="Is er een garage?"
            >
              <option value="false">Nee</option>
              <option value="true">Ja</option>
            </select>

            {formData.garage && (
              <>
                <label>Garageoppervlakte: </label>
                <input
                  type="number"
                  name="garage_area"
                  value={formData.garage_area || ""}
                  onChange={handleChange}
                  title="Voer de garageoppervlakte in"
                  placeholder="Garageoppervlakte"
                />

                <label>Aantal Garages: </label>
                <input
                  type="number"
                  name="number_of_garages"
                  value={formData.number_of_garages || ""}
                  onChange={handleChange}
                  title="hoeveel garages zijn er?"
                  placeholder="Aantal garages"
                />
              </>
            )}

            <label>Aantal parkeerplaatsen: </label>
            <input
              type="number"
              name="parkings"
              value={formData.number_of_parking_spaces || ""}
              onChange={handleChange}
              title="hoeveel parkeerplaatsen zijn er?"
              placeholder="Aantal parkeerplaatsen"
            />

            <label>Is Bemeubeld: </label>
            <select
              name="furnished"
              value={formData.furnished.toString()}
              onChange={handleChange}
              title="Is de woning bemeubeld?"
            >
              <option value="false">Nee</option>
              <option value="true">Ja</option>
            </select>
          </div>
        </FoldableSection>

        {/* Keuken en Sanitair */}
        <FoldableSection
          title="Keuken en Sanitair"
          sectionKey="Keuken&Sanitair"
          isOpen={openSections["Keuken&Sanitair"] || false}
          toggleSection={toggleSection}
        >
          <div className="grid-container">
            <label>Keukenoppervlakte:</label>
            <input
              type="number"
              name="kitchen_area"
              value={formData.kitchen_area || ""}
              onChange={handleChange}
              title="Voer de keukenoppervlakte in"
              placeholder="Keukenoppervlakte"
            />

            <label>Keukenuitrusting:</label>
            <select
              name="kitchen_equipment"
              value={formData.kitchen_equipment}
              onChange={handleChange}
              title="Voer de keukenuitrusting in"
            >
              <option value="Volledig ingericht">Volledig ingericht</option>
              <option value="Deels ingericht">Deels ingericht</option>
              <option value="Geen">Geen</option>
            </select>

            <label>Aantal Badkamers:</label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms || ""}
              onChange={handleChange}
              title="Voer het aantal badkamers in"
              placeholder="Aantal badkamers"
            />

            <label>Aantal Douches:</label>
            <input
              type="number"
              name="number_of_shower_cabins"
              value={formData.number_of_shower_cabins || ""}
              onChange={handleChange}
              title="Voer het aantal douches in"
              placeholder="Aantal douches"
            />

            <label>Aantal Badkuipen:</label>
            <input
              type="number"
              name="number_of_baths"
              value={formData.number_of_baths || ""}
              onChange={handleChange}
              title="Voer het aantal badkuipen in"
              placeholder="Aantal badkuipen"
            />

            <label>Aantal Toiletten:</label>
            <input
              type="number"
              name="number_of_toilets"
              value={formData.number_of_toilets || ""}
              onChange={handleChange}
              title="Voer het aantal toiletten in"
              placeholder="Aantal toiletten"
            />
          </div>
        </FoldableSection>

        {/* Energie en Milieu */}
        <FoldableSection
          title="Energie en Milieu"
          sectionKey="Energie&Milieu"
          isOpen={openSections["Energie&Milieu"] || false}
          toggleSection={toggleSection}
        >
          <div className="grid-container">
            <label>EPC:</label>
            <select
              name="epc"
              value={formData.epc}
              onChange={handleChange}
              title="Voer de EPC in"
              style={{
              backgroundColor: (() => {
                switch (formData.epc) {
                case "A+":
                  return "green";
                case "A":
                  return "limegreen";
                case "B":
                  return "yellowgreen";
                case "C":
                  return "yellow";
                case "D":
                  return "orange";
                case "E":
                  return "orangered";
                case "F":
                  return "red";
                case "G":
                  return "darkred";
                default:
                  return "green";
                }
              })(),
              color: ["C", "yellow"].includes(formData.epc) ? "black" : "white",
              }}
            >
                <option value="A+" style={{ backgroundColor: "green", color: "white" }}>A+</option>
                <option value="A" style={{ backgroundColor: "limegreen", color: "white" }}>A</option>
                <option value="B" style={{ backgroundColor: "yellowgreen", color: "white" }}>B</option>
                <option value="C" style={{ backgroundColor: "yellow", color: "black" }}>C</option>
                <option value="D" style={{ backgroundColor: "orange", color: "white" }}>D</option>
                <option value="E" style={{ backgroundColor: "orangered", color: "white" }}>E</option>
                <option value="F" style={{ backgroundColor: "red", color: "white" }}>F</option>
                <option value="G" style={{ backgroundColor: "darkred", color: "white" }}>G</option>
            </select>

            <label>Type Verwarming:</label>
            <select
              name="heating_type"
              value={formData.heating_type}
              onChange={handleChange}
              title="Voer het type verwarming in"
            >
              <option value="CV">CV</option>
              <option value="Vloerverwarming">Vloerverwarming</option>
              <option value="Infrarood">Infrarood</option>
              <option value="Houtkachel">Houtkachel</option>
              <option value="Pelletkachel">Pelletkachel</option>
              <option value="Zonneboiler">Zonneboiler</option>
              <option value="Warmtepomp">Warmtepomp</option>
              <option value="Geen">Geen</option>
            </select>

            <label>Heeft Gasleiding:</label>
            <select
              name="gas_connection"
              value={formData.gas_connection.toString()} // Convert boolean to string
              onChange={handleChange}
              title="Heeft de woning een gasleiding?"
            >
              <option value="false">Nee</option>
              <option value="true">Ja</option>
            </select>

            {formData.gas_connection && (
              <>
                <label>Type Glas:</label>
                <input
                  type="text"
                  name="glass_type"
                  value={formData.glass_type}
                  onChange={handleChange}
                  title="Voer het type glas in"
                  placeholder="Type glas"
                />
              </>
            )}

            <label>Heeft Zonnepanelen:</label>
            <select
              name="solar_panels"
              value={formData.solar_panels.toString()} // Convert boolean to string
              onChange={handleChange}
              title="Heeft de woning zonnepanelen?"
            >
              <option value={0}>Nee</option>
              <option value={1}>Ja</option>
            </select>

            {formData.solar_panels && (
              <>
                <label>Zonnepaneeloppervlakte:</label>
                <input
                  type="number"
                  name="solar_panel_area"
                  value={formData.solar_panel_area || ""}
                  onChange={handleChange}
                  title="Voer de zonnepaneeloppervlakte in"
                  placeholder="Zonnepaneeloppervlakte"
                />
              </>
            )}
          </div>
        </FoldableSection>

        {/* Buitenruimte */}
        <FoldableSection
          title="Buitenruimte"
          sectionKey="Buitenruimte"
          isOpen={openSections["Buitenruimte"] || false}
          toggleSection={toggleSection}
        >
          <div className="grid-container">
            <label>Aantal Gevels:</label>
            <select
              name="number_of_facades"
              value={formData.number_of_facades.toString()} // Convert boolean to string
              onChange={handleChange}
              title="Voer het aantal gevels in"
            >
              <option value="1">1 of minder</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4 of meer</option>
            </select>

            <label>Front Gevelbreedte:</label>
            <input
              type="number"
              name="facade_width"
              value={formData.facade_width || ""}
              onChange={handleChange}
              title="Voer de gevelbreedte in"
              placeholder="Gevelbreedte"
            />

            <label>Perceeldiepte:</label>
            <input
              type="number"
              name="plot_depth"
              value={formData.plot_depth || ""}
              onChange={handleChange}
              title="Voer de perceeldiepte in"
              placeholder="Perceeldiepte"
            />

            <label>Aantal Verdiepingen:</label>
            <input
              type="number"
              name="number_of_floors"
              value={formData.number_of_floors || ""}
              onChange={handleChange}
              title="Voer het aantal verdiepingen in"
              placeholder="Aantal verdiepingen"
            />

            <label>Heeft Terras:</label>
            <select
              name="terrace"
              value={formData.terrace.toString()} // Convert boolean to string
              onChange={handleChange}
              title="Heeft de woning een terras?"
            >
              <option value="false">Nee</option>
              <option value="true">Ja</option>
            </select>

            {formData.terrace && (
              <>
                <label>Terrasoppervlakte:</label>
                <input
                  type="number"
                  name="terrace_area"
                  value={formData.terrace_area || ""}
                  onChange={handleChange}
                  title="Voer de terrasoppervlakte in"
                  placeholder="Terrasoppervlakte"
                />

                <label>Terrasbreedte:</label>
                <input
                  type="number"
                  name="terrace_front_width"
                  value={formData.terrace_front_width || ""}
                  onChange={handleChange}
                  title="Voer de terrasbreedte in"
                  placeholder="Terrasbreedte"
                />
              </>
            )}

            <label>Heeft Riolering:</label>
            <select
              name="sewer_connection"
              value={formData.sewer_connection.toString()} // Convert boolean to string
              onChange={handleChange}
              title="Heeft de woning riolering?"
            >
              <option value="false">Nee</option>
              <option value="true">Ja</option>
            </select>

            <label>Heeft Waterleiding:</label>
            <select
              name="water_connection"
              value={formData.water_connection.toString()} // Convert boolean to string
              onChange={handleChange}
              title="Heeft de woning waterleiding?"
            >
              <option value="false">Nee</option>
              <option value="true">Ja</option>
            </select>

            <label>Heeft Tuin:</label>
            <select
              name="garden"
              value={formData.garden.toString()} // Convert boolean to string
              onChange={handleChange}
              title="Heeft de woning een tuin?"
            >
              <option value="false">Nee</option>
              <option value="true">Ja</option>
            </select>

            {formData.garden && (
              <>
                <label>Tuinoppervlakte:</label>
                <input
                  type="number"
                  name="garden_area"
                  value={formData.garden_area || ""}
                  onChange={handleChange}
                  title="Voer de tuinoppervlakte in"
                  placeholder="Tuinoppervlakte"
                />
              </>
            )}

            <label>Heeft Zwembad:</label>
            <select
              name="swimming_pool"
              value={formData.swimming_pool.toString()} // Convert boolean to string
              onChange={handleChange}
              title="Heeft de woning een zwembad?"
            >
              <option value="false">Nee</option>
              <option value="true">Ja</option>
            </select>

            {formData.swimming_pool && (
              <>
                <label>Zwembadoppervlakte:</label>
                <input
                  type="number"
                  name="swimming_pool_area"
                  value={formData.swimming_pool_area || ""}
                  onChange={handleChange}
                  title="Voer de zwembadoppervlakte in"
                  placeholder="Zwembadoppervlakte"
                />
              </>
            )}
          </div>
        </FoldableSection>

        {/* Extra's */}
        <FoldableSection
          title="Extra's"
          sectionKey="Extra"
          isOpen={openSections["Extra"] || false}
          toggleSection={toggleSection}
        >
          <div className="grid-container">
            <label>Heeft Lift:</label>
            <select
              name="elevator"
              value={formData.elevator.toString()} // Convert boolean to string
              onChange={handleChange}
              title="Heeft de woning een lift?"
            >
              <option value="false">Nee</option>
              <option value="true">Ja</option>
            </select>

            <label>Rolstoeltoegankelijk:</label>
            <select
              name="wheelchair_accessible"
              value={formData.wheelchair_accessible.toString()} // Convert boolean to string
              onChange={handleChange}
              title="Is de woning rolstoeltoegankelijk?"
            >
              <option value="false">Nee</option>
              <option value="true">Ja</option>
            </select>

            <label>Geluidsoverlast: </label>
            <select
              name="noise_pollution"
              value={formData.noise_pollution.toString()} // Convert boolean to string
              onChange={handleChange}
              title="Voer de geluidsoverlast in"
            >
              <option value="false">Nee</option>
              <option value="true">Ja</option>
            </select>
          </div>

          <div className="grid-container-extra">
            {formData.noise_pollution && (
              <>
                <label>Type: </label>
                <input
                  type="text"
                  name="noise_pollution_type"
                  value={formData.noise_pollution_type || ""}
                  onChange={handleChange}
                  title="Voer de geluidsoverlast type in"
                  placeholder="Geluidsoverlast Type"
                />

                <label>last %: </label>
                <input
                  type="number"
                  name="noise_pollution_level"
                  value={formData.noise_pollution_level || ""}
                  onChange={handleChange}
                  title="Voer de geluidsoverlast level in"
                  placeholder="Geluidsoverlast Level"
                />
              </>
            )}
          </div>

          <div className="grid-container">
            <label>Geur Overlast: </label>
            <select
              name="smell_pollution"
              value={formData.smell_pollution.toString()} // Convert boolean to string
              onChange={handleChange}
              title="Voer de geur overlast in"
            >
              <option value="false">Nee</option>
              <option value="true">Ja</option>
            </select>
          </div>

          <div className="grid-container-extra">
            {formData.smell_pollution && (
              <>
                <label>Type: </label>
                <input
                  type="text"
                  name="smell_pollution_type"
                  value={formData.smell_pollution_type || ""}
                  onChange={handleChange}
                  title="Voer de geur overlast type in"
                  placeholder="Geur Overlast Type"
                />

                <label>last %: </label>
                <input
                  type="number"
                  name="smell_pollution_level"
                  value={formData.smell_pollution_level || ""}
                  onChange={handleChange}
                  title="Voer de geur overlast level in"
                  placeholder="Geur Overlast Level"
                />
              </>
            )}
          </div>

          <div className="grid-container">
            <label>Verkeersoverlast: </label>
            <select
              name="traffic_pollution"
              value={formData.traffic_pollution.toString()} // Convert boolean to string
              onChange={handleChange}
              title="Voer de verkeersoverlast in"
            >
              <option value="false">Nee</option>
              <option value="true">Ja</option>
            </select>
          </div>

          <div className="grid-container-extra">
            {formData.traffic_pollution && (
              <>
                <label>Type: </label>
                <input
                  type="text"
                  name="traffic_pollution_type"
                  value={formData.traffic_pollution_type || ""}
                  onChange={handleChange}
                  title="Voer de verkeersoverlast type in"
                  placeholder="Verkeers Overlast Type"
                />

                <label>last %: </label>
                <input
                  type="number"
                  name="traffic_pollution_level"
                  value={formData.traffic_pollution_level || ""}
                  onChange={handleChange}
                  title="Voer de verkeersoverlast level in"
                  placeholder="Verkeers Overlast Level"
                />
              </>
            )}
          </div>

          <div className="grid-container">
            <label>Luchtvervuiling: </label>
            <select
              name="air_pollution"
              value={formData.air_pollution.toString()} // Convert boolean to string
              onChange={handleChange}
              title="Voer de luchtvervuiling in"
            >
              <option value="false">Nee</option>
              <option value="true">Ja</option>
            </select>
          </div>

          <div className="grid-container-extra">
            {formData.air_pollution && (
              <>
                <label>Type: </label>
                <input
                  type="text"
                  name="air_pollution_type"
                  value={formData.air_pollution_type || ""}
                  onChange={handleChange}
                  title="Voer de luchtvervuiling type in"
                  placeholder="Luchtvervuiling Type"
                />

                <label>last %: </label>
                <input
                  type="number"
                  name="air_pollution_level"
                  value={formData.air_pollution_level || ""}
                  onChange={handleChange}
                  title="Voer de luchtvervuiling level in"
                  placeholder="Luchtvervuiling Level"
                />
              </>
            )}
          </div>

          <div className="grid-container">
            <label>Aparte Vormen: </label>
            <select
              name="special_shapes"
              value={formData.special_shapes.toString()} // Convert boolean to string
              onChange={handleChange}
              title="Voer de aparte vormen in"
            >
              <option value="false">Nee</option>
              <option value="true">Ja</option>
            </select>
          </div>

          <div className="grid-container-extra">
            {formData.special_shapes && (
              <>
                <label>Type: </label>
                <input
                  type="text"
                  name="special_shapes_type"
                  value={formData.special_shapes_type || ""}
                  onChange={handleChange}
                  title="Voer de aparte vormen type in"
                  placeholder="Aparte Vormen Type"
                />

                <label>last %: </label>
                <input
                  type="number"
                  name="special_shapes_level"
                  value={formData.special_shapes_level || ""}
                  onChange={handleChange}
                  title="Voer de aparte vormen level in"
                  placeholder="Aparte Vormen Level"
                />
              </>
            )}
          </div>

          <div className="grid-container">
            <label>Aparte Kleuren: </label>
            <select
              name="special_colors"
              value={formData.special_colors.toString()} // Convert boolean to string
              onChange={handleChange}
              title="Voer de aparte kleuren in"
            >
              <option value="false">Nee</option>
              <option value="true">Ja</option>
            </select>
          </div>

          <div className="grid-container-extra">
            {formData.special_colors && (
              <>
                <label>Type: </label>
                <input
                  type="text"
                  name="special_colors_type"
                  value={formData.special_colors_type || ""}
                  onChange={handleChange}
                  title="Voer de aparte kleuren type in"
                  placeholder="Aparte Kleuren Type"
                />

                <label>last %: </label>
                <input
                  type="number"
                  name="special_colors_level"
                  value={formData.special_colors_level || ""}
                  onChange={handleChange}
                  title="Voer de aparte kleuren level in"
                  placeholder="Aparte Kleuren Level"
                />
              </>
            )}
          </div>

          <div className="grid-container">
            <label>Aparte Materialen: </label>
            <select
              name="special_materials"
              value={formData.special_materials.toString()} // Convert boolean to string
              onChange={handleChange}
              title="Voer de aparte materialen in"
            >
              <option value="false">Nee</option>
              <option value="true">Ja</option>
            </select>
          </div>

          <div className="grid-container-extra">
            {formData.special_materials && (
                <>
                <label>Type: </label>
                <input
                  type="text"
                  name="special_materials_type"
                  value={formData.special_materials_type || ""}
                  onChange={handleChange}
                  title="Voer de aparte materialen type in"
                  placeholder="Aparte Materialen Type"
                />

                <label>last %: </label>
                <input
                  type="range"
                  name="special_materials_level"
                  value={formData.special_materials_level || 1}
                  onChange={handleChange}
                  title="Voer de aparte materialen level in"
                  min={1}
                  max={15}
                  step={1}
                />
                <span>{formData.special_materials_level || 1}</span>
                </>
            )}
          </div>
        </FoldableSection>
      </>
    );
  }
);

export default React.memo(HouseForm);
