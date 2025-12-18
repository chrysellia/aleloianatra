import { Router } from 'express'
import { 
  getAllModules, 
  getModuleById, 
  getModuleLessons,
  getModuleQuizzes,
  createModule 
} from '../controllers/modules.controller.js'
import { authenticate, optionalAuth, authorize } from '../middleware/auth.js'

const router = Router()

/**
 * @swagger
 * /api/modules:
 *   get:
 *     summary: Liste de tous les modules
 *     tags: [Modules]
 *     parameters:
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [BEGINNER, INTERMEDIATE, ADVANCED, PRACTICAL]
 *         description: Filtrer par niveau
 *       - in: query
 *         name: audience
 *         schema:
 *           type: string
 *           enum: [STUDENTS, DEVELOPERS, DESIGNERS, DATA_SCIENTISTS, GENERAL]
 *         description: Filtrer par audience
 *     responses:
 *       200:
 *         description: Liste des modules
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
 *                     $ref: '#/components/schemas/Module'
 */
router.get('/', optionalAuth, getAllModules)

/**
 * @swagger
 * /api/modules/{id}:
 *   get:
 *     summary: Détails d'un module
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du module
 *     responses:
 *       200:
 *         description: Détails du module
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Module'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', optionalAuth, getModuleById)

/**
 * @swagger
 * /api/modules/{id}/lessons:
 *   get:
 *     summary: Leçons d'un module
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des leçons
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
 *                     $ref: '#/components/schemas/Lesson'
 */
router.get('/:id/lessons', getModuleLessons)

/**
 * @swagger
 * /api/modules/{id}/quizzes:
 *   get:
 *     summary: Quiz d'un module
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
router.get('/:id/quizzes', getModuleQuizzes)

/**
 * @swagger
 * /api/modules:
 *   post:
 *     summary: Créer un module (Admin)
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - level
 *               - audiences
 *               - estimatedMinutes
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [BEGINNER, INTERMEDIATE, ADVANCED, PRACTICAL]
 *               audiences:
 *                 type: array
 *                 items:
 *                   type: string
 *               estimatedMinutes:
 *                 type: integer
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Module créé
 *       403:
 *         description: Accès refusé
 */
router.post('/', authenticate, authorize('ADMIN'), createModule)

export default router
