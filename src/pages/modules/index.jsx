<<<<<<< HEAD
import React, { useState, useEffect } from 'react'
=======
import React from 'react'
>>>>>>> 53fa89dd23aad9ac4f4ad818d1ad296ecbca1712
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
<<<<<<< HEAD
  Card,
  CardBody,
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { 
  FaBook,
  FaArrowRight,
  FaRegClock
} from 'react-icons/fa'
import coursesData from '../../data/courses.json'
=======
} from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { FaGlobeAfrica, FaNewspaper, FaBrain, FaShieldAlt, FaUsers } from 'react-icons/fa'
>>>>>>> 53fa89dd23aad9ac4f4ad818d1ad296ecbca1712

export default function Modules() {
  const navigate = useNavigate()
  const cardBg = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const hoverBg = useColorModeValue('gray.50', 'gray.600')
<<<<<<< HEAD
  const [courses, setCourses] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLevel, setFilterLevel] = useState('all')

  const difficultyLevels = [
    { value: 'all', label: 'Tous les niveaux' },
    { value: 'Débutant', label: 'Débutant' },
    { value: 'Intermédiaire', label: 'Intermédiaire' },
    { value: 'Avancé', label: 'Avancé' },
    { value: 'Pratique', label: 'Pratique' },
  ]

  useEffect(() => {
    // Charger les cours depuis courses.json
    setCourses(coursesData)
  }, [])

  const getLevelColor = (level) => {
    const levelColors = {
      'Débutant': 'green',
      'Intermédiaire': 'blue',
      'Avancé': 'purple',
      'Pratique': 'orange'
    }
    return levelColors[level] || 'gray'
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = filterLevel === 'all' || course.level === filterLevel
    return matchesSearch && matchesLevel
  })

  const handleCourseClick = (courseId) => {
    navigate(`/modules/${courseId}`)
=======

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
>>>>>>> 53fa89dd23aad9ac4f4ad818d1ad296ecbca1712
  }

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading as="h1" size="xl" mb={2}>
<<<<<<< HEAD
            Modules d'Apprentissage
          </Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')}>
            Découvrez nos cours et développez vos compétences
=======
            Parcours d'apprentissage
          </Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')}>
            Découvrez nos modules de formation pour renforcer votre esprit critique et votre analyse des médias
>>>>>>> 53fa89dd23aad9ac4f4ad818d1ad296ecbca1712
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
<<<<<<< HEAD
                placeholder="Rechercher un cours..."
                size="lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
=======
                placeholder="Rechercher un module..."
                size="lg"
>>>>>>> 53fa89dd23aad9ac4f4ad818d1ad296ecbca1712
                _focus={{
                  borderColor: 'primary.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                }}
              />
            </InputGroup>
            
            <Select
              placeholder="Filtrer par niveau"
              size="lg"
<<<<<<< HEAD
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
=======
>>>>>>> 53fa89dd23aad9ac4f4ad818d1ad296ecbca1712
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

<<<<<<< HEAD
        {/* Liste des cours */}
        {filteredCourses.length === 0 ? (
          <Box p={8} textAlign="center" bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
            <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
              Aucun cours trouvé avec ces critères de recherche.
            </Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: 'lg',
                  borderColor: `${getLevelColor(course.level)}.400`,
                }}
                transition="all 0.2s"
                cursor="pointer"
                onClick={() => handleCourseClick(course.id)}
                h="100%"
              >
                <CardBody>
                  <VStack align="stretch" spacing={4} h="100%">
                    <HStack justify="space-between" align="start">
                      <Box flex={1}>
                        <HStack mb={2}>
                          <Icon as={FaBook} color={`${getLevelColor(course.level)}.500`} />
                          <Badge colorScheme={getLevelColor(course.level)} variant="subtle">
                            {course.level}
                          </Badge>
                        </HStack>
                        <Heading size="md" mb={2}>
                          {course.title}
                        </Heading>
                        <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')} noOfLines={3}>
                          {course.description}
                        </Text>
                      </Box>
                    </HStack>
                    
                    <Box>
                      <HStack spacing={4} mb={3} fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                        <HStack>
                          <Icon as={FaBook} />
                          <Text>{course.lessons?.length || 0} leçons</Text>
                        </HStack>
                        <HStack>
                          <Icon as={FaRegClock} />
                          <Text>{course.estimatedMinutes || 0} min</Text>
                        </HStack>
                      </HStack>
                      
                      {course.lessons && course.lessons.length > 0 && (
                        <VStack align="stretch" spacing={1} mb={4}>
                          <Text fontSize="xs" fontWeight="medium" color={useColorModeValue('gray.700', 'gray.300')}>
                            Leçons :
                          </Text>
                          {course.lessons.slice(0, 2).map((lesson, idx) => (
                            <Text key={idx} fontSize="xs" color={useColorModeValue('gray.600', 'gray.400')}>
                              • {lesson.title}
                            </Text>
                          ))}
                          {course.lessons.length > 2 && (
                            <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.500')}>
                              + {course.lessons.length - 2} autres leçons...
                            </Text>
                          )}
                        </VStack>
                      )}
                    </Box>
                    
                    <Button
                      colorScheme={getLevelColor(course.level)}
                      variant="solid"
                      size="sm"
                      width="full"
                      mt="auto"
                      rightIcon={<FaArrowRight />}
                    >
                      Voir les leçons
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}
=======
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
>>>>>>> 53fa89dd23aad9ac4f4ad818d1ad296ecbca1712

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
