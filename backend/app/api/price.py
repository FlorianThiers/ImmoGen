from fastapi import APIRouter, Depends, HTTPException
from app.security.auth import get_current_user
from app.models.user import User
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.house import EstimatedHouse
from app.AI.Models.ai_price import ai_price
from app.AI.Models.model_loader import load_model
from app.AI.Models.geoLocation import geocode_address
from app.config import APP_FEATURES


router = APIRouter()

@router.post("/calculate-price")
def calculate_price(
    house_data: dict, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        model, scaler, features, dummy_columns = load_model()
        # print(f"✅ Schaalverhouding geladen: {scaler}")  # Log de scaler
        # print(f"✅ Features geladen: {features}")  # Log de features
        result = ai_price(house_data, model, scaler, features, dummy_columns)
        print(f"✅ Berekeningsresultaat: {result}")

        if result:
            update_price_and_geo(db, house_data, result, current_user.id)

        return result
    except Exception as e:
        print(f"❌ Fout bij het berekenen van de prijs: {e}")  # Log de fout
        import traceback
        traceback.print_exc()  # Print de volledige traceback voor debugging
        raise HTTPException(status_code=500, detail=f"Fout bij het berekenen van de prijs: {str(e)}")
    
def update_price_and_geo(db: Session, house_data, estimated_price: float, user_id: int):
    """Update or insert the estimated price and the longitude and latitud for a house in the database."""

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
    house = EstimatedHouse(**flat_data, ai_price=estimated_price, latitude=latitude, longitude=longitude, user_id=user_id)

    db.add(house)
    print("🆕 New EstimatedHouse added")
    
    db.commit()
    return True

