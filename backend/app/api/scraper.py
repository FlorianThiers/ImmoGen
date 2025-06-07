from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.AI.Models.immoVlanScraper import scrap_houses

router = APIRouter()

@router.post("/scrape")
async def start_scraping(request: Request, db: Session = Depends(get_db)):
    # if not current_user.is_admin:
    #     raise HTTPException(status_code=403, detail="Forbidden")
    # if limit < 1 or limit > 1000:
    #     raise HTTPException(status_code=400, detail="Limit out of range")
    # ...rest van je code...
    """
    Start het scrapen van woningdata en sla deze op in de database.
    """
    try:
        data = await request.json()
        max_pages = int(data.get("max_pages", 1))
        scrap_houses(db, max_pages=max_pages)
        return {"message": f"Scraping voltooid en data opgeslagen in de database ({max_pages} pagina's)."}
    except Exception as e:
        return {"error": str(e)}