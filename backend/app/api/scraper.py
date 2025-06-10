from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from app.models.user import User
from app.db.database import get_db
from app.AI.Models.immoVlanScraper import scrap_houses
from app.security.auth import get_current_user


router = APIRouter()

@router.post("/scrape")
async def start_scraping(request: Request, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Start het scrapen van woningdata en sla deze op in de database.
    """
    # if not current_user.is_admin:
    #     raise HTTPException(status_code=403, detail="Forbidden")
    # if limit < 1 or limit > 1000:
    #     raise HTTPException(status_code=400, detail="Limit out of range")
    try:
        data = await request.json()
        max_pages = int(data.get("max_pages", 1))
        scrap_houses(db, max_pages=max_pages)
        return {"message": f"Scraping voltooid en data opgeslagen in de database ({max_pages} pagina's)."}
    except Exception as e:
        return {"error": str(e)}