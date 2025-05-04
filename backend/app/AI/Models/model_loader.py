import pickle

def load_model(model_path="app/AI/Models/houseList/woningprijs_model.pkl"):
    """Laad een bestaand model."""
    try:
        with open(model_path, 'rb') as f:
            model, scaler, features, dummy_columns = pickle.load(f)
        print(f"✅ Model geladen: {model_path}")
        return model, scaler, features, dummy_columns
    except FileNotFoundError:
        print(f"❌ Model niet gevonden: {model_path}")
        return None, None, None, None
    except Exception as e:
        print(f"❌ Fout bij laden model: {e}")
        return None, None, None, None