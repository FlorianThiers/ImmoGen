import os
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from app.db.database import get_db
from app.models.house import ScrapeHouse
from app.models.user import User

from app.models.AdminStats import AdminStats

router = APIRouter()

@router.get("/admin/stats", response_model=AdminStats)
def get_admin_stats(db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    total_scraped_pages = db.query(ScrapeHouse).count() // 20  # Of pas aan als je andere logica hebt

    # Database size query
    db_size_query = text("""
        SELECT 
            ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS size_mb
        FROM information_schema.TABLES
        WHERE table_schema = 'immogen'
    """)

    result = db.execute(db_size_query).fetchone()
    storage_used = f"{result[0]} MB" if result and result[0] else "Onbekend"

    # Dummy systeemstatus (kan je zelf verbeteren)
    system_health = "healthy" if total_users > 0 else "warning"

    return {
        "totalUsers": total_users,
        "totalScrapedPages": total_scraped_pages,
        "lastTrainingDate": "Onbekend",  # Voeg hier eventueel training logic toe
        "systemHealth": system_health,
        "storageUsed": storage_used
    }