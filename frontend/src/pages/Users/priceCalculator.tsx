import React, { useState } from "react";

import FormDataType from "../../context/formDataType";
import Sidebar from "../../components/SideNavbar";
import Header from "../../components/Header";
import UserField from "../../components/UserField";
import FormField from "../../components/formpage/FormFields";
import CalculationFields from "../../components/formpage/CalculationFields";

import User from "../../context/User";

import "./dashboard.css";
import "./priceCalculator.css";

interface PriceCalculatorProps {
  user?: User | null;
}

const PriceCalculator: React.FC<PriceCalculatorProps> = ({ user }) => {
  const isDarkTheme = useState(
    typeof document !== "undefined" &&
      document.body.classList.contains("dark-theme")
  );
  const showOverlay = useState(false);
  const overlayTheme = useState(isDarkTheme ? "dark" : "light");
  const [showUserField, setShowUserField] = useState(false);

  const [isCalculating, setIsCalculating] = useState(false); // Nieuwe state

  const [result, setResult] = useState(null);
  const [, setSelectedType] = useState<string>("");
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

  return (
    <div className="dashboard">
      {showOverlay && (
        <div className={`dashboard-bg-fade ${overlayTheme}`}></div>
      )}
      <div
        className={`dashboard-bg-fade ${isDarkTheme ? "dark" : "light"}`}
      ></div>
      <Sidebar user={user || undefined} activePage="/price-calculator" />
      <main className="main-content">
        <Header
          title="Prijsberekening"
          user={user || undefined}
          onUserClick={() => setShowUserField(true)}
        />

        <div className="content-wrapper">
          <div className="bottom-section">
            <FormField
              formData={formData}
              setFormData={setFormData}
              result={result}
              setResult={setResult}
              formulaPrice={formulaPrice}
              setFormulaPrice={setFormulaPrice}
              formulaResult={formulaResult}
              setFormulaResult={setFormulaResult}
              handleChange={handleChange}
              setIsCalculating={setIsCalculating}
            />
            <div className="right-panel">
              <CalculationFields
                formulaResult={formulaResult}
                formulaPrice={formulaPrice}
                result={result}
                formData={formData}
                isLoading={isCalculating}
              />
            </div>
          </div>
        </div>
      </main>
      <UserField
        open={showUserField}
        user={user || undefined}
        onClose={() => setShowUserField(false)}
      />
    </div>
  );
};

export default PriceCalculator;
