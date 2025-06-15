from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from dotenv import load_dotenv
import os

load_dotenv() 

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 600
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")  # of jouw login endpoint


def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_identifier = payload.get("sub")
        if user_identifier  is None:
            print("❌ Geen 'sub' gevonden in JWT payload")
            raise credentials_exception
        print(f"🔍 Zoek gebruiker met identifier: {user_identifier}")

    except JWTError as e:
        print(f"❌ JWT decode fout: {e}")

        raise credentials_exception

    user = db.query(User).filter(User.username == str(user_identifier)).first()
    if not user:
    # Als het een integer is, probeer dan op ID
        try:
            user_id = int(user_identifier)
            user = db.query(User).filter(User.id == user_id).first()
        except (ValueError, TypeError):
            pass

    if user is None:
        print(f"❌ Geen gebruiker gevonden met identifier: {user_identifier}")
        raise credentials_exception
        
    print(f"✅ Gebruiker gevonden: {user.username} (ID: {user.id})")
    return user