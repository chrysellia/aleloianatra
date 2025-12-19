import prisma from '../config/database.js'
import { asyncHandler, ApiError } from '../middleware/errorHandler.js'

/**
 * Get lesson content for AI (internal endpoint)
 * GET /api/internal/lessons/:lessonId
 */
export const getLessonForAI = asyncHandler(async (req, res) => {
  const { lessonId } = req.params

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: {
        select: {
          id: true,
          title: true,
          description: true,
          level: true
        }
      }
    }
  })

  if (!lesson) {
    throw new ApiError(404, 'Leçon non trouvée')
  }

  res.json({
    success: true,
    data: {
      id: lesson.id,
      title: lesson.title,
      summary: lesson.summary,
      content: lesson.content,
      module: {
        id: lesson.module.id,
        title: lesson.module.title,
        description: lesson.module.description,
        level: lesson.module.level
      }
    }
  })
})

/**
 * Get module with all lessons for AI (internal endpoint)
 * GET /api/internal/modules/:moduleId
 */
export const getModuleForAI = asyncHandler(async (req, res) => {
  const { moduleId } = req.params

  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    include: {
      lessons: {
        orderBy: { orderIndex: 'asc' },
        select: {
          id: true,
          title: true,
          summary: true,
          content: true,
          orderIndex: true
        }
      },
      quizzes: {
        orderBy: { orderIndex: 'asc' },
        select: {
          id: true,
          question: true,
          choices: true,
          correctIndex: true,
          rationale: true,
          difficulty: true
        }
      }
    }
  })

  if (!module) {
    throw new ApiError(404, 'Module non trouvé')
  }

  res.json({
    success: true,
    data: module
  })
})

/**
 * Get user quiz errors for AI (internal endpoint)
 * GET /api/internal/user/:userId/quiz-errors/:moduleId
 */
export const getUserQuizErrors = asyncHandler(async (req, res) => {
  const { userId, moduleId } = req.params
  const { limit = 10 } = req.query

  // Récupérer les tentatives incorrectes récentes
  const incorrectAttempts = await prisma.quizAttempt.findMany({
    where: {
      userId,
      isCorrect: false,
      quiz: {
        moduleId
      }
    },
    include: {
      quiz: {
        select: {
          id: true,
          question: true,
          choices: true,
          correctIndex: true,
          rationale: true,
          difficulty: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: parseInt(limit)
  })

  // Formater les erreurs
  const errors = incorrectAttempts.map(attempt => ({
    quizId: attempt.quiz.id,
    question: attempt.quiz.question,
    selectedAnswer: attempt.quiz.choices[attempt.selectedIndex] || 'Non spécifié',
    correctAnswer: attempt.quiz.choices[attempt.quiz.correctIndex],
    correctIndex: attempt.quiz.correctIndex,
    rationale: attempt.quiz.rationale,
    difficulty: attempt.quiz.difficulty,
    attemptedAt: attempt.createdAt
  }))

  res.json({
    success: true,
    data: errors
  })
})

/**
 * Get user progress for AI (internal endpoint)
 * GET /api/internal/user/:userId/progress/:moduleId
 */
export const getUserProgressForAI = asyncHandler(async (req, res) => {
  const { userId, moduleId } = req.params

  // Récupérer la progression du module
  const moduleProgress = await prisma.userProgress.findUnique({
    where: {
      userId_moduleId: {
        userId,
        moduleId
      }
    }
  })

  // Récupérer la progression des leçons
  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    include: {
      lessons: {
        select: { id: true }
      }
    }
  })

  const lessonIds = module?.lessons.map(l => l.id) || []
  const lessonProgress = await prisma.lessonProgress.findMany({
    where: {
      userId,
      lessonId: { in: lessonIds }
    }
  })

  const completedLessons = lessonProgress
    .filter(lp => lp.completed)
    .map(lp => lp.lessonId)

  res.json({
    success: true,
    data: {
      moduleProgress: moduleProgress?.progressPercent || 0,
      completedLessons,
      totalLessons: lessonIds.length,
      lastAccessedAt: moduleProgress?.lastAccessedAt || null
    }
  })
})

/**
 * Get all quizzes for a module (internal endpoint)
 * GET /api/internal/modules/:moduleId/quizzes
 */
export const getModuleQuizzesForAI = asyncHandler(async (req, res) => {
  const { moduleId } = req.params

  const quizzes = await prisma.quiz.findMany({
    where: { moduleId },
    orderBy: { orderIndex: 'asc' },
    select: {
      id: true,
      question: true,
      choices: true,
      correctIndex: true,
      rationale: true,
      difficulty: true,
      tags: true
    }
  })

  res.json({
    success: true,
    data: quizzes
  })
})

