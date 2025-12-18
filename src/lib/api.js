/**
 * Configuration API pour Alelo'IA NATRA
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * Récupère le token JWT depuis le localStorage
 */
const getToken = () => {
  return localStorage.getItem('aleloianatra_token')
}

/**
 * Effectue une requête API avec gestion automatique du token
 */
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken()
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    const data = await response.json()

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || 'Une erreur est survenue',
        errors: data.errors || []
      }
    }

    return data
  } catch (error) {
    // Si c'est une erreur réseau
    if (error instanceof TypeError) {
      throw {
        status: 0,
        message: 'Impossible de se connecter au serveur. Vérifiez votre connexion.',
        errors: []
      }
    }
    throw error
  }
}

/**
 * API Auth
 */
export const authAPI = {
  /**
   * Inscription
   * @param {object} data - { name, email, password, audience? }
   */
  register: async (data) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Connexion
   * @param {object} data - { email, password }
   */
  login: async (data) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Récupérer le profil de l'utilisateur connecté
   */
  getMe: async () => {
    return apiRequest('/auth/me', {
      method: 'GET',
    })
  },

  /**
   * Déconnexion
   */
  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    })
  },

  /**
   * Changer le mot de passe
   * @param {object} data - { currentPassword, newPassword }
   */
  changePassword: async (data) => {
    return apiRequest('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
}

/**
 * API Users
 */
export const usersAPI = {
  getById: async (id) => apiRequest(`/users/${id}`),
  update: async (id, data) => apiRequest(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getStats: async (id) => apiRequest(`/users/${id}/stats`),
  getAchievements: async (id) => apiRequest(`/users/${id}/achievements`),
}

/**
 * API Modules
 */
export const modulesAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiRequest(`/modules${query ? `?${query}` : ''}`)
  },
  getById: async (id) => apiRequest(`/modules/${id}`),
  getLessons: async (id) => apiRequest(`/modules/${id}/lessons`),
  getQuizzes: async (id) => apiRequest(`/modules/${id}/quizzes`),
}

/**
 * API Lessons
 */
export const lessonsAPI = {
  getById: async (id) => apiRequest(`/lessons/${id}`),
  complete: async (id, data = {}) => apiRequest(`/lessons/${id}/complete`, { method: 'POST', body: JSON.stringify(data) }),
  updateProgress: async (id, data) => apiRequest(`/lessons/${id}/progress`, { method: 'PUT', body: JSON.stringify(data) }),
}

/**
 * API Quizzes
 */
export const quizzesAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiRequest(`/quizzes${query ? `?${query}` : ''}`)
  },
  getById: async (id) => apiRequest(`/quizzes/${id}`),
  submit: async (id, data) => apiRequest(`/quizzes/${id}/submit`, { method: 'POST', body: JSON.stringify(data) }),
  getAdaptive: async (count = 5) => apiRequest(`/quizzes/user/adaptive?count=${count}`),
  getHistory: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiRequest(`/quizzes/user/history${query ? `?${query}` : ''}`)
  },
}

/**
 * API Progress
 */
export const progressAPI = {
  getAll: async () => apiRequest('/progress'),
  getRecent: async (limit = 5) => apiRequest(`/progress/recent?limit=${limit}`),
  getByModule: async (moduleId) => apiRequest(`/progress/${moduleId}`),
  update: async (moduleId, data) => apiRequest(`/progress/${moduleId}`, { method: 'POST', body: JSON.stringify(data) }),
}

/**
 * API Analyze
 */
export const analyzeAPI = {
  analyze: async (text) => apiRequest('/analyze', { method: 'POST', body: JSON.stringify({ text }) }),
  getHistory: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiRequest(`/analyze/history${query ? `?${query}` : ''}`)
  },
  getById: async (id) => apiRequest(`/analyze/${id}`),
}

/**
 * API Community
 */
export const communityAPI = {
  getPosts: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiRequest(`/community/posts${query ? `?${query}` : ''}`)
  },
  getPost: async (id) => apiRequest(`/community/posts/${id}`),
  createPost: async (data) => apiRequest('/community/posts', { method: 'POST', body: JSON.stringify(data) }),
  updatePost: async (id, data) => apiRequest(`/community/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePost: async (id) => apiRequest(`/community/posts/${id}`, { method: 'DELETE' }),
  toggleLike: async (id) => apiRequest(`/community/posts/${id}/like`, { method: 'POST' }),
  addComment: async (id, content) => apiRequest(`/community/posts/${id}/comment`, { method: 'POST', body: JSON.stringify({ content }) }),
  deleteComment: async (id) => apiRequest(`/community/comments/${id}`, { method: 'DELETE' }),
}

/**
 * API Achievements
 */
export const achievementsAPI = {
  getAll: async () => apiRequest('/achievements'),
  getById: async (id) => apiRequest(`/achievements/${id}`),
}

export default {
  auth: authAPI,
  users: usersAPI,
  modules: modulesAPI,
  lessons: lessonsAPI,
  quizzes: quizzesAPI,
  progress: progressAPI,
  analyze: analyzeAPI,
  community: communityAPI,
  achievements: achievementsAPI,
}

