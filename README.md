# 🧠 Alelo'IA - Service Backend AI

Ce service est le cerveau du projet Alelo'IA. Il utilise **FastAPI** et l'IA **Groq (Llama 3.1)** pour fournir un coaching financier adapté au contexte malgache.

## 🚀 Fonctionnalités
- **Chat Coach** : Réponses personnalisées sur la finance et la LMI.
- **Générateur de Quiz** : Création automatique de questions JSON à partir d'un cours.
- **Détection d'Arnaques** (En cours) : Analyse de messages suspects.

## 🛠 Installation

1. **Cloner la branche** :
   ```bash
   git checkout feature/ai-service
   ```
2. **Installer les dépendances** :
    ```bash
   pip install -r requirements.txt
   ```
3. **Configuration (Important)** :
    * Crée un fichier .env à la racine.
    * Ajoute ta clé API Groq : GROQ_API_KEY=votre_cle_ici

4. **Lancer le serveur** :
    ```bash
    uvicorn main:app --reload
    ```
## 🔌 API Endpoints

Une fois lancé, accède au Swagger ici : http://127.0.0.1:8000/docs
* POST /ai/chat : Pose une question au coach.
* POST /ai/generate-quiz : Génère un quiz à partir d'un texte.

## 📝 Exemples d'utilisation (Payloads)

1. Chat avec le Coach (POST /ai/chat)  

Requête (Ce que le Front envoie) :
```bash
    {
      "message": "C'est quoi l'épargne ?",
      "user_level": "débutant",
      "lesson_id": "L01"
    }   
```

Réponse (Ce que le Front reçoit) :
```bash
    {
      "response": "L'épargne, c'est mettre un peu d'argent de côté aujourd'hui (comme sur ton compte MVola) pour pouvoir réaliser un projet plus tard ou faire face à une urgence."
    }   
```

2. Générateur de Quiz (POST /ai/generate-quiz)  

Requête :
```bash
    {
      "lesson_content": "Le code PIN Mobile Money doit rester secret.",
      "num_questions": 1
    }  
```
Réponse :
```bash
  {
    "quiz": [
      {
        "question": "À qui pouvez-vous donner votre code PIN ?",
        "options": ["À personne", "À un agent", "À un ami"],
        "answer": "A",
        "explanation": "Le code PIN est strictement personnel pour garantir la sécurité de votre argent."
      }
    ]
  }  
```

3. Détecteur d'Arnaques (POST /ai/detect-scam)  

Requête :
```bash
    {
      "message_content": "Félicitations ! Vous avez gagné 1.000.000 Ar..."
    }  
```
Réponse :
```bash
    {
      "verdict": "DANGEREUX",
      "score": 9,
      "analyse": "Explication du risque...",
      "conseil": "Action à entreprendre..."
    }  
```

4. Liste des Leçons (GET /ai/lessons)