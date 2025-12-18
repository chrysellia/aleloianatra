import { Router } from 'express'
import { 
  getAllAchievements, 
  getAchievementById,
  createAchievement 
} from '../controllers/achievements.controller.js'
import { authenticate, optionalAuth, authorize } from '../middleware/auth.js'

const router = Router()

/**
 * @swagger
 * /api/achievements:
 *   get:
 *     summary: Liste de toutes les réalisations
 *     tags: [Achievements]
 *     responses:
 *       200:
 *         description: Liste des réalisations disponibles
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
 *                     allOf:
 *                       - $ref: '#/components/schemas/Achievement'
 *                       - type: object
 *                         properties:
 *                           earned:
 *                             type: boolean
 *                             description: Si l'utilisateur a obtenu cette réalisation
 *                           earnedAt:
 *                             type: string
 *                             format: date-time
 */
router.get('/', optionalAuth, getAllAchievements)

/**
 * @swagger
 * /api/achievements/{id}:
 *   get:
 *     summary: Détails d'une réalisation
 *     tags: [Achievements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de la réalisation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Achievement'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', optionalAuth, getAchievementById)

/**
 * @swagger
 * /api/achievements:
 *   post:
 *     summary: Créer une réalisation (Admin)
 *     tags: [Achievements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - icon
 *               - color
 *               - condition
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Quiz Pro"
 *               description:
 *                 type: string
 *                 example: "Répondre correctement à 50 quiz"
 *               icon:
 *                 type: string
 *                 example: "🏅"
 *               color:
 *                 type: string
 *                 example: "#FFD700"
 *               xpReward:
 *                 type: integer
 *                 example: 100
 *               condition:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [modules_completed, quizzes_correct, xp_total, posts_created, daily_streak]
 *                   count:
 *                     type: integer
 *                 example:
 *                   type: quizzes_correct
 *                   count: 50
 *     responses:
 *       201:
 *         description: Réalisation créée
 *       403:
 *         description: Accès refusé (Admin requis)
 */
router.post('/', authenticate, authorize('ADMIN'), createAchievement)

export default router
