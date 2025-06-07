import axios from "axios";
import React, { useState, useCallback } from "react";

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

import { calculatePrice, PriceInput } from "../../utils/calculator"; 
// import { getAbexValue } from "../../utils/abexCalculator"; 
import "../../pages/Users/dashboard.css"; 
import "../../pages/Users/priceCalculator.css"; 

type FormFieldProps = {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
  result: any;
  setResult: React.Dispatch<React.SetStateAction<any>>;
  formulaPrice: number | null;
  setFormulaPrice: React.Dispatch<React.SetStateAction<number | null>>;
  formulaResult: any;
  setFormulaResult: React.Dispatch<React.SetStateAction<any>>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
};

const FormField: React.FC<FormFieldProps> = ({ formData, setFormData, result, setResult, formulaPrice, setFormulaPrice, formulaResult, setFormulaResult, handleChange }) => {
  const [selectedType, setSelectedType] = useState<string>("");
  
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
    <div className="form">
        <form onSubmit={handleSubmit}>
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
                className={`bg-blue-500 text-white p-2 rounded mt-4${!selectedType ? " opacity-50 cursor-not-allowed" : ""}`}
                onClick={e => {
                    if (!selectedType) {
                        e.preventDefault();
                        alert("Duid eerst een type aan.");
                    }
                }}
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
  );
};

export default FormField;
