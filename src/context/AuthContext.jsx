import React, { createContext, useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'

// Création du contexte
export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const toast = useToast()

  // Vérifier l'état de connexion au chargement
  useEffect(() => {
    const storedUser = localStorage.getItem('aleloianatra_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // Fonction de connexion
  const login = async (email, password) => {
    try {
      // Ici, vous devrez implémenter votre logique d'authentification réelle
      // Ceci est une simulation
      if (email && password) {
        const mockUser = {
          id: '123',
          email,
          name: email.split('@')[0],
          role: 'user'
        }
        
        localStorage.setItem('aleloianatra_user', JSON.stringify(mockUser))
        setUser(mockUser)
        
        toast({
          title: 'Connexion réussie',
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
        description: 'Email ou mot de passe incorrect',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
    return false
  }

  // Fonction d'inscription
  const register = async (name, email, password) => {
    try {
      // Ici, vous devrez implémenter votre logique d'inscription réelle
      // Ceci est une simulation
      if (name && email && password) {
        const newUser = {
          id: Date.now().toString(),
          name,
          email,
          role: 'user'
        }
        
        localStorage.setItem('aleloianatra_user', JSON.stringify(newUser))
        setUser(newUser)
        
        toast({
          title: 'Compte créé avec succès',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        
        navigate('/dashboard')
        return true
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast({
        title: 'Erreur lors de l\'inscription',
        description: 'Une erreur est survenue lors de la création de votre compte',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
    return false
  }

  // Fonction de déconnexion
  const logout = () => {
    localStorage.removeItem('aleloianatra_user')
    setUser(null)
    navigate('/login')
    
    toast({
      title: 'Déconnexion réussie',
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
  }

  // Valeur du contexte
  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  return useContext(AuthContext)
}
