import os
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime
from dotenv import load_dotenv

load_dotenv()

# On récupère l'URL du .env
DATABASE_URL = os.getenv("DATABASE_URL")

# Pour Render/PostgreSQL, il faut parfois forcer le début de l'URL
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class AIChatHistory(Base):
    __tablename__ = "ai_chat_history" # Nom unique pour ton IA
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    role = Column(String) 
    content = Column(Text)
    lesson_id = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

# Cette ligne crée la table SEULEMENT si elle n'existe pas déjà
Base.metadata.create_all(bind=engine)