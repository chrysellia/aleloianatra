from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    user_level: str
    lesson_id: str

@app.get("/")
def home():
    return {"status": "Alelo'IA API est en ligne !"}

@app.post("/ai/chat")
async def chat(data: ChatRequest):
    # Simulation de réponse AI
    return {
        "response": f"Message reçu : '{data.message}'. Je suis prêt à devenir ton coach {data.user_level} !"
    }