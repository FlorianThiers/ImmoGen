import pandas as pd

from app.AI.Models.immoVlanScraper import scrap_houses
from app.AI.Models.model_loader import load_model
from app.AI.Models.filter_sorting import filter_and_sort_houses

def analyse_specifics(model, features, df=None, house_types=None):
    """Analyseer welke eigenschappen de meeste invloed hebben op de prijs."""
    try:
        if df is None:
            try:
                print("📂 Proberen DataFrame te laden...")
                df = pd.read_csv("app/AI/Models/houseList/woningprijzen.csv")
            except FileNotFoundError:
                print("❌ DataFrame niet gevonden. Proberen te scrapen...")
                df = scrap_houses(df)
                
            if df is None or df.empty:
                print("❌ Geen data beschikbaar voor analyse")
                return None
        
        # Filter and sort the DataFrame if house_types is provided
        if house_types:
            print(f"📊 Filteren en sorteren op types: {house_types}")
            df = filter_and_sort_houses("app/AI/Models/houseList/woningprijzen.csv", house_types)
            print(f"✅ Gefilterde en gesorteerde DataFrame met {len(df)} rijen.")

        if model is None:
            print("📦 Model is None. Proberen te laden...")
            model, scaler, features = load_model()
            if model is None:
                print("❌ Model kon niet worden geladen.")
                return None
        
        # Check if model has feature_importances_
        if not hasattr(model, "feature_importances_"):
            print("❌ Model heeft geen feature_importances_ attribuut.")
            return None
        
        # Gebruik model feature importance
        print("📊 Berekenen van feature importance...")
        feature_importance = pd.DataFrame({
            'feature': features,
            'importance': model.feature_importances_
        }).sort_values('importance', ascending=False)
        print(f"✅ Feature importance berekend:\n{feature_importance}")
        
        # Bereken correlatie met prijs
        print("📈 Berekenen van correlaties...")
        numerieke_kolommen = [col for col in df.columns if col != 'prijs' and df[col].dtype in ['int64', 'float64']]
        correlaties = df[numerieke_kolommen + ['prijs']].corr()['prijs'].drop('prijs').sort_values(ascending=False)
        correlaties = correlaties.fillna(0)
        print(f"✅ Correlaties berekend:\n{correlaties}")

        return {
            'feature_importance': feature_importance,
            'correlaties': correlaties
        }
    except Exception as e:
        print(f"❌ Fout bij het analyseren van specificaties: {e}")
        import traceback
        traceback.print_exc()
        return None

def analyse_specifics_50P(model, features, df=None):
    """Analyseer welke eigenschappen de meeste invloed hebben op de prijs."""
    try:
        if df is None:
            try:
                print("📂 Proberen DataFrame te laden...")
                df = pd.read_csv("app/AI/Models/houseList/woningprijzen_veeel_metpagina.csv")
            except FileNotFoundError:
                print("❌ DataFrame niet gevonden. Proberen te scrapen...")
                df = scrap_houses(df)
                
            if df is None or df.empty:
                print("❌ Geen data beschikbaar voor analyse")
                return None
        
        if model is None:
            print("📦 Model is None. Proberen te laden...")
            model, features = load_model()
            if model is None:
                print("❌ Model kon niet worden geladen.")
                return None
        
        # Check if model has feature_importances_
        if not hasattr(model, "feature_importances_"):
            print("❌ Model heeft geen feature_importances_ attribuut.")
            return None
        
        # Gebruik model feature importance
        print("📊 Berekenen van feature importance...")
        feature_importance = pd.DataFrame({
            'feature': features,
            'importance': model.feature_importances_
        }).sort_values('importance', ascending=False)
        print(f"✅ Feature importance berekend:\n{feature_importance}")
        
        # Bereken correlatie met prijs
        print("📈 Berekenen van correlaties...")
        numerieke_kolommen = [col for col in df.columns if col != 'prijs' and df[col].dtype in ['int64', 'float64']]
        correlaties = df[numerieke_kolommen + ['prijs']].corr()['prijs'].drop('prijs').sort_values(ascending=False)
        correlaties = correlaties.fillna(0)
        print(f"✅ Correlaties berekend:\n{correlaties}")

        return {
            'feature_importance': feature_importance,
            'correlaties': correlaties
        }
    except Exception as e:
        print(f"❌ Fout bij het analyseren van specificaties 50P: {e}")
        import traceback
        traceback.print_exc()
        return None