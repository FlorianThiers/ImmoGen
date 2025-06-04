import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";

import FormDataType from "../../components/formDataType";
import ApartmentForm from "../../components/formpage/forms/ApartementForm";
import BuildingPlotForm from "../../components/formpage/forms/BuildingPlotForm";
import DuplexForm from "../../components/formpage/forms/DuplexForm";
import CommercialPropertyForm from "../../components/formpage/forms/CommercialPropertyForm";
import HouseForm from "../../components/formpage/forms/HouseForm";
import OfficeForm from "../../components/formpage/forms/OfficeForm";
import VillaForm from "../../components/formpage/forms/VillaForm";
import Sidebar from "../../components/SideNavbar";
import Header from "../../components/Header";

import CalculationFields from "../../components/formpage/CalculationFields";

import { calculatePrice, PriceInput } from "../../utils/calculator"; // Pas het pad aan naar waar je de functie opslaat
import { getAbexValue } from "../../utils/abexCalculator"; // Zorg ervoor dat je deze functie hebt geïmplementeerd

import "./dashboard.css"; // Zorg ervoor dat je een CSS-bestand hebt voor de styling
import "./priceCalculator.css"; // Zorg ervoor dat je een CSS-bestand hebt voor de styling

const PriceCalculator = () => {
  const [result, setResult] = useState(null);
  const [titles, setTitles] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>(""); // Houd het type huis bij
  const [formulaPrice, setFormulaPrice] = useState<number | null>(null);

  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    price: 0,
    property_condition: "Nieuw",
    current_year: new Date().getFullYear(),
    construction_year: 1850,
    renovation: true,
    renovation_year: 2004,
    renovation_price: 0,
    area: 3500,
    price_per_m2: 100,
    build_price: 1660,
    demolition_price: 0,
    grade_of_finish: 1.1,
    abex_current_year: getAbexValue(new Date().getFullYear(), "july"),
    abex_renovation_year: 0,
    correction_percentage: 0,
    house_unusable: false,

    // Location
    country: "België",
    province: "Oost-Vlaanderen",
    city: "Haaltert",
    postal_code: 9450,
    street: "Knipperhoek",
    street_number: 7,
    distance_to_center: 10,
    neighborhood_safety: 6,

    // Interior
    livable_area: 165,
    bedrooms: 3,
    bedroom_1_area: 15,
    bedroom_2_area: 14,
    bedroom_3_area: 12,
    bedroom_4_area: 0,
    bedroom_5_area: 0,
    bedroom_6_area: 0,
    living_room_area: 40,
    veranda: true,
    veranda_area: 0,
    attic: false,
    attic_area: 0,
    basement: false,
    basement_area: 0,
    garage: true,
    garage_area: 0,
    number_of_garages: 1,
    number_of_parking_spaces: 5,
    furnished: false,

    // Kitchen and sanitary
    kitchen_area: 24,
    kitchen_equipment: "Super uitgerust",
    bathrooms: 2,
    number_of_shower_cabins: 2,
    number_of_baths: 1,
    number_of_toilets: 2,

    // Energy and environment
    epc: "B",
    heating_type: "Gas",
    gas_connection: true,
    glass_type: "Dubbel glas",
    solar_panels: false,
    solar_panel_area: 0,

    // Equipment
    elevator: false,
    wheelchair_accessible: false,

    // Outdoor space
    number_of_facades: 3,
    facade_width: 13,
    plot_depth: 0,
    floor: 0,
    number_of_floors: 1,
    terrace: true,
    terrace_area: 0,
    terrace_front_width: 0,
    sewer_connection: true,
    water_connection: true,
    garden: true,
    garden_area: 1320,
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

    source: "ImmoGen",
  });

  function calculateCorrectionPercentage(formData: FormDataType): number {
    let correction = 0;

    // Negatieve factoren
    if (formData.noise_pollution) {
      correction -= Number(formData.noise_pollution_level);
    }
    if (formData.smell_pollution) {
      correction -= Number(formData.smell_pollution_level);
    }
    if (formData.traffic_pollution) {
      correction -= Number(formData.traffic_pollution_level);
    }
    if (formData.air_pollution) {
      correction -= Number(formData.air_pollution_level);
    }
    if (formData.special_shapes) {
      correction -= Number(formData.special_shapes_level);
    }
    if (formData.special_colors) {
      correction -= Number(formData.special_colors_level);
    }
    if (formData.special_materials) {
      correction -= Number(formData.special_materials_level);
    }

    // Positieve factoren
    if (formData.elevator) correction += 2;
    if (formData.wheelchair_accessible) correction += 2;
    if (formData.garden) correction += 2;
    if (formData.swimming_pool) correction += 4;

    // Clamp tussen -25 en +10
    correction = Math.max(-25, Math.min(10, correction));

    return correction;
  }

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      // Controleer of de waarde een boolean is
      const parsedValue =
        value === "true" ? true : value === "false" ? false : value;

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
    },
    []
  );

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      let abexLastRenovation = 0;
      if (formData.renovation === true) {
        abexLastRenovation = getAbexValue(formData.renovation_year, "july");
      } else {
        abexLastRenovation = getAbexValue(formData.construction_year, "july");
      }

      const correctionPercentage = calculateCorrectionPercentage(formData);

      formData.correctionPercentage = correctionPercentage;

      // Formuleprijs berekenen
      const priceInput: PriceInput = {
        constructionYear: formData.construction_year,
        currentYear: formData.current_year,
        landArea: formData.area,
        landPricePerM2: formData.price_per_m2,
        livingArea: formData.livable_area,
        buildCostPerM2: formData.build_price,
        finishQuality: formData.grade_of_finish,
        abexCurrent: formData.abex_current_year,
        abexLastRenovation,
        correctionPercentage: formData.correction_percentage,
        houseUnusable: false, // Dit moet worden aangepast op basis van je logica
      };

      // update formData met de berekende waarden
      formData.abex_renovation_year = abexLastRenovation;

      const formulaResult = calculatePrice(priceInput);
      setFormulaPrice(formulaResult.totalCorrected);
      formData.price = formulaResult.totalCorrected;

      const token = localStorage.getItem("token"); // of haal je token uit context
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/calculate-price`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResult(response.data);
    } catch (error) {
      console.error("Fout bij het berekenen van de prijs:", error);
    }
  };

  const renderForm = useCallback(() => {
    switch (selectedType) {
      case "Appartement":
        return <ApartmentForm />;
      case "Bouwgrond":
        return (
          <BuildingPlotForm formData={formData} handleChange={handleChange} />
        );
      case "Duplex":
        return <DuplexForm />;
      case "Handelspand":
        return <CommercialPropertyForm />;
      case "Huis":
        return <HouseForm formData={formData} handleChange={handleChange} />;
      case "Kantoor":
        return <OfficeForm />;
      case "Villa":
        return <VillaForm />;
      default:
        return null;
    }
  }, [selectedType, formData, handleChange]);

  useEffect(() => {
    const fetchHouseTitles = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/house_titles`
        );
        setTitles(response.data.titles);
      } catch (error) {
        console.error("Fout bij het ophalen van woningtitels:", error);
      }
    };
    fetchHouseTitles();
  }, []);

    // Voeg bovenaan toe in je PriceCalculator component
  const houseTypes = [
    { value: "Appartement", label: "Appartement", img: "/img/appartement.png" },
    { value: "Huis", label: "Huis", img: "/img/house.png" },
    // Voeg meer types toe indien gewenst
  ];

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="main-content">
        <Header title="Calculator" />

        <div className="content-wrapper">
          <div className="bottom-section">
            <div className="form">
              <form onSubmit={handleSubmit}>
                {/* Algemene Informatie */}
                <h2 className="text-xl font-bold mt-4">Type</h2>

                <div className="type-select-row">
                  {houseTypes.map((type) => (
                    <div
                      key={type.value}
                      className={`type-card${selectedType === type.value ? " selected" : ""}`}
                      onClick={() => {
                        setSelectedType(type.value);
                        setFormData({ ...formData, title: type.value });
                      }}
                    >
                      <img src={type.img} alt={type.label} className="type-img" />
                      <span>{type.label}</span>
                    </div>
                  ))}
                </div>
                
                {selectedType && (
                  <>
                    {renderForm()}
                    <button
                      type="submit"
                      className="bg-blue-500 text-white p-2 rounded mt-4"
                    >
                      Bereken Prijs
                    </button>
                  </>
                )}
              </form>

            </div>

            <div className="right-panel">
              <CalculationFields />

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PriceCalculator;
