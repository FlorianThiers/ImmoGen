from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.house import ScrapeHouse
from app.AI.Models.model_loader import load_model
import pandas as pd

router = APIRouter()


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
    




