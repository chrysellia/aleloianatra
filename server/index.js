const express = require('express')
const path = require('path')
require('dotenv').config()

const app = express()
app.use(express.json({ limit: '1mb' }))

// simple CORS allow (dev only)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

const OPENAI_KEY = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY

function analyzeTextLocal(text){
  const cleaned = (text || '').trim()
  if(!cleaned) return { label: 'Vide', confidence: 1, reasons: ['Aucun texte fourni'], suggestions: ['Collez un texte à analyser'] }
  const lower = cleaned.toLowerCase()
  const reasons = []
  let score = 0

  if(/https?:\/\//.test(cleaned)){
    reasons.push('Contient des liens (vérifier les sources).')
    score += 1
  }
  if(/\b(source|selon|rapport|étude|d'après|scient|universit)/i.test(cleaned)){
    reasons.push('Présence d’allusions à des études ou sources. Vérifier crédibilité.')
    score += 1
  }
  if(/[A-Z]{6,}/.test(cleaned)){
    reasons.push('Usage excessif de MAJUSCULES (sensationalisme).')
    score -= 1
  }
  const exclam = (cleaned.match(/!/g) || []).length
  if(exclam > 2){
    reasons.push('Beaucoup de points d’exclamation (ton émotionnel élevé).')
    score -= 1
  }
  const sensational = /incroyable|choc|secret|révolutionnaire|meilleur|garanti/.test(lower)
  if(sensational){
    reasons.push('Langage sensationaliste détecté.')
    score -= 1
  }

  const hasNumbers = /\b\d{2,}\b/.test(cleaned)
  if(hasNumbers && !/\b(source|selon|rapport|étude)\b/.test(lower)){
    reasons.push('Chiffres présents sans référence claire.')
    score -= 0.5
  }

  const suspicious = /hoax|fake|canular|complot|mensonge|propagande/.test(lower)
  if(suspicious){
    reasons.push('Termes suspects détectés (hoax / complot).')
    score -= 2
  }

  const credibleWords = /journal|science|université|organisation|institut|publié/.test(lower)
  if(credibleWords){
    reasons.push('Mention d’organisations ou d’études (à vérifier).')
    score += 1
  }

  let label = 'Douteux'
  let confidence = Math.min(0.95, Math.max(0.3, 0.5 + score * 0.15))
  if(score >= 2) label = 'Fiable'
  else if(score <= -1.5) label = 'Faux'

  const suggestions = []
  if(!/\b(source|auteur|contact|publié)\b/.test(lower)) suggestions.push('Cherchez l’auteur et la source originale.')
  if(label === 'Faux' || label === 'Douteux') suggestions.push('Vérifiez avec fact-checkers reconnus et comparez plusieurs sources.')
  suggestions.push('Recherchez plusieurs sources et comparez les versions.')

  return { label, confidence, reasons, suggestions }
}

app.post('/api/analyze', async (req, res) => {
  const { text } = req.body || {}
  if(!text) return res.status(400).json({ error: 'Missing text' })

  if(OPENAI_KEY){
    try{
      const promptSystem = `You are an assistant that analyzes a piece of text for reliability, bias and evidence. Respond ONLY with valid JSON with these fields: label ("Fiable" | "Douteux" | "Faux"), confidence (number between 0 and 1), reasons (array of short strings), suggestions (array of short strings). Do not include any extra text.`
      const payload = {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: promptSystem },
          { role: 'user', content: `Analyze the following text and output JSON as requested:\n\n${text}` }
        ],
        max_tokens: 500,
        temperature: 0.2
      }

      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_KEY}`
        },
        body: JSON.stringify(payload)
      })

      const data = await r.json()
      const textOut = data?.choices?.[0]?.message?.content || ''
      try{
        const parsed = JSON.parse(textOut)
        return res.json(parsed)
      }catch(e){
        return res.json({ label: 'Douteux', confidence: 0.5, reasons: ['Le modèle a retourné un format inattendu'], suggestions: ['Activer clé OpenAI ou vérifier le format de sortie'] })
      }
    }catch(err){
      console.error('OpenAI error', err)
      return res.status(500).json({ error: 'OpenAI request failed' })
    }
  }

  // fallback
  const result = analyzeTextLocal(text)
  return res.json(result)
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`Aleloianatra server listening on http://localhost:${port}`))
