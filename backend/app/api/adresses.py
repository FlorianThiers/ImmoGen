from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.house import ScrapeHouse
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/scrape_addresses")
def get_house_addresses(db: Session = Depends(get_db), limit: int = 100):
    try:
        logger.info("⏳ Fetching geocoded houses from database...")

        houses = (
            db.query(ScrapeHouse)
            .filter(ScrapeHouse.latitude.isnot(None), ScrapeHouse.longitude.isnot(None))
            .limit(limit)
            .all()
        )

        if not houses:
            logger.warning("⚠️ No geocoded houses found.")
            return []

        results = []
        for house in houses:
            full_address = f"{house.street} {house.street_number}, {house.postal_code} {house.city}, {house.country}"

            results.append({
                "id": house.id,
                "address": full_address,
                "lat": house.latitude,
                "lon": house.longitude,
                "ai_price": getattr(house, "ai_price", None),
                "price": house.price,
                "title": house.title,
                "area": house.area,
                "bedrooms": house.bedrooms
            })

        logger.info(f"✅ Returning {len(results)} mapped houses.")
        return results

    except Exception as e:
        logger.error(f"❌ Error in get_house_addresses: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching geocoded houses: {str(e)}")


@router.get("/scrape_addresses_batch")
def get_house_addresses_batch(db: Session = Depends(get_db), batch_size: int = 20, offset: int = 0):
    """
    Get addresses in batches to avoid overwhelming the frontend and API
    """
    try:
        logger.info(f"Fetching batch: offset={offset}, batch_size={batch_size}")
        
        houses = db.query(ScrapeHouse).offset(offset).limit(batch_size).all()
        total_count = db.query(ScrapeHouse).count()
        
        if not houses:
            return {
                "addresses": [],
                "total_count": total_count,
                "has_more": False,
                "next_offset": offset
            }
        
        results = []
        for house in houses:
            if not all([house.street, house.street_number, house.city]):
                continue
                
            full_address = f"{house.street} {house.street_number}, {house.postal_code} {house.city}, {house.country}"
            geocode_result = geocode_address(full_address)
            
            if geocode_result:
                results.append({
                    "id": house.id,
                    "address": full_address,
                    "lat": geocode_result["lat"],
                    "lon": geocode_result["lon"],
                    "ai_price": getattr(house, "ai_price", None),
                    "price": house.price,
                    "title": house.title,
                    "area": house.area,
                    "bedrooms": house.bedrooms
                })
        
        has_more = (offset + batch_size) < total_count
        next_offset = offset + batch_size if has_more else offset
        
        return {
            "addresses": results,
            "total_count": total_count,
            "has_more": has_more,
            "next_offset": next_offset,
            "processed_count": len(results)
        }

    except Exception as e:
        logger.error(f"Error in batch processing: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching address batch: {str(e)}")
    
@router.get("/geocoding_status")
def get_geocoding_status():
    """
    Get status of geocoding cache and processing
    """
    return {
        "cached_addresses": len(geocoding_cache),
        "successful_geocodes": len([v for v in geocoding_cache.values() if v is not None]),
        "failed_geocodes": len([v for v in geocoding_cache.values() if v is None])
    }

@router.post("/clear_geocoding_cache")
def clear_geocoding_cache():
    """
    Clear the geocoding cache (useful for development)
    """
    global geocoding_cache
    cache_size = len(geocoding_cache)
    geocoding_cache.clear()
    return {"message": f"Cleared {cache_size} cached entries"}