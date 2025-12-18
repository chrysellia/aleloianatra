import React, { useState, useEffect } from 'react'
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

export default function Modules() {
  const navigate = useNavigate()
  const cardBg = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const hoverBg = useColorModeValue('gray.50', 'gray.600')
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
  }

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading as="h1" size="xl" mb={2}>
            Modules d'Apprentissage
          </Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')}>
            Découvrez nos cours et développez vos compétences
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
                placeholder="Rechercher un cours..."
                size="lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                _focus={{
                  borderColor: 'primary.500',
                  boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
                }}
              />
            </InputGroup>
            
            <Select
              placeholder="Filtrer par niveau"
              size="lg"
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
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
