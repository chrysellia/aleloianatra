import React, { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
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
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)
    try {
      const success = await login(email, password)
      if (success) {
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: 'Erreur de connexion',
        description: 'Une erreur est survenue lors de la connexion',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const bgColor = useColorModeValue('white', 'gray.800')
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
              Connexion
            </Heading>
            <Text color={useColorModeValue('gray.600', 'gray.400')}>
              Entrez vos identifiants pour accéder à votre compte
            </Text>
          </Box>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel>Adresse email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  size="lg"
                />
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel>Mot de passe</FormLabel>
                <InputGroup size="lg">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                <Box textAlign="right" mt={2}>
                  <Link
                    as={RouterLink}
                    to="/forgot-password"
                    color="primary.500"
                    fontSize="sm"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    Mot de passe oublié ?
                  </Link>
                </Box>
              </FormControl>

              <Button
                type="submit"
                colorScheme="primary"
                size="lg"
                width="100%"
                mt={4}
                isLoading={isLoading}
                loadingText="Connexion en cours..."
              >
                Se connecter
              </Button>
            </VStack>
          </form>

          <Divider my={6} />

          <Box textAlign="center">
            <Text>
              Pas encore de compte ?{' '}
              <Link
                as={RouterLink}
                to="/register"
                color="primary.500"
                fontWeight="medium"
                _hover={{ textDecoration: 'underline' }}
              >
                S'inscrire
              </Link>
            </Text>
          </Box>
        </VStack>
      </Box>
    </Container>
  )
}
