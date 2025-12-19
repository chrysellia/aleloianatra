import os
import httpx
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from typing import Optional, List, Dict

# Importations de tes nouveaux modules de base de données
from database import SessionLocal, engine, Base, AIChatHistory
from databaseLesson import LESSONS_DB

# URL du backend Node.js
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:5000")

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

# --- Fonctions utilitaires pour appeler le Backend ---

async def fetch_lesson_from_backend(lesson_id: str) -> Optional[Dict]:
    """Récupère le contenu d'une leçon depuis le Backend"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{BACKEND_URL}/api/internal/lessons/{lesson_id}")
            if response.status_code == 200:
                data = response.json()
                return data.get("data") if data.get("success") else None
    except Exception as e:
        print(f"Erreur lors de la récupération de la leçon: {e}")
    return None

async def fetch_user_quiz_errors(user_id: str, module_id: str, limit: int = 5) -> List[Dict]:
    """Récupère les erreurs de quiz récentes depuis le Backend"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{BACKEND_URL}/api/internal/user/{user_id}/quiz-errors/{module_id}",
                params={"limit": limit}
            )
            if response.status_code == 200:
                data = response.json()
                return data.get("data", []) if data.get("success") else []
    except Exception as e:
        print(f"Erreur lors de la récupération des erreurs de quiz: {e}")
    return []

async def fetch_user_progress(user_id: str, module_id: str) -> Optional[Dict]:
    """Récupère la progression de l'utilisateur depuis le Backend"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{BACKEND_URL}/api/internal/user/{user_id}/progress/{module_id}"
            )
            if response.status_code == 200:
                data = response.json()
                return data.get("data") if data.get("success") else None
    except Exception as e:
        print(f"Erreur lors de la récupération de la progression: {e}")
    return None

async def fetch_module_for_ai(module_id: str) -> Optional[Dict]:
    """Récupère un module complet avec leçons et quiz depuis le Backend"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{BACKEND_URL}/api/internal/modules/{module_id}")
            if response.status_code == 200:
                data = response.json()
                return data.get("data") if data.get("success") else None
    except Exception as e:
        print(f"Erreur lors de la récupération du module: {e}")
    return None

# --- Modèles Pydantic ---

class ChatRequest(BaseModel):
    user_id: str      # L'ID de l'utilisateur connecté
    message: str      # Le nouveau message envoyé
    user_level: str
    lesson_id: str
    module_id: Optional[str] = None  # Nouveau : ID du module
    context: Optional[Dict] = None   # Nouveau : contexte enrichi depuis le frontend

# --- Routes ---

@app.post("/ai/chat")
async def chat(data: ChatRequest, db: Session = Depends(get_db)):
    # 1. Récupération du contexte de la leçon (depuis Backend ou fallback LESSONS_DB)
    lesson_data = None
    if data.context and data.context.get("lessonContent"):
        # Utiliser le contexte envoyé depuis le frontend
        lesson_data = {
            "title": data.context.get("lessonTitle", "Leçon"),
            "content": data.context.get("lessonContent", ""),
            "module": {
                "title": data.context.get("moduleTitle", ""),
                "description": data.context.get("moduleDescription", "")
            }
        }
    else:
        # Fallback : essayer depuis le Backend
        lesson_data = await fetch_lesson_from_backend(data.lesson_id)
        if not lesson_data:
            # Dernier fallback : LESSONS_DB
            lesson = LESSONS_DB.get(data.lesson_id)
            if lesson:
                lesson_data = {
                    "title": lesson.get("title", "Leçon"),
                    "content": lesson.get("content", ""),
                    "module": {"title": "", "description": ""}
                }

    # 2. Récupérer les erreurs de quiz si module_id est fourni
    quiz_errors = []
    if data.module_id:
        if data.context and data.context.get("recentQuizErrors"):
            quiz_errors = data.context.get("recentQuizErrors", [])
        else:
            quiz_errors = await fetch_user_quiz_errors(data.user_id, data.module_id, limit=5)

    # 3. Récupérer la progression si module_id est fourni
    user_progress = None
    if data.module_id:
        if data.context and data.context.get("currentProgress") is not None:
            user_progress = {
                "moduleProgress": data.context.get("currentProgress", 0),
                "completedLessons": data.context.get("completedLessons", []),
                "totalLessons": data.context.get("totalLessons", 0)
            }
        else:
            user_progress = await fetch_user_progress(data.user_id, data.module_id)

    # 4. Analyser le contexte du quiz si présent
    quiz_context = data.context.get("quizContext") if data.context else None
    repetitive_errors = []
    
    if quiz_context:
        # Détecter les erreurs répétitives
        all_errors = quiz_errors + (quiz_context.get("sessionErrors", []) or [])
        error_counts = {}
        
        for err in all_errors:
            # Utiliser la question comme clé pour détecter les répétitions
            question_key = err.get("question", "")[:100]
            if question_key not in error_counts:
                error_counts[question_key] = {
                    "count": 0,
                    "error": err
                }
            error_counts[question_key]["count"] += 1
        
        # Identifier les erreurs répétitives (plus de 2 fois)
        for key, data_err in error_counts.items():
            if data_err["count"] >= 2:
                repetitive_errors.append({
                    "question": data_err["error"].get("question", ""),
                    "count": data_err["count"],
                    "correctAnswer": data_err["error"].get("correctAnswer", ""),
                    "rationale": data_err["error"].get("rationale", "")
                })

    # 5. Construire le contexte enrichi pour le prompt
    context_parts = []
    
    if lesson_data:
        context_parts.append(f"LEÇON ACTUELLE: {lesson_data.get('title', 'Leçon')}")
        context_parts.append(f"CONTENU DE LA LEÇON:\n{lesson_data.get('content', '')[:2000]}")  # Limiter à 2000 caractères
        
        if lesson_data.get("module"):
            context_parts.append(f"MODULE: {lesson_data['module'].get('title', '')}")
            if lesson_data['module'].get('description'):
                context_parts.append(f"Description du module: {lesson_data['module']['description']}")

    # Ajouter le contexte du quiz si présent
    if quiz_context:
        current_q = quiz_context.get("currentQuestion")
        if current_q:
            context_parts.append(f"QUESTION ACTUELLE DU QUIZ:\n{current_q.get('question', '')}")
            context_parts.append(f"Options: {', '.join(current_q.get('choices', []))}")
            context_parts.append(f"Bonne réponse: {current_q.get('choices', [])[current_q.get('correctIndex', 0)]}")
        
        context_parts.append(f"PROGRESSION DU QUIZ: Question {quiz_context.get('currentIndex', 0) + 1} sur {quiz_context.get('totalQuestions', 0)}")
        context_parts.append(f"SCORE ACTUEL: {quiz_context.get('score', 0)} bonnes réponses")

    if user_progress:
        progress_percent = user_progress.get("moduleProgress", 0)
        completed = len(user_progress.get("completedLessons", []))
        total = user_progress.get("totalLessons", 0)
        context_parts.append(f"PROGRESSION: {progress_percent}% du module complété ({completed}/{total} leçons terminées)")

    if quiz_errors:
        errors_text = "\n".join([
            f"- Question: {err.get('question', '')[:100]}\n"
            f"  Réponse choisie (incorrecte): {err.get('selectedAnswer', '')}\n"
            f"  Bonne réponse: {err.get('correctAnswer', '')}\n"
            f"  Explication: {err.get('rationale', '')}"
            for err in quiz_errors[:3]  # Limiter à 3 erreurs récentes
        ])
        context_parts.append(f"ERREURS RÉCENTES DE QUIZ:\n{errors_text}")

    # Ajouter l'alerte sur les erreurs répétitives
    if repetitive_errors:
        repetitive_text = "\n".join([
            f"⚠️ ERREUR RÉPÉTITIVE ({err['count']} fois):\n"
            f"  Question: {err['question'][:150]}\n"
            f"  Bonne réponse: {err['correctAnswer']}\n"
            f"  Explication: {err['rationale']}"
            for err in repetitive_errors[:3]
        ])
        context_parts.append(f"⚠️ ATTENTION - ERREURS RÉPÉTITIVES DÉTECTÉES:\n{repetitive_text}")

    context_text = "\n\n".join(context_parts) if context_parts else "Contexte général"

    # 5. Récupérer l'historique depuis la base de données
    db_history = db.query(AIChatHistory).filter(
        AIChatHistory.user_id == data.user_id,
        AIChatHistory.lesson_id == data.lesson_id
    ).order_by(AIChatHistory.timestamp.asc()).all()

    # Construire le message d'alerte pour les erreurs répétitives
    alert_message = ""
    if repetitive_errors:
        alert_message = f"\n\n⚠️ ALERTE IMPORTANTE: L'utilisateur a fait des erreurs répétitives sur certaines questions. " \
                       f"Tu dois absolument l'alerter de manière bienveillante et lui proposer des explications détaillées " \
                       f"pour l'aider à comprendre ces concepts. Voici les erreurs répétitives:\n" + \
                       "\n".join([f"- {err['question'][:100]} (erreur {err['count']} fois)" for err in repetitive_errors[:3]])

    # 6. Construction des messages pour Groq avec contexte enrichi
    system_prompt = f"""Tu es Alelo'IA, un coach expert en littératie médiatique et éducation financière adapté au contexte malgache.

CONTEXTE ACTUEL:
{context_text}
{alert_message}

NIVEAU DE L'UTILISATEUR: {data.user_level}

RÈGLES IMPORTANTES:
1. Utilise des exemples malgaches (Ariary, MVola, Orange Money, etc.)
2. Sois concis mais complet dans tes explications
3. Si l'utilisateur a fait des erreurs de quiz récentes, propose des explications ciblées
4. Si des erreurs répétitives sont détectées, ALERTE l'utilisateur de manière bienveillante et propose des explications détaillées
5. Si l'utilisateur est en train de faire un quiz, sois disponible pour l'aider avec la question actuelle
6. Adapte ton langage au niveau de l'utilisateur ({data.user_level})
7. Réfère-toi au contenu de la leçon actuelle pour donner des réponses précises
8. Si la discussion a déjà des messages, entre directement dans le vif du sujet
9. Encourage l'utilisateur et félicite-le pour sa progression"""

    messages = [{
        "role": "system", 
        "content": system_prompt
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

        # 7. Ajouter un message d'alerte automatique si des erreurs répétitives sont détectées
        # Déclencher l'alerte si des erreurs répétitives sont détectées, même avec un historique
        if repetitive_errors:
            alert_auto_message = "\n\n⚠️ **Alerte automatique**: J'ai remarqué que vous avez fait des erreurs répétitives sur certaines questions. "
            alert_auto_message += "Cela signifie que ces concepts nécessitent une attention particulière. "
            alert_auto_message += "N'hésitez pas à me poser des questions spécifiques sur ces sujets pour mieux les comprendre !"
            
            # Si c'est le premier message, ajouter l'alerte au début
            if len(db_history) == 0:
                ai_response = alert_auto_message + "\n\n" + ai_response
            else:
                # Sinon, ajouter l'alerte à la fin pour qu'elle soit visible
                ai_response = ai_response + "\n\n" + alert_auto_message

        # 8. SAUVEGARDE dans la base de données Cloud
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