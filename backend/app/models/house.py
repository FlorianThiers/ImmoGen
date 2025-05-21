from sqlalchemy import Column, Integer, String, Float, Boolean, UniqueConstraint
from app.db.database import Base

class ScrapeHouse(Base):
    __tablename__ = "scrape_houses"
    # __table_args__ = (UniqueConstraint('title', 'location', name='unique_house'),)

    # General
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    price = Column(Integer, nullable=True, default=None)
    property_condition = Column(String(255), nullable=True)
    construction_year = Column(Integer, nullable=True)

    # Location
    country = Column(String(255), nullable=False)
    province = Column(String(255), nullable=False)
    city = Column(String(255), nullable=False)
    postal_code = Column(String(255), nullable=False)
    street = Column(String(255), nullable=False)
    street_number = Column(String(255), nullable=False)
    distance_to_center = Column(Float, nullable=False)
    neighborhood_safety = Column(Integer, nullable=False)

    # Interior
    bedrooms = Column(Integer, nullable=True)
    bedroom_1_area = Column(Float, nullable=True)
    bedroom_2_area = Column(Float, nullable=True)
    bedroom_3_area = Column(Float, nullable=True)
    bedroom_4_area = Column(Float, nullable=True)
    bedroom_5_area = Column(Float, nullable=True)
    bedroom_6_area = Column(Float, nullable=True)
    area = Column(Float, nullable=True)
    livable_area = Column(Float, nullable=True)
    living_room_area = Column(Float, nullable=True)
    veranda = Column(Boolean, nullable=True)
    veranda_area = Column(Float, nullable=True)
    attic = Column(Boolean, nullable=True)
    attic_area = Column(Float, nullable=True)
    basement = Column(Boolean, nullable=True)
    basement_area = Column(Float, nullable=True)
    garage = Column(Boolean, nullable=True)
    garage_area = Column(Float, nullable=True)
    number_of_garages = Column(Integer, nullable=True)
    number_of_parking_spaces = Column(Integer, nullable=True)
    furnished = Column(Boolean, nullable=True)

    # Kitchen and sanitary
    kitchen_area = Column(Float, nullable=True)
    kitchen_equipment = Column(String(255), nullable=True)
    bathrooms = Column(Integer, nullable=True)
    number_of_shower_cabins = Column(Integer, nullable=True)
    number_of_baths = Column(Integer, nullable=True)
    number_of_toilets = Column(Integer, nullable=True)

    # Energy and environment
    epc = Column(String(255), nullable=True)
    heating_type = Column(String(255), nullable=True)
    glass_type = Column(String(255), nullable=True)
    solar_panels = Column(Boolean, nullable=True)
    solar_panel_area = Column(Float, nullable=True)

    # Equipment
    elevator = Column(Boolean, nullable=True)
    wheelchair_accessible = Column(Boolean, nullable=True)

    # Outdoor space
    number_of_facades = Column(Integer, nullable=True)
    facade_width = Column(Float, nullable=True)
    floor = Column(Integer, nullable=True)
    number_of_floors = Column(Integer, nullable=True)
    terrace = Column(Boolean, nullable=True)
    terrace_area = Column(Float, nullable=True)
    plot_depth = Column(Float, nullable=True)
    terrace_front_width = Column(Float, nullable=True)
    sewer_connection = Column(Boolean, nullable=True)
    water_connection = Column(Boolean, nullable=True)
    gas_connection = Column(Boolean, nullable=True)
    swimming_pool = Column(Boolean, nullable=True)
    swimming_pool_area = Column(Float, nullable=True)
    garden = Column(Boolean, nullable=True)
    garden_area = Column(Float, nullable=True)

    source = Column(String(255), nullable=False)

class EstimatedHouse(Base):
    __tablename__ = "estimated_houses"

    # General
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    price = Column(Integer, nullable=True, default=None)
    property_condition = Column(String(255), nullable=True)
    construction_year = Column(Integer, nullable=True)

    # Location
    country = Column(String(255), nullable=False)
    province = Column(String(255), nullable=False)
    city = Column(String(255), nullable=False)
    postal_code = Column(String(255), nullable=False)
    street = Column(String(255), nullable=False)
    street_number = Column(String(255), nullable=False)
    distance_to_center = Column(Float, nullable=False)
    neighborhood_safety = Column(Integer, nullable=False)

    # Interior
    bedrooms = Column(Integer, nullable=True)
    bedroom_1_area = Column(Float, nullable=True)
    bedroom_2_area = Column(Float, nullable=True)
    bedroom_3_area = Column(Float, nullable=True)
    bedroom_4_area = Column(Float, nullable=True)
    bedroom_5_area = Column(Float, nullable=True)
    bedroom_6_area = Column(Float, nullable=True)
    area = Column(Float, nullable=True)
    livable_area = Column(Float, nullable=True)
    living_room_area = Column(Float, nullable=True)
    veranda = Column(Boolean, nullable=True)
    veranda_area = Column(Float, nullable=True)
    attic = Column(Boolean, nullable=True)
    attic_area = Column(Float, nullable=True)
    basement = Column(Boolean, nullable=True)
    basement_area = Column(Float, nullable=True)
    garage = Column(Boolean, nullable=True)
    garage_area = Column(Float, nullable=True)
    number_of_garages = Column(Integer, nullable=True)
    number_of_parking_spaces = Column(Integer, nullable=True)
    furnished = Column(Boolean, nullable=True)

    # Kitchen and sanitary
    kitchen_area = Column(Float, nullable=True)
    kitchen_equipment = Column(String(255), nullable=True)
    bathrooms = Column(Integer, nullable=True)
    number_of_shower_cabins = Column(Integer, nullable=True)
    number_of_baths = Column(Integer, nullable=True)
    number_of_toilets = Column(Integer, nullable=True)

    # Energy and environment
    epc = Column(String(255), nullable=True)
    heating_type = Column(String(255), nullable=True)
    glass_type = Column(String(255), nullable=True)
    solar_panels = Column(Boolean, nullable=True)
    solar_panel_area = Column(Float, nullable=True)

    # Equipment
    elevator = Column(Boolean, nullable=True)
    wheelchair_accessible = Column(Boolean, nullable=True)

    # Outdoor space
    number_of_facades = Column(Integer, nullable=True)
    facade_width = Column(Float, nullable=True)
    floor = Column(Integer, nullable=True)
    number_of_floors = Column(Integer, nullable=True)
    terrace = Column(Boolean, nullable=True)
    terrace_area = Column(Float, nullable=True)
    plot_depth = Column(Float, nullable=True)
    terrace_front_width = Column(Float, nullable=True)
    sewer_connection = Column(Boolean, nullable=True)
    water_connection = Column(Boolean, nullable=True)
    gas_connection = Column(Boolean, nullable=True)
    swimming_pool = Column(Boolean, nullable=True)
    swimming_pool_area = Column(Float, nullable=True)
    garden = Column(Boolean, nullable=True)
    garden_area = Column(Float, nullable=True)

    source = Column(String(255), nullable=False)