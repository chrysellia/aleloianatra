import prisma from '../config/database.js'
import { ApiError, asyncHandler } from '../middleware/errorHandler.js'

/**
 * Get all posts
 * GET /api/community/posts
 */
export const getAllPosts = asyncHandler(async (req, res) => {
  const { limit = 20, offset = 0, tag } = req.query

  const where = tag ? { tags: { has: tag } } : {}

  const [posts, total] = await Promise.all([
    prisma.communityPost.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    }),
    prisma.communityPost.count({ where })
  ])

  // Check if current user liked each post
  let postsWithLikeStatus = posts

  if (req.user) {
    const userLikes = await prisma.postLike.findMany({
      where: {
        userId: req.user.id,
        postId: { in: posts.map(p => p.id) }
      }
    })

    const likedPostIds = new Set(userLikes.map(l => l.postId))

    postsWithLikeStatus = posts.map(post => ({
      ...post,
      isLikedByUser: likedPostIds.has(post.id)
    }))
  }

  res.json({
    success: true,
    data: {
      posts: postsWithLikeStatus,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + posts.length < total
      }
    }
  })
})

/**
 * Get post by ID
 * GET /api/community/posts/:id
 */
export const getPostById = asyncHandler(async (req, res) => {
  const { id } = req.params

  const post = await prisma.communityPost.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true
        }
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'asc' }
      },
      _count: {
        select: {
          likes: true
        }
      }
    }
  })

  if (!post) {
    throw new ApiError(404, 'Post non trouvé')
  }

  // Check if current user liked this post
  let isLikedByUser = false
  if (req.user) {
    const like = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId: req.user.id,
          postId: id
        }
      }
    })
    isLikedByUser = !!like
  }

  res.json({
    success: true,
    data: {
      ...post,
      isLikedByUser
    }
  })
})

/**
 * Create a new post
 * POST /api/community/posts
 */
export const createPost = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body

  const post = await prisma.communityPost.create({
    data: {
      userId: req.user.id,
      title,
      content,
      tags: tags || []
    },
    include: {
      user: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  // Award XP for creating a post
  await prisma.user.update({
    where: { id: req.user.id },
    data: {
      xpTotal: { increment: 10 }
    }
  })

  res.status(201).json({
    success: true,
    message: 'Post créé',
    data: post
  })
})

/**
 * Update a post
 * PUT /api/community/posts/:id
 */
export const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { title, content, tags } = req.body

  // Check if post exists and belongs to user
  const existingPost = await prisma.communityPost.findUnique({
    where: { id }
  })

  if (!existingPost) {
    throw new ApiError(404, 'Post non trouvé')
  }

  if (existingPost.userId !== req.user.id && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'Vous ne pouvez pas modifier ce post')
  }

  const post = await prisma.communityPost.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(content && { content }),
      ...(tags && { tags })
    },
    include: {
      user: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  res.json({
    success: true,
    message: 'Post mis à jour',
    data: post
  })
})

/**
 * Delete a post
 * DELETE /api/community/posts/:id
 */
export const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params

  // Check if post exists and belongs to user
  const existingPost = await prisma.communityPost.findUnique({
    where: { id }
  })

  if (!existingPost) {
    throw new ApiError(404, 'Post non trouvé')
  }

  if (existingPost.userId !== req.user.id && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'Vous ne pouvez pas supprimer ce post')
  }

  await prisma.communityPost.delete({
    where: { id }
  })

  res.json({
    success: true,
    message: 'Post supprimé'
  })
})

/**
 * Like/Unlike a post
 * POST /api/community/posts/:id/like
 */
export const toggleLike = asyncHandler(async (req, res) => {
  const { id } = req.params

  // Check if post exists
  const post = await prisma.communityPost.findUnique({
    where: { id }
  })

  if (!post) {
    throw new ApiError(404, 'Post non trouvé')
  }

  // Check if already liked
  const existingLike = await prisma.postLike.findUnique({
    where: {
      userId_postId: {
        userId: req.user.id,
        postId: id
      }
    }
  })

  let liked = false

  if (existingLike) {
    // Unlike
    await prisma.postLike.delete({
      where: { id: existingLike.id }
    })

    await prisma.communityPost.update({
      where: { id },
      data: { likesCount: { decrement: 1 } }
    })
  } else {
    // Like
    await prisma.postLike.create({
      data: {
        userId: req.user.id,
        postId: id
      }
    })

    await prisma.communityPost.update({
      where: { id },
      data: { likesCount: { increment: 1 } }
    })

    liked = true
  }

  res.json({
    success: true,
    data: { liked }
  })
})

/**
 * Add a comment to a post
 * POST /api/community/posts/:id/comment
 */
export const addComment = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { content } = req.body

  // Check if post exists
  const post = await prisma.communityPost.findUnique({
    where: { id }
  })

  if (!post) {
    throw new ApiError(404, 'Post non trouvé')
  }

  const comment = await prisma.comment.create({
    data: {
      userId: req.user.id,
      postId: id,
      content
    },
    include: {
      user: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  // Award XP for commenting
  await prisma.user.update({
    where: { id: req.user.id },
    data: {
      xpTotal: { increment: 2 }
    }
  })

  res.status(201).json({
    success: true,
    message: 'Commentaire ajouté',
    data: comment
  })
})

/**
 * Delete a comment
 * DELETE /api/community/comments/:id
 */
export const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params

  const comment = await prisma.comment.findUnique({
    where: { id }
  })

  if (!comment) {
    throw new ApiError(404, 'Commentaire non trouvé')
  }

  if (comment.userId !== req.user.id && req.user.role !== 'ADMIN') {
    throw new ApiError(403, 'Vous ne pouvez pas supprimer ce commentaire')
  }

  await prisma.comment.delete({
    where: { id }
  })

  res.json({
    success: true,
    message: 'Commentaire supprimé'
  })
})

