import React, { useState, useEffect } from 'react'
import {
  Box,
  Heading,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Badge,
  Progress,
  Button,
  Flex,
  Avatar,
  IconButton,
  SimpleGrid,
  Divider,
  Link,
  Icon,
} from '@chakra-ui/react'
import { 
  FaPlay, 
  FaTimes,
  FaSearch,
  FaBell,
  FaGlobe,
  FaCheckCircle,
  FaMedal,
  FaStar,
  FaRobot,
  FaGift,
  FaChevronLeft,
  FaChevronRight,
  FaCertificate,
  FaLock,
  FaArrowRight
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { Link as RouterLink } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useAuth()
  const [showBanner, setShowBanner] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Slides promotionnels
  const promoSlides = [
    {
      id: 1,
      title: "🎁 Promotion Spéciale",
      subtitle: "0 Ariary",
      description: "Accédez à tous nos cours gratuitement pendant une durée limitée !",
      buttonText: "En profiter maintenant",
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: FaGift
    },
    {
      id: 2,
      title: "🤖 Coach IA Disponible",
      subtitle: "Votre assistant personnel",
      description: "Posez vos questions et obtenez des réponses personnalisées 24h/24 !",
      buttonText: "Parler au Coach IA",
      gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      icon: FaRobot
    }
  ]

  // Auto-défilement des slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promoSlides.length)
    }, 5000) // Change toutes les 5 secondes
    return () => clearInterval(timer)
  }, [promoSlides.length])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % promoSlides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + promoSlides.length) % promoSlides.length)
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const cardBg = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const textSecondary = useColorModeValue('gray.600', 'gray.400')
  const greenColor = '#00D97E'
  const darkBlue = '#0B1426'

  // Données de démonstration
  const courses = [
    {
      id: 1,
      title: "Introduction à l'IA pour le Travail",
      progress: 3,
      timeRemaining: "1h 56min",
      category: "Intelligence Artificielle"
    },
    {
      id: 2,
      title: "Détection des Fake News",
      progress: 45,
      timeRemaining: "2h 30min",
      category: "Pensée Critique"
    }
  ]

  const achievements = [
    { id: 1, name: "Course Crusher", count: 3, color: greenColor, icon: FaCheckCircle },
    { id: 2, name: "Podium Finisher", count: 1, color: "#764ba2", icon: FaMedal },
    { id: 3, name: "Best Finish", count: 13, color: "#FFD700", icon: FaStar },
  ]

  const certifications = [
    { id: 1, title: "Data Engineer", locked: true },
    { id: 2, title: "AI Engineer pour Dév...", locked: true },
    { id: 3, title: "Python Data Associate", locked: true },
  ]

  const userInitial = user?.name?.charAt(0).toUpperCase() || 'U'
  const userName = user?.name || 'Utilisateur'

  return (
    <Box bg={useColorModeValue('gray.50', 'gray.900')} minH="100vh">
      {/* Header Navigation */}
      <Box bg={bgColor} borderBottom="1px" borderColor={borderColor} position="sticky" top={0} zIndex={100}>
        <Flex h={16} alignItems="center" justifyContent="space-between" px={{ base: 4, md: 8, lg: 12 }}>
            <HStack spacing={8}>
              <Heading as={RouterLink} to="/" size="md" color={darkBlue} fontWeight="bold">
                Alelo'IA-Anatra
              </Heading>
              <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
                <Link as={RouterLink} to="/" fontWeight="medium" color={darkBlue}>
                  Accueil
                </Link>
                <Link as={RouterLink} to="/modules" fontWeight="medium" color={darkBlue}>
                  Apprendre
                </Link>
              </HStack>
            </HStack>
            <HStack spacing={4}>
              <IconButton
                icon={<FaSearch />}
                variant="ghost"
                aria-label="Rechercher"
                display={{ base: 'none', md: 'flex' }}
              />
              <IconButton
                icon={<FaGlobe />}
                variant="ghost"
                aria-label="Langue"
              />
              <IconButton
                icon={<FaBell />}
                variant="ghost"
                aria-label="Notifications"
              />
              <Avatar size="sm" name={userName} bg={greenColor} />
            </HStack>
          </Flex>
      </Box>

      <Box px={{ base: 4, md: 8, lg: 12 }} py={8}>
        <Flex gap={8} direction={{ base: 'column', lg: 'row' }}>
          {/* Main Content */}
          <Box flex="1" minW={0}>
            <VStack spacing={6} align="stretch">
              {/* Banner Promotionnel avec défilement */}
              {showBanner && (
                <Box
                  position="relative"
                  bgGradient={promoSlides[currentSlide].gradient}
                  borderRadius="lg"
                  py={8}
                  px={{ base: 6, md: 16, lg: 20 }}
                  color="white"
                  overflow="hidden"
                  transition="all 0.5s ease-in-out"
                >
                  {/* Bouton fermer */}
                  <IconButton
                    icon={<FaTimes />}
                    position="absolute"
                    top={4}
                    right={4}
                    variant="ghost"
                    color="white"
                    onClick={() => setShowBanner(false)}
                    aria-label="Fermer"
                    size="sm"
                    _hover={{ bg: 'whiteAlpha.200' }}
                  />

                  {/* Contenu du slide */}
                  <Flex 
                    direction={{ base: 'column', md: 'row' }} 
                    align="center" 
                    justify="center"
                    gap={8}
                    mx="auto"
                    maxW="900px"
                  >
                    {/* Icône */}
                    <Box
                      bg="whiteAlpha.200"
                      p={4}
                      borderRadius="full"
                      display={{ base: 'none', md: 'flex' }}
                    >
                      <Icon as={promoSlides[currentSlide].icon} boxSize={12} />
                    </Box>

                    {/* Texte */}
                    <VStack align="start" spacing={2} flex="1">
                      <Badge bg="whiteAlpha.300" color="white" fontSize="sm" px={3} py={1} borderRadius="full">
                        {promoSlides[currentSlide].title}
                      </Badge>
                      <Heading size="xl" fontWeight="bold">
                        {promoSlides[currentSlide].subtitle}
                      </Heading>
                      <Text fontSize="md" opacity={0.9}>
                        {promoSlides[currentSlide].description}
                      </Text>
                    </VStack>

                    {/* Bouton action */}
                    <Button
                      bg="white"
                      color={darkBlue}
                      _hover={{ bg: 'whiteAlpha.900' }}
                      size="lg"
                      fontWeight="bold"
                      flexShrink={0}
                    >
                      {promoSlides[currentSlide].buttonText}
                    </Button>
                  </Flex>

                  {/* Navigation */}
                  <HStack position="absolute" bottom={4} left="50%" transform="translateX(-50%)" spacing={2}>
                    {promoSlides.map((_, index) => (
                      <Box
                        key={index}
                        w={index === currentSlide ? 6 : 2}
                        h={2}
                        bg={index === currentSlide ? 'white' : 'whiteAlpha.500'}
                        borderRadius="full"
                        cursor="pointer"
                        onClick={() => setCurrentSlide(index)}
                        transition="all 0.3s"
                      />
                    ))}
                  </HStack>

                  {/* Flèches de navigation */}
                  <IconButton
                    icon={<FaChevronLeft />}
                    position="absolute"
                    left={4}
                    top="50%"
                    transform="translateY(-50%)"
                    variant="ghost"
                    color="white"
                    onClick={prevSlide}
                    aria-label="Précédent"
                    size="md"
                    _hover={{ bg: 'whiteAlpha.200' }}
                    display={{ base: 'none', md: 'flex' }}
                  />
                  <IconButton
                    icon={<FaChevronRight />}
                    position="absolute"
                    right={4}
                    top="50%"
                    transform="translateY(-50%)"
                    variant="ghost"
                    color="white"
                    onClick={nextSlide}
                    aria-label="Suivant"
                    size="md"
                    _hover={{ bg: 'whiteAlpha.200' }}
                    display={{ base: 'none', md: 'flex' }}
                  />
                </Box>
              )}

              {/* Learn Section */}
              <Box>
                <HStack justify="space-between" mb={4}>
                  <HStack spacing={2}>
                    <Icon as={FaPlay} color={darkBlue} />
                    <Heading size="lg" color={darkBlue}>
                      Apprendre {'>'}
                    </Heading>
                  </HStack>
                </HStack>
                <VStack spacing={4} align="stretch">
                  {courses.map((course) => (
                    <Box
                      key={course.id}
                      bg={darkBlue}
                      borderRadius="lg"
                      p={6}
                      color="white"
                    >
                      <Flex direction={{ base: 'column', md: 'row' }} gap={6} align="center">
                        <VStack align="start" spacing={2} flex="1">
                          <Text fontSize="sm" opacity={0.8}>
                            {course.category}
                          </Text>
                          <Heading size="md" fontWeight="bold">
                            {course.title}
                          </Heading>
                        </VStack>
                        <Box w={{ base: '100%', md: '300px' }}>
                          <HStack justify="space-between" mb={2}>
                            <Text fontSize="sm" opacity={0.8}>
                              {course.progress}% complété
                            </Text>
                            <Text fontSize="sm" opacity={0.8}>
                              {course.timeRemaining} restant
                            </Text>
                          </HStack>
                          <Progress 
                            value={course.progress} 
                            colorScheme="green"
                            size="sm"
                            borderRadius="full"
                          />
                        </Box>
                        <Button
                          leftIcon={<FaPlay />}
                          bg={greenColor}
                          color="white"
                          _hover={{ bg: '#00C96E' }}
                          px={8}
                        >
                          Continuer
                        </Button>
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              </Box>

              {/* Certification Section */}
              <Box>
                <HStack spacing={2} mb={4}>
                  <Icon as={FaCertificate} color={darkBlue} />
                  <Heading size="lg" color={darkBlue}>
                    Certification {'>'}
                  </Heading>
                </HStack>
                <Box
                  bg={cardBg}
                  borderRadius="lg"
                  p={6}
                  borderWidth="1px"
                  borderColor={borderColor}
                  borderStyle="dashed"
                >
                  <Flex direction={{ base: 'column', md: 'row' }} gap={6} align="center">
                    {/* Certificate Image */}
                    <Box
                      w={{ base: '100%', md: '150px' }}
                      h="120px"
                      bg={useColorModeValue('gray.100', 'gray.600')}
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      position="relative"
                      borderWidth="2px"
                      borderColor={borderColor}
                      borderStyle="dashed"
                    >
                      <VStack spacing={1}>
                        <Text fontSize="xs" fontWeight="bold" color={textSecondary}>
                          DATA SCIENTIST
                        </Text>
                        <Icon as={FaLock} color={textSecondary} boxSize={6} />
                      </VStack>
                    </Box>

                    {/* Content */}
                    <VStack align="start" spacing={3} flex="1">
                      <VStack align="start" spacing={1}>
                        <Heading size="md" color={darkBlue}>
                          Vous manquez quelque chose !
                        </Heading>
                        <Text color={textSecondary} fontSize="sm">
                          Améliorez vos chances d'être embauché avec une certification reconnue par l'industrie.
                        </Text>
                      </VStack>
                      
                      {/* Certification Tags */}
                      <HStack spacing={3} flexWrap="wrap">
                        {certifications.map((cert) => (
                          <HStack
                            key={cert.id}
                            bg={useColorModeValue('gray.50', 'gray.600')}
                            px={3}
                            py={2}
                            borderRadius="md"
                            borderWidth="1px"
                            borderColor={borderColor}
                            spacing={2}
                          >
                            <Icon as={FaLock} color={textSecondary} boxSize={3} />
                            <Text fontSize="sm" color={darkBlue} fontWeight="medium">
                              {cert.title}
                            </Text>
                          </HStack>
                        ))}
                      </HStack>
                    </VStack>

                    {/* See All Button */}
                    <Button
                      rightIcon={<FaArrowRight />}
                      variant="outline"
                      colorScheme="gray"
                      size="md"
                    >
                      Voir tout
                    </Button>
                  </Flex>
                </Box>
              </Box>

            </VStack>
          </Box>

          {/* Right Sidebar */}
          <Box w={{ base: '100%', lg: '350px' }} flexShrink={0}>
            <VStack spacing={6} align="stretch">
              {/* User Profile Card */}
              <Box
                bg={cardBg}
                borderRadius="lg"
                p={6}
                borderWidth="1px"
                borderColor={borderColor}
              >
                <VStack spacing={4}>
                  <Avatar size="xl" name={userName} bg={greenColor} />
                  <VStack spacing={1}>
                    <Text fontWeight="bold" fontSize="lg" color={darkBlue}>
                      Salut, {userName}!
                    </Text>
                    <Link color={greenColor} fontSize="sm" fontWeight="medium">
                      Voir le profil {'>'}
                    </Link>
                  </VStack>
                  <Box w="100%">
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="sm" color={textSecondary}>
                        Profil
                      </Text>
                      <Text fontSize="sm" fontWeight="medium" color={darkBlue}>
                        25% complété
                      </Text>
                    </HStack>
                    <Progress value={25} colorScheme="green" size="sm" borderRadius="full" />
                  </Box>
                  <Divider />
                  <HStack justify="space-between" w="100%">
                    <VStack align="start" spacing={1}>
                      <Text fontSize="xs" color={textSecondary}>
                        Série quotidienne
                      </Text>
                      <HStack>
                        <Text fontSize="lg" fontWeight="bold" color={darkBlue}>
                          ⚡ 0 jours
                        </Text>
                      </HStack>
                    </VStack>
                  </HStack>
                  <HStack justify="space-between" w="100%">
                    <VStack align="start" spacing={1}>
                      <Text fontSize="xs" color={textSecondary}>
                        Total XP
                      </Text>
                      <Text fontSize="lg" fontWeight="bold" color={darkBlue}>
                        15043 XP
                      </Text>
                    </VStack>
                  </HStack>
                </VStack>
              </Box>


              {/* Achievements Card */}
              <Box
                bg={cardBg}
                borderRadius="lg"
                p={6}
                borderWidth="1px"
                borderColor={borderColor}
              >
                <Heading size="md" color={darkBlue} mb={4}>
                  Réalisations
                </Heading>
                <SimpleGrid columns={3} spacing={4}>
                  {achievements.map((achievement) => (
                    <VStack key={achievement.id} spacing={2}>
                      <Box
                        w={12}
                        h={12}
                        bg={achievement.color}
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color="white"
                      >
                        <Icon as={achievement.icon} />
                      </Box>
                      <VStack spacing={0}>
                        <Text fontSize="xs" fontWeight="bold" color={darkBlue}>
                          {achievement.count}
                        </Text>
                        <Text fontSize="xs" color={textSecondary} textAlign="center">
                          {achievement.name}
                        </Text>
                      </VStack>
                    </VStack>
                  ))}
                </SimpleGrid>
              </Box>
            </VStack>
          </Box>
        </Flex>
      </Box>
    </Box>
  )
}
