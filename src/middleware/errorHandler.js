/**
 * Global Error Handler Middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      message: 'Cette ressource existe déjà',
      field: err.meta?.target?.[0]
    })
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Ressource non trouvée'
    })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token invalide'
    })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expiré'
    })
  }

  // Joi validation errors
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      message: 'Données invalides',
      errors: err.details.map(d => ({
        field: d.path.join('.'),
        message: d.message
      }))
    })
  }

  // Default error
  const statusCode = err.statusCode || 500
  const message = err.message || 'Erreur interne du serveur'

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.statusCode = statusCode
    this.success = false
  }
}

/**
 * Async handler wrapper to catch errors
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

