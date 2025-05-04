import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

const PriceCalculator = () => {
  const [result, setResult] = useState(null);
  const [titles, setTitles] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "Huis",
    price: 250000,
    property_condition: "Uitstekend",
    construction_year: 2000,

    
    // Location
    country: "België",
    province: "Oost-Vlaanderen",
    city: "Gent",
    postal_code: 9000,
    street: "Hoogstraat",
    street_number: 1,
    distance_to_center: 5,
    neighborhood_safety: 7,


    // Interior
    bedrooms: 2,
    bedroom_1_area: 0,
    bedroom_2_area: 0,
    bedroom_3_area: 0,
    bedroom_4_area: 0,
    bedroom_5_area: 0,
    bedroom_6_area: 0,
    area: 750,
    livable_area: 250,
    living_room_area: 50,
    attic: 0,
    attic_area: 0,
    basement: 0,
    basement_area: 0,
    garage: 0,
    garage_area: 0,
    number_of_garages: 0,
    number_of_parking_spaces: 2,
    furnished: true,

    // Kitchen and sanitary
    kitchen_area: 30,
    kitchen_equipment: "Smeg",
    bathrooms: 2,
    number_of_shower_cabins: 2,
    number_of_baths: 2,
    number_of_toilets: 3,

    // Energy and environment
    epc: "A",
    heating_type: "gas",
    glass_type: "double",
    solar_panels: true,
    solar_panel_area: 20,

    // Equipment
    elevator: false,
    wheelchair_accessible: false,

    // Outdoor space
    number_of_facades: 4,
    facade_width: 12.5,
    floor: 0,
    number_of_floors: 3,
    terrace: false,
    terrace_area: 0,
    plot_depth: 35,
    terrace_front_width: 0,
    sewer_connection: true,
    water_connection: true,
    gas_connection: true,
    swimming_pool: false,
    swimming_pool_area: 0,
    garden: true,
    garden_area: 500,

    source: "ImmoGen"
  });


  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/calculate-price", formData);
      setResult(response.data);
    } catch (error) {
      console.error("Fout bij het berekenen van de prijs:", error);
    }
  };

  useEffect(() => {

    // Haal statistieken op van de backend
    const fetchHouseTitles = async () => {
      try {
        const response = await axios.get("http://localhost:8000/house_titles");
        setTitles(response.data.titles);
      } catch (error) {
        console.error("Fout bij het ophalen van woningtitels:", error);
      }
    };
    fetchHouseTitles();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bereken Woningprijs</h1>
      <form onSubmit={handleSubmit}>
      {/* Algemene Informatie */}
      <h2 className="text-xl font-bold mt-4">Algemene Informatie</h2>
      <label>Huis Type:</label>
      <select
        name="title"
        value={formData.title}
        onChange={handleChange}
        title="Selecteer een titel"
      >
        {titles.map((title, index) => (
        <option key={index} value={title}>
          {title}
        </option>
        ))}
      </select>

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

      {/* Interieur */}
      <h2 className="text-xl font-bold mt-4">Interieur</h2>
      <label>Aantal Slaapkamers:</label>
      <input
        type="number"
        name="bedrooms"
        value={formData.bedrooms || ""}
        onChange={handleChange}
        title="Voer het aantal slaapkamers in"
        placeholder="Aantal slaapkamers"
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

      <label>Woonoppervlakte:</label>
      <input
        type="number"
        name="livable_area"
        value={formData.livable_area || ""}
        onChange={handleChange}
        title="Voer de woonoppervlakte in"
        placeholder="Woonoppervlakte"
      />

      {/* Keuken en Sanitair */}
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

      {/* Energie en Milieu */}
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

      {/* Buitenruimte */}
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
      </form>

      <form onSubmit={handleSubmit}>
        {/* Algemene Informatie */}
        <h2 className="text-xl font-bold mt-4">Algemene Informatie</h2>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4">
          Bereken Prijs
        </button>
      </form>
    


      {result && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Resultaat:</h2>
          <p>AI Prijs: €{result}</p>
          {/* <p>Formule Prijs: €{result.formule_prijs}</p>
          <p>Verschil: €{result.verschil}</p>
          <p>Verschil Percentage: {result.verschil_percentage}%</p> */}
        </div>
      )}
    </div>
  );
};

export default PriceCalculator;