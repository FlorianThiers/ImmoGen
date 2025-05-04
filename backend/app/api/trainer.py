from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.AI.Models.model_training import train_model
from app.config import SCRAPE_FEATURES

router = APIRouter()

@router.post("/train")
def start_training(db: Session = Depends(get_db)):
    """
    Start het trainen van het model.
    """
    try:
        train_model(db, features=SCRAPE_FEATURES)
        return {"message": "Training voltooid en model opgeslagen."}
    except Exception as e:
        return {"error": str(e)}
    