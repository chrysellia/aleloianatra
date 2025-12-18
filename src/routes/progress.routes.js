import { Router } from 'express'
import { 
  getUserProgress, 
  getRecentProgress,
  updateModuleProgress,
  getModuleProgress 
} from '../controllers/progress.controller.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// All routes require authentication
router.use(authenticate)

/**
 * @swagger
 * /api/progress:
 *   get:
 *     summary: Progression globale de l'utilisateur
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Progression sur tous les modules
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
 *                     progress:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           moduleId:
 *                             type: string
 *                           progressPercent:
 *                             type: integer
 *                           completedAt:
 *                             type: string
 *                             format: date-time
 *                     stats:
 *                       type: object
 *                       properties:
 *                         totalModules:
 *                           type: integer
 *                         completedModules:
 *                           type: integer
 *                         inProgressModules:
 *                           type: integer
 *                         overallPercent:
 *                           type: integer
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', getUserProgress)

/**
 * @swagger
 * /api/progress/recent:
 *   get:
 *     summary: Cours en cours (récents)
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Nombre de cours à retourner
 *     responses:
 *       200:
 *         description: Cours récemment accédés
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
 *                     type: object
 *                     properties:
 *                       moduleId:
 *                         type: string
 *                       progressPercent:
 *                         type: integer
 *                       remainingMinutes:
 *                         type: integer
 *                       remainingTime:
 *                         type: string
 *                         example: "15min"
 *                       module:
 *                         $ref: '#/components/schemas/Module'
 */
router.get('/recent', getRecentProgress)

/**
 * @swagger
 * /api/progress/{moduleId}:
 *   get:
 *     summary: Progression sur un module spécifique
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Progression détaillée du module
 */
router.get('/:moduleId', getModuleProgress)

/**
 * @swagger
 * /api/progress/{moduleId}:
 *   post:
 *     summary: Mettre à jour la progression d'un module
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: moduleId
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
 *               - progressPercent
 *             properties:
 *               progressPercent:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 50
 *     responses:
 *       200:
 *         description: Progression mise à jour
 */
router.post('/:moduleId', updateModuleProgress)

export default router
