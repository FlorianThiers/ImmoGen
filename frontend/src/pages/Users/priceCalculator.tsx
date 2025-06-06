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
import GarageForm from "../../components/formpage/forms/GarageForm"
import CabinForm from "../../components/formpage/forms/CabinForm";
import GroundForm from "../../components/formpage/forms/GroundForm";

import Sidebar from "../../components/SideNavbar";
import Header from "../../components/Header";
import UserField from '../../components/UserField';

import CalculationFields from "../../components/formpage/CalculationFields";

import { calculatePrice, PriceInput } from "../../utils/calculator"; 
// import { getAbexValue } from "../../utils/abexCalculator"; 
import "./dashboard.css"; 
import "./priceCalculator.css"; 

const PriceCalculator = () => {
  const isDarkTheme = useState(
    typeof document !== "undefined" &&
      document.body.classList.contains("dark-theme")
  );
  const showOverlay = useState(false);
  const overlayTheme = useState(isDarkTheme ? "dark" : "light");
  const [user, setUser] = useState(null);
  const [showUserField, setShowUserField] = useState(false);
  useEffect(() => {
      const fetchUser = async () => {
      try {
          const token = localStorage.getItem("token");
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
      } catch (err) {
          setUser(null);
      }
      };
      fetchUser();
  }, []);

  const [result, setResult] = useState(null);
  const [selectedType, setSelectedType] = useState<string>("");
  const [formulaPrice, setFormulaPrice] = useState<number | null>(null);
  const [formulaResult, setFormulaResult] = useState<any>(null);

  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    price: 0,
    property_condition: "Nieuw",
    current_year: new Date().getFullYear(),
    construction_year: 1980,
    renovation: true,
    renovation_year: 2004,
    renovation_price: 0,
    area: 3500,
    price_per_m2: 100,
    build_price: 1660,
    demolition_price: 0,
    grade_of_finish: 1.1,
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

  //   const [formData, setFormData] = useState<FormDataType>({
  //   title: "",
  //   price: 0,
  //   property_condition: "Nieuw",
  //   current_year: new Date().getFullYear(),
  //   construction_year: new Date().getFullYear(),
  //   renovation: false,
  //   renovation_year: new Date().getFullYear(),
  //   renovation_price: 0,
  //   area: 0,
  //   price_per_m2: 0,
  //   build_price: 0,
  //   demolition_price: 0,
  //   grade_of_finish: 1,
  //   correction_percentage: 0,
  //   house_unusable: false,

  //   // Location
  //   country: "",
  //   province: "",
  //   city: "",
  //   postal_code: 0,
  //   street: "",
  //   street_number: 0,
  //   distance_to_center: 0,
  //   neighborhood_safety: 5,

  //   // Interior
  //   livable_area: 0,
  //   bedrooms: 0,
  //   bedroom_1_area: 0,
  //   bedroom_2_area: 0,
  //   bedroom_3_area: 0,
  //   bedroom_4_area: 0,
  //   bedroom_5_area: 0,
  //   bedroom_6_area: 0,
  //   living_room_area: 0,
  //   veranda: false,
  //   veranda_area: 0,
  //   attic: false,
  //   attic_area: 0,
  //   basement: false,
  //   basement_area: 0,
  //   garage: false,
  //   garage_area: 0,
  //   number_of_garages: 0,
  //   number_of_parking_spaces: 0,
  //   furnished: false,

  //   // Kitchen and sanitary
  //   kitchen_area: 0,
  //   kitchen_equipment: "",
  //   bathrooms: 0,
  //   number_of_shower_cabins: 0,
  //   number_of_baths: 0,
  //   number_of_toilets: 0,

  //   // Energy and environment
  //   epc: "",
  //   heating_type: "",
  //   gas_connection: false,
  //   glass_type: "",
  //   solar_panels: false,
  //   solar_panel_area: 0,

  //   // Equipment
  //   elevator: false,
  //   wheelchair_accessible: false,

  //   // Outdoor space
  //   number_of_facades: 0,
  //   facade_width: 0,
  //   plot_depth: 0,
  //   floor: 0,
  //   number_of_floors: 0,
  //   terrace: false,
  //   terrace_area: 0,
  //   terrace_front_width: 0,
  //   sewer_connection: false,
  //   water_connection: false,
  //   garden: false,
  //   garden_area: 0,
  //   swimming_pool: false,
  //   swimming_pool_area: 0,

  //   // extra
  //   noise_pollution: false,
  //   noise_pollution_type: "",
  //   noise_pollution_level: 0,
  //   smell_pollution: false,
  //   smell_pollution_type: "",
  //   smell_pollution_level: 0,
  //   traffic_pollution: false,
  //   traffic_pollution_type: "",
  //   traffic_pollution_level: 0,
  //   air_pollution: false,
  //   air_pollution_type: "",
  //   air_pollution_level: 0,
  //   special_shapes: false,
  //   special_shapes_type: "",
  //   special_shapes_level: 0,
  //   special_colors: false,
  //   special_colors_type: "",
  //   special_colors_level: 0,
  //   special_materials: false,
  //   special_materials_type: "",
  //   special_materials_level: 0,

  //   source: "ImmoGen",
  // });

  //     const [formData, setFormData] = useState<FormDataType>({
  //   title: "",
  //   price: 0,
  //   property_condition: "Nieuw",
  //   current_year: new Date().getFullYear(),
  //   construction_year: 1850,
  //   renovation: true,
  //   renovation_year: 2015,
  //   renovation_price: 0,
  //   area: 20,
  //   price_per_m2: 300,
  //   build_price: 1600,
  //   demolition_price: 0,
  //   grade_of_finish: 0.5,
  //   correction_percentage: 0,
  //   house_unusable: false,

  //   // Location
  //   country: "België",
  //   province: "Oost-Vlaanderen",
  //   city: "Gent",
  //   postal_code: 9000,
  //   street: "Sint-Lievenspoortstraat",
  //   street_number: 168,
  //   distance_to_center: 1,
  //   neighborhood_safety: 5,

  //   // Interior
  //   livable_area: 60,
  //   bedrooms: 1,
  //   bedroom_1_area: 15,
  //   bedroom_2_area: 0,
  //   bedroom_3_area: 0,
  //   bedroom_4_area: 0,
  //   bedroom_5_area: 0,
  //   bedroom_6_area: 0,
  //   living_room_area: 20,
  //   veranda: false,
  //   veranda_area: 0,
  //   attic: false,
  //   attic_area: 0,
  //   basement: false,
  //   basement_area: 0,
  //   garage: false,
  //   garage_area: 0,
  //   number_of_garages: 0,
  //   number_of_parking_spaces: 0,
  //   furnished: false,

  //   // Kitchen and sanitary
  //   kitchen_area: 15,
  //   kitchen_equipment: "",
  //   bathrooms: 1,
  //   number_of_shower_cabins: 1,
  //   number_of_baths: 0,
  //   number_of_toilets: 1,

  //   // Energy and environment
  //   epc: "",
  //   heating_type: "",
  //   gas_connection: true,
  //   glass_type: "",
  //   solar_panels: false,
  //   solar_panel_area: 0,

  //   // Equipment
  //   elevator: false,
  //   wheelchair_accessible: false,

  //   // Outdoor space
  //   number_of_facades: 1,
  //   facade_width: 4,
  //   plot_depth: 4,
  //   floor: 0,
  //   number_of_floors: 3,
  //   terrace: false,
  //   terrace_area: 0,
  //   terrace_front_width: 0,
  //   sewer_connection: true,
  //   water_connection: true,
  //   garden: false,
  //   garden_area: 0,
  //   swimming_pool: false,
  //   swimming_pool_area: 0,

  //   // extra
  //   noise_pollution: false,
  //   noise_pollution_type: "",
  //   noise_pollution_level: 0,
  //   smell_pollution: false,
  //   smell_pollution_type: "",
  //   smell_pollution_level: 0,
  //   traffic_pollution: false,
  //   traffic_pollution_type: "",
  //   traffic_pollution_level: 0,
  //   air_pollution: false,
  //   air_pollution_type: "",
  //   air_pollution_level: 0,
  //   special_shapes: false,
  //   special_shapes_type: "",
  //   special_shapes_level: 0,
  //   special_colors: false,
  //   special_colors_type: "",
  //   special_colors_level: 0,
  //   special_materials: false,
  //   special_materials_type: "",
  //   special_materials_level: 0,

  //   source: "ImmoGen",
  // });

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

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const correctionPercentage = calculateCorrectionPercentage(formData);
      
      formData.correction_percentage = correctionPercentage;

      // Formuleprijs berekenen - GEEN ABEX meer nodig!
      const priceInput: PriceInput = {
        constructionYear: Number(formData.construction_year),
        currentYear: Number(formData.current_year),
        landArea: Number(formData.area),
        landPricePerM2: Number(formData.price_per_m2),
        livingArea: Number(formData.livable_area),
        buildCostPerM2: Number(formData.build_price),
        finishQuality: Number(formData.grade_of_finish),
        // ABEX velden worden niet meer gebruikt in de berekening
        abexCurrent: 0, // Placeholder, wordt niet gebruikt
        abexLastRenovation: 0, // Placeholder, wordt niet gebruikt
        correctionPercentage: Number(correctionPercentage),
        houseUnusable: false,
        // Nieuwe velden voor renovatie
        hasRenovation: formData.renovation === true,
        renovationYear: formData.renovation ? Number(formData.renovation_year) : undefined,
      };

      const formulaResult = calculatePrice(priceInput);
      setFormulaResult(formulaResult);
      setFormulaPrice(formulaResult.totalCorrected);
      formData.price = formulaResult.totalCorrected;

      const token = localStorage.getItem("token");
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
        return <ApartmentForm formData={formData} handleChange={handleChange} />;
      case "Bouwgrond":
        return <BuildingPlotForm formData={formData} handleChange={handleChange} />;
      case "Duplex":
        return <DuplexForm formData={formData} handleChange={handleChange} />;
      case "Handelspand":
        return <CommercialPropertyForm formData={formData} handleChange={handleChange} />;
      case "Huis":
        return <HouseForm formData={formData} handleChange={handleChange} />;
      case "Kantoor":
        return <OfficeForm formData={formData} handleChange={handleChange} />;
      case "Villa":
        return <VillaForm formData={formData} handleChange={handleChange} />;
      case "Garage":
        return <GarageForm formData={formData} handleChange={handleChange} />;
      case "Hut":
        return <CabinForm formData={formData} handleChange={handleChange} />;
      case "Grond":
        return <GroundForm formData={formData} handleChange={handleChange} />;
             
      default:
        return null;
    }
  }, [selectedType, formData, handleChange]);

    // Voeg bovenaan toe in je PriceCalculator component
  const [searchTerm, setSearchTerm] = useState<string>("");
  const houseTypes = [
    { value: "Appartement", label: "Appartement", img: "/appartement.png" },
    { value: "Huis", label: "Huis", img: "/house.png" },
    { value: "Villa", label: "Villa", img: "/villa.png" },
    { value: "Duplex", label: "Duplex", img: "/duplex.png" },
    { value: "Kantoor", label: "Kantoor", img: "/office.png" },
    { value: "Handelspand", label: "Handelspand", img: "/office2.png" },
    { value: "Bouwgrond", label: "Bouwgrond", img: "/shovel.png" },
    { value: "Hut", label: "Hut", img: "/cabin.png" },
    { value: "Garage", label: "Garage", img: "/garage.png" },
    { value: "Grond", label: "Grond", img: "/ground.png" },
    { value: "Overig", label: "Overig", img: "/more.png" }, // Voeg een 'Overig' type toe
    // Voeg meer types toe indien gewenst
  ];

  const filteredHouseTypes = houseTypes.filter(type =>
    type.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard">
      {showOverlay && (<div className={`dashboard-bg-fade ${overlayTheme}`}></div>)}
      <div className={`dashboard-bg-fade ${isDarkTheme ? "dark" : "light"}`}></div>
      <Sidebar />
      <main className="main-content">
        <Header title="Calculator" user={user || undefined} onUserClick={() => setShowUserField(true)}/>

        <div className="content-wrapper">
          <div className="bottom-section">
            <div className="form">
              <form onSubmit={handleSubmit}>
                {/* Algemene Informatie */}
                <div className="type-select-container">
                  <div className="type-search-container">
                    <h2 className="form-type-title">Type</h2>
                    <input
                    type="text"
                    placeholder="Zoek type..."
                    className="type-search-input"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="type-select-row">
                    {(() => {
                      // Altijd 3 tonen: de eerste 3 gefilterde types, tenzij selectedType niet in die 3 zit, dan vervang de laatste door selectedType
                      let typesToShow = filteredHouseTypes.slice(0, 3);
                      if (
                        selectedType &&
                        !typesToShow.some(type => type.value === selectedType)
                      ) {
                        // Vervang de laatste met selectedType (indien die bestaat in houseTypes)
                        const selected = houseTypes.find(type => type.value === selectedType);
                        if (selected) {
                          typesToShow = [...typesToShow.slice(0, 2), selected];
                        }
                      }
                      // Remove duplicates by value
                      typesToShow = typesToShow.filter(
                        (type, idx, arr) => arr.findIndex(t => t.value === type.value) === idx
                      );
                      return typesToShow.map(type => (
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
                      ));
                    })()}
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded mt-4"
                  >
                    Bereken Prijs
                  </button>
                </div>
                
                {selectedType && (
                  <>
                    {renderForm()}
                  </>
                )}
              </form>
            </div>

            <div className="right-panel">
              <CalculationFields
                formulaResult={formulaResult} 
                formulaPrice={formulaPrice}
                result={result}
                formData={formData}
              />
            </div>
          </div>
        </div>
      </main>
        <UserField open={showUserField}  onClose={() => setShowUserField(false)} />
    </div>
  );
};

export default PriceCalculator;
