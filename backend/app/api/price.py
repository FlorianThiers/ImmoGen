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

        # Update de geschatte prijs in de database
        house_id = house_data.get("id")  # Zorg ervoor dat het ID wordt meegegeven
        if house_id and result:
            update_estimated_price(db, house_id, result["estimated_price"])

        return result
    except Exception as e:
        print(f"❌ Fout bij het berekenen van de prijs: {e}")  # Log de fout
        import traceback
        traceback.print_exc()  # Print de volledige traceback voor debugging
        raise HTTPException(status_code=500, detail=f"Fout bij het berekenen van de prijs: {str(e)}")
    
def update_estimated_price(db: Session, house_id: int, estimated_price: float):
    """Update de geschatte prijs van een huis in de database."""
    house = db.query(EstimatedHouse).filter(EstimatedHouse.id == house_id).first()
    if house:
        house.price = estimated_price
        db.commit()
        return True
    return False