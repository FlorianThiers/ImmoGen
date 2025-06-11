type FormDataType = {
    [key: string]: any;
    title: string;
    property_condition: string;
    construction_year: number;
    renovation_year: number;
    area: number;
    price_per_m2: number;
    build_price: number;
    renovation_price: number;
    grade_of_finish: number;


    country: string;
    province: string;
    city: string;
    postal_code: number;
    street: string;
    street_number: number;
    distance_to_center: number;
    neighborhood_safety: number;

    livable_area: number;
    living_room_area: number;
    bedrooms: number;
    bedroom_1_area?: number;
    bedroom_2_area?: number;
    bedroom_3_area?: number;
    bedroom_4_area?: number;
    bedroom_5_area?: number;
    bedroom_6_area?: number;
    attic: boolean;
    attic_area: number;
    basement: boolean;
    basement_area: number;
    garage: boolean;
    garage_area: number;
    number_of_garages: number;
    number_of_parking_spaces: number;
    furnished: boolean;

    kitchen_area: number;
    kitchen_equipment: string;
    bathrooms: number;
    number_of_shower_cabins: number;
    number_of_baths: number;
    number_of_toilets: number;

    epc: string;
    heating_type: string;
    glass_type: string;
    solar_panels: boolean;
    solar_panel_area: number;

    elevator: boolean;
    wheelchair_accessible: boolean;

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

    noise_pollution: boolean;
    noise_pollution_type: string;
    noise_pollution_level: number;
    smell_pollution: boolean;
    smell_pollution_type: string;
    smell_pollution_level: number;
    traffic_pollution: boolean;
    traffic_pollution_type: string;
    traffic_pollution_level: number;
    air_pollution: boolean;
    air_pollution_type: string;
    air_pollution_level: number;
    special_shapes: boolean;
    special_shapes_type: string;
    special_shapes_level: number;
    special_colors: boolean;
    special_colors_type: string;
    special_colors_level: number;
    special_materials: boolean;
    special_materials_type: string;
    special_materials_level: number;



    source: string;
};

export default FormDataType;