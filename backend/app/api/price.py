from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.house import EstimatedHouse
from app.AI.Models.ai_price import ai_price
from app.AI.Models.model_loader import load_model
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