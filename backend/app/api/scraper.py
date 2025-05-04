from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.AI.Models.immoVlanScraper import scrap_houses

router = APIRouter()

@router.post("/scrape")
def start_scraping(db: Session = Depends(get_db)):
    """
    Start het scrapen van woningdata en sla deze op in de database.
    """
    try:
        scrap_houses(db, max_pages=5)  # Pas het aantal pagina's aan indien nodig
        return {"message": "Scraping voltooid en data opgeslagen in de database."}
    except Exception as e:
        return {"error": str(e)}