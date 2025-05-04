from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Haal de database-URL op uit de omgevingsvariabelen
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://immogen_user:immogen_password@localhost:3306/immogen")

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