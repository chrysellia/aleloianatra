import { Router } from 'express'
import {
  getLessonForAI,
  getModuleForAI,
  getUserQuizErrors,
  getUserProgressForAI,
  getModuleQuizzesForAI
} from '../controllers/ai-internal.controller.js'

const router = Router()

/**
 * Internal API routes for AI Brain service
 * These endpoints are used by the Brain service to fetch context
 */

/**
 * @swagger
 * /api/internal/lessons/{lessonId}:
 *   get:
 *     summary: Get lesson content for AI (internal)
 *     tags: [AI Internal]
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lesson content
 */
router.get('/lessons/:lessonId', getLessonForAI)

/**
 * @swagger
 * /api/internal/modules/{moduleId}:
 *   get:
 *     summary: Get module with lessons and quizzes for AI (internal)
 *     tags: [AI Internal]
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Module data
 */
router.get('/modules/:moduleId', getModuleForAI)

/**
 * @swagger
 * /api/internal/modules/{moduleId}/quizzes:
 *   get:
 *     summary: Get all quizzes for a module (internal)
 *     tags: [AI Internal]
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of quizzes
 */
router.get('/modules/:moduleId/quizzes', getModuleQuizzesForAI)

/**
 * @swagger
 * /api/internal/user/{userId}/quiz-errors/{moduleId}:
 *   get:
 *     summary: Get user quiz errors for AI (internal)
 *     tags: [AI Internal]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of quiz errors
 */
router.get('/user/:userId/quiz-errors/:moduleId', getUserQuizErrors)

/**
 * @swagger
 * /api/internal/user/{userId}/progress/{moduleId}:
 *   get:
 *     summary: Get user progress for AI (internal)
 *     tags: [AI Internal]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User progress data
 */
router.get('/user/:userId/progress/:moduleId', getUserProgressForAI)

export default router

