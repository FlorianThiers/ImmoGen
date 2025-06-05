from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.house import EstimatedHouse
from app.models.house import ScrapeHouse

router = APIRouter()


@router.get("/houses")
def get_houses(db: Session = Depends(get_db)):
    return db.query(EstimatedHouse).order_by(EstimatedHouse.created_at.desc()).all()

@router.get("/scrape_houses")
def get_houses(db: Session = Depends(get_db)):
    return db.query(ScrapeHouse).order_by(ScrapeHouse).all()