import requests
import time
from typing import Dict, Optional
from fastapi import APIRouter
import logging

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
            # time.sleep(1.1)
            
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