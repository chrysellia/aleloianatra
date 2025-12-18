import { Router } from 'express'
import { 
  getLessonById, 
  completeLesson,
  updateLessonProgress 
} from '../controllers/lessons.controller.js'
import { authenticate, optionalAuth } from '../middleware/auth.js'

const router = Router()

/**
 * @swagger
 * /api/lessons/{id}:
 *   get:
 *     summary: Contenu d'une leçon
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la leçon
 *     responses:
 *       200:
 *         description: Contenu complet de la leçon
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Lesson'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', optionalAuth, getLessonById)

/**
 * @swagger
 * /api/lessons/{id}/complete:
 *   post:
 *     summary: Marquer une leçon comme terminée
 *     tags: [Lessons]
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
 *               timeSpent:
 *                 type: integer
 *                 description: Temps passé en secondes
 *                 example: 300
 *     responses:
 *       200:
 *         description: Leçon complétée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     lessonProgress:
 *                       type: object
 *                     moduleProgress:
 *                       type: object
 *                       properties:
 *                         completed:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         percent:
 *                           type: integer
 *                     xpEarned:
 *                       type: integer
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/:id/complete', authenticate, completeLesson)

/**
 * @swagger
 * /api/lessons/{id}/progress:
 *   put:
 *     summary: Mettre à jour le temps passé sur une leçon
 *     tags: [Lessons]
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
 *               timeSpent:
 *                 type: integer
 *                 description: Temps additionnel passé en secondes
 *     responses:
 *       200:
 *         description: Progression mise à jour
 */
router.put('/:id/progress', authenticate, updateLessonProgress)

export default router
