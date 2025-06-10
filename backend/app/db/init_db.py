from app.db.database import Base, engine, SessionLocal
from app.models.house import ScrapeHouse
from app.models.house import EstimatedHouse
from app.models.user import User
from sqlalchemy.exc import IntegrityError
from app.security.auth import get_password_hash


def init_db():
    print("Initialiseren van de database...")
    Base.metadata.create_all(bind=engine)
    print("Database succesvol geïnitialiseerd!")

     # Voeg een admin user toe als die nog niet bestaat
    db = SessionLocal()
    try:
        if not db.query(User).filter_by(username="admin").first():
            admin_user = User(
                username="flor",
                email="flor@example.com",
                hashed_password=get_password_hash("flor"),  # Pas aan naar jouw hash-methode
                is_admin=True
            )
            db.add(admin_user)
            db.commit()
            print("Admin user aangemaakt: flor / flor")
        else:
            print("Admin user bestaat al.")
    except IntegrityError:
        db.rollback()
        print("Admin user bestaat al (integrity error).")
    finally:
        db.close()

if __name__ == "__main__":
    init_db()