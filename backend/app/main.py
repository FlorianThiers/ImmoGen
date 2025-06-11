import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import houses
from app.api import adresses
from app.api import scraper
from app.api import trainer
from app.api import price
from app.api import user
from app.api import admin


app = FastAPI()

# CORS Configuratie - voeg je Vercel URL toe
allowed_origins = [
    "http://localhost:5173", 
    "http://localhost:5174",
    "https://immo-gen-olive.vercel.app",  # Vervang dit met je echte Vercel URL
]

# Voor development kun je ook wildcard gebruiken (minder veilig)
if os.getenv("ENVIRONMENT") == "development":
    allowed_origins.append("*")

# CORS Configuratie (voor React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API-routes registreren
app.include_router(user.router) # , prefix="/api/v1", tags=["user"]
app.include_router(houses.router)  # , prefix="/api/v1", tags=["houses"]
app.include_router(adresses.router)
app.include_router(scraper.router)
app.include_router(trainer.router)
app.include_router(price.router)
app.include_router(admin.router)



@app.get("/")
def home():
    return {"message": "ImmoGen API werkt!"}
