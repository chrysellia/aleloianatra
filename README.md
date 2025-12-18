# Alelo'IA-Anatra

Prototype d'une application web React + Vite + Tailwind pour renforcer la littératie médiatique et informationnelle.

Quick start

1. Installer les dépendances

```bash
npm install
```

2. Lancer en dev

```bash
npm run dev
```

Backend optionnel (analyse via OpenAI):

1. Aller dans le dossier `server` et installer les dépendances

```bash
cd server
npm install
```

2. Créer un fichier `.env` dans `server/` avec `OPENAI_API_KEY=your_key` ou laisser vide pour utiliser l'heuristique locale

3. Lancer le serveur

```bash
npm start
```

Vous pouvez lancer à la racine en parallèle (requiert `concurrently`):

```bash
npm run start
```

Fonctionnalités incluses dans le prototype
- Pages: Accueil, Quiz intelligent, Analyseur de contenu, Parcours adaptif
- Analyse heuristique locale (`src/lib/ai.js`) pour classification et suggestions

Notes pour intégrer une IA réelle
- Remplacer la fonction `analyzeText` par un appel à une API (ex: OpenAI, HuggingFace) ou à un microservice local qui exécute un modèle NLP pour détection de biais, classification et génération d'explications.
- Ajouter un backend (endpoint `/api/analyze`) pour garder les clés d'API côté serveur.
