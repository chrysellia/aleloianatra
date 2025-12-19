import React, { useState, useEffect } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Badge,
  Icon,
  Flex,
  Button,
  InputGroup,
  InputLeftElement,
  Input,
  Select,
  Avatar,
  Link,
  Spinner,
  Center,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { FaGlobeAfrica, FaNewspaper, FaBrain, FaShieldAlt, FaUsers, FaBook } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import Logo from '../../components/Logo'
import { modulesAPI } from '../../lib/api'

export default function Modules() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const cardBg = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const hoverBg = useColorModeValue('gray.50', 'gray.600')
  const bgColor = useColorModeValue('white', 'gray.800')
  const textSecondary = useColorModeValue('gray.600', 'gray.400')
  const greenColor = '#00D97E'
  const darkBlue = '#0B1426'
  
  const userName = user?.name || 'Utilisateur'

  // États pour les modules
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')

  // Mapping des icônes et couleurs par mot-clé dans le titre
  const getModuleMetadata = (module) => {
    const titleLower = module.title.toLowerCase()
    
    // Déterminer l'icône et la couleur basés sur le titre
    if (titleLower.includes('média') || titleLower.includes('information') || titleLower.includes('fake news') || titleLower.includes('vérification')) {
      return { icon: FaNewspaper, color: 'blue' }
    }
    if (titleLower.includes('pensée') || titleLower.includes('critique') || titleLower.includes('raisonnement')) {
      return { icon: FaBrain, color: 'purple' }
    }
    if (titleLower.includes('numérique') || titleLower.includes('digital') || titleLower.includes('littératie')) {
      return { icon: FaGlobeAfrica, color: 'green' }
    }
    if (titleLower.includes('sécurité') || titleLower.includes('protection') || titleLower.includes('sécuriser')) {
      return { icon: FaShieldAlt, color: 'red' }
    }
    if (titleLower.includes('réseau') || titleLower.includes('social') || titleLower.includes('communauté')) {
      return { icon: FaUsers, color: 'pink' }
    }
    if (titleLower.includes('finance') || titleLower.includes('financier') || titleLower.includes('budget') || titleLower.includes('épargne')) {
      return { icon: FaBook, color: 'teal' }
    }
    
    // Par défaut
    return { icon: FaBook, color: 'gray' }
  }

  // Charger les modules depuis l'API
  useEffect(() => {
    const fetchModules = async () => {
      try {
        setLoading(true)
        const params = {}
        if (levelFilter !== 'all') {
          params.level = levelFilter.toUpperCase()
        }
        
        const response = await modulesAPI.getAll(params)
        if (response.success) {
          // Mapper les modules avec les métadonnées (icône, couleur, etc.)
          const mappedModules = response.data.map(module => {
            const metadata = getModuleMetadata(module)
            return {
              ...module,
              icon: metadata.icon,
              color: metadata.color,
              moduleCount: module._count?.lessons || 0,
            }
          })
          setModules(mappedModules)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des modules:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchModules()
  }, [levelFilter])

  // Filtrer les modules par recherche
  const filteredModules = modules.filter(module => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      module.title.toLowerCase().includes(query) ||
      module.description.toLowerCase().includes(query)
    )
  })

  const difficultyLevels = [
    { value: 'all', label: 'Tous les niveaux' },
    { value: 'beginner', label: 'Débutant' },
    { value: 'intermediate', label: 'Intermédiaire' },
    { value: 'advanced', label: 'Avancé' },
  ]

  const handleModuleClick = (moduleId) => {
    navigate(`/modules/${moduleId}`)
  }

  return (
    <Box bg={useColorModeValue('gray.50', 'gray.900')} minH="100vh">
      {/* Header Navigation */}
      <Box bg={bgColor} borderBottom="1px" borderColor={borderColor} position="sticky" top={0} zIndex={100}>
        <Flex h={16} alignItems="center" justifyContent="space-between" px={{ base: 4, md: 8, lg: 12 }}>
          <HStack spacing={8}>
            <Logo size="sm" />
            <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
              <Link 
                as={RouterLink} 
                to="/dashboard" 
                fontWeight="medium" 
                color={darkBlue}
                _hover={{ color: greenColor }}
              >
                Accueil
              </Link>
              <Link 
                as={RouterLink} 
                to="/modules" 
                fontWeight="semibold" 
                color={darkBlue}
                bg="gray.100"
                px={3}
                py={1}
                borderRadius="md"
                _hover={{ bg: 'gray.200' }}
              >
                Apprendre
              </Link>
            </HStack>
          </HStack>
          <HStack spacing={4}>
            <Avatar size="sm" name={userName} bg={greenColor} />
            <Button
              size="sm"
              variant="outline"
              colorScheme="red"
              onClick={logout}
            >
              Se déconnecter
            </Button>
          </HStack>
        </Flex>
      </Box>

      {/* Main Content */}
      <Box px={{ base: 4, md: 8, lg: 12 }} py={8}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading as="h1" size="xl" mb={2}>
              Parcours d'apprentissage
            </Heading>
            <Text color={textSecondary}>
              Découvrez nos modules de formation pour renforcer votre esprit critique et votre analyse des médias
            </Text>
          </Box>

          {/* Filtres et recherche */}
          <Box
            bg={cardBg}
            p={6}
            borderRadius="lg"
            boxShadow="md"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Rechercher un module..."
                  size="lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  _focus={{
                    borderColor: 'primary.500',
                    boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                  }}
                />
              </InputGroup>
              
              <Select
                placeholder="Filtrer par niveau"
                size="lg"
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                _focus={{
                  borderColor: 'primary.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                }}
              >
                {difficultyLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </Select>
            </SimpleGrid>
          </Box>

          {/* Liste des modules */}
          {loading ? (
            <Center py={12}>
              <VStack spacing={4}>
                <Spinner size="xl" color={greenColor} thickness="4px" />
                <Text color={textSecondary}>Chargement des modules...</Text>
              </VStack>
            </Center>
          ) : filteredModules.length === 0 ? (
            <Box
              bg={cardBg}
              p={8}
              borderRadius="lg"
              textAlign="center"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Text color={textSecondary} fontSize="lg">
                {searchQuery || levelFilter !== 'all'
                  ? 'Aucun module ne correspond à vos critères de recherche'
                  : 'Aucun module disponible pour le moment'}
              </Text>
            </Box>
          ) : (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {filteredModules.map((module) => {
                const levelMap = {
                  BEGINNER: 'Débutant',
                  INTERMEDIATE: 'Intermédiaire',
                  ADVANCED: 'Avancé',
                  PRACTICAL: 'Pratique'
                }
                
                return (
                  <Box
                    key={module.id}
                    bg={cardBg}
                    p={6}
                    borderRadius="lg"
                    boxShadow="md"
                    borderWidth="1px"
                    borderColor={borderColor}
                    _hover={{
                      transform: 'translateY(-4px)',
                      boxShadow: 'lg',
                      cursor: 'pointer',
                    }}
                    transition="all 0.2s"
                    onClick={() => handleModuleClick(module.id)}
                  >
                    <VStack spacing={4} align="stretch">
                      <HStack spacing={4}>
                        <Box
                          p={3}
                          bg={`${module.color}.100`}
                          color={`${module.color}.600`}
                          borderRadius="lg"
                        >
                          <Icon as={module.icon} boxSize={6} />
                        </Box>
                        <Box flex="1">
                          <Heading as="h3" size="md">
                            {module.title}
                          </Heading>
                          <Badge colorScheme={module.color} variant="subtle" mt={1}>
                            {module.moduleCount} {module.moduleCount === 1 ? 'LEÇON' : 'LEÇONS'}
                          </Badge>
                        </Box>
                      </HStack>
                      <Text color={textSecondary} noOfLines={2}>
                        {module.description}
                      </Text>
                      <Flex justify="space-between" align="center" pt={2}>
                        <HStack spacing={2}>
                          <Badge colorScheme="gray" variant="outline" fontSize="xs">
                            {levelMap[module.level] || module.level}
                          </Badge>
                          {module.estimatedMinutes && (
                            <Text fontSize="xs" color={textSecondary}>
                              {Math.floor(module.estimatedMinutes / 60) > 0
                                ? `${Math.floor(module.estimatedMinutes / 60)}h ${module.estimatedMinutes % 60}min`
                                : `${module.estimatedMinutes}min`}
                            </Text>
                          )}
                        </HStack>
                        <Button
                          size="sm"
                          colorScheme={module.color}
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleModuleClick(module.id)
                          }}
                        >
                          Voir
                        </Button>
                      </Flex>
                    </VStack>
                  </Box>
                )
              })}
            </SimpleGrid>
          )}

          {/* Appel à l'action */}
          <Box
            bgGradient="linear(to-r, primary.500, primary.600)"
            color="white"
            p={8}
            borderRadius="lg"
            textAlign="center"
            mt={8}
          >
            <Heading as="h2" size="lg" mb={4}>
              Vous ne trouvez pas ce que vous cherchez ?
            </Heading>
            <Text mb={6} maxW="2xl" mx="auto">
              Notre équipe travaille constamment à ajouter de nouveaux modules. Dites-nous ce que vous aimeriez apprendre !
            </Text>
            <Button colorScheme="white" variant="outline" size="lg">
              Proposer un module
            </Button>
          </Box>
        </VStack>
      </Box>
    </Box>
  )
}
