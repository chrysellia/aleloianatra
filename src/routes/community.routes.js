import { Router } from 'express'
import { 
  getAllPosts, 
  getPostById, 
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment 
} from '../controllers/community.controller.js'
import { authenticate, optionalAuth } from '../middleware/auth.js'
import { validate, createPostSchema, createCommentSchema } from '../middleware/validate.js'

const router = Router()

/**
 * @swagger
 * /api/community/posts:
 *   get:
 *     summary: Liste des posts de la communauté
 *     tags: [Community]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filtrer par tag
 *     responses:
 *       200:
 *         description: Liste des posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     posts:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Post'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         hasMore:
 *                           type: boolean
 */
router.get('/posts', optionalAuth, getAllPosts)

/**
 * @swagger
 * /api/community/posts/{id}:
 *   get:
 *     summary: Détails d'un post
 *     tags: [Community]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du post avec commentaires
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/posts/:id', optionalAuth, getPostById)

/**
 * @swagger
 * /api/community/posts:
 *   post:
 *     summary: Créer un nouveau post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 200
 *                 example: "Comment vérifier une source ?"
 *               content:
 *                 type: string
 *                 minLength: 10
 *                 example: "Je cherche des conseils pour vérifier la fiabilité d'une source en ligne..."
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["verification", "sources", "aide"]
 *     responses:
 *       201:
 *         description: Post créé
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/posts', authenticate, validate(createPostSchema), createPost)

/**
 * @swagger
 * /api/community/posts/{id}:
 *   put:
 *     summary: Modifier un post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Post modifié
 *       403:
 *         description: Non autorisé à modifier ce post
 */
router.put('/posts/:id', authenticate, updatePost)

/**
 * @swagger
 * /api/community/posts/{id}:
 *   delete:
 *     summary: Supprimer un post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post supprimé
 *       403:
 *         description: Non autorisé à supprimer ce post
 */
router.delete('/posts/:id', authenticate, deletePost)

/**
 * @swagger
 * /api/community/posts/{id}/like:
 *   post:
 *     summary: Liker/Unliker un post
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Like togglé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     liked:
 *                       type: boolean
 */
router.post('/posts/:id/like', authenticate, toggleLike)

/**
 * @swagger
 * /api/community/posts/{id}/comment:
 *   post:
 *     summary: Ajouter un commentaire
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 1000
 *                 example: "Merci pour ce partage !"
 *     responses:
 *       201:
 *         description: Commentaire ajouté
 */
router.post('/posts/:id/comment', authenticate, validate(createCommentSchema), addComment)

/**
 * @swagger
 * /api/community/comments/{id}:
 *   delete:
 *     summary: Supprimer un commentaire
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Commentaire supprimé
 */
router.delete('/comments/:id', authenticate, deleteComment)

export default router
