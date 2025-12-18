import prisma from '../config/database.js'
import { ApiError, asyncHandler } from '../middleware/errorHandler.js'

/**
 * Get user by ID
 * GET /api/users/:id
 */
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      audience: true,
      xpTotal: true,
      dailyStreak: true,
      profileCompletion: true,
      createdAt: true,
      _count: {
        select: {
          progress: true,
          quizAttempts: true,
          achievements: true,
          communityPosts: true
        }
      }
    }
  })

  if (!user) {
    throw new ApiError(404, 'Utilisateur non trouvé')
  }

  res.json({
    success: true,
    data: user
  })
})

/**
 * Update user profile
 * PUT /api/users/:id
 */
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { name, audience } = req.body

  // Check if user is updating their own profile
  if (req.user.id !== id && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'Vous ne pouvez pas modifier ce profil')
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(audience && { audience })
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      audience: true,
      xpTotal: true,
      dailyStreak: true,
      profileCompletion: true
    }
  })

  res.json({
    success: true,
    message: 'Profil mis à jour',
    data: user
  })
})

/**
 * Get user statistics
 * GET /api/users/:id/stats
 */
export const getUserStats = asyncHandler(async (req, res) => {
  const { id } = req.params

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      xpTotal: true,
      dailyStreak: true,
      profileCompletion: true
    }
  })

  if (!user) {
    throw new ApiError(404, 'Utilisateur non trouvé')
  }

  // Get completed modules count
  const completedModules = await prisma.userProgress.count({
    where: {
      userId: id,
      progressPercent: 100
    }
  })

  // Get total modules count
  const totalModules = await prisma.module.count({
    where: { isPublished: true }
  })

  // Get quiz stats
  const totalQuizAttempts = await prisma.quizAttempt.count({
    where: { userId: id }
  })

  const correctQuizAttempts = await prisma.quizAttempt.count({
    where: { userId: id, isCorrect: true }
  })

  const xpFromQuizzes = await prisma.quizAttempt.aggregate({
    where: { userId: id },
    _sum: { xpEarned: true }
  })

  // Get achievements count
  const achievementsCount = await prisma.userAchievement.count({
    where: { userId: id }
  })

  // Calculate total time spent
  const timeSpent = await prisma.quizAttempt.aggregate({
    where: { userId: id },
    _sum: { timeSpent: true }
  })

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        xpTotal: user.xpTotal,
        dailyStreak: user.dailyStreak,
        profileCompletion: user.profileCompletion
      },
      stats: {
        modulesCompleted: completedModules,
        totalModules,
        progressPercent: totalModules > 0 
          ? Math.round((completedModules / totalModules) * 100) 
          : 0,
        quizzesAttempted: totalQuizAttempts,
        quizAccuracy: totalQuizAttempts > 0 
          ? Math.round((correctQuizAttempts / totalQuizAttempts) * 100) 
          : 0,
        xpFromQuizzes: xpFromQuizzes._sum.xpEarned || 0,
        achievementsEarned: achievementsCount,
        totalTimeSpent: timeSpent._sum.timeSpent || 0
      }
    }
  })
})

/**
 * Get user achievements
 * GET /api/users/:id/achievements
 */
export const getUserAchievements = asyncHandler(async (req, res) => {
  const { id } = req.params

  const achievements = await prisma.userAchievement.findMany({
    where: { userId: id },
    include: {
      achievement: true
    },
    orderBy: { earnedAt: 'desc' }
  })

  res.json({
    success: true,
    data: achievements.map(ua => ({
      id: ua.achievement.id,
      name: ua.achievement.name,
      description: ua.achievement.description,
      icon: ua.achievement.icon,
      color: ua.achievement.color,
      count: ua.count,
      earnedAt: ua.earnedAt
    }))
  })
})

/**
 * Add XP to user
 * Internal function (not a route)
 */
export const addXpToUser = async (userId, xpAmount) => {
  await prisma.user.update({
    where: { id: userId },
    data: {
      xpTotal: { increment: xpAmount }
    }
  })
}

