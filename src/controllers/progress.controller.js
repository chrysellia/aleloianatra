import prisma from '../config/database.js'
import { ApiError, asyncHandler } from '../middleware/errorHandler.js'

/**
 * Get user's overall progress
 * GET /api/progress
 */
export const getUserProgress = asyncHandler(async (req, res) => {
  const progress = await prisma.userProgress.findMany({
    where: { userId: req.user.id },
    include: {
      module: {
        select: {
          id: true,
          title: true,
          level: true,
          estimatedMinutes: true,
          imageUrl: true
        }
      }
    },
    orderBy: { lastAccessedAt: 'desc' }
  })

  // Get overall stats
  const totalModules = await prisma.module.count({
    where: { isPublished: true }
  })

  const completedModules = progress.filter(p => p.progressPercent === 100).length
  const inProgressModules = progress.filter(p => p.progressPercent > 0 && p.progressPercent < 100).length

  res.json({
    success: true,
    data: {
      progress,
      stats: {
        totalModules,
        completedModules,
        inProgressModules,
        notStarted: totalModules - completedModules - inProgressModules,
        overallPercent: totalModules > 0 
          ? Math.round((completedModules / totalModules) * 100)
          : 0
      }
    }
  })
})

/**
 * Get recent progress (courses in progress)
 * GET /api/progress/recent
 */
export const getRecentProgress = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query

  const recentProgress = await prisma.userProgress.findMany({
    where: {
      userId: req.user.id,
      progressPercent: { lt: 100 }
    },
    include: {
      module: {
        select: {
          id: true,
          title: true,
          description: true,
          level: true,
          estimatedMinutes: true,
          imageUrl: true,
          _count: {
            select: {
              lessons: true
            }
          }
        }
      }
    },
    orderBy: { lastAccessedAt: 'desc' },
    take: parseInt(limit)
  })

  // Calculate time remaining for each module
  const progressWithTime = recentProgress.map(p => {
    const remainingPercent = 100 - p.progressPercent
    const remainingMinutes = Math.round(
      (p.module.estimatedMinutes * remainingPercent) / 100
    )
    
    return {
      ...p,
      remainingMinutes,
      remainingTime: formatDuration(remainingMinutes)
    }
  })

  res.json({
    success: true,
    data: progressWithTime
  })
})

/**
 * Update module progress
 * POST /api/progress/:moduleId
 */
export const updateModuleProgress = asyncHandler(async (req, res) => {
  const { moduleId } = req.params
  const { progressPercent } = req.body

  // Check if module exists
  const module = await prisma.module.findUnique({
    where: { id: moduleId }
  })

  if (!module) {
    throw new ApiError(404, 'Module non trouvé')
  }

  const progress = await prisma.userProgress.upsert({
    where: {
      userId_moduleId: {
        userId: req.user.id,
        moduleId
      }
    },
    update: {
      progressPercent: Math.min(100, Math.max(0, progressPercent)),
      lastAccessedAt: new Date(),
      ...(progressPercent >= 100 && { completedAt: new Date() })
    },
    create: {
      userId: req.user.id,
      moduleId,
      progressPercent: Math.min(100, Math.max(0, progressPercent)),
      lastAccessedAt: new Date(),
      ...(progressPercent >= 100 && { completedAt: new Date() })
    }
  })

  // Check and award achievement if module completed
  if (progressPercent >= 100) {
    await checkAndAwardModuleAchievement(req.user.id)
  }

  res.json({
    success: true,
    data: progress
  })
})

/**
 * Get progress for a specific module
 * GET /api/progress/:moduleId
 */
export const getModuleProgress = asyncHandler(async (req, res) => {
  const { moduleId } = req.params

  const progress = await prisma.userProgress.findUnique({
    where: {
      userId_moduleId: {
        userId: req.user.id,
        moduleId
      }
    },
    include: {
      module: {
        select: {
          id: true,
          title: true,
          lessons: {
            select: {
              id: true,
              title: true
            }
          }
        }
      }
    }
  })

  // Get lesson progress for this module
  let lessonProgress = []
  if (progress) {
    lessonProgress = await prisma.lessonProgress.findMany({
      where: {
        userId: req.user.id,
        lessonId: { in: progress.module.lessons.map(l => l.id) }
      }
    })
  }

  res.json({
    success: true,
    data: {
      moduleProgress: progress,
      lessonProgress
    }
  })
})

/**
 * Helper: Format duration in minutes to human readable
 */
function formatDuration(minutes) {
  if (minutes < 60) {
    return `${minutes}min`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
}

/**
 * Helper: Check and award module completion achievement
 */
async function checkAndAwardModuleAchievement(userId) {
  const completedCount = await prisma.userProgress.count({
    where: {
      userId,
      progressPercent: 100
    }
  })

  // Check for "Course Crusher" achievement (3 modules completed)
  if (completedCount >= 3) {
    const achievement = await prisma.achievement.findUnique({
      where: { name: 'Course Crusher' }
    })

    if (achievement) {
      await prisma.userAchievement.upsert({
        where: {
          userId_achievementId: {
            userId,
            achievementId: achievement.id
          }
        },
        update: {
          count: completedCount
        },
        create: {
          userId,
          achievementId: achievement.id,
          count: completedCount
        }
      })
    }
  }
}

