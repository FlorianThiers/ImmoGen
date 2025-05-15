interface BuildingPlotFormProps {
  formData: {
    area?: number;
    livable_area?: number;
    country: string;
    province: string;
    city: string;
    postal_code: number;
    street: string;
    street_number?: number;
  };
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const BuildingPlotForm: React.FC<BuildingPlotFormProps> = ({ formData, handleChange }) => {

  return (
    <div>
      <h2 className="text-xl font-bold mt-4">Algemene Informatie</h2>
      <label>Perceeloppervlakte:</label>
      <input
        type="number"
        name="area"
        value={formData.area || ""}
        onChange={handleChange}
        title="Voer de perceeloppervlakte in"
        placeholder="Perceeloppervlakte"
      />

      <label>Bebouwbare oppervlakte:</label>
      <input
        type="number"
        name="livable_area"
        value={formData.livable_area || ""}
        onChange={handleChange}
        title="Voer de bebouwbare oppervlakte in"
        placeholder="Bebouwbare oppervlakte"
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
    </div>
  );
};

export default BuildingPlotForm;