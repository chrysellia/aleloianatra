import { Router } from 'express'
import { 
  getAllQuizzes, 
  getQuizById, 
  submitQuiz,
  getAdaptiveQuiz,
  getQuizHistory 
} from '../controllers/quizzes.controller.js'
import { authenticate } from '../middleware/auth.js'
import { validate, submitQuizSchema } from '../middleware/validate.js'

const router = Router()

/**
 * @swagger
 * /api/quizzes:
 *   get:
 *     summary: Liste de tous les quiz
 *     tags: [Quizzes]
 *     parameters:
 *       - in: query
 *         name: moduleId
 *         schema:
 *           type: string
 *         description: Filtrer par module
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [EASY, INTERMEDIATE, ADVANCED]
 *         description: Filtrer par difficulté
 *       - in: query
 *         name: audience
 *         schema:
 *           type: string
 *         description: Filtrer par audience
 *     responses:
 *       200:
 *         description: Liste des quiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Quiz'
 */
router.get('/', getAllQuizzes)

/**
 * @swagger
 * /api/quizzes/user/adaptive:
 *   get:
 *     summary: Obtenir des quiz adaptés à l'utilisateur
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: count
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Nombre de quiz à retourner
 *     responses:
 *       200:
 *         description: Quiz personnalisés
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/user/adaptive', authenticate, getAdaptiveQuiz)

/**
 * @swagger
 * /api/quizzes/user/history:
 *   get:
 *     summary: Historique des quiz de l'utilisateur
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Historique des tentatives
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/user/history', authenticate, getQuizHistory)

/**
 * @swagger
 * /api/quizzes/{id}:
 *   get:
 *     summary: Détails d'un quiz
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du quiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Quiz'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', getQuizById)

/**
 * @swagger
 * /api/quizzes/{id}/submit:
 *   post:
 *     summary: Soumettre une réponse au quiz
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - selectedIndex
 *             properties:
 *               selectedIndex:
 *                 type: integer
 *                 minimum: 0
 *                 description: Index de la réponse choisie (0-based)
 *                 example: 1
 *               timeSpent:
 *                 type: integer
 *                 description: Temps passé en secondes
 *                 example: 30
 *     responses:
 *       200:
 *         description: Résultat de la soumission
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     isCorrect:
 *                       type: boolean
 *                     correctIndex:
 *                       type: integer
 *                     rationale:
 *                       type: string
 *                     xpEarned:
 *                       type: integer
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.post('/:id/submit', authenticate, validate(submitQuizSchema), submitQuiz)

export default router
