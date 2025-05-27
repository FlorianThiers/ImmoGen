from app.db.database import Base, engine
from app.models.house import ScrapeHouse
from app.models.house import EstimatedHouse
from app.models.user import User

def init_db():
    print("Initialiseren van de database...")
    Base.metadata.create_all(bind=engine)
    print("Database succesvol geïnitialiseerd!")

if __name__ == "__main__":
    init_db()