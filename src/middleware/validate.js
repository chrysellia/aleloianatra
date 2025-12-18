import Joi from 'joi'

/**
 * Validation middleware factory
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    })

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: error.details.map(d => ({
          field: d.path.join('.'),
          message: d.message.replace(/"/g, '')
        }))
      })
    }

    req.body = value
    next()
  }
}

// ============ AUTH SCHEMAS ============
export const registerSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne peut pas dépasser 100 caractères',
      'any.required': 'Le nom est requis'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email invalide',
      'any.required': 'L\'email est requis'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
      'any.required': 'Le mot de passe est requis'
    }),
  audience: Joi.string()
    .valid('STUDENTS', 'DEVELOPERS', 'DESIGNERS', 'DATA_SCIENTISTS', 'GENERAL')
    .default('GENERAL')
})

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email invalide',
      'any.required': 'L\'email est requis'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Le mot de passe est requis'
    })
})

// ============ USER SCHEMAS ============
export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  audience: Joi.string().valid('STUDENTS', 'DEVELOPERS', 'DESIGNERS', 'DATA_SCIENTISTS', 'GENERAL')
})

// ============ QUIZ SCHEMAS ============
export const submitQuizSchema = Joi.object({
  selectedIndex: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'L\'index sélectionné doit être un nombre',
      'any.required': 'L\'index de la réponse est requis'
    }),
  timeSpent: Joi.number()
    .integer()
    .min(0)
    .default(0)
})

// ============ COMMUNITY SCHEMAS ============
export const createPostSchema = Joi.object({
  title: Joi.string()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.min': 'Le titre doit contenir au moins 5 caractères',
      'string.max': 'Le titre ne peut pas dépasser 200 caractères',
      'any.required': 'Le titre est requis'
    }),
  content: Joi.string()
    .min(10)
    .required()
    .messages({
      'string.min': 'Le contenu doit contenir au moins 10 caractères',
      'any.required': 'Le contenu est requis'
    }),
  tags: Joi.array()
    .items(Joi.string())
    .default([])
})

export const createCommentSchema = Joi.object({
  content: Joi.string()
    .min(1)
    .max(1000)
    .required()
    .messages({
      'string.min': 'Le commentaire ne peut pas être vide',
      'string.max': 'Le commentaire ne peut pas dépasser 1000 caractères',
      'any.required': 'Le commentaire est requis'
    })
})

// ============ ANALYZE SCHEMAS ============
export const analyzeTextSchema = Joi.object({
  text: Joi.string()
    .min(10)
    .max(10000)
    .required()
    .messages({
      'string.min': 'Le texte doit contenir au moins 10 caractères',
      'string.max': 'Le texte ne peut pas dépasser 10000 caractères',
      'any.required': 'Le texte à analyser est requis'
    })
})

