import os
from fastapi import FastAPI
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
from database import LESSONS_DB

# Charger la clé API depuis le fichier .env
load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI()

class ChatRequest(BaseModel):
    message: str
    user_level: str
    lesson_id: str

@app.post("/ai/chat")
async def chat(data: ChatRequest):
    # Récupération sécurisée du contenu de la leçon
    lesson = LESSONS_DB.get(data.lesson_id)
    
    if lesson:
        context_text = f"Leçon : {lesson['title']}. Contenu : {lesson['content']}"
    else:
        context_text = "Contenu général sur l'éducation financière à Madagascar."

    system_prompt = f"""
    Tu es Alelo'IA, un coach expert basé sur la philosophie de Robert Kiyosaki (Père Riche, Père Pauvre).
    Ton but est d'enseigner aux jeunes Malgaches comment sortir de la 'Rat Race'.
    
    Contexte de la leçon actuelle : {context_text}
    Niveau de l'élève : {data.user_level}
    
    Règles :
    1. Utilise des exemples locaux (Ariary, MVola, petites entreprises à Mada).
    2. Explique bien la différence entre Actif et Passif.
    3. Sois motivant mais réaliste sur les risques.
    """

    # Appel à l'IA Groq
    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": data.message}
        ],
        temperature=0.7 
    )

    return {"response": completion.choices[0].message.content}


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