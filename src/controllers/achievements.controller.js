import prisma from '../config/database.js'
import { ApiError, asyncHandler } from '../middleware/errorHandler.js'

/**
 * Get all achievements
 * GET /api/achievements
 */
export const getAllAchievements = asyncHandler(async (req, res) => {
  const achievements = await prisma.achievement.findMany({
    orderBy: { name: 'asc' }
  })

  // If user is authenticated, include their earned achievements
  let achievementsWithStatus = achievements

  if (req.user) {
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: req.user.id }
    })

    const earnedMap = new Map(
      userAchievements.map(ua => [ua.achievementId, ua])
    )

    achievementsWithStatus = achievements.map(achievement => ({
      ...achievement,
      earned: earnedMap.has(achievement.id),
      earnedAt: earnedMap.get(achievement.id)?.earnedAt || null,
      count: earnedMap.get(achievement.id)?.count || 0
    }))
  }

  res.json({
    success: true,
    data: achievementsWithStatus
  })
})

/**
 * Get achievement by ID
 * GET /api/achievements/:id
 */
export const getAchievementById = asyncHandler(async (req, res) => {
  const { id } = req.params

  const achievement = await prisma.achievement.findUnique({
    where: { id }
  })

  if (!achievement) {
    throw new ApiError(404, 'Réalisation non trouvée')
  }

  // Check if user has earned this achievement
  let userAchievement = null
  if (req.user) {
    userAchievement = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId: req.user.id,
          achievementId: id
        }
      }
    })
  }

  res.json({
    success: true,
    data: {
      ...achievement,
      earned: !!userAchievement,
      earnedAt: userAchievement?.earnedAt || null,
      count: userAchievement?.count || 0
    }
  })
})

/**
 * Check and award achievements for user
 * Internal function called after various actions
 */
export const checkAndAwardAchievements = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      progress: true,
      quizAttempts: true,
      communityPosts: true
    }
  })

  if (!user) return

  const achievements = await prisma.achievement.findMany()
  const awardedAchievements = []

  for (const achievement of achievements) {
    const condition = achievement.condition
    let shouldAward = false
    let count = 0

    switch (condition.type) {
      case 'modules_completed':
        count = user.progress.filter(p => p.progressPercent === 100).length
        shouldAward = count >= condition.count
        break

      case 'quizzes_correct':
        count = user.quizAttempts.filter(a => a.isCorrect).length
        shouldAward = count >= condition.count
        break

      case 'xp_total':
        count = user.xpTotal
        shouldAward = count >= condition.count
        break

      case 'posts_created':
        count = user.communityPosts.length
        shouldAward = count >= condition.count
        break

      case 'daily_streak':
        count = user.dailyStreak
        shouldAward = count >= condition.count
        break
    }

    if (shouldAward) {
      const existing = await prisma.userAchievement.findUnique({
        where: {
          userId_achievementId: {
            userId,
            achievementId: achievement.id
          }
        }
      })

      if (!existing) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
            count
          }
        })

        // Award XP for achievement
        await prisma.user.update({
          where: { id: userId },
          data: {
            xpTotal: { increment: achievement.xpReward }
          }
        })

        awardedAchievements.push(achievement)
      } else if (existing.count < count) {
        // Update count
        await prisma.userAchievement.update({
          where: { id: existing.id },
          data: { count }
        })
      }
    }
  }

  return awardedAchievements
}

/**
 * Create achievement (Admin only)
 * POST /api/achievements
 */
export const createAchievement = asyncHandler(async (req, res) => {
  const { name, description, icon, color, xpReward, condition } = req.body

  const achievement = await prisma.achievement.create({
    data: {
      name,
      description,
      icon,
      color,
      xpReward: xpReward || 0,
      condition
    }
  })

  res.status(201).json({
    success: true,
    message: 'Réalisation créée',
    data: achievement
  })
})

