import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Icon,
  Button,
  useColorModeValue,
  Divider,
  Progress,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Card,
  CardBody,
  CardFooter,
  Avatar,
  Flex,
  Spacer,
  IconButton,
} from '@chakra-ui/react'
import { ChevronRightIcon, ChevronLeftIcon, StarIcon, CheckCircleIcon } from '@chakra-ui/icons'
import { FaBookOpen, FaPlay, FaLock, FaCheckCircle, FaRegClock } from 'react-icons/fa'

export default function ModuleDetail() {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const [moduleData, setModuleData] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  // Simuler le chargement des données
  useEffect(() => {
    // Ici, vous feriez normalement un appel API
    const fetchModuleData = () => {
      // Données de démonstration
      // Après (corrigé)
const mockModules = {
  medias: {
    id: 'medias',
    title: 'Médias et Information',
    description: 'Apprenez à analyser et évaluer les informations des médias de manière critique.',
    category: 'Éducation aux médias',
    difficulty: 'Intermédiaire',
    duration: '4h 30min',
    totalLessons: 8,  // Renommé de 'lessons' à 'totalLessons'
    progress: 45,
    instructor: {
      name: 'Dr. Marie Rakoto',
      role: 'Professeure en Sciences de l\'Information',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    objectives: [
      'Comprendre le paysage médiatique actuel',
      'Identifier les sources fiables',
      'Détecter les fausses informations',
      'Développer un esprit critique face aux médias'
    ],
    lessons: [  // Seule déclaration de 'lessons'
      { id: 1, title: 'Introduction aux médias', duration: '25 min', completed: true, locked: false },
      { id: 2, title: 'Les différents types de médias', duration: '35 min', completed: true, locked: false },
      { id: 3, title: 'Comment évaluer une source', duration: '40 min', completed: true, locked: false },
      { id: 4, title: 'Les biais médiatiques', duration: '30 min', completed: false, locked: false },
      { id: 5, title: 'Les fake news et comment les repérer', duration: '45 min', completed: false, locked: true },
      { id: 6, title: 'Les réseaux sociaux et l\'information', duration: '35 min', completed: false, locked: true },
      { id: 7, title: 'Atelier pratique', duration: '1h', completed: false, locked: true },
      { id: 8, title: 'Évaluation finale', duration: '20 min', completed: false, locked: true },
    ]
  }
}

      setTimeout(() => {
        const data = mockModules[moduleId] || null
        setModuleData(data)
        setProgress(data?.progress || 0)
        setLoading(false)
      }, 500)
    }

    fetchModuleData()
  }, [moduleId])

  const handleLessonClick = (lesson) => {
    if (lesson.locked) return
    // Naviguer vers la leçon
    navigate(`/modules/${moduleId}/lessons/${lesson.id}`)
  }

  const handleStartModule = () => {
    const firstUnlockedLesson = moduleData.lessons.find(lesson => !lesson.completed && !lesson.locked)
    if (firstUnlockedLesson) {
      navigate(`/modules/${moduleId}/lessons/${firstUnlockedLesson.id}`)
    } else {
      // Toutes les leçons sont complétées ou verrouillées
      const firstLesson = moduleData.lessons[0]
      if (firstLesson) {
        navigate(`/modules/${moduleId}/lessons/${firstLesson.id}`)
      }
    }
  }

  if (loading) {
    return (
      <Container maxW="7xl" py={8}>
        <Text>Chargement du module...</Text>
      </Container>
    )
  }

  if (!moduleData) {
    return (
      <Container maxW="7xl" py={8} textAlign="center">
        <Heading size="lg" mb={4}>Module non trouvé</Heading>
        <Text mb={6}>Le module que vous recherchez n'existe pas ou a été déplacé.</Text>
        <Button as={RouterLink} to="/modules" colorScheme="primary">
          Retour aux modules
        </Button>
      </Container>
    )
  }

  const nextLesson = moduleData.lessons.find(lesson => !lesson.completed && !lesson.locked)
  const completedLessons = moduleData.lessons.filter(lesson => lesson.completed).length

  return (
    <Container maxW="7xl" py={8}>
      {/* Fil d'Ariane */}
      <Breadcrumb spacing={2} mb={6} separator={<ChevronRightIcon color="gray.500" />}>
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to="/modules">
            Modules
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{moduleData.title}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <VStack spacing={8} align="stretch">
        {/* En-tête du module */}
        <Box>
          <Badge colorScheme="blue" mb={4} px={3} py={1} borderRadius="full">
            {moduleData.category}
          </Badge>
          <Heading as="h1" size="2xl" mb={4}>
            {moduleData.title}
          </Heading>
          <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')} maxW="3xl">
            {moduleData.description}
          </Text>
          
          <HStack spacing={6} mt={6} color={useColorModeValue('gray.600', 'gray.400')}>
            <HStack>
              <Icon as={FaBookOpen} />
              <Text>{moduleData.lessons.length} leçons</Text>
            </HStack>
            <HStack>
              <Icon as={FaRegClock} />
              <Text>{moduleData.duration}</Text>
            </HStack>
            <HStack>
              <Icon as={StarIcon} color="yellow.400" />
              <Text>4.8 (128 avis)</Text>
            </HStack>
          </HStack>
          
          <Box mt={6} maxW="2xl">
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" fontWeight="medium">Progression: {progress}%</Text>
              <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                {completedLessons} sur {moduleData.lessons.length} leçons complétées
              </Text>
            </HStack>
            <Progress value={progress} size="sm" colorScheme="blue" borderRadius="full" />
          </Box>
          
          <HStack spacing={4} mt={8}>
            <Button 
              colorScheme="primary" 
              size="lg" 
              leftIcon={nextLesson ? <FaPlay /> : <FaCheckCircle />}
              onClick={handleStartModule}
            >
              {nextLesson ? 'Continuer' : 'Revoir le module'}
            </Button>
            <Button variant="outline" size="lg">
              Ajouter aux favoris
            </Button>
          </HStack>
        </Box>

        <Divider my={8} />

        <Tabs variant="enclosed" isLazy>
          <TabList>
            <Tab _selected={{ color: 'primary.500', borderBottom: '2px solid' }}>Contenu du module</Tab>
            <Tab _selected={{ color: 'primary.500', borderBottom: '2px solid' }}>À propos</Tab>
            <Tab _selected={{ color: 'primary.500', borderBottom: '2px solid' }}>Instructeur</Tab>
            <Tab _selected={{ color: 'primary.500', borderBottom: '2px solid' }}>Avis</Tab>
          </TabList>

          <TabPanels mt={6}>
            <TabPanel px={0}>
              <VStack spacing={4} align="stretch">
                {moduleData.lessons.map((lesson, index) => (
                  <Card 
                    key={lesson.id} 
                    variant="outline" 
                    _hover={{ 
                      bg: useColorModeValue('gray.50', 'gray.800'),
                      cursor: !lesson.locked ? 'pointer' : 'not-allowed'
                    }}
                    onClick={() => handleLessonClick(lesson)}
                    opacity={lesson.locked ? 0.7 : 1}
                  >
                    <CardBody>
                      <HStack spacing={4}>
                        <Box
                          w={10}
                          h={10}
                          borderRadius="full"
                          bg={lesson.completed 
                            ? 'green.100' 
                            : lesson.locked 
                              ? 'gray.100' 
                              : 'blue.50'
                          }
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          flexShrink={0}
                        >
                          {lesson.completed ? (
                            <CheckCircleIcon color="green.500" boxSize={5} />
                          ) : lesson.locked ? (
                            <FaLock color={useColorModeValue('gray.400', 'gray.500')} />
                          ) : (
                            <Text fontWeight="bold" color="blue.500">{index + 1}</Text>
                          )}
                        </Box>
                        <Box flex={1}>
                          <HStack>
                            <Text fontWeight="medium">{lesson.title}</Text>
                            {lesson.locked && (
                              <Badge colorScheme="gray" fontSize="xs">Verrouillé</Badge>
                            )}
                          </HStack>
                          <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                            {lesson.duration}
                          </Text>
                        </Box>
                        {!lesson.locked && (
                          <Icon as={ChevronRightIcon} color="gray.400" />
                        )}
                      </HStack>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            </TabPanel>
            
            <TabPanel px={0}>
              <VStack spacing={6} align="stretch">
                <Box>
                  <Heading as="h3" size="md" mb={4}>À propos de ce module</Heading>
                  <Text mb={4}>
                    Ce module vous fournira les compétences essentielles pour naviguer dans le paysage médiatique actuel 
                    avec un esprit critique. Vous apprendrez à évaluer la crédibilité des sources, à identifier les 
                    biais et à repérer les fausses informations.
                  </Text>
                </Box>
                
                <Box>
                  <Heading as="h4" size="sm" mb={3}>Ce que vous allez apprendre</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                    {moduleData.objectives.map((objective, index) => (
                      <HStack key={index} align="flex-start">
                        <CheckCircleIcon color="green.500" mt={1} />
                        <Text>{objective}</Text>
                      </HStack>
                    ))}
                  </SimpleGrid>
                </Box>
                
                <Box>
                  <Heading as="h4" size="sm" mb={3}>Prérequis</Heading>
                  <Text>Ce module est accessible à tous les niveaux. Aucune connaissance préalable n'est requise.</Text>
                </Box>
              </VStack>
            </TabPanel>
            
            <TabPanel px={0}>
              <Card variant="outline">
                <CardBody>
                  <HStack spacing={6} align="flex-start">
                    <Avatar 
                      size="xl" 
                      src={moduleData.instructor.avatar} 
                      name={moduleData.instructor.name}
                      borderWidth={2}
                      borderColor="primary.200"
                    />
                    <Box>
                      <Heading as="h3" size="md" mb={2}>{moduleData.instructor.name}</Heading>
                      <Text color={useColorModeValue('gray.600', 'gray.400')} mb={4}>
                        {moduleData.instructor.role}
                      </Text>
                      <Text mb={4}>
                        {moduleData.instructor.name} est une experte reconnue dans le domaine des sciences de l'information 
                        avec plus de 10 ans d'expérience dans l'enseignement et la recherche. Elle a travaillé avec 
                        diverses organisations pour promouvoir l'éducation aux médias en Afrique.
                      </Text>
                      <HStack spacing={4}>
                        <Button variant="outline" size="sm">Voir le profil</Button>
                        <Button variant="outline" size="sm">Contacter</Button>
                      </HStack>
                    </Box>
                  </HStack>
                </CardBody>
              </Card>
            </TabPanel>
            
            <TabPanel px={0}>
              <VStack spacing={6} align="stretch">
                <Box textAlign="center" py={8}>
                  <Box display="inline-flex" alignItems="center" mb={4} p={3} bg="blue.50" borderRadius="full">
                    <Text fontSize="4xl" fontWeight="bold" color="blue.600">4.8</Text>
                    <Text mx={1}>/</Text>
                    <Text>5.0</Text>
                  </Box>
                  <Box display="flex" justifyContent="center" mb={4}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon key={star} color="yellow.400" boxSize={6} mx={0.5} />
                    ))}
                  </Box>
                  <Text color={useColorModeValue('gray.600', 'gray.400')}>
                    Basé sur 128 avis d'apprenants
                  </Text>
                </Box>
                
                <Box bg={useColorModeValue('gray.50', 'gray.800')} p={6} borderRadius="lg">
                  <Text fontStyle="italic" mb={4}>
                    "Ce module m'a vraiment ouvert les yeux sur la façon dont je consomme l'information. 
                    Je recommande vivement à tous ceux qui veulent développer leur esprit critique."
                  </Text>
                  <HStack>
                    <Avatar size="sm" name="Jean Dupont" />
                    <Box>
                      <Text fontWeight="medium">Jean Dupont</Text>
                      <HStack spacing={1}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon key={star} color="yellow.400" boxSize={3} />
                        ))}
                      </HStack>
                    </Box>
                  </HStack>
                </Box>
                
                <Button variant="outline" alignSelf="center">
                  Voir plus d'avis
                </Button>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  )
}
