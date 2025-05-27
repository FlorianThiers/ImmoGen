from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import scrape_houses
from app.api import adresses
from app.api import scraper
from app.api import trainer
from app.api import price
from app.api import user


app = FastAPI()

# CORS Configuratie (voor React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],  # Zet hier "http://localhost:5173" voor veiligheid
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API-routes registreren
app.include_router(user.router) # , prefix="/api/v1", tags=["user"]
app.include_router(scrape_houses.router)
app.include_router(adresses.router)
app.include_router(scraper.router)
app.include_router(trainer.router)
app.include_router(price.router)


@app.get("/")
def home():
    return {"message": "ImmoGen API werkt!"}
