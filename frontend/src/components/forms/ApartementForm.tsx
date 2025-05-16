import { useState } from "react";
import FormDataType from "../formDataType";

import "../../index.css";

const ApartmentForm = () => {
  const [formData, setFormData] = useState<FormDataType>({
    // General Information
    title: "Project:",
    property_condition: "",
    construction_year: 1980,
    renovation_year: 2010,
    area: 50,
    price_per_m2: 80.68,
    build_price: 1660,
    renovation_price: 2500,
    demolition_price: 0,
    grade_of_finish: 0.6,

    
    // Location
    country: "België",
    province: "Oost-Vlaanderen",
    city: "Gent",
    postal_code: 9000,
    street: "Sint-Lievenspoortstraat",
    street_number: 168,
    distance_to_center: 1,
    neighborhood_safety: 6,


    // Interior
    livable_area: 50,
    bedrooms: 1,
    bedroom_1_area: 0,
    bedroom_2_area: 0,
    bedroom_3_area: 0,
    bedroom_4_area: 0,
    bedroom_5_area: 0,
    bedroom_6_area: 0,
    living_room_area: 80,
    attic: false,
    attic_area: 0,
    basement: false,
    basement_area: 0,
    garage: false,
    garage_area: 0,
    number_of_garages: 0,
    number_of_parking_spaces: 0,
    furnished: false,

    // Kitchen and sanitary
    kitchen_area: 0,
    kitchen_equipment: "",
    bathrooms: 0,
    number_of_shower_cabins: 0,
    number_of_baths: 0,
    number_of_toilets: 0,

    // Energy and environment
    epc: "",
    heating_type: "",
    gas_connection: false,
    glass_type: "",
    solar_panels: false,
    solar_panel_area: 0,

    // Equipment
    elevator: false,
    wheelchair_accessible: false,

    // Outdoor space
    number_of_facades: 0,
    facade_width: 0,
    plot_depth: 0,
    floor: 0,
    number_of_floors: 0,
    terrace: false,
    terrace_area: 0,
    terrace_front_width: 0,
    sewer_connection: false,
    water_connection: false,
    garden: false,
    garden_area: 0,
    swimming_pool: false,
    swimming_pool_area: 0,

    // extra
    noise_pollution: false,
    noise_pollution_type: "",
    noise_pollution_level: 0,
    smell_pollution: false,
    smell_pollution_type: "",
    smell_pollution_level: 0,
    traffic_pollution: false,
    traffic_pollution_type: "",
    traffic_pollution_level: 0,
    air_pollution: false,
    air_pollution_type: "",
    air_pollution_level: 0,
    special_shapes: false,
    special_shapes_type: "",
    special_shapes_level: 0,
    special_colors: false,
    special_colors_type: "",
    special_colors_level: 0,
    special_materials: false,
    special_materials_type: "",
    special_materials_level: 0,
    
    source: "ImmoGen"
  });

  const handleChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;

    // Controleer of de waarde een boolean is
    const parsedValue = value === "true" ? true : value === "false" ? false : value;
  
    setFormData({ ...formData, [name]: parsedValue });
  };
  
  return (
    <div>
      <h2 className="text-xl font-bold mt-4">Algemene Informatie</h2>
      <label>Woningconditie:</label>
      <input
        type="text"
        name="property_condition"
        value={formData.property_condition}
        onChange={handleChange}
        title="Voer de woningconditie in"
        placeholder="Woningconditie"
      />

      <label>Bouwjaar:</label>
      <input
        type="number"
        name="construction_year"
        value={formData.construction_year || ""}
        onChange={handleChange}
        title="Voer het bouwjaar in"
        placeholder="Bouwjaar"
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

      <h2 className="text-xl font-bold mt-4">Locatie</h2>
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

      <h2 className="text-xl font-bold mt-4">Interieur</h2>
      <label>Woonoppervlakte:</label>
      <input
        type="number"
        name="livable_area"
        value={formData.livable_area || ""}
        onChange={handleChange}
        title="Voer de woonoppervlakte in"
        placeholder="Woonoppervlakte"
      />

      <label>Aantal Slaapkamers:</label>
      <input
        type="number"
        name="bedrooms"
        value={formData.bedrooms || ""}
        onChange={handleChange}
        title="Voer het aantal slaapkamers in"
        placeholder="Aantal slaapkamers"
      />

      <h2 className="text-xl font-bold mt-4">Keuken en Sanitair</h2>
      <label>Keukenuitrusting:</label>
      <input
        type="text"
        name="kitchen_equipment"
        value={formData.kitchen_equipment}
        onChange={handleChange}
        title="Voer de keukenuitrusting in"
        placeholder="Keukenuitrusting"
      />

      <label>Aantal Badkamers:</label>
      <input
        type="number"
        name="bathrooms"
        value={formData.bathrooms || ""}
        onChange={handleChange}
        title="Voer het aantal badkamers in"
        placeholder="Aantal badkamers"
      />

      <h2 className="text-xl font-bold mt-4">Energie en Milieu</h2>
      <label>Type Verwarming:</label>
      <input
        type="text"
        name="heating_type"
        value={formData.heating_type}
        onChange={handleChange}
        title="Voer het type verwarming in"
        placeholder="Type verwarming"
      />

      <label>Type Glas:</label>
      <input
        type="text"
        name="glass_type"
        value={formData.glass_type}
        onChange={handleChange}
        title="Voer het type glas in"
        placeholder="Type glas"
      />

      <h2 className="text-xl font-bold mt-4">Buitenruimte</h2>
      <label>Heeft Tuin:</label>
      <select
        name="has_garden"
        value={formData.garden ? 1 : 0}
        onChange={(e) =>
          handleChange({
            target: {
              name: "has_garden",
              value: e.target.value === "1",
            },
          })
        }
        title="Heeft de woning een tuin?"
      >
        <option value={0}>Nee</option>
        <option value={1}>Ja</option>
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

      <label>Heeft Terras:</label>
      <select
        name="has_terrace"
        value={formData.terrace ? 1 : 0}
        onChange={(e) =>
          handleChange({
            target: {
              name: "has_terrace",
              value: e.target.value === "1",
            },
          })
        }
        title="Heeft de woning een terras?"
      >
        <option value={0}>Nee</option>
        <option value={1}>Ja</option>
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
        </>
      )}

      <label>Heeft Zonnepanelen:</label>
      <select
        name="has_solar_panels"
        value={formData.solar_panels ? 1 : 0}
        onChange={(e) =>
          handleChange({
            target: {
              name: "has_solar_panels",
              value: e.target.value === "1",
            },
          })
        }
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
  );
};

export default ApartmentForm;