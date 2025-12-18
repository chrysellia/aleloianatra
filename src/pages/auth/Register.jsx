import React, { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  InputGroup,
  InputRightElement,
  IconButton,
  FormHelperText,
  useColorModeValue,
  Text,
  Link,
  VStack,
  Divider,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useAuth } from '../../context/AuthContext'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { register } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis'
    }
    
    if (!formData.email) {
      newErrors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email est invalide'
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      const success = await register(
        formData.name,
        formData.email,
        formData.password
      )
      
      if (success) {
        navigate('/dashboard')
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
    } finally {
      setIsLoading(false)
    }
  }

  const cardBg = useColorModeValue('white', 'gray.700')

  return (
    <Container maxW="md" py={12}>
      <Box
        bg={cardBg}
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        borderWidth="1px"
        borderColor={useColorModeValue('gray.200', 'gray.600')}
      >
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Heading as="h1" size="xl" mb={2}>
              Créer un compte
            </Heading>
            <Text color={useColorModeValue('gray.600', 'gray.400')}>
              Rejoignez notre communauté d'apprenants
            </Text>
          </Box>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl id="name" isRequired isInvalid={!!errors.name}>
                <FormLabel>Nom complet</FormLabel>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  size="lg"
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl id="email" isRequired isInvalid={!!errors.email}>
                <FormLabel>Adresse email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  size="lg"
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl id="password" isRequired isInvalid={!!errors.password}>
                <FormLabel>Mot de passe</FormLabel>
                <InputGroup size="lg">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                  <InputRightElement>
                    <IconButton
                      variant="ghost"
                      aria-label={showPassword ? 'Cacher le mot de passe' : 'Afficher le mot de passe'}
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowPassword(!showPassword)}
                      size="sm"
                    />
                  </InputRightElement>
                </InputGroup>
                <FormHelperText>Minimum 6 caractères</FormHelperText>
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>

              <FormControl id="confirmPassword" isRequired isInvalid={!!errors.confirmPassword}>
                <FormLabel>Confirmer le mot de passe</FormLabel>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  size="lg"
                />
                <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
              </FormControl>

              <Button
                type="submit"
                colorScheme="primary"
                size="lg"
                width="100%"
                mt={4}
                isLoading={isLoading}
                loadingText="Création du compte..."
              >
                S'inscrire
              </Button>
            </VStack>
          </form>

          <Divider my={6} />

          <Box textAlign="center">
            <Text>
              Vous avez déjà un compte ?{' '}
              <Link
                as={RouterLink}
                to="/login"
                color="primary.500"
                fontWeight="medium"
                _hover={{ textDecoration: 'underline' }}
              >
                Se connecter
              </Link>
            </Text>
          </Box>
        </VStack>
      </Box>
    </Container>
  )
}
