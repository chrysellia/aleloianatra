import React, { createContext, useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { authAPI } from '../lib/api'

// Création du contexte
export const AuthContext = createContext()

// Clés localStorage
const TOKEN_KEY = 'aleloianatra_token'
const USER_KEY = 'aleloianatra_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const toast = useToast()

  // Vérifier l'état de connexion au chargement
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY)
      const storedUser = localStorage.getItem(USER_KEY)
      
      if (token && storedUser) {
        try {
          // Vérifier si le token est encore valide
          const response = await authAPI.getMe()
          if (response.success) {
            setUser(response.data)
            localStorage.setItem(USER_KEY, JSON.stringify(response.data))
          } else {
            // Token invalide, nettoyer
            clearAuth()
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          // En cas d'erreur, utiliser les données stockées
          setUser(JSON.parse(storedUser))
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  // Nettoyer l'authentification
  const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  // Sauvegarder l'authentification
  const saveAuth = (userData, token) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
    setUser(userData)
  }

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password })
      
      if (response.success) {
        saveAuth(response.data.user, response.data.token)
        
        toast({
          title: 'Connexion réussie',
          description: `Bienvenue, ${response.data.user.name} !`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        
        navigate('/dashboard')
        return true
      }
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: 'Erreur de connexion',
        description: error.message || 'Email ou mot de passe incorrect',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
    return false
  }

  // Fonction d'inscription
  const register = async (name, email, password, audience = 'GENERAL') => {
    try {
      const response = await authAPI.register({ name, email, password, audience })
      
      if (response.success) {
        saveAuth(response.data.user, response.data.token)
        
        toast({
          title: 'Compte créé avec succès',
          description: `Bienvenue sur Alelo'IA NATRA, ${response.data.user.name} !`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        
        navigate('/dashboard')
        return true
      }
    } catch (error) {
      console.error('Registration error:', error)
      
      let errorMessage = 'Une erreur est survenue lors de la création de votre compte'
      
      if (error.status === 409) {
        errorMessage = 'Un compte avec cet email existe déjà'
      } else if (error.errors && error.errors.length > 0) {
        errorMessage = error.errors.map(e => e.message).join(', ')
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast({
        title: 'Erreur lors de l\'inscription',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
    return false
  }

  // Fonction de déconnexion
  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
    
    clearAuth()
    navigate('/login')
    
    toast({
      title: 'Déconnexion réussie',
      description: 'À bientôt !',
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
  }

  // Rafraîchir les données utilisateur
  const refreshUser = async () => {
    try {
      const response = await authAPI.getMe()
      if (response.success) {
        setUser(response.data)
        localStorage.setItem(USER_KEY, JSON.stringify(response.data))
        return response.data
      }
    } catch (error) {
      console.error('Refresh user error:', error)
    }
    return null
  }

  // Valeur du contexte
  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
