import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";

import FormDataType from "../../components/formDataType";
import ApartmentForm from "../../components/forms/ApartementForm";
import BuildingPlotForm from "../../components/forms/BuildingPlotForm";
import DuplexForm from "../../components/forms/DuplexForm";
import CommercialPropertyForm from "../../components/forms/CommercialPropertyForm";
import HouseForm from "../../components/forms/HouseForm";
import OfficeForm from "../../components/forms/OfficeForm";
import VillaForm from "../../components/forms/VillaForm";

import { calculatePrice, PriceInput } from "../../utils/calculator"; // Pas het pad aan naar waar je de functie opslaat


const PriceCalculator = () => {
  const [result, setResult] = useState(null);
  const [titles, setTitles] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>(""); // Houd het type huis bij
  const [formulaPrice, setFormulaPrice] = useState<number | null>(null);

  const [formData, setFormData] = useState<FormDataType>({
    title: "Project:",
    property_condition: "",
    construction_year: 1980,
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


  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      // Controleer of de waarde een boolean is
      const parsedValue = value === "true" ? true : value === "false" ? false : value;

    
      // Update het geselecteerde type huis
      if (name === "title") {
        setSelectedType(value);
      }
    
      setFormData((prevFormData) => {
        if (prevFormData[name] === parsedValue) {
          return prevFormData; // Geen update nodig
        }
        return { ...prevFormData, [name]: parsedValue };
      });
    },[]
  );

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      // const response = await axios.post(`${import.meta.env.VITE_API_URL}/calculate-price`, formData);
      // setResult(response.data);

      // Formuleprijs berekenen
      const priceInput: PriceInput = {
        constructionYear: formData.construction_year,
        currentYear: new Date().getFullYear(),
        landArea: formData.area,
        landPricePerM2: formData.price_per_m2,
        livingArea: formData.livable_area,
        buildCostPerM2: formData.build_price,
        finishQuality: formData.grade_of_finish,
        abexCurrent: 1048, // Dit moet worden aangepast op basis van je logica
        abexAtConstruction: 304, // Dit moet worden aangepast op basis van je logica
        correctionPercentage: 0.30, // Dit moet worden aangepast op basis van je logica
        houseUnusable: false, // Dit moet worden aangepast op basis van je logica
      };

      const formulaResult = calculatePrice(priceInput);
      setFormulaPrice(formulaResult.totalCorrected);
    } catch (error) {
      console.error("Fout bij het berekenen van de prijs:", error);
    }
  };

  const renderForm = useCallback(() => {
    switch (selectedType) {
      case 'Appartement':
        return <ApartmentForm/>;
      case 'Bouwgrond':
        return <BuildingPlotForm formData={formData} handleChange={handleChange}/>;
      case 'Duplex':
        return <DuplexForm/>;
      case 'Handelspand':
        return <CommercialPropertyForm/>;
      case 'Huis':
        return <HouseForm formData={formData} handleChange={handleChange}/>;
      case 'Kantoor':
        return <OfficeForm/>;
      case 'Villa':
        return <VillaForm/>;
      default:
        return null;
    }
  }, [selectedType, formData, handleChange]);

  useEffect(() => {
    const fetchHouseTitles = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/house_titles`);
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
        <h2 className="text-xl font-bold mt-4">Type</h2>
        <label>Type: </label>
        {/* <select
          name="title"
          value={formData.title}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedType(value); // Update het geselecteerde type
            setFormData({ ...formData, title: value }); // Update de title in formData
          }}
          title="Selecteer een titel"
        >
          {titles.map((title, index) => (
          <option key={index} value={title}>
            {title}
          </option>
          ))}
        </select> */}

        <select
          name="title"
          value={formData.title}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedType(value); // Update het geselecteerde type
            setFormData({ ...formData, title: value }); // Update de title in formData
          }}
          title="Selecteer een titel"
        >
          <option value="Appartement">Appartement</option>
          <option value="Huis">Huis</option>
        </select>

        {renderForm()}
        
        <button type="submit" className="bg-blue-500 text-white p-2 rounded mt-4">
          Bereken Prijs
        </button>
      </form>
    
      <p>Formule Prijs: €{formulaPrice?.toFixed(2)}</p>

      {result && (
        <div className="mt-4">
          <h2 className="text-xl font-bold">Resultaat:</h2>
          <p>AI Prijs: €{result}</p>
          <p>Formule Prijs: €{formulaPrice?.toFixed(2)}</p>
          {/* <p>Verschil: €{result.verschil}</p>
          <p>Verschil Percentage: {result.verschil_percentage}%</p> */}
        </div>
      )}
    </div>
  );
};

export default PriceCalculator;
