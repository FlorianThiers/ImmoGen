from sqlalchemy.orm import Session
import pandas as pd
from app.models.house import ScrapeHouse

def estimate_distance_to_center(location):
    if "Gent" not in location:
        return 5.0
    elif "centrum" in location.lower():
        return 0.5
    return 2.5

def estimate_neighborhood_safety(location):
    if "centrum" in location.lower():
        return 7
    elif "gentbrugge" in location.lower():
        return 8
    return 7

def fetch_data_from_db(db: Session):
    """Haal data op uit de database en zet deze om naar een Pandas DataFrame."""
    houses = db.query(ScrapeHouse).all()
    data = [
        {
            "id": house.id,
            "title": house.title,
            "price": house.price,
            "property_condition": house.property_condition,
            "construction_year": house.construction_year,


            "country": house.country,
            "province": house.province,
            "city": house.city,
            "postal_code": house.postal_code,
            "street": house.street,
            "street_number": house.street_number,
            "distance_to_center": house.distance_to_center,
            "neighborhood_safety": house.neighborhood_safety,


            "bedrooms": house.bedrooms,
            "bedroom_1_area": house.bedroom_1_area,
            "bedroom_2_area": house.bedroom_2_area,
            "bedroom_3_area": house.bedroom_3_area,
            "bedroom_4_area": house.bedroom_4_area,
            "bedroom_5_area": house.bedroom_5_area,
            "bedroom_6_area": house.bedroom_6_area,
            "area": house.area,
            "livable_area": house.livable_area,
            "living_room_area": house.living_room_area,
            "veranda": house.veranda,
            "veranda_area": house.veranda_area,
            "attic": house.attic,
            "attic_area": house.attic_area,
            "basement": house.basement,
            "basement_area": house.basement_area,
            "garage": house.garage,
            "garage_area": house.garage_area,
            "number_of_garages": house.number_of_garages,
            "number_of_parking_spaces": house.number_of_parking_spaces,
            "furnished": house.furnished,

            "kitchen_area": house.kitchen_area,
            "kitchen_equipment": house.kitchen_equipment,
            "bathrooms": house.bathrooms,
            "number_of_shower_cabins": house.number_of_shower_cabins,
            "number_of_baths": house.number_of_baths,
            "number_of_toilets": house.number_of_toilets,

            "epc": house.epc,
            "heating_type": house.heating_type,
            "glass_type": house.glass_type,
            "solar_panels": house.solar_panels,
            "solar_panel_area": house.solar_panel_area,

            "elevator": house.elevator,
            "wheelchair_accessible": house.wheelchair_accessible,
            
            "number_of_facades": house.number_of_facades,
            "facade_width": house.facade_width,
            "floor": house.floor,
            "number_of_floors": house.number_of_floors,
            "terrace": house.terrace,
            "terrace_area": house.terrace_area,
            "plot_depth": house.plot_depth,
            "terrace_front_width": house.terrace_front_width,
            "sewer_connection": house.sewer_connection,
            "water_connection": house.water_connection,
            "gas_connection": house.gas_connection,
            "swimming_pool": house.swimming_pool,
            "swimming_pool_area": house.swimming_pool_area,
            "garden": house.garden,
            "garden_area": house.garden_area,

            "source": house.source,
        }
        for house in houses
    ]
    return pd.DataFrame(data)