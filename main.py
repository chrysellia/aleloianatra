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

