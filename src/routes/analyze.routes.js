import { Router } from 'express'
import { 
  analyzeText, 
  getAnalysisHistory,
  getAnalysisById 
} from '../controllers/analyze.controller.js'
import { authenticate, optionalAuth } from '../middleware/auth.js'
import { validate, analyzeTextSchema } from '../middleware/validate.js'

const router = Router()

/**
 * @swagger
 * /api/analyze:
 *   post:
 *     summary: Analyser un texte pour détecter les biais
 *     description: |
 *       Analyse un texte et retourne un score de biais et de fiabilité.
 *       L'analyse détecte les éléments suivants :
 *       - Superlatifs excessifs
 *       - Langage émotionnel
 *       - Points d'exclamation
 *       - Expressions clickbait
 *       - Sentiment d'urgence
 *     tags: [Analyze]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 10000
 *                 example: "BREAKING NEWS! Vous ne croirez jamais ce qui s'est passé! C'est absolument incroyable!"
 *     responses:
 *       200:
 *         description: Résultat de l'analyse
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     analysis:
 *                       $ref: '#/components/schemas/AnalysisResult'
 *             example:
 *               success: true
 *               data:
 *                 analysis:
 *                   biasScore: 0.75
 *                   reliabilityScore: 0.25
 *                   classification: HIGH_BIAS
 *                   indicators:
 *                     superlatives: 2
 *                     emotional: 1
 *                     exclamations: 3
 *                     clickbait: 1
 *                   suggestions:
 *                     - "Le texte contient beaucoup de superlatifs. Vérifiez les affirmations absolues."
 *                     - "Beaucoup de points d'exclamation suggèrent un ton sensationnaliste."
 *                   summary: "Ce texte présente des signes importants de biais..."
 *       400:
 *         description: Texte invalide
 */
router.post('/', optionalAuth, validate(analyzeTextSchema), analyzeText)

/**
 * @swagger
 * /api/analyze/history:
 *   get:
 *     summary: Historique des analyses de l'utilisateur
 *     tags: [Analyze]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre de résultats
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Offset pour pagination
 *     responses:
 *       200:
 *         description: Historique des analyses
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/history', authenticate, getAnalysisHistory)

/**
 * @swagger
 * /api/analyze/{id}:
 *   get:
 *     summary: Détails d'une analyse
 *     tags: [Analyze]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'analyse
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', optionalAuth, getAnalysisById)

export default router
