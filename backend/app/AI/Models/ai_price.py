import os
import sys
import pickle
import pandas as pd
import numpy as np



from app.AI.Models.model_loader import load_model

def ai_price(data, model, scaler, features, dummy_columns):
    """Bereken woningprijs met AI model.""" 
    try:
        # print(f"📥 Data ontvangen voor AI prijsberekening: {data}")
        if model is None or scaler is None:
            print("❌ Model of scaler is None. Trying to load them.")
            model, scaler, features, dummy_columns = load_model()
            if model is None or scaler is None:
                print("❌ Model or scaler could not be loaded.")
                return None

        # ULTRA OPTIMALISATIE: Maak direct een DataFrame met alle verwachte kolommen
        # Dit is veel sneller dan dummy encoding + kolom manipulaties
        
        # Maak een lege array met de juiste vorm
        feature_array = np.zeros(len(dummy_columns))
        
        # Maak een mapping van kolom naam naar index voor snelle lookup
        col_to_idx = {col: idx for idx, col in enumerate(dummy_columns)}
        
        # Vul numerieke waarden direct in
        for key, value in data.items():
            if key in ['price', 'id']:  # Skip deze
                continue
                
            # Voor categorische waarden, zoek de juiste dummy kolom
            if key in ['title', 'country', 'province', 'city', 'street', 'property_condition', 'kitchen_equipment', 'heating_type', 'glass_type', 'epc', 'source']:
                dummy_col = f"{key}_{value}"
                if dummy_col in col_to_idx:
                    feature_array[col_to_idx[dummy_col]] = 1
            else:
                # Voor numerieke/boolean waarden
                if key in col_to_idx:
                    feature_array[col_to_idx[key]] = float(value) if value is not None else 0.0
        
        # Maak DataFrame met juiste kolom namen
        input_df = pd.DataFrame([feature_array], columns=dummy_columns)

        # Normaliseer de features
        try:
            input_scaled = scaler.transform(input_df)
        except Exception as e:
            print(f"❌ Fout bij het normaliseren van de features: {e}")
            return None
        
        # Voorspel de prijs
        voorspelde_prijs = model.predict(input_scaled)[0]
        print(f"✅ Voorspelde prijs: {voorspelde_prijs}")

        return round(voorspelde_prijs, 2)
    
    except Exception as e:
        print(f"❌ Fout bij het berekenen van de prijs: {e}")
        import traceback
        traceback.print_exc()
        return None