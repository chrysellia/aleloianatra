import prisma from '../config/database.js'
import { ApiError, asyncHandler } from '../middleware/errorHandler.js'

/**
 * Get lesson by ID
 * GET /api/lessons/:id
 */
export const getLessonById = asyncHandler(async (req, res) => {
  const { id } = req.params

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
      module: {
        select: {
          id: true,
          title: true
        }
      }
    }
  })

  if (!lesson) {
    throw new ApiError(404, 'Leçon non trouvée')
  }

  // Get user progress if authenticated
  let progress = null
  if (req.user) {
    progress = await prisma.lessonProgress.findUnique({
      where: {
        lessonId_userId: {
          lessonId: id,
          userId: req.user.id
        }
      }
    })
  }

  res.json({
    success: true,
    data: {
      ...lesson,
      progress
    }
  })
})

/**
 * Mark lesson as complete
 * POST /api/lessons/:id/complete
 */
export const completeLesson = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { timeSpent = 0 } = req.body

  // Check if lesson exists
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
      module: {
        include: {
          lessons: true
        }
      }
    }
  })

  if (!lesson) {
    throw new ApiError(404, 'Leçon non trouvée')
  }

  // Update or create lesson progress
  const lessonProgress = await prisma.lessonProgress.upsert({
    where: {
      lessonId_userId: {
        lessonId: id,
        userId: req.user.id
      }
    },
    update: {
      completed: true,
      completedAt: new Date(),
      timeSpent: { increment: timeSpent }
    },
    create: {
      lessonId: id,
      userId: req.user.id,
      completed: true,
      completedAt: new Date(),
      timeSpent
    }
  })

  // Calculate module progress
  const totalLessons = lesson.module.lessons.length
  const completedLessons = await prisma.lessonProgress.count({
    where: {
      userId: req.user.id,
      lessonId: { in: lesson.module.lessons.map(l => l.id) },
      completed: true
    }
  })

  const progressPercent = Math.round((completedLessons / totalLessons) * 100)

  // Update module progress
  await prisma.userProgress.upsert({
    where: {
      userId_moduleId: {
        userId: req.user.id,
        moduleId: lesson.moduleId
      }
    },
    update: {
      progressPercent,
      lastAccessedAt: new Date(),
      ...(progressPercent === 100 && { completedAt: new Date() })
    },
    create: {
      userId: req.user.id,
      moduleId: lesson.moduleId,
      progressPercent,
      lastAccessedAt: new Date(),
      ...(progressPercent === 100 && { completedAt: new Date() })
    }
  })

  // Award XP for completing lesson
  const xpEarned = 10
  await prisma.user.update({
    where: { id: req.user.id },
    data: {
      xpTotal: { increment: xpEarned }
    }
  })

  res.json({
    success: true,
    message: 'Leçon complétée',
    data: {
      lessonProgress,
      moduleProgress: {
        completed: completedLessons,
        total: totalLessons,
        percent: progressPercent
      },
      xpEarned
    }
  })
})

/**
 * Update lesson progress (time tracking)
 * PUT /api/lessons/:id/progress
 */
export const updateLessonProgress = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { timeSpent = 0 } = req.body

  const progress = await prisma.lessonProgress.upsert({
    where: {
      lessonId_userId: {
        lessonId: id,
        userId: req.user.id
      }
    },
    update: {
      timeSpent: { increment: timeSpent }
    },
    create: {
      lessonId: id,
      userId: req.user.id,
      timeSpent
    }
  })

  res.json({
    success: true,
    data: progress
  })
})

