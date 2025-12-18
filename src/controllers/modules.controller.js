import prisma from '../config/database.js'
import { ApiError, asyncHandler } from '../middleware/errorHandler.js'

/**
 * Get all modules
 * GET /api/modules
 */
export const getAllModules = asyncHandler(async (req, res) => {
  const { level, audience } = req.query

  const where = {
    isPublished: true,
    ...(level && { level: level.toUpperCase() }),
    ...(audience && { audiences: { has: audience.toUpperCase() } })
  }

  const modules = await prisma.module.findMany({
    where,
    include: {
      _count: {
        select: {
          lessons: true,
          quizzes: true
        }
      }
    },
    orderBy: { orderIndex: 'asc' }
  })

  // If user is authenticated, include their progress
  let modulesWithProgress = modules

  if (req.user) {
    const userProgress = await prisma.userProgress.findMany({
      where: { userId: req.user.id }
    })

    const progressMap = new Map(
      userProgress.map(p => [p.moduleId, p])
    )

    modulesWithProgress = modules.map(module => ({
      ...module,
      userProgress: progressMap.get(module.id) || null
    }))
  }

  res.json({
    success: true,
    data: modulesWithProgress
  })
})

/**
 * Get module by ID
 * GET /api/modules/:id
 */
export const getModuleById = asyncHandler(async (req, res) => {
  const { id } = req.params

  const module = await prisma.module.findUnique({
    where: { id },
    include: {
      lessons: {
        orderBy: { orderIndex: 'asc' },
        select: {
          id: true,
          title: true,
          summary: true,
          orderIndex: true
        }
      },
      _count: {
        select: {
          quizzes: true
        }
      }
    }
  })

  if (!module) {
    throw new ApiError(404, 'Module non trouvé')
  }

  // Get user progress if authenticated
  let userProgress = null
  let lessonProgress = []

  if (req.user) {
    userProgress = await prisma.userProgress.findUnique({
      where: {
        userId_moduleId: {
          userId: req.user.id,
          moduleId: id
        }
      }
    })

    lessonProgress = await prisma.lessonProgress.findMany({
      where: {
        userId: req.user.id,
        lessonId: { in: module.lessons.map(l => l.id) }
      }
    })
  }

  const lessonProgressMap = new Map(
    lessonProgress.map(lp => [lp.lessonId, lp])
  )

  const lessonsWithProgress = module.lessons.map(lesson => ({
    ...lesson,
    progress: lessonProgressMap.get(lesson.id) || null
  }))

  res.json({
    success: true,
    data: {
      ...module,
      lessons: lessonsWithProgress,
      userProgress
    }
  })
})

/**
 * Get module lessons
 * GET /api/modules/:id/lessons
 */
export const getModuleLessons = asyncHandler(async (req, res) => {
  const { id } = req.params

  const lessons = await prisma.lesson.findMany({
    where: { moduleId: id },
    orderBy: { orderIndex: 'asc' }
  })

  res.json({
    success: true,
    data: lessons
  })
})

/**
 * Get module quizzes
 * GET /api/modules/:id/quizzes
 */
export const getModuleQuizzes = asyncHandler(async (req, res) => {
  const { id } = req.params

  const quizzes = await prisma.quiz.findMany({
    where: { moduleId: id },
    orderBy: { orderIndex: 'asc' },
    select: {
      id: true,
      question: true,
      choices: true,
      difficulty: true,
      tags: true,
      audiences: true
    }
  })

  res.json({
    success: true,
    data: quizzes
  })
})

/**
 * Create module (Admin only)
 * POST /api/modules
 */
export const createModule = asyncHandler(async (req, res) => {
  const { title, description, level, audiences, estimatedMinutes, imageUrl } = req.body

  // Get the next order index
  const lastModule = await prisma.module.findFirst({
    orderBy: { orderIndex: 'desc' }
  })

  const module = await prisma.module.create({
    data: {
      title,
      description,
      level: level.toUpperCase(),
      audiences: audiences.map(a => a.toUpperCase()),
      estimatedMinutes,
      imageUrl,
      orderIndex: (lastModule?.orderIndex || 0) + 1
    }
  })

  res.status(201).json({
    success: true,
    message: 'Module créé',
    data: module
  })
})

