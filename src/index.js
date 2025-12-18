import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from './config/swagger.js'

// Import routes
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/users.routes.js'
import moduleRoutes from './routes/modules.routes.js'
import lessonRoutes from './routes/lessons.routes.js'
import quizRoutes from './routes/quizzes.routes.js'
import progressRoutes from './routes/progress.routes.js'
import analyzeRoutes from './routes/analyze.routes.js'
import communityRoutes from './routes/community.routes.js'
import achievementRoutes from './routes/achievements.routes.js'

// Import middleware
import { errorHandler } from './middleware/errorHandler.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Swagger UI custom options
const swaggerUiOptions = {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #03EF62 }
  `,
  customSiteTitle: "Alelo'IA-NATRA API Documentation",
  customfavIcon: '/favicon.ico'
}

// Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))

// Swagger JSON
app.get('/api/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

// Root route - API Welcome page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Alelo'IA-NATRA API</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #03045E 0%, #0A0A2E 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        .container {
          text-align: center;
          padding: 40px;
          max-width: 600px;
        }
        .logo {
          font-size: 4rem;
          margin-bottom: 20px;
        }
        h1 {
          font-size: 2.5rem;
          margin-bottom: 10px;
          background: linear-gradient(90deg, #03EF62, #00D97E);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .subtitle {
          color: #8B8BA7;
          font-size: 1.1rem;
          margin-bottom: 40px;
        }
        .status {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(3, 239, 98, 0.1);
          border: 1px solid rgba(3, 239, 98, 0.3);
          padding: 10px 20px;
          border-radius: 50px;
          margin-bottom: 40px;
        }
        .status-dot {
          width: 10px;
          height: 10px;
          background: #03EF62;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .links {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        a {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 15px 30px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: white;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s;
        }
        a:hover {
          background: rgba(3, 239, 98, 0.1);
          border-color: #03EF62;
          transform: translateY(-2px);
        }
        a.primary {
          background: linear-gradient(90deg, #03EF62, #00D97E);
          color: #03045E;
          border: none;
        }
        a.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(3, 239, 98, 0.3);
        }
        .endpoints {
          margin-top: 40px;
          text-align: left;
          background: rgba(255, 255, 255, 0.03);
          padding: 25px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .endpoints h3 {
          margin-bottom: 15px;
          color: #03EF62;
        }
        .endpoint {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .method {
          font-size: 0.75rem;
          padding: 3px 8px;
          border-radius: 4px;
          font-weight: 700;
        }
        .get { background: #61AFFE; color: white; }
        .post { background: #49CC90; color: white; }
        .path { color: #8B8BA7; font-family: monospace; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">🎓</div>
        <h1>Alelo'IA-NATRA API</h1>
        <p class="subtitle">Plateforme d'éducation à la littératie médiatique</p>
        
        <div class="status">
          <div class="status-dot"></div>
          <span>API opérationnelle</span>
        </div>
        
        <div class="links">
          <a href="/api/docs" class="primary">
            📚 Documentation Swagger
          </a>
          <a href="/api/health">
            💚 Health Check
          </a>
          <a href="/api/docs.json">
            📄 OpenAPI JSON
          </a>
        </div>
        
        <div class="endpoints">
          <h3>🔗 Endpoints principaux</h3>
          <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/api/auth/register</span>
          </div>
          <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/api/auth/login</span>
          </div>
          <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/modules</span>
          </div>
          <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/quizzes</span>
          </div>
          <div class="endpoint">
            <span class="method post">POST</span>
            <span class="path">/api/analyze</span>
          </div>
          <div class="endpoint">
            <span class="method get">GET</span>
            <span class="path">/api/community/posts</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `)
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    status: 'OK', 
    message: "Alelo'IA-NATRA API is running",
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      docs: '/api/docs',
      auth: '/api/auth',
      modules: '/api/modules',
      quizzes: '/api/quizzes',
      analyze: '/api/analyze',
      community: '/api/community'
    }
  })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/modules', moduleRoutes)
app.use('/api/lessons', lessonRoutes)
app.use('/api/quizzes', quizRoutes)
app.use('/api/progress', progressRoutes)
app.use('/api/analyze', analyzeRoutes)
app.use('/api/community', communityRoutes)
app.use('/api/achievements', achievementRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route non trouvée',
    availableEndpoints: {
      documentation: '/api/docs',
      health: '/api/health'
    }
  })
})

// Error handler
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════════════════╗
  ║                                                       ║
  ║   🚀 Alelo'IA-NATRA Backend API                       ║
  ║   📍 Server: http://localhost:${PORT}                    ║
  ║   📚 Docs: http://localhost:${PORT}/api/docs             ║
  ║   🌍 Environment: ${(process.env.NODE_ENV || 'development').padEnd(12)}               ║
  ║                                                       ║
  ╚═══════════════════════════════════════════════════════╝
  `)
})

export default app
