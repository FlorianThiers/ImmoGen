import os
import sys
import pickle
import pandas as pd


from app.AI.Models.model_loader import load_model

def ai_price(data, model, scaler, features, dummy_columns):
    """Bereken woningprijs met AI model.""" 
    try:
        print(f"📥 Data ontvangen voor AI prijsberekening: {data}")
        if model is None or scaler is None:
            print("❌ Model of scaler is None. Trying to load them.")
            model, scaler, features, dummy_columns = load_model()
            if model is None or scaler is None:
                print("❌ Model or scaler could not be loaded.")
                return None

        input_df = pd.DataFrame([data])

        # Converteer categorische kolommen naar dummy-variabelen
        categorical_columns = ['title', 'country', 'province', 'city', 'street', 'property_condition', 'kitchen_equipment', 'heating_type', 'glass_type', 'epc']
        input_df = pd.get_dummies(input_df, columns=categorical_columns, drop_first=True)

        # Voeg ontbrekende dummy-variabelen toe
        for col in dummy_columns:
            if col not in input_df.columns:
                input_df[col] = 0

        # Verwijder extra kolommen
        input_df = input_df[dummy_columns]

        # Debugging: Controleer ontbrekende en extra kolommen
        print(f"✅ Kolommen in input_df: {input_df.columns.tolist()}")

        # Normaliseer de features
        try:
            input_scaled = scaler.transform(input_df)
            print(f"✅ Genormaliseerde features: {input_scaled}")
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