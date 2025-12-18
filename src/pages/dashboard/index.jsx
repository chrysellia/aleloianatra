import React from 'react'
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Badge,
  Progress,
  Icon,
} from '@chakra-ui/react'
import { FaBook, FaChartLine, FaTrophy, FaClock } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const cardBg = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  // Données de démonstration
  const stats = [
    {
      title: 'Modules complétés',
      value: '3',
      change: '+2 cette semaine',
      icon: FaBook,
      color: 'blue.400',
    },
    {
      title: 'Score moyen',
      value: '85%',
      change: '+5% ce mois-ci',
      icon: FaChartLine,
      color: 'green.400',
    },
    {
      title: 'Badges obtenus',
      value: '5',
      change: '+1 cette semaine',
      icon: FaTrophy,
      color: 'yellow.400',
    },
    {
      title: 'Temps passé',
      value: '12h 30m',
      change: '+2h cette semaine',
      icon: FaClock,
      color: 'purple.400',
    },
  ]

  const recentModules = [
    {
      id: 1,
      title: 'Détection des fake news',
      progress: 75,
      lastAccessed: 'Il y a 2 jours',
      category: 'Médias',
    },
    {
      id: 2,
      title: 'Analyse des sources',
      progress: 45,
      lastAccessed: 'Il y a 5 jours',
      category: 'Recherche',
    },
    {
      id: 3,
      title: 'Pensée critique',
      progress: 20,
      lastAccessed: 'Il y a 1 semaine',
      category: 'Fondamentaux',
    },
  ]

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading as="h1" size="xl" mb={2}>
            Bonjour, {user?.name || 'Utilisateur'} 👋
          </Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')}>
            Voici un aperçu de votre progression
          </Text>
        </Box>

        {/* Statistiques */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={8}>
  {/* Carte 1 */}
  <Box
    p={5}
    bg={useColorModeValue('white', 'gray.700')}
    borderRadius="lg"
    boxShadow="sm"
  >
    <Stat>
      <StatLabel>Progression</StatLabel>
      <StatNumber>45%</StatNumber>
      <StatHelpText>
        <StatArrow type="increase" />
        12% par rapport au mois dernier
      </StatHelpText>
    </Stat>
  </Box>
  {/* Carte 2 */}
  <Box
    p={5}
    bg={useColorModeValue('white', 'gray.700')}
    borderRadius="lg"
    boxShadow="sm"
  >
    <Stat>
      <StatLabel>Leçons complétées</StatLabel>
      <StatNumber>12/24</StatNumber>
      <StatHelpText>50% des leçons terminées</StatHelpText>
    </Stat>
  </Box>
  {/* Carte 3 */}
  <Box
    p={5}
    bg={useColorModeValue('white', 'gray.700')}
    borderRadius="lg"
    boxShadow="sm"
  >
    <Stat>
      <StatLabel>Score moyen</StatLabel>
      <StatNumber>78%</StatNumber>
      <StatHelpText>
        <StatArrow type="decrease" />
        5% par rapport au mois dernier
      </StatHelpText>
    </Stat>
  </Box>
</SimpleGrid>

        {/* Progression récente */}
        <Box
          bg={cardBg}
          p={6}
          borderRadius="lg"
          boxShadow="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Heading as="h2" size="md" mb={6}>
            Vos modules en cours
          </Heading>
          <VStack spacing={6} align="stretch">
            {recentModules.map((module) => (
              <Box key={module.id}>
                <HStack justify="space-between" mb={2}>
                  <Text fontWeight="medium">{module.title}</Text>
                  <Badge colorScheme="blue" variant="subtle">
                    {module.category}
                  </Badge>
                </HStack>
                <HStack fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')} mb={1}>
                  <Text>Progression: {module.progress}%</Text>
                  <Text>•</Text>
                  <Text>Dernière activité: {module.lastAccessed}</Text>
                </HStack>
                <Progress
                  value={module.progress}
                  size="sm"
                  colorScheme="blue"
                  borderRadius="full"
                />
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Recommandations */}
        <Box
          bg={cardBg}
          p={6}
          borderRadius="lg"
          boxShadow="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Heading as="h2" size="md" mb={6}>
            Recommandé pour vous
          </Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')}>
            Découvrez de nouveaux modules basés sur vos intérêts et votre progression.
          </Text>
          {/* Ici, vous pourriez ajouter une liste de modules recommandés */}
        </Box>
      </VStack>
    </Container>
  )
}
