import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
from sqlalchemy.orm import Session

# Importations de tes nouveaux modules de base de données
from database import SessionLocal, engine, Base, AIChatHistory
from databaseLesson import LESSONS_DB

# 1. Initialisation
load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Créer la table dans le Cloud Render au démarrage si elle n'existe pas
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Fonction pour récupérer la session de DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Modèles Pydantic ---

class ChatRequest(BaseModel):
    user_id: str      # L'ID de l'utilisateur connecté
    message: str      # Le nouveau message envoyé
    user_level: str
    lesson_id: str

# --- Routes ---

@app.post("/ai/chat")
async def chat(data: ChatRequest, db: Session = Depends(get_db)):
    # 1. Récupération du contexte de la leçon
    lesson = LESSONS_DB.get(data.lesson_id)
    context_text = f"Leçon : {lesson['title']}. Contenu : {lesson['content']}" if lesson else "Général"

    # 2. Récupérer l'historique depuis PostgreSQL (Render)
    db_history = db.query(AIChatHistory).filter(
        AIChatHistory.user_id == data.user_id,
        AIChatHistory.lesson_id == data.lesson_id
    ).order_by(AIChatHistory.timestamp.asc()).all()

    # 3. Construction des messages pour Groq
    messages = [{
        "role": "system", 
        "content": f"""
        Tu es Alelo'IA, un coach expert basé sur la philosophie de Robert Kiyosaki.
        Contexte : {context_text}. Niveau : {data.user_level}.
        Règles : Utilise des exemples malgaches (Ariary, MVola). 
        Si la discussion a déjà des messages, entre directement dans le vif du sujet.
        """
    }]

    # Ajouter le passé stocké en DB
    for msg in db_history:
        messages.append({"role": msg.role, "content": msg.content})

    # Ajouter le nouveau message de l'utilisateur
    messages.append({"role": "user", "content": data.message})

    try:
        # 4. Appel à l'IA
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            temperature=0.7 
        )
        ai_response = completion.choices[0].message.content

        # 5. SAUVEGARDE dans la base de données Cloud
        new_user_msg = AIChatHistory(
            user_id=data.user_id, 
            role="user", 
            content=data.message, 
            lesson_id=data.lesson_id
        )
        new_ai_msg = AIChatHistory(
            user_id=data.user_id, 
            role="assistant", 
            content=ai_response, 
            lesson_id=data.lesson_id
        )
        db.add(new_user_msg)
        db.add(new_ai_msg)
        db.commit()

        return {"response": ai_response}

    except Exception as e:
        return {"error": str(e)}

# Nouvelle route pour que le Front puisse charger l'historique au login
@app.get("/ai/history/{user_id}/{lesson_id}")
async def get_history(user_id: str, lesson_id: str, db: Session = Depends(get_db)):
    history = db.query(AIChatHistory).filter(
        AIChatHistory.user_id == user_id,
        AIChatHistory.lesson_id == lesson_id
    ).order_by(AIChatHistory.timestamp.asc()).all()
    return history

#Quiz Generation
class QuizByIDRequest(BaseModel):
    lesson_id: str
    num_questions: int = 3
    user_level: str = "débutant"

@app.post("/ai/generate-quiz")
async def generate_quiz(data: QuizByIDRequest):
    lesson = LESSONS_DB.get(data.lesson_id)
    
    if not lesson:
        return {"error": "Leçon non trouvée."}


    prompt = f"""
    Basé sur ce contenu : "{lesson['content']}", 
    génère un quiz de EXACTEMENT {data.num_questions} questions pour un niveau {data.user_level}.
    
    CONSIGNES STRICTES :
    1. Difficulté : Adapte les questions au niveau "{data.user_level}".
    2. Langue et contexte : Utilise des termes simples et des exemples malgaches (Ariary, Mvola).
    3. Format : Génère exactement {data.num_questions} questions au format JSON.
    4. La clé "answer" doit correspondre à une lettre (A, B ou C).
    5. Retourne un objet JSON contenant une clé "questions" qui est une liste.
    """
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "Tu es un générateur de quiz. Réponds UNIQUEMENT en JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={ "type": "json_object" } 
        )
        
        import json
        quiz_data = json.loads(completion.choices[0].message.content)
        
        # Pour éviter les structures bizarres, on s'assure de renvoyer une liste propre
        # Si l'IA a mis les questions dans une clé "questions", on la récupère
        final_questions = quiz_data.get("questions", quiz_data)
        
        return {
            "lesson_title": lesson['title'],
            "count_requested": data.num_questions,
            "quiz": final_questions
        }
        
    except Exception as e:
        return {"error": f"Erreur : {str(e)}"}
        

#Scam Detection
class ScamRequest(BaseModel):
    message_content: str

@app.post("/ai/detect-scam")
async def detect_scam(data: ScamRequest):
    prompt = f"""
    Analyse ce message suspect reçu par un utilisateur : "{data.message_content}"
    
    En tant qu'expert en sécurité financière à Madagascar, détermine s'il s'agit d'une arnaque.
    Réponds au format JSON avec ces clés :
    - "verdict": (SÛR, SUSPECT, ou DANGEREUX)
    - "score": une note de danger de 0 à 10
    - "analyse": explication courte du pourquoi (ex: demande de code PIN, promesse de gain irréaliste)
    - "conseil": action à faire (ex: bloquer le numéro, ne jamais donner son PIN)
    """

    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            response_format={ "type": "json_object" }
        )
        import json
        return json.loads(completion.choices[0].message.content)
    except Exception as e:
        return {"error": str(e)}
    
@app.get("/ai/lessons")
async def get_lessons():
    return [
        {"id": key, "title": val["title"]} 
        for key, val in LESSONS_DB.items()
    ]