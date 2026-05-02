from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Placeholder for DATABASE_URL. Update this in your .env file.
# Format: postgresql+psycopg2://user:password@host:port/dbname
DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql+psycopg2://postgres:your_password@db.your_project.supabase.co:5432/postgres")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
