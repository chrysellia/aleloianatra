import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
from database import LESSONS_DB

# Charger la clé API depuis le fichier .env
load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str # "user" ou "assistant"
    content: str

class ChatRequest(BaseModel):
    history: list[Message] # Liste des messages précédents
    user_level: str
    lesson_id: str

@app.post("/ai/chat")
async def chat(data: ChatRequest):
    # 1. Récupération du contexte de la leçon
    lesson = LESSONS_DB.get(data.lesson_id)
    context_text = f"Leçon : {lesson['title']}. Contenu : {lesson['content']}" if lesson else "Général"

    # 2. Construction des messages pour l'API
    messages = [{
        "role": "system", 
        "content": f"""
        Tu es Alelo'IA, un coach expert basé sur la philosophie de Robert Kiyosaki.
        Contexte : {context_text}. Niveau : {data.user_level}.
        Règles : Utilise des exemples malgaches (Ariary, MVola). 
        Si la discussion est déjà lancée (présence d'historique), ne refais pas de salutations amicales, entre directement dans le vif du sujet.
        """
    }]

    # Ajout de l'historique des messages
    for msg in data.history:
        messages.append({"role": msg.role, "content": msg.content})

    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            temperature=0.7 
        )
        return {"response": completion.choices[0].message.content}
    except Exception as e:
        return {"error": str(e)}


#Quiz
class QuizByIDRequest(BaseModel):
    lesson_id: str
    num_questions: int = 3

@app.post("/ai/generate-quiz")
async def generate_quiz(data: QuizByIDRequest):
    lesson = LESSONS_DB.get(data.lesson_id)
    
    if not lesson:
        return {"error": "Leçon non trouvée."}

    # Correction ici : on ajoute {data.num_questions} dans le texte du prompt
    prompt = f"""
    Basé sur ce contenu : "{lesson['content']}", 
    génère un quiz de EXACTEMENT {data.num_questions} questions au format JSON.
    
    CONSIGNES STRICTES :
    1. Génère exactement {data.num_questions} questions, ni plus, ni moins.
    2. La clé "answer" doit correspondre à une lettre (A, B ou C).
    3. Retourne un objet JSON contenant une clé "questions" qui est une liste.
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