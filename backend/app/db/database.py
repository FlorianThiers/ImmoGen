from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv() 

# Haal de database-URL op uit de omgevingsvariabelen
DATABASE_URL = os.getenv("DATABASE_URL", int(os.getenv("DATABASE_URL")))

# Maak de engine aan
engine = create_engine(DATABASE_URL)

# Maak een sessionmaker aan
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base voor modellen
Base = declarative_base()

# Dependency om een database-sessie te verkrijgen
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()