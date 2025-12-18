import { Router } from 'express'
import { 
  getUserById, 
  updateUser, 
  getUserStats,
  getUserAchievements 
} from '../controllers/users.controller.js'
import { authenticate } from '../middleware/auth.js'
import { validate, updateUserSchema } from '../middleware/validate.js'

const router = Router()

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Profil d'un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Profil de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', getUserById)

/**
 * @swagger
 * /api/users/{id}/stats:
 *   get:
 *     summary: Statistiques d'un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statistiques détaillées
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
 *                     user:
 *                       type: object
 *                       properties:
 *                         xpTotal:
 *                           type: integer
 *                         dailyStreak:
 *                           type: integer
 *                     stats:
 *                       type: object
 *                       properties:
 *                         modulesCompleted:
 *                           type: integer
 *                         quizzesAttempted:
 *                           type: integer
 *                         quizAccuracy:
 *                           type: integer
 *                         achievementsEarned:
 *                           type: integer
 */
router.get('/:id/stats', getUserStats)

/**
 * @swagger
 * /api/users/{id}/achievements:
 *   get:
 *     summary: Réalisations d'un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des réalisations obtenues
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
 *                     $ref: '#/components/schemas/Achievement'
 */
router.get('/:id/achievements', getUserAchievements)

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Modifier son profil
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               audience:
 *                 type: string
 *                 enum: [STUDENTS, DEVELOPERS, DESIGNERS, DATA_SCIENTISTS, GENERAL]
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *       403:
 *         description: Non autorisé à modifier ce profil
 */
router.put('/:id', authenticate, validate(updateUserSchema), updateUser)

export default router
