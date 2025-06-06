# backend/api/feature_importance.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import numpy as np

router = APIRouter()

class HouseData(BaseModel):
    id: int
    price: Optional[float] = None
    area: Optional[float] = None
    construction_year: Optional[int] = None
    distance_to_center: Optional[float] = None
    neighborhood_safety: Optional[int] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    garden_area: Optional[float] = None
    garage: Optional[bool] = None
    terrace: Optional[bool] = None
    epc: Optional[str] = None
    livable_area: Optional[float] = None
    number_of_facades: Optional[int] = None
    swimming_pool: Optional[bool] = None
    solar_panels: Optional[bool] = None

class FeatureImportanceRequest(BaseModel):
    houses: List[HouseData]

class FeatureImportanceResponse(BaseModel):
    feature: str
    importance: float

def prepare_features(df: pd.DataFrame) -> pd.DataFrame:
    """Prepare features for Random Forest model"""
    # Copy dataframe
    features_df = df.copy()
    
    # Handle missing values
    numeric_columns = ['area', 'construction_year', 'distance_to_center', 
                      'neighborhood_safety', 'bedrooms', 'bathrooms', 
                      'garden_area', 'livable_area', 'number_of_facades']
    
    for col in numeric_columns:
        if col in features_df.columns:
            features_df[col] = features_df[col].fillna(features_df[col].median())
    
    # Handle boolean columns
    boolean_columns = ['garage', 'terrace', 'swimming_pool', 'solar_panels']
    for col in boolean_columns:
        if col in features_df.columns:
            features_df[col] = features_df[col].fillna(False).astype(int)
    
    # Handle EPC (categorical)
    if 'epc' in features_df.columns:
        # EPC mapping naar numerieke waarden (A+ = 1, G = 7)
        epc_mapping = {
            'A+': 1, 'A': 2, 'B': 3, 'C': 4, 'D': 5, 'E': 6, 'F': 7, 'G': 8
        }
        features_df['epc_numeric'] = features_df['epc'].map(epc_mapping).fillna(5)  # Default naar D
        features_df = features_df.drop('epc', axis=1)
    
    # Remove id and price columns for feature matrix
    feature_columns = [col for col in features_df.columns if col not in ['id', 'price']]
    
    return features_df[feature_columns]

@router.post("/feature-importance", response_model=List[FeatureImportanceResponse])
async def calculate_feature_importance(request: FeatureImportanceRequest):
    try:
        # Convert to DataFrame
        houses_data = [house.dict() for house in request.houses]
        df = pd.DataFrame(houses_data)
        
        # Filter houses with prices
        df_with_prices = df[df['price'].notna() & (df['price'] > 0)].copy()
        
        if len(df_with_prices) < 10:
            raise HTTPException(
                status_code=400, 
                detail="Not enough houses with prices for feature importance calculation"
            )
        
        # Prepare features
        X = prepare_features(df_with_prices)
        y = df_with_prices['price']
        
        # Train Random Forest
        rf = RandomForestRegressor(
            n_estimators=100,
            random_state=42,
            max_depth=10,
            min_samples_split=5,
            min_samples_leaf=2
        )
        
        rf.fit(X, y)
        
        # Get feature importance
        feature_names = X.columns.tolist()
        importance_scores = rf.feature_importances_
        
        # Create response
        feature_importance_list = []
        for feature, importance in zip(feature_names, importance_scores):
            # Convert boolean correlation to signed importance
            if feature in ['garage', 'terrace', 'swimming_pool', 'solar_panels']:
                # Calculate if feature has positive or negative impact
                with_feature = df_with_prices[df_with_prices[feature] == 1]['price'].mean()
                without_feature = df_with_prices[df_with_prices[feature] == 0]['price'].mean()
                sign = 1 if with_feature > without_feature else -1
                signed_importance = importance * sign
            else:
                # For continuous variables, use correlation to determine sign
                correlation = df_with_prices[feature].corr(df_with_prices['price'])
                sign = 1 if correlation > 0 else -1
                signed_importance = importance * sign
            
            feature_importance_list.append(
                FeatureImportanceResponse(
                    feature=feature,
                    importance=signed_importance
                )
            )
        
        # Sort by absolute importance and take top 10
        feature_importance_list.sort(key=lambda x: abs(x.importance), reverse=True)
        
        return feature_importance_list[:10]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Feature importance calculation failed: {str(e)}")

# Als je FastAPI app al bestaat, voeg deze router toe:
# app.include_router(router, prefix="/api")