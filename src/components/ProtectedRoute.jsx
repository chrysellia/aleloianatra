import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Center, Spinner, Text, VStack } from '@chakra-ui/react'
import { useAuth } from '../context/AuthContext'

/**
 * Composant de route protégée
 * Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  // Afficher un spinner pendant le chargement de l'état d'authentification
  if (loading) {
    return (
      <Center minH="100vh">
        <VStack spacing={4}>
          <Spinner
            size="xl"
            thickness="4px"
            speed="0.65s"
            color="#03EF62"
          />
          <Text color="gray.500">Chargement...</Text>
        </VStack>
      </Center>
    )
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated) {
    // Sauvegarder l'URL actuelle pour rediriger après la connexion
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Afficher le contenu de la route si authentifié
  return children
}

