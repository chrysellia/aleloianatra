import prisma from '../config/database.js'
import { ApiError, asyncHandler } from '../middleware/errorHandler.js'

/**
 * Get all quizzes
 * GET /api/quizzes
 */
export const getAllQuizzes = asyncHandler(async (req, res) => {
  const { moduleId, difficulty, audience } = req.query

  const where = {
    ...(moduleId && { moduleId }),
    ...(difficulty && { difficulty: difficulty.toUpperCase() }),
    ...(audience && { audiences: { has: audience.toUpperCase() } })
  }

  const quizzes = await prisma.quiz.findMany({
    where,
    select: {
      id: true,
      moduleId: true,
      question: true,
      choices: true,
      difficulty: true,
      tags: true,
      audiences: true,
      module: {
        select: {
          id: true,
          title: true
        }
      }
    },
    orderBy: { orderIndex: 'asc' }
  })

  res.json({
    success: true,
    data: quizzes
  })
})

/**
 * Get quiz by ID
 * GET /api/quizzes/:id
 */
export const getQuizById = asyncHandler(async (req, res) => {
  const { id } = req.params

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    select: {
      id: true,
      moduleId: true,
      question: true,
      choices: true,
      difficulty: true,
      tags: true,
      audiences: true,
      module: {
        select: {
          id: true,
          title: true
        }
      }
    }
  })

  if (!quiz) {
    throw new ApiError(404, 'Quiz non trouvé')
  }

  res.json({
    success: true,
    data: quiz
  })
})

/**
 * Submit quiz answer
 * POST /api/quizzes/:id/submit
 */
export const submitQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { selectedIndex, timeSpent = 0 } = req.body

  // Get quiz with correct answer
  const quiz = await prisma.quiz.findUnique({
    where: { id }
  })

  if (!quiz) {
    throw new ApiError(404, 'Quiz non trouvé')
  }

  // Check if answer is correct
  const isCorrect = selectedIndex === quiz.correctIndex

  // Calculate XP earned
  const baseXP = 5
  const difficultyMultiplier = {
    EASY: 1,
    INTERMEDIATE: 1.5,
    ADVANCED: 2
  }
  const xpEarned = isCorrect 
    ? Math.round(baseXP * (difficultyMultiplier[quiz.difficulty] || 1))
    : 0

  // Record attempt
  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: req.user.id,
      quizId: id,
      selectedIndex,
      isCorrect,
      xpEarned,
      timeSpent
    }
  })

  // Update user XP if correct
  if (isCorrect) {
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        xpTotal: { increment: xpEarned }
      }
    })
  }

  res.json({
    success: true,
    data: {
      isCorrect,
      correctIndex: quiz.correctIndex,
      rationale: quiz.rationale,
      xpEarned,
      attempt
    }
  })
})

/**
 * Get adaptive quiz (personalized for user)
 * GET /api/quizzes/adaptive
 */
export const getAdaptiveQuiz = asyncHandler(async (req, res) => {
  const { count = 5 } = req.query

  // Get user's audience preference
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { audience: true }
  })

  // Get quizzes the user hasn't attempted recently
  const recentAttempts = await prisma.quizAttempt.findMany({
    where: {
      userId: req.user.id,
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
      }
    },
    select: { quizId: true }
  })

  const recentQuizIds = recentAttempts.map(a => a.quizId)

  // Get quizzes prioritizing user's audience
  const quizzes = await prisma.quiz.findMany({
    where: {
      id: { notIn: recentQuizIds },
      OR: [
        { audiences: { has: user.audience } },
        { audiences: { has: 'GENERAL' } }
      ]
    },
    select: {
      id: true,
      moduleId: true,
      question: true,
      choices: true,
      difficulty: true,
      tags: true,
      module: {
        select: {
          id: true,
          title: true
        }
      }
    },
    take: parseInt(count),
    orderBy: { orderIndex: 'asc' }
  })

  // If not enough quizzes, get any available
  if (quizzes.length < count) {
    const additionalQuizzes = await prisma.quiz.findMany({
      where: {
        id: { 
          notIn: [...recentQuizIds, ...quizzes.map(q => q.id)] 
        }
      },
      select: {
        id: true,
        moduleId: true,
        question: true,
        choices: true,
        difficulty: true,
        tags: true,
        module: {
          select: {
            id: true,
            title: true
          }
        }
      },
      take: parseInt(count) - quizzes.length
    })

    quizzes.push(...additionalQuizzes)
  }

  res.json({
    success: true,
    data: quizzes
  })
})

/**
 * Get user's quiz history
 * GET /api/quizzes/history
 */
export const getQuizHistory = asyncHandler(async (req, res) => {
  const { limit = 20, offset = 0 } = req.query

  const [attempts, total] = await Promise.all([
    prisma.quizAttempt.findMany({
      where: { userId: req.user.id },
      include: {
        quiz: {
          select: {
            id: true,
            question: true,
            difficulty: true,
            module: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    }),
    prisma.quizAttempt.count({
      where: { userId: req.user.id }
    })
  ])

  res.json({
    success: true,
    data: {
      attempts,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + attempts.length < total
      }
    }
  })
})

