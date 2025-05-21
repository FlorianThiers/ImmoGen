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
    
    try:
        # Haal data op uit de database
        print("📥 Fetching data from database...")
        df = fetch_data_from_db(db)
        print(f"✅ Data fetched: {df.shape if not df.empty else 'Empty DataFrame'}")
        
        if df.empty:
            print("❌ Geen data beschikbaar voor training")
            return False
        
        # # Debug: Print column names
        # print(f"🔍 Available columns in DataFrame: {list(df.columns)}")
        # print(f"🔍 DataFrame shape: {df.shape}")
        # print(f"🔍 DataFrame dtypes:\n{df.dtypes}")
        
        # Filter invalid data
        print("🧹 Filtering invalid data...")
        initial_count = len(df)
        df = df.dropna(subset=['price', 'area'])
        df = df[df['price'] > 0]
        print(f"✅ Filtered data: {initial_count} -> {len(df)} rows")
        
        # Check if there is enough data for training
        if len(df) < 10:
            print(f"❌ Insufficient data for training: {len(df)} rows")
            # Add synthetic data if necessary
            df = add_synthetic_data(df)
            print(f"✅ After synthetic data: {len(df)} rows")
            
        # Prepare features and target
        if not features:
            features = SCRAPE_FEATURES

        features = [f for f in SCRAPE_FEATURES if f != "price"]
        # print("🔍 Features passed to model:", features)
        
        # Check which features actually exist in the DataFrame
        available_features = [f for f in features if f in df.columns]
        missing_features = [f for f in features if f not in df.columns]
        
        # print(f"✅ Available features ({len(available_features)}): {available_features}")
        if missing_features:
            print(f"⚠️ Missing features ({len(missing_features)}): {missing_features}")
        
        # Use only available features
        if not available_features:
            print("❌ No valid features found in DataFrame")
            return False
            
        print(f"🎯 Selecting features from DataFrame...")
        X = df[available_features].fillna(0)
        # print(f"✅ Features selected: {X.shape}")
        
        print(f"🎯 Selecting target variable...")
        y = df['price']
        # print(f"✅ Target selected: {y.shape}")
        
        print(f"✅ Data voor training: {X.shape[0]} rows, {X.shape[1]} columns")

        categorical_columns = [
            'title', 'country', 'province', 'city', 'street',
            'property_condition', 'kitchen_equipment', 'epc',
            'heating_type', 'glass_type', 'source', 'veranda',
            'attic', 'basement', 'garage', 'furnished',
            'elevator', 'wheelchair_accessible', 'solar_panels',
            'terrace', 'sewer_connection', 'water_connection',
            'gas_connection', 'swimming_pool', 'garden'
        ]      

        # Filter categorical columns to only include those that exist in X
        available_categorical = [col for col in categorical_columns if col in X.columns]
        # print(f"🔍 Available categorical columns: {available_categorical}")

        # Converteer categorische kolommen naar numerieke waarden
        print("🔄 Creating dummy variables...")
        X = pd.get_dummies(X, columns=available_categorical, drop_first=True)
        X = X.fillna(0)
        print(f"✅ After dummy encoding: {X.shape}")
        
        # Sla de gegenereerde kolomnamen op
        dummy_columns = X.columns.tolist()

        print("🔍 Checking for NaNs or Infs in input:")
        nan_count = X.isnull().sum().sum()
        inf_count = (X == float("inf")).sum().sum()
        print(f"NaN count: {nan_count}, Inf count: {inf_count}")
        
        if nan_count > 0:
            print("⚠️ NaN columns:", X.isnull().sum()[X.isnull().sum() > 0])
        
        # Replace any remaining NaNs and Infs
        X = X.replace([float('inf'), float('-inf')], 0).fillna(0)
        # Vervang string 'None' waarden
        X = X.replace(['None', 'null', 'NULL', 'nan', 'NaN', '', 'none'], 0)

        # Forceer alle kolommen naar numeric
        for col in X.columns:
            X[col] = pd.to_numeric(X[col], errors='coerce').fillna(0)
            

        # Normalize features
        print("📊 Normalizing features...")
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        print("✅ Features normalized")

        # Train-test split
        print("🔀 Splitting data...")
        X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
        print(f"✅ Train: {X_train.shape}, Test: {X_test.shape}")

        # Train the model
        print("🚀 Training RandomForest model...")
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        print("✅ Model trained")

        # Evaluate the model
        score = model.score(X_test, y_test)
        print(f"📈 Model R² score: {score:.4f}")

        try:    
            # Save the model
            print("💾 Saving model...")
            with open(model_path, 'wb') as f:
                pickle.dump((model, scaler, available_features, dummy_columns), f)
            print(f"✅ Model saved at {model_path}")
            return True
        except Exception as e:
            print(f"❌ Error saving the model: {e}")
            return False
            
    except Exception as e:
        print(f"❌ Error during training: {e}")
        import traceback
        traceback.print_exc()
        return False