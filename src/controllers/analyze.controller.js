import prisma from '../config/database.js'
import { asyncHandler } from '../middleware/errorHandler.js'

/**
 * Analyze text for bias and reliability
 * POST /api/analyze
 */
export const analyzeText = asyncHandler(async (req, res) => {
  const { text } = req.body

  // Perform analysis (heuristic-based for now)
  const analysisResult = performTextAnalysis(text)

  // Save analysis if user is authenticated
  let savedAnalysis = null
  if (req.user) {
    savedAnalysis = await prisma.analysis.create({
      data: {
        userId: req.user.id,
        inputText: text,
        result: analysisResult,
        biasScore: analysisResult.biasScore,
        reliability: analysisResult.reliabilityScore,
        suggestions: analysisResult.suggestions
      }
    })

    // Award XP for using the analyzer
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        xpTotal: { increment: 5 }
      }
    })
  }

  res.json({
    success: true,
    data: {
      analysis: analysisResult,
      id: savedAnalysis?.id
    }
  })
})

/**
 * Get analysis history
 * GET /api/analyze/history
 */
export const getAnalysisHistory = asyncHandler(async (req, res) => {
  const { limit = 10, offset = 0 } = req.query

  const [analyses, total] = await Promise.all([
    prisma.analysis.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset),
      select: {
        id: true,
        inputText: true,
        biasScore: true,
        reliability: true,
        suggestions: true,
        createdAt: true
      }
    }),
    prisma.analysis.count({
      where: { userId: req.user.id }
    })
  ])

  res.json({
    success: true,
    data: {
      analyses: analyses.map(a => ({
        ...a,
        inputText: a.inputText.substring(0, 200) + (a.inputText.length > 200 ? '...' : '')
      })),
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + analyses.length < total
      }
    }
  })
})

/**
 * Get analysis by ID
 * GET /api/analyze/:id
 */
export const getAnalysisById = asyncHandler(async (req, res) => {
  const { id } = req.params

  const analysis = await prisma.analysis.findUnique({
    where: { id }
  })

  if (!analysis) {
    return res.status(404).json({
      success: false,
      message: 'Analyse non trouvée'
    })
  }

  // Check if user owns this analysis
  if (analysis.userId && analysis.userId !== req.user?.id) {
    return res.status(403).json({
      success: false,
      message: 'Accès non autorisé'
    })
  }

  res.json({
    success: true,
    data: analysis
  })
})

/**
 * Heuristic-based text analysis
 * This can be replaced with AI/ML models later
 */
function performTextAnalysis(text) {
  const lowerText = text.toLowerCase()
  
  // Indicators of potential bias
  const biasIndicators = {
    superlatives: /\b(best|worst|always|never|everyone|nobody|completely|totally|absolutely)\b/gi,
    emotionalLanguage: /\b(shocking|incredible|unbelievable|outrageous|terrifying|amazing|horrible)\b/gi,
    exclamations: /!/g,
    allCaps: /\b[A-Z]{3,}\b/g,
    clickbait: /\b(you won't believe|secret|revealed|exposed|truth about)\b/gi,
    urgency: /\b(urgent|immediately|now|breaking|alert)\b/gi
  }

  // Calculate scores
  const scores = {
    superlatives: (text.match(biasIndicators.superlatives) || []).length,
    emotional: (text.match(biasIndicators.emotionalLanguage) || []).length,
    exclamations: (text.match(biasIndicators.exclamations) || []).length,
    allCaps: (text.match(biasIndicators.allCaps) || []).length,
    clickbait: (text.match(biasIndicators.clickbait) || []).length,
    urgency: (text.match(biasIndicators.urgency) || []).length
  }

  // Calculate bias score (0-1, higher = more biased)
  const wordCount = text.split(/\s+/).length
  const totalIndicators = Object.values(scores).reduce((a, b) => a + b, 0)
  const biasScore = Math.min(1, totalIndicators / (wordCount * 0.1))

  // Calculate reliability score (0-1, higher = more reliable)
  const reliabilityScore = Math.max(0, 1 - biasScore)

  // Generate suggestions
  const suggestions = []
  
  if (scores.superlatives > 2) {
    suggestions.push('Le texte contient beaucoup de superlatifs. Vérifiez les affirmations absolues.')
  }
  
  if (scores.emotional > 2) {
    suggestions.push('Le langage émotionnel est présent. Les faits sont-ils séparés des opinions?')
  }
  
  if (scores.exclamations > 3) {
    suggestions.push('Beaucoup de points d\'exclamation suggèrent un ton sensationnaliste.')
  }
  
  if (scores.clickbait > 0) {
    suggestions.push('Expressions clickbait détectées. Méfiez-vous des titres accrocheurs.')
  }
  
  if (scores.urgency > 1) {
    suggestions.push('Le texte crée un sentiment d\'urgence. Prenez le temps de vérifier.')
  }

  if (suggestions.length === 0) {
    suggestions.push('Le texte semble relativement neutre. Vérifiez toujours les sources.')
  }

  // Determine classification
  let classification = 'NEUTRAL'
  if (biasScore > 0.6) {
    classification = 'HIGH_BIAS'
  } else if (biasScore > 0.3) {
    classification = 'MODERATE_BIAS'
  } else if (biasScore > 0.1) {
    classification = 'LOW_BIAS'
  }

  return {
    biasScore: Math.round(biasScore * 100) / 100,
    reliabilityScore: Math.round(reliabilityScore * 100) / 100,
    classification,
    indicators: scores,
    suggestions,
    wordCount,
    summary: generateSummary(classification, biasScore)
  }
}

/**
 * Generate human-readable summary
 */
function generateSummary(classification, biasScore) {
  const summaries = {
    HIGH_BIAS: 'Ce texte présente des signes importants de biais. Il est fortement recommandé de vérifier les informations auprès de sources fiables.',
    MODERATE_BIAS: 'Ce texte contient quelques éléments qui méritent vérification. Restez vigilant et croisez les sources.',
    LOW_BIAS: 'Ce texte semble relativement équilibré, mais une vérification des faits reste recommandée.',
    NEUTRAL: 'Ce texte apparaît neutre et factuel. Bonne pratique de vérifier quand même les sources citées.'
  }

  return summaries[classification] || summaries.NEUTRAL
}

