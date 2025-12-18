// Mock/simple heuristic AI for prototype purposes
// Provides classification (Fiable / Douteux / Faux), confidence, reasons and suggestions

export function analyzeText(text){
  const cleaned = (text || '').trim()
  if(!cleaned) return { label: 'Vide', confidence: 1, reasons: ['Aucun texte fourni'], suggestions: ['Collez un texte à analyser'] }

  const lower = cleaned.toLowerCase()
  const reasons = []
  let score = 0

  // Heuristics
  if(/https?:\/\//.test(cleaned)){
    reasons.push('Contient des liens (vérifier les sources).')
    score += 1
  }
  if(/\b(source|selon|rapport|étude|d'après|scient)/i.test(cleaned)){
    reasons.push('Présence d’allusions à des études ou sources. Vérifier crédibilité.')
    score += 1
  }
  if(/[A-Z]{6,}/.test(cleaned)){
    reasons.push('Usage excessif de MAJUSCULES (signal de sensationalisme).')
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

  // Basic claim-check: many absolute claims without sources -> doubtful
  const hasNumbers = /\b\d{2,}\b/.test(cleaned)
  if(hasNumbers && !/\b(source|selon|rapport|étude)\b/.test(lower)){
    reasons.push('Chiffres présents sans référence claire.')
    score -= 0.5
  }

  // Keywords that often indicate misinformation
  const suspicious = /hoax|fake|canular|complot|mensonge|propagande/.test(lower)
  if(suspicious){
    reasons.push('Termes suspects détectés (hoax / complot).')
    score -= 2
  }

  // Simple positive signals
  const credibleWords = /journal|science|université|organisation|institut|publié/.test(lower)
  if(credibleWords){
    reasons.push('Mention d’organisations ou d’études (à vérifier).')
    score += 1
  }

  // Decide label
  let label = 'Douteux'
  let confidence = Math.min(0.95, Math.max(0.3, 0.5 + score * 0.15))
  if(score >= 2) label = 'Fiable'
  else if(score <= -1.5) label = 'Faux'

  // Suggestions
  const suggestions = []
  if(!/\b(source|auteur|contact|publié)\b/.test(lower)) suggestions.push('Cherchez l’auteur et la source originale.')
  if(label === 'Faux' || label === 'Douteux') suggestions.push('Vérifiez avec fact-checkers reconnus (ex: AFP Factuel, Les Décodeurs).')
  suggestions.push('Recherchez plusieurs sources et comparez les versions.')

  return {
    label,
    confidence,
    reasons,
    suggestions
  }
}
