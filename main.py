import os
from fastapi import FastAPI
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv

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
    # Instruction pour donner une personnalité à l'IA
    system_prompt = f"""
    Tu es Alelo'IA, un coach financier expert à Madagascar. 
    Ton but est d'aider les jeunes à comprendre la finance et éviter les arnaques (LMI).
    Adapte ton langage au niveau : {data.user_level}.
    Utilise des exemples locaux (Ariary, Mobile Money comme MVola/Orange Money).
    Sois encourageant et simple.
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
class QuizRequest(BaseModel):
    lesson_content: str
    num_questions: int = 3

@app.post("/ai/generate-quiz")
async def generate_quiz(data: QuizRequest):
    # On précise bien le format attendu pour que l'IA ne se trompe pas
    prompt = f"""
    Tu es un assistant pédagogique. Basé sur le contenu suivant : "{data.lesson_content}", 
    génère un quiz de {data.num_questions} questions au format JSON.
    
    Chaque objet du tableau doit avoir exactement ces clés :
    "question", "options" (un tableau de 3 choix), "answer" (la lettre correspondante), "explanation".
    
    Adapte les exemples au contexte de Madagascar.
    """
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "Tu réponds uniquement en JSON."},
                {"role": "user", "content": prompt}
            ],
            response_format={ "type": "json_object" } 
        )
        
        # On transforme la chaîne de caractères reçue en vrai objet JSON pour FastAPI
        import json
        quiz_data = json.loads(completion.choices[0].message.content)
        return {"quiz": quiz_data}
        
    except Exception as e:
        return {"error": str(e)}