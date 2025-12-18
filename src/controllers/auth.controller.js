import bcrypt from 'bcryptjs'
import prisma from '../config/database.js'
import { generateToken } from '../middleware/auth.js'
import { ApiError, asyncHandler } from '../middleware/errorHandler.js'

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, audience } = req.body

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw new ApiError(409, 'Un compte avec cet email existe déjà')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(password, salt)

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      audience: audience || 'GENERAL',
      profileCompletion: 25 // Initial profile completion
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      audience: true,
      xpTotal: true,
      dailyStreak: true,
      profileCompletion: true,
      createdAt: true
    }
  })

  // Generate token
  const token = generateToken(user.id)

  res.status(201).json({
    success: true,
    message: 'Compte créé avec succès',
    data: {
      user,
      token
    }
  })
})

/**
 * Login user
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Find user
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    throw new ApiError(401, 'Email ou mot de passe incorrect')
  }

  // Check password
  const isValidPassword = await bcrypt.compare(password, user.passwordHash)

  if (!isValidPassword) {
    throw new ApiError(401, 'Email ou mot de passe incorrect')
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() }
  })

  // Generate token
  const token = generateToken(user.id)

  res.json({
    success: true,
    message: 'Connexion réussie',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        audience: user.audience,
        xpTotal: user.xpTotal,
        dailyStreak: user.dailyStreak,
        profileCompletion: user.profileCompletion
      },
      token
    }
  })
})

/**
 * Get current user profile
 * GET /api/auth/me
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      audience: true,
      xpTotal: true,
      dailyStreak: true,
      profileCompletion: true,
      lastLoginAt: true,
      createdAt: true,
      _count: {
        select: {
          progress: true,
          quizAttempts: true,
          achievements: true
        }
      }
    }
  })

  res.json({
    success: true,
    data: user
  })
})

/**
 * Logout user (client-side token removal)
 * POST /api/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  // In JWT-based auth, logout is handled client-side
  // This endpoint is for any server-side cleanup if needed
  
  res.json({
    success: true,
    message: 'Déconnexion réussie'
  })
})

/**
 * Change password
 * PUT /api/auth/password
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body

  // Get user with password
  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  })

  // Verify current password
  const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash)

  if (!isValidPassword) {
    throw new ApiError(401, 'Mot de passe actuel incorrect')
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(newPassword, salt)

  // Update password
  await prisma.user.update({
    where: { id: req.user.id },
    data: { passwordHash }
  })

  res.json({
    success: true,
    message: 'Mot de passe modifié avec succès'
  })
})

