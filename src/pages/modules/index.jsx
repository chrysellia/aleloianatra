import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
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
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { FaGlobeAfrica, FaNewspaper, FaBrain, FaShieldAlt, FaUsers } from 'react-icons/fa'

export default function Modules() {
  const navigate = useNavigate()
  const cardBg = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const hoverBg = useColorModeValue('gray.50', 'gray.600')

  const categories = [
    {
      id: 'medias',
      title: 'Médias et Information',
      description: 'Apprenez à analyser et évaluer les informations des médias',
      icon: FaNewspaper,
      color: 'blue',
      modules: 8,
    },
    {
      id: 'critical-thinking',
      title: 'Pensée Critique',
      description: 'Développez votre esprit critique et votre raisonnement',
      icon: FaBrain,
      color: 'purple',
      modules: 6,
    },
    {
      id: 'digital-literacy',
      title: 'Littératie Numérique',
      description: 'Maîtrisez les compétences numériques essentielles',
      icon: FaGlobeAfrica,
      color: 'green',
      modules: 5,
    },
    {
      id: 'online-safety',
      title: 'Sécurité en Ligne',
      description: 'Protégez-vous et vos données sur internet',
      icon: FaShieldAlt,
      color: 'red',
      modules: 4,
    },
    {
      id: 'social-media',
      title: 'Réseaux Sociaux',
      description: 'Comprenez et utilisez les réseaux sociaux de manière critique',
      icon: FaUsers,
      color: 'pink',
      modules: 7,
    },
  ]

  const difficultyLevels = [
    { value: 'all', label: 'Tous les niveaux' },
    { value: 'beginner', label: 'Débutant' },
    { value: 'intermediate', label: 'Intermédiaire' },
    { value: 'advanced', label: 'Avancé' },
  ]

  const handleCategoryClick = (categoryId) => {
    navigate(`/modules/${categoryId}`)
  }

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading as="h1" size="xl" mb={2}>
            Parcours d'apprentissage
          </Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')}>
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
                _focus={{
                  borderColor: 'primary.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                }}
              />
            </InputGroup>
            
            <Select
              placeholder="Filtrer par niveau"
              size="lg"
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

        {/* Liste des catégories */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {categories.map((category) => (
            <Box
              key={category.id}
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
              onClick={() => handleCategoryClick(category.id)}
            >
              <VStack spacing={4} align="stretch">
                <HStack spacing={4}>
                  <Box
                    p={3}
                    bg={`${category.color}.100`}
                    color={`${category.color}.600`}
                    borderRadius="lg"
                  >
                    <Icon as={category.icon} boxSize={6} />
                  </Box>
                  <Box>
                    <Heading as="h3" size="md">
                      {category.title}
                    </Heading>
                    <Badge colorScheme={category.color} variant="subtle" mt={1}>
                      {category.modules} modules
                    </Badge>
                  </Box>
                </HStack>
                <Text color={useColorModeValue('gray.600', 'gray.400')} noOfLines={2}>
                  {category.description}
                </Text>
                <Flex justify="space-between" align="center" pt={2}>
                  <HStack spacing={2}>
                    {[1, 2, 3].map((star) => (
                      <Box
                        key={star}
                        w={3}
                        h={3}
                        borderRadius="full"
                        bg={star <= 3 ? 'yellow.400' : 'gray.200'}
                      />
                    ))}
                    <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                      (24 avis)
                    </Text>
                  </HStack>
                  <Button
                    size="sm"
                    colorScheme={category.color}
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCategoryClick(category.id)
                    }}
                  >
                    Voir
                  </Button>
                </Flex>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>

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
    </Container>
  )
}
