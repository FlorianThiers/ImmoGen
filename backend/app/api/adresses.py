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
                    "user_id": house.user_id,
                    "address": full_address,
                    "lat": geocode_result["lat"],
                    "lon": geocode_result["lon"],
                    "ai_price": getattr(house, "ai_price", None),
                    "price": house.price,
                    "title": house.title,
                    "city": house.city,
                    "postal_code": house.postal_code,
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