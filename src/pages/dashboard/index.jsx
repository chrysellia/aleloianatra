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
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import Logo from '../../components/Logo'
import { authAPI, usersAPI, progressAPI, modulesAPI } from '../../lib/api'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showBanner, setShowBanner] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [profile, setProfile] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [achievements, setAchievements] = useState([])
  const [loadingAchievements, setLoadingAchievements] = useState(true)
  const [coursesInProgress, setCoursesInProgress] = useState([])
  const [availableModules, setAvailableModules] = useState([])
  const [loadingCourses, setLoadingCourses] = useState(true)

  // Récupérer le profil utilisateur depuis l'API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authAPI.getMe()
        if (response.success) {
          setProfile(response.data)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error)
      } finally {
        setLoadingProfile(false)
      }
    }
    fetchProfile()
  }, [])

  // Récupérer les réalisations depuis l'API
  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user?.id) return
      
      try {
        const response = await usersAPI.getAchievements(user.id)
        if (response.success && response.data.length > 0) {
          // Transformer les données de l'API pour correspondre au format attendu
          const formattedAchievements = response.data.slice(0, 3).map((achievement) => {
            // Mapper les icônes depuis les emojis/noms
            let icon = FaCheckCircle // Par défaut
            const iconStr = achievement.icon || ''
            const nameLower = achievement.name?.toLowerCase() || ''
            
            if (iconStr.includes('🏆') || nameLower.includes('crusher') || nameLower.includes('course')) {
              icon = FaCheckCircle
            } else if (iconStr.includes('🧠') || nameLower.includes('master') || nameLower.includes('quiz')) {
              icon = FaMedal
            } else if (iconStr.includes('⭐') || iconStr.includes('star') || nameLower.includes('hunter') || nameLower.includes('xp')) {
              icon = FaStar
            } else if (iconStr.includes('🔥') || nameLower.includes('streak') || nameLower.includes('legend')) {
              icon = FaStar
            } else if (iconStr.includes('🎯') || nameLower.includes('premier') || nameLower.includes('pas')) {
              icon = FaCheckCircle
            }
            
            return {
              id: achievement.id,
              name: achievement.name,
              count: achievement.count || 0,
              color: achievement.color || greenColor,
              icon: icon
            }
          })
          
          // Si moins de 3 achievements, compléter avec des placeholders
          while (formattedAchievements.length < 3) {
            formattedAchievements.push({
              id: `placeholder-${formattedAchievements.length + 1}`,
              name: 'À venir',
              count: 0,
              color: '#gray.300',
              icon: FaCheckCircle
            })
          }
          
          setAchievements(formattedAchievements)
        } else {
          // Aucune réalisation obtenue, afficher des placeholders
          setAchievements([
            { id: 1, name: "Course Crusher", count: 0, color: greenColor, icon: FaCheckCircle },
            { id: 2, name: "Quiz Master", count: 0, color: "#764ba2", icon: FaMedal },
            { id: 3, name: "XP Hunter", count: 0, color: "#FFD700", icon: FaStar },
          ])
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des réalisations:', error)
        // En cas d'erreur, utiliser des données par défaut
        setAchievements([
          { id: 1, name: "Course Crusher", count: 0, color: greenColor, icon: FaCheckCircle },
          { id: 2, name: "Quiz Master", count: 0, color: "#764ba2", icon: FaMedal },
          { id: 3, name: "XP Hunter", count: 0, color: "#FFD700", icon: FaStar },
        ])
      } finally {
        setLoadingAchievements(false)
      }
    }
    fetchAchievements()
  }, [user?.id])

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

  // Récupérer les cours en cours et les modules disponibles
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Récupérer les cours en cours
        const progressResponse = await progressAPI.getRecent(5)
        
        if (progressResponse.success && progressResponse.data.length > 0) {
          // Transformer les données de l'API pour correspondre au format attendu
          const formattedCourses = progressResponse.data.map((progress) => {
            // Mapper le level vers une catégorie
            const levelToCategory = {
              'BEGINNER': 'Débutant',
              'INTERMEDIATE': 'Intermédiaire',
              'ADVANCED': 'Avancé',
              'PRACTICAL': 'Pratique'
            }
            
            return {
              id: progress.moduleId,
              title: progress.module.title,
              progress: progress.progressPercent,
              timeRemaining: progress.remainingTime || `${progress.remainingMinutes}min`,
              category: levelToCategory[progress.module.level] || progress.module.level
            }
          })
          setCoursesInProgress(formattedCourses)
        } else {
          setCoursesInProgress([])
        }

        // Toujours récupérer les modules disponibles pour les propositions
        const modulesResponse = await modulesAPI.getAll()
        if (modulesResponse.success && modulesResponse.data.length > 0) {
          const levelToCategory = {
            'BEGINNER': 'Débutant',
            'INTERMEDIATE': 'Intermédiaire',
            'ADVANCED': 'Avancé',
            'PRACTICAL': 'Pratique'
          }
          
          const formattedModules = modulesResponse.data.map((module) => {
            // Calculer le temps total estimé
            const totalMinutes = module.estimatedMinutes || 0
            const hours = Math.floor(totalMinutes / 60)
            const mins = totalMinutes % 60
            const timeStr = hours > 0 ? `${hours}h ${mins}min` : `${mins}min`
            
            return {
              id: module.id,
              title: module.title,
              description: module.description,
              progress: module.userProgress?.progressPercent || 0,
              timeRemaining: timeStr,
              category: levelToCategory[module.level] || module.level,
              level: module.level
            }
          })
          setAvailableModules(formattedModules)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des cours:', error)
        setCoursesInProgress([])
        setAvailableModules([])
      } finally {
        setLoadingCourses(false)
      }
    }
    fetchCourses()
  }, [])

  // Les achievements sont maintenant chargés depuis l'API (voir useEffect ci-dessus)

  // Certificats statiques basés sur les modules disponibles
  const certifications = [
    { 
      id: 'cert-media-literacy', 
      title: "Littératie Médiatique Certifié", 
      description: "Vérification des informations et lutte contre les fake news",
      moduleIds: ['module-info-verification', 'module-fake-news'],
      locked: true,
      icon: '📜'
    },
    { 
      id: 'cert-financial-literacy', 
      title: "Éducation Financière Certifié", 
      description: "Intelligence financière et gestion de patrimoine",
      moduleIds: ['module-education-financiere'],
      locked: true,
      icon: '💰'
    },
    { 
      id: 'cert-cybersecurity', 
      title: "Cybersécurité et Protection des Données", 
      description: "Sécurité numérique et protection de la vie privée",
      moduleIds: ['module-cybersecurite'],
      locked: true,
      icon: '🔒'
    },
    { 
      id: 'cert-digital-citizenship', 
      title: "Citoyenneté Numérique", 
      description: "Éthique numérique et responsabilité en ligne",
      moduleIds: ['module-citoyennete-numerique'],
      locked: true,
      icon: '🌐'
    }
  ]

  const userInitial = user?.name?.charAt(0).toUpperCase() || 'U'
  const userName = user?.name || 'Utilisateur'

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
                  fontWeight="semibold" 
                  color={darkBlue}
                  bg="gray.100"
                  px={3}
                  py={1}
                  borderRadius="md"
                  _hover={{ bg: 'gray.200' }}
                >
                  Accueil
                </Link>
                <Link as={RouterLink} to="/modules" fontWeight="medium" color={darkBlue} _hover={{ color: greenColor }}>
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
                <VStack spacing={6} align="stretch">
                  {loadingCourses ? (
                    <Box textAlign="center" py={8}>
                      <Text color={textSecondary}>Chargement des cours...</Text>
                    </Box>
                  ) : coursesInProgress.length > 0 ? (
                    // Afficher les cours en cours
                    coursesInProgress.map((course) => (
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
                            onClick={() => navigate(`/modules/${course.id}`)}
                          >
                            Continuer
                          </Button>
                        </Flex>
                      </Box>
                    ))
                  ) : (
                    // Aucun cours en cours - Afficher message + propositions
                    <>
                      <Box
                        bg={cardBg}
                        borderRadius="lg"
                        p={8}
                        textAlign="center"
                        borderWidth="1px"
                        borderColor={borderColor}
                      >
                        <Text color={textSecondary} mb={4}>
                          Aucun cours en cours pour le moment
                        </Text>
                        <Button
                          as={RouterLink}
                          to="/modules"
                          colorScheme="green"
                          leftIcon={<FaPlay />}
                        >
                          Découvrir les modules
                        </Button>
                      </Box>

                      {/* Propositions de cours à commencer */}
                      {availableModules.length > 0 && (
                        <Box>
                          <Heading size="md" color={darkBlue} mb={4}>
                            Cours recommandés pour commencer
                          </Heading>
                          <VStack spacing={4} align="stretch">
                            {availableModules.slice(0, 3).map((module) => (
                              <Box
                                key={module.id}
                                bg={darkBlue}
                                borderRadius="lg"
                                p={6}
                                color="white"
                                cursor="pointer"
                                _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                                transition="all 0.2s"
                                onClick={() => navigate(`/modules/${module.id}`)}
                              >
                                <Flex direction={{ base: 'column', md: 'row' }} gap={4} align="center">
                                  <VStack align="start" spacing={2} flex="1">
                                    <Text fontSize="sm" opacity={0.8}>
                                      {module.category}
                                    </Text>
                                    <Heading size="md" fontWeight="bold">
                                      {module.title}
                                    </Heading>
                                    <Text fontSize="sm" opacity={0.7} noOfLines={2}>
                                      {module.description}
                                    </Text>
                                  </VStack>
                                  <Box>
                                    <Text fontSize="sm" opacity={0.8} mb={2}>
                                      {module.timeRemaining}
                                    </Text>
                                    <Button
                                      leftIcon={<FaPlay />}
                                      bg={greenColor}
                                      color="white"
                                      _hover={{ bg: '#00C96E' }}
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        navigate(`/modules/${module.id}`)
                                      }}
                                    >
                                      Commencer
                                    </Button>
                                  </Box>
                                </Flex>
                              </Box>
                            ))}
                          </VStack>
                        </Box>
                      )}
                    </>
                  )}
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
                        <Text fontSize="2xl">{certifications[0]?.icon || '📜'}</Text>
                        <Text fontSize="xs" fontWeight="bold" color={textSecondary} textAlign="center" px={2}>
                          {certifications[0]?.title?.toUpperCase().substring(0, 20) || 'CERTIFICAT'}
                        </Text>
                        <Icon as={FaLock} color={textSecondary} boxSize={4} />
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
                        {certifications.slice(0, 3).map((cert) => (
                          <HStack
                            key={cert.id}
                            bg={useColorModeValue('gray.50', 'gray.600')}
                            px={3}
                            py={2}
                            borderRadius="md"
                            borderWidth="1px"
                            borderColor={borderColor}
                            spacing={2}
                            cursor="pointer"
                            _hover={{ bg: useColorModeValue('gray.100', 'gray.500') }}
                            transition="all 0.2s"
                          >
                            <Text fontSize="sm">{cert.icon}</Text>
                            <Icon as={FaLock} color={textSecondary} boxSize={3} />
                            <Text fontSize="sm" color={darkBlue} fontWeight="medium" maxW="150px" isTruncated>
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
                  <Avatar size="xl" name={profile?.name || userName} bg={greenColor} />
                  <VStack spacing={1}>
                    <Text fontWeight="bold" fontSize="lg" color={darkBlue}>
                      Salut, {profile?.name || userName}!
                    </Text>
                    <Link as={RouterLink} to="/profile" color={greenColor} fontSize="sm" fontWeight="medium">
                      Voir le profil {'>'}
                    </Link>
                  </VStack>
                  <Box w="100%">
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="sm" color={textSecondary}>
                        Profil
                      </Text>
                      <Text fontSize="sm" fontWeight="medium" color={darkBlue}>
                        {profile?.profileCompletion || 0}% complété
                      </Text>
                    </HStack>
                    <Progress 
                      value={profile?.profileCompletion || 0} 
                      colorScheme="green" 
                      size="sm" 
                      borderRadius="full" 
                    />
                  </Box>
                  <Divider />
                  <HStack justify="space-between" w="100%">
                    <VStack align="start" spacing={1}>
                      <Text fontSize="xs" color={textSecondary}>
                        Série quotidienne
                      </Text>
                      <HStack>
                        <Text fontSize="lg" fontWeight="bold" color={darkBlue}>
                          ⚡ {profile?.dailyStreak || 0} jours
                        </Text>
                      </HStack>
                    </VStack>
                  </HStack>
                  <HStack justify="space-between" w="100%">
                    <VStack align="start" spacing={1}>
                      <Text fontSize="xs" color={textSecondary}>
                        Total XP
                      </Text>
                      <Text fontSize="lg" fontWeight="bold" color={greenColor}>
                        {profile?.xpTotal?.toLocaleString() || 0} XP
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
