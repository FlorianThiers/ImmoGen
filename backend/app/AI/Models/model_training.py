import os
import pickle
import pandas as pd

from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sqlalchemy.orm import Session

from app.AI.Models.synthetic_data import add_synthetic_data
from app.AI.Models.immoVlanScraper import scrap_houses
from app.AI.Models.utils import fetch_data_from_db

from app.config import SCRAPE_FEATURES

model_path = os.path.join(os.getcwd(), "app/AI/Models/houseList/woningprijs_model.pkl")

def train_model(db: Session, features=None):
    """Train een RandomForest model op basis van woningdata."""
    print("🏠 Training model...")
    
    # Haal data op uit de database
    df = fetch_data_from_db(db)
    
    if df.empty:
        print("❌ Geen data beschikbaar voor training")
        return False
    
     # Filter invalid data
    df = df.dropna(subset=['price', 'area'])
    df = df[df['price'] > 0]
    
    # Check if there is enough data for training
    if len(df) < 10:
        print(f"❌ Insufficient data for training: {len(df)} rows")
        # Add synthetic data if necessary
        df = add_synthetic_data(df)
        
    print(f"✅ Data voor training: {len(df)} rows")
    # Prepare features and target
    if not features:
        features = SCRAPE_FEATURES
    X = df[features].fillna(0)
    y = df['price']
    print(f"✅ Data voor training: {X.shape[0]} rows, {X.shape[1]} columns")

    # Converteer categorische kolommen naar numerieke waarden
    X = pd.get_dummies(X, columns=['title', 'country', 'province', 'city', 'street', 'property_condition', 'kitchen_equipment', 'epc', 'heating_type', 'glass_type', 'source'], drop_first=True)

    # Sla de gegenereerde kolomnamen op
    dummy_columns = X.columns.tolist()

    # Normalize features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    print(f"✅ Features: {features}")

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

    # Train the model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate the model
    score = model.score(X_test, y_test)
    print(f"Model R² score: {score:.4f}")

    try:    
        # Save the model
        with open(model_path, 'wb') as f:
            pickle.dump((model, scaler, features, dummy_columns), f)
        print(f"✅ Model saved at {model_path}")
    except Exception as e:
        print(f"❌ Error saving the model: {e}")
