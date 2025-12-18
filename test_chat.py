import requests

URL = "http://127.0.0.1:8000/ai/chat"

# On simule une discussion qui s'accumule
history = []

def chat_step(user_text):
    global history
    # 1. On ajoute le message de l'utilisateur
    history.append({"role": "user", "content": user_text})
    
    # 2. On envoie tout l'historique au backend
    payload = {
        "history": history,
        "user_level": "débutant",
        "lesson_id": "L01"
    }
    
    response = requests.post(URL, json=payload).json()
    ai_message = response["response"]
    
    # 3. On ajoute la réponse de l'IA à l'historique pour la prochaine fois
    history.append({"role": "assistant", "content": ai_message})
    
    print(f"\nUser: {user_text}")
    print(f"AI: {ai_message}")

# --- SCÉNARIO DE TEST ---
chat_step("Bonjour, je m'appelle Mihavana.")
chat_step("C'est quoi un actif ?")
chat_step("Rappelle-moi mon nom pour voir ?")