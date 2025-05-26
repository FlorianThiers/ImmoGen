from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.house import EstimatedHouse
from app.AI.Models.ai_price import ai_price
from app.AI.Models.model_loader import load_model
from app.AI.Models.geoLocation import geocode_address
from app.config import APP_FEATURES


router = APIRouter()

@router.post("/calculate-price")
def calculate_price(house_data: dict, db: Session = Depends(get_db)):
    try:
        model, scaler, features, dummy_columns = load_model()
        # print(f"✅ Schaalverhouding geladen: {scaler}")  # Log de scaler
        # print(f"✅ Features geladen: {features}")  # Log de features
        result = ai_price(house_data, model, scaler, features, dummy_columns)  # Bereken de prijs
        print(f"✅ Berekeningsresultaat: {result}")  # Log het resultaat

        if result:
            update_estimated_price(db, house_data, result)
            
        update_lon_lat(db, house_data)

        return result
    except Exception as e:
        print(f"❌ Fout bij het berekenen van de prijs: {e}")  # Log de fout
        import traceback
        traceback.print_exc()  # Print de volledige traceback voor debugging
        raise HTTPException(status_code=500, detail=f"Fout bij het berekenen van de prijs: {str(e)}")
    
def update_estimated_price(db: Session, house_data, estimated_price: float):
    """Update or insert the estimated price for a house in the database."""

    flat_data = {
        key: val for key, val in house_data.items()
        if key in EstimatedHouse.__table__.columns.keys() and not isinstance(val, dict)
    }
    house = EstimatedHouse(**flat_data, ai_price=estimated_price)

    db.add(house)
    print("🆕 New EstimatedHouse added")
    
    db.commit()
    return True

def update_lon_lat(db: Session, house_data):
    """Update the longitude and latitude for a house in the database."""
    # get the dorp_postcode from house_data
    country = house_data.get("country", "")
    province = house_data.get("province", "")
    city = house_data.get("city", "")
    postalcode = house_data.get("postal_code", "")
    street = house_data.get("street", "")
    street_number = house_data.get("street_number", "")

    full_address = f"{country}, {province}, {city}, {postalcode}, {street} {street_number}"
    geo = geocode_address(full_address)
    if geo:
        latitude = geo["lat"]
        longitude = geo["lon"]
        print(f"✅ Geocode gevonden: {latitude}, {longitude}")
    else:
        latitude = None
        longitude = None

    flat_data = {
        key: val for key, val in house_data.items()
        if key in EstimatedHouse.__table__.columns.keys() and not isinstance(val, dict)
    }
    house = EstimatedHouse(**flat_data, latitude=latitude, longitude=longitude)
    db.add(house)
    print("🆕 New EstimatedHouse added with geo data")

    db.commit()
    return True

