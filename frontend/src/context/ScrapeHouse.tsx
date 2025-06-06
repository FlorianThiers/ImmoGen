type ScrapeHouse = {
  id: number;
  title: string;
  price: number;
  property_condition: string;
  construction_year: number;
  
  country: string;
  province: string;
  city: string;
  postal_code: string;
  street: string;
  street_number: string;
  latitude: number;
  longitude: number;
  distance_to_center: number;
  neighborhood_safety: number;
  
  // Interior
  bedrooms: number;
  bedroom_1_area: number;
  bedroom_2_area: number;
  bedroom_3_area: number;
  bedroom_4_area: number;
  bedroom_5_area: number;
  bedroom_6_area: number;
  area: number;
  livable_area: number;
  living_room_area: number;
  veranda: boolean;
  veranda_area: number;
  attic: boolean;
  attic_area: number;
  basement: boolean;
  basement_area: number;
  garage: boolean;
  garage_area: number;
  number_of_garages: number;
  number_of_parking_spaces: number;
  furnished: boolean;
  
  // Kitchen and sanitary
  kitchen_area: number;
  kitchen_equipment: string;
  bathrooms: number;
  number_of_shower_cabins: number;
  number_of_baths: number;
  number_of_toilets: number;
  
  // Energy and environment
  epc: string;
  heating_type: string;
  glass_type: string;
  solar_panels: boolean;
  solar_panel_area: number;
  
  // Equipment
  elevator: boolean;
  wheelchair_accessible: boolean;
  
  // Outdoor space
  number_of_facades: number;
  facade_width: number;
  floor: number;
  number_of_floors: number;
  terrace: boolean;
  terrace_area: number;
  plot_depth: number;
  terrace_front_width: number;
  sewer_connection: boolean;
  water_connection: boolean;
  gas_connection: boolean;
  swimming_pool: boolean;
  swimming_pool_area: number;
  garden: boolean;
  garden_area: number;
  
  source: string;
};

export default ScrapeHouse;