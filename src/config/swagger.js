import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: "Alelo'IA-NATRA API",
      version: '1.0.0',
      description: `
## 🎓 API pour la plateforme d'éducation à la littératie médiatique

Alelo'IA-NATRA est une plateforme éducative qui aide les utilisateurs à développer leur esprit critique face aux médias et à l'information.

### Fonctionnalités principales :
- 📚 **Modules** : Cours structurés sur la littératie médiatique
- 📝 **Quiz** : Questions interactives avec feedback
- 🔍 **Analyseur** : Outil d'analyse de texte pour détecter les biais
- 👥 **Communauté** : Espace d'échange entre apprenants
- 🏆 **Achievements** : Système de récompenses et XP

### Authentification :
L'API utilise JWT (JSON Web Tokens). Après connexion, incluez le token dans le header :
\`\`\`
Authorization: Bearer <votre-token>
\`\`\`
      `,
      contact: {
        name: "Alelo'IA-NATRA Team",
        email: 'contact@aleloianatra.mg'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Serveur de développement'
      },
      {
        url: 'https://api.aleloianatra.mg',
        description: 'Serveur de production'
      }
    ],
    tags: [
      { name: 'Auth', description: 'Authentification et gestion de compte' },
      { name: 'Users', description: 'Gestion des utilisateurs' },
      { name: 'Modules', description: 'Modules d\'apprentissage' },
      { name: 'Lessons', description: 'Leçons et contenu éducatif' },
      { name: 'Quizzes', description: 'Quiz et évaluations' },
      { name: 'Progress', description: 'Suivi de progression' },
      { name: 'Analyze', description: 'Analyseur de texte IA' },
      { name: 'Community', description: 'Forum communautaire' },
      { name: 'Achievements', description: 'Réalisations et badges' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Entrez votre token JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            role: { type: 'string', enum: ['USER', 'ADMIN', 'MODERATOR'] },
            audience: { type: 'string', enum: ['STUDENTS', 'DEVELOPERS', 'DESIGNERS', 'DATA_SCIENTISTS', 'GENERAL'] },
            xpTotal: { type: 'integer' },
            dailyStreak: { type: 'integer' },
            profileCompletion: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Module: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            level: { type: 'string', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PRACTICAL'] },
            audiences: { type: 'array', items: { type: 'string' } },
            estimatedMinutes: { type: 'integer' },
            imageUrl: { type: 'string' }
          }
        },
        Lesson: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            moduleId: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            summary: { type: 'string' },
            content: { type: 'string' }
          }
        },
        Quiz: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            moduleId: { type: 'string', format: 'uuid' },
            question: { type: 'string' },
            choices: { type: 'array', items: { type: 'string' } },
            difficulty: { type: 'string', enum: ['EASY', 'INTERMEDIATE', 'ADVANCED'] },
            tags: { type: 'array', items: { type: 'string' } }
          }
        },
        Post: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userId: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            content: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            likesCount: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Achievement: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            description: { type: 'string' },
            icon: { type: 'string' },
            color: { type: 'string' },
            xpReward: { type: 'integer' }
          }
        },
        AnalysisResult: {
          type: 'object',
          properties: {
            biasScore: { type: 'number', minimum: 0, maximum: 1 },
            reliabilityScore: { type: 'number', minimum: 0, maximum: 1 },
            classification: { type: 'string', enum: ['NEUTRAL', 'LOW_BIAS', 'MODERATE_BIAS', 'HIGH_BIAS'] },
            suggestions: { type: 'array', items: { type: 'string' } },
            summary: { type: 'string' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Token manquant ou invalide',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Accès non autorisé. Token manquant.'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Ressource non trouvée',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Ressource non trouvée'
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
}

export const swaggerSpec = swaggerJsdoc(options)

