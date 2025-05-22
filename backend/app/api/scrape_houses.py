import requests
import pandas as pd
import time
from typing import List, Dict, Optional
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.house import ScrapeHouse
from app.AI.Models.model_loader import load_model
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

    
@router.get("/scrape_addresses")
def get_house_addresses(db: Session = Depends(get_db), limit: int = 100):
    try:
        logger.info("Starting to fetch house addresses...")
        
        # Fetch houses from database with limit to avoid overwhelming the geocoding API
        houses = db.query(ScrapeHouse).limit(limit).all()
        
        if not houses:
            logger.warning("No houses found in database")
            return []
        
        logger.info(f"Processing {len(houses)} houses...")
        results = []
        processed_count = 0
        failed_count = 0
        
        for house in houses:
            # Validate required fields
            if not all([house.street, house.street_number, house.city]):
                logger.debug(f"Skipping house {house.id}: missing address components")
                continue
            
            # Build full address
            full_address = f"{house.street} {house.street_number}, {house.postal_code} {house.city}, {house.country}"
            
            # Attempt geocoding
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
                processed_count += 1
            else:
                failed_count += 1
                logger.warning(f"Failed to geocode: {full_address}")
        
        logger.info(f"✅ Successfully processed {processed_count} addresses, {failed_count} failed")
        
        if not results:
            raise HTTPException(
                status_code=404, 
                detail="No addresses could be geocoded. Please check your data or try again later."
            )
        
        return results

    except Exception as e:
        logger.error(f"Error in get_house_addresses: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching addresses: {str(e)}")

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


@router.get("/house_titles")
def get_house_titles(db: Session = Depends(get_db)):
    try:
        # Fetch titles from the database or another source
        titles = list({house.title.split()[0] for house in db.query(ScrapeHouse).all()})
        # Sort alphabetically
        titles.sort()
        # Separate titles with 'nieuwbouw'
        nieuwbouw_titles = [title for title in titles if "nieuwbouw" in title]
        titles = [title for title in titles if "nieuwbouw" not in title]
        
        # Add 'nieuwbouw' versions for titles that originally had it
        titles_with_nieuwbouw = titles + [f"{title} nieuwbouw" for title in nieuwbouw_titles]
        
        return {
            "titles": titles_with_nieuwbouw,
            "nieuwbouw": nieuwbouw_titles
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fout bij het ophalen van woningtypes: {str(e)}")
    
@router.get("/statistics")
def get_statistics(db: Session = Depends(get_db)):
    try:
        # Fetch all house data from the database
        houses = db.query(ScrapeHouse).all()
        if not houses:
            raise HTTPException(status_code=404, detail="Geen data beschikbaar voor analyse.")

        print(f"✅ Aantal woningen in de database: {len(houses)}")

        # Convert database objects to a DataFrame
        data = [
            {
                "title": house.title,
                "price": house.price,
                "property_condition": house.property_condition,
                "construction_year": house.construction_year,

                "country": house.country,
                "province": house.province,
                "city": house.city,
                "postal_code": house.postal_code,
                "street": house.street,
                "street_number": house.street_number,
                "distance_to_center": house.distance_to_center,
                "neighborhood_safety": house.neighborhood_safety,

                "bedrooms": house.bedrooms,
                "bedroom_1_area": house.bedroom_1_area,
                "bedroom_2_area": house.bedroom_2_area,
                "bedroom_3_area": house.bedroom_3_area,
                "bedroom_4_area": house.bedroom_4_area,
                "bedroom_5_area": house.bedroom_5_area,
                "bedroom_6_area": house.bedroom_6_area,
                "area": house.area,
                "livable_area": house.livable_area,
                "living_room_area": house.living_room_area,
                "attic": house.attic,
                "attic_area": house.attic_area,
                "basement": house.basement,
                "basement_area": house.basement_area,
                "garage": house.garage,
                "garage_area": house.garage_area,
                "number_of_garages": house.number_of_garages,
                "number_of_parking_spaces": house.number_of_parking_spaces,
                "furnished": house.furnished,

                "kitchen_area": house.kitchen_area,
                "kitchen_equipment": house.kitchen_equipment,
                "bathrooms": house.bathrooms,
                "number_of_shower_cabins": house.number_of_shower_cabins,
                "number_of_baths": house.number_of_baths,
                "number_of_toilets": house.number_of_toilets,

                "epc": house.epc,
                "heating_type": house.heating_type,
                "glass_type": house.glass_type,
                "elevator": house.elevator,
                "wheelchair_accessible": house.wheelchair_accessible,
                "solar_panels": house.solar_panels,
                "solar_panel_area": house.solar_panel_area,

                "number_of_facades": house.number_of_facades,
                "facade_width": house.facade_width,
                "floor": house.floor,
                "number_of_floors": house.number_of_floors,
                "terrace": house.terrace,
                "terrace_area": house.terrace_area,
                "plot_depth": house.plot_depth,
                "terrace_front_width": house.terrace_front_width,
                "sewer_connection": house.sewer_connection,
                "water_connection": house.water_connection,
                "gas_connection": house.gas_connection,
                "swimming_pool": house.swimming_pool,
                "garden": house.garden,
                "garden_area": house.garden_area,

                "source": house.source,

                
            }
            for house in houses
        ]
        df = pd.DataFrame(data)

        if df.empty:
            raise HTTPException(status_code=404, detail="Geen data beschikbaar voor analyse.")
        
        model, scaler, features, dummy_columns = load_model()
        if model is None:
            raise HTTPException(status_code=500, detail="Model niet beschikbaar voor het berekenen van feature importance.")

        if len(model.feature_importances_) != len(dummy_columns):
            raise HTTPException(status_code=500, detail="Mismatch tussen feature_importances_ en dummy_columns.")
        
        # Bereken feature importance
        try:
            feature_importance = pd.DataFrame({
                "feature": dummy_columns,
                "importance": model.feature_importances_
            }).sort_values("importance", ascending=False)

            # Add correlation with price for each feature
            feature_importance["correlation_with_price"] = feature_importance["feature"].apply(
                lambda feature: df[feature].corr(df["price"]) if feature in df.columns else None
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Fout bij het berekenen van feature importance: {str(e)}")

        # Controleer datatypes en ontbrekende waarden
        print(f"✅ Datatypes in DataFrame: {df.dtypes}")
        print(f"✅ Ontbrekende waarden in DataFrame: {df.isnull().sum()}")

        # Vul ontbrekende waarden in
        df = df.fillna(0)
        # Definieer numerieke kolommen
        numerieke_kolommen = [col for col in df.columns if col != "price" and df[col].dtype in ["int64", "float64"]]

        # Bereken correlaties
        try:
            correlaties = df[numerieke_kolommen + ["price"]].corr()["price"].drop("price").sort_values(ascending=False)
            correlaties = correlaties.fillna(0)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Fout bij het berekenen van correlaties: {str(e)}")

        return {
            "feature_importance": feature_importance.to_dict(orient="records"),
            "correlations": correlaties.to_dict()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fout bij het ophalen van statistieken: {str(e)}")
    




