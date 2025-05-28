import time
import logging
import requests

from typing import List, Dict, Optional
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.house import ScrapeHouse, EstimatedHouse
from app.models.user import User
from app.security.auth import get_current_user
from app.AI.Models.geoLocation import geocode_address

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# In-memory cache for geocoding results (consider using Redis in production)
geocoding_cache = {}

def geocode_address(address: str, max_retries: int = 3) -> Optional[Dict]:
    """
    Geocode an address with retry logic and caching
    """
    # Check cache first
    if address in geocoding_cache:
        logger.info(f"Using cached result for: {address}")
        return geocoding_cache[address]
    
    for attempt in range(max_retries):
        try:
            # Add delay to respect rate limits (1 request per second for Nominatim)
            time.sleep(1.1)
            
            response = requests.get(
                "https://nominatim.openstreetmap.org/search",
                params={
                    "q": address,
                    "format": "json",
                    "limit": 1,
                    "addressdetails": 1
                },
                headers={
                    "User-Agent": "ImmoGen/1.0 (your-email@example.com)"  # Replace with your email
                },
                timeout=10
            )
            
            response.raise_for_status()
            data = response.json()
            
            if data:
                result = {
                    "lat": float(data[0]["lat"]),
                    "lon": float(data[0]["lon"]),
                    "display_name": data[0].get("display_name", address)
                }
                # Cache the result
                geocoding_cache[address] = result
                logger.info(f"✅ Geocoded: {address}")
                return result
            else:
                logger.warning(f"⚠️ No results for: {address}")
                # Cache empty result to avoid repeated failed requests
                geocoding_cache[address] = None
                return None
                
        except requests.exceptions.RequestException as e:
            logger.error(f"❌ Request failed for {address} (attempt {attempt + 1}): {e}")
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff
            continue
        except (ValueError, KeyError) as e:
            logger.error(f"❌ Data parsing failed for {address}: {e}")
            break
    
    # Cache failed result
    geocoding_cache[address] = None
    return None

@router.get("/user_house_addresses")
def get_user_addresses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    limit: int = 100
):
    """
    Fetch estimated houses created by a specific user.
    """
    try:
        user_id = current_user.id
        logger.info(f"⏳ Fetching user addresses for user_id={user_id} from database...")

        houses = (
            db.query(EstimatedHouse)
            .filter(EstimatedHouse.user_id == user_id)
            .limit(limit)
            .all()
        )

        if not houses:
            logger.warning(f"⚠️ No houses found in the database for user_id={user_id}.")
            return []

        results = []
        for house in houses:
            if not all([house.street, house.street_number, house.city]):
                continue  # Skip incomplete addresses

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

        logger.info(f"✅ Returning {len(results)} mapped houses for user_id={user_id}.")
        return results

    except Exception as e:
        logger.error(f"❌ Error in get_user_addresses: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching addresses: {str(e)}")
    
@router.get("/immogen_addresses_without_user")
def get_immogen_addresses_without_user(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user), 
    limit: int = 100):
    """
    Fetch estimated houses without a specific user.
    """
    try:
        user_id = current_user.id        
        logger.info(f"⏳ Fetching user addresses for user_id={user_id} from database...")

        houses = (
            db.query(EstimatedHouse)
            .filter(EstimatedHouse.user_id != user_id) 
            .limit(limit)
            .all()
        )
        

        if not houses:
            logger.warning("⚠️ No houses found in the database.")
            return []

        results = []
        for house in houses:
            if not all([house.street, house.street_number, house.city]):
                continue  # Skip incomplete addresses
            
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

        logger.info(f"✅ Returning {len(results)} mapped houses.")
        return results

    except Exception as e:
        logger.error(f"❌ Error in get_immogen_addresses_without_user: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching addresses: {str(e)}")

@router.get("/immogen_addresses")
def get_immogen_addresses(db: Session = Depends(get_db), limit: int = 100):
    try:
        logger.info("⏳ Fetching addresses from database...")

        houses = db.query(EstimatedHouse).limit(limit).all()

        if not houses:
            logger.warning("⚠️ No houses found in the database.")
            return []

        results = []
        for house in houses:
            if not all([house.street, house.street_number, house.city]):
                continue  # Skip incomplete addresses
            
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

        logger.info(f"✅ Returning {len(results)} mapped houses.")
        return results

    except Exception as e:
        logger.error(f"❌ Error in get_immogen_addresses: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching addresses: {str(e)}")

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