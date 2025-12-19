import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Heading,
  VStack,
  Text,
  Radio,
  RadioGroup,
  Stack,
  Progress,
  useToast,
  Alert,
  AlertIcon,
  useColorModeValue,
  Flex,
  HStack,
  Avatar,
  Link,
  Spinner,
  Badge,
} from '@chakra-ui/react'
import { FaArrowLeft, FaCheck, FaTimes, FaBook } from 'react-icons/fa'
import { modulesAPI, quizzesAPI, internalAPI } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import AICoach from '../components/AICoach'
import Logo from '../components/Logo'

const Quiz = () => {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [moduleData, setModuleData] = useState(null)
  const [quizData, setQuizData] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [quizErrors, setQuizErrors] = useState([]) // Erreurs de cette session
  const [recentQuizErrors, setRecentQuizErrors] = useState([]) // Erreurs historiques
  const [showAICoach, setShowAICoach] = useState(false) // Pour mobile
  const [hasRepetitiveErrors, setHasRepetitiveErrors] = useState(false) // Détection d'erreurs répétitives
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false) // Si la réponse a été soumise
  const [lastAnswerResult, setLastAnswerResult] = useState(null) // Résultat de la dernière réponse (correct/incorrect)
  const [lastError, setLastError] = useState(null) // Dernière erreur pour le Coach IA
  const aiCoachRef = useRef(null) // Référence au Coach IA
  const toast = useToast()

  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const headerBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const greenColor = '#00D97E'
  const darkBlue = '#0B1426'
  const userName = user?.name || 'Utilisateur'

  // Charger les données du module et du quiz
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setIsLoading(true)

        // Charger le module
        const moduleResponse = await modulesAPI.getById(moduleId)
        if (moduleResponse.success) {
          setModuleData(moduleResponse.data)
        }

        // Charger les quiz du module
        const quizzesResponse = await modulesAPI.getQuizzes(moduleId)
        if (quizzesResponse.success && quizzesResponse.data) {
          // Vérifier que les quiz ont correctIndex et rationale
          const quizzesWithFields = quizzesResponse.data.map(quiz => ({
            ...quiz,
            correctIndex: quiz.correctIndex !== undefined ? quiz.correctIndex : null,
            rationale: quiz.rationale || ''
          }))
          console.log('Quiz chargés:', quizzesWithFields) // Debug
          setQuizData(quizzesWithFields)
        } else {
          toast({
            title: 'Aucun quiz disponible',
            description: 'Ce module ne contient pas de quiz pour le moment.',
            status: 'warning',
            duration: 3000,
            isClosable: true,
          })
        }
      } catch (error) {
        console.error('Erreur lors du chargement du quiz:', error)
        toast({
          title: 'Erreur',
          description: 'Impossible de charger le quiz.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
        navigate(`/modules/${moduleId}`)
      } finally {
        setIsLoading(false)
      }
    }

    if (moduleId) {
      fetchQuizData()
    }
  }, [moduleId, navigate, toast])

  // Charger les erreurs historiques pour le contexte AI
  useEffect(() => {
    const fetchQuizErrors = async () => {
      if (!user?.id || !moduleId) return

      try {
        const errorsResponse = await internalAPI.getUserQuizErrors(user.id, moduleId, 10)
        if (errorsResponse.success && errorsResponse.data) {
          setRecentQuizErrors(errorsResponse.data)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des erreurs de quiz:', error)
      }
    }

    fetchQuizErrors()
  }, [user?.id, moduleId])

  const handleSubmit = async () => {
    if (selectedIndex === null) {
      toast({
        title: "Sélectionnez une réponse",
        status: "warning",
        duration: 2000,
        isClosable: true,
      })
      return
    }

    const currentQuiz = quizData[currentQuestion]
    const isCorrect = selectedIndex === currentQuiz.correctIndex

    // Enregistrer l'erreur si incorrecte
    if (!isCorrect) {
      const error = {
        quizId: currentQuiz.id,
        question: currentQuiz.question,
        selectedAnswer: currentQuiz.choices[selectedIndex],
        correctAnswer: currentQuiz.choices[currentQuiz.correctIndex],
        correctIndex: currentQuiz.correctIndex,
        rationale: currentQuiz.rationale,
        difficulty: currentQuiz.difficulty,
        attemptedAt: new Date().toISOString()
      }
      const updatedErrors = [...quizErrors, error]
      setQuizErrors(updatedErrors)
      
      // Détecter les erreurs répétitives (même question échouée 2+ fois)
      const errorCounts = {}
      const allErrors = [...recentQuizErrors, ...updatedErrors]
      
      allErrors.forEach(err => {
        const questionKey = err.question?.substring(0, 100) || ''
        errorCounts[questionKey] = (errorCounts[questionKey] || 0) + 1
      })
      
      // Vérifier s'il y a des erreurs répétitives (2+ fois)
      const hasRepetitive = Object.values(errorCounts).some(count => count >= 2)
      
      // Afficher une notification si erreurs répétitives détectées pour la première fois
      if (hasRepetitive && !hasRepetitiveErrors) {
        setHasRepetitiveErrors(true)
        toast({
          title: "⚠️ Erreurs répétitives détectées",
          description: "Le Coach IA peut vous aider à comprendre ces concepts. Ouvrez le panneau du Coach IA !",
          status: "warning",
          duration: 5000,
          isClosable: true,
        })
      }
    } else {
      // Réinitialiser la détection si bonne réponse
      setHasRepetitiveErrors(false)
    }

    // Soumettre au backend
    try {
      const submitResponse = await quizzesAPI.submit(currentQuiz.id, {
        selectedIndex,
        timeSpent: 0 // TODO: Calculer le temps réel
      })

      if (submitResponse.success) {
        if (isCorrect) {
          setScore(score + 1)
        }
      }
    } catch (error) {
      console.error('Erreur lors de la soumission:', error)
    }

    // Marquer la réponse comme soumise
    setIsAnswerSubmitted(true)
    setLastAnswerResult(isCorrect ? 'correct' : 'incorrect')
    
    // Si erreur, déclencher automatiquement une clarification du Coach IA
    if (!isCorrect) {
      setLastError({
        question: currentQuiz.question,
        selectedAnswer: currentQuiz.choices[selectedIndex],
        correctAnswer: currentQuiz.choices[currentQuiz.correctIndex],
        rationale: currentQuiz.rationale
      })
      
      // Déclencher l'envoi automatique au Coach IA après un court délai
      setTimeout(() => {
        if (aiCoachRef.current) {
          aiCoachRef.current.sendAutoClarification({
            question: currentQuiz.question,
            selectedAnswer: currentQuiz.choices[selectedIndex],
            correctAnswer: currentQuiz.choices[currentQuiz.correctIndex],
            rationale: currentQuiz.rationale
          })
        }
      }, 500)
    }
  }

  const handleNextQuestion = () => {
    setIsAnswerSubmitted(false)
    setLastAnswerResult(null)
    setLastError(null)
    setSelectedIndex(null)
    
    // Passer à la question suivante ou afficher les résultats
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResult(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedIndex(null)
    setScore(0)
    setShowResult(false)
    setQuizErrors([])
  }

  const getUserLevel = () => {
    // TODO: Récupérer depuis le profil utilisateur
    return 'BEGINNER'
  }

  const progress = ((currentQuestion) / quizData.length) * 100

  if (isLoading) {
    return (
      <Box bg={bgColor} minH="100vh" display="flex" flexDirection="column">
        {/* Header Navigation */}
        <Box bg={headerBg} borderBottom="1px" borderColor={borderColor} position="sticky" top={0} zIndex={100}>
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
        <Flex flex="1" justify="center" align="center">
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" />
            <Text>Chargement du quiz...</Text>
          </VStack>
        </Flex>
      </Box>
    )
  }

  if (quizData.length === 0) {
    return (
      <Box bg={bgColor} minH="100vh" display="flex" flexDirection="column">
        {/* Header Navigation */}
        <Box bg={headerBg} borderBottom="1px" borderColor={borderColor} position="sticky" top={0} zIndex={100}>
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
        <Container maxW="container.md" py={10}>
          <Alert status="warning">
            <AlertIcon />
            <Box>
              <Text>Aucun quiz disponible pour ce module.</Text>
            </Box>
          </Alert>
          <Button leftIcon={<FaArrowLeft />} mt={4} onClick={() => navigate(`/modules/${moduleId}`)}>
            Retour au module
          </Button>
        </Container>
      </Box>
    )
  }

  if (showResult) {
    return (
      <Box bg={bgColor} minH="100vh" display="flex" flexDirection="column">
        {/* Header Navigation */}
        <Box bg={headerBg} borderBottom="1px" borderColor={borderColor} position="sticky" top={0} zIndex={100}>
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
        <Container maxW="container.md" py={10}>
          <VStack spacing={6} textAlign="center">
            <Heading as="h1" size="xl">Résultats du Quiz</Heading>
            <Box
              p={8}
              bg="white"
              borderRadius="lg"
              boxShadow="md"
              w="100%"
              maxW="500px"
            >
              <Text fontSize="xl" mb={4}>
                Votre score : {score} / {quizData.length}
              </Text>
              <Text mb={6}>
                {score === quizData.length 
                  ? "Félicitations ! Vous avez réussi tous les quiz !" 
                  : score > quizData.length / 2 
                    ? "Bon travail ! Vous pouvez encore vous améliorer." 
                    : "Continuez à vous entraîner !"}
              </Text>
              <Button 
                colorScheme="blue" 
                onClick={handleRestart}
                size="lg"
                mr={2}
              >
                Recommencer le quiz
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate(`/modules/${moduleId}`)}
                size="lg"
              >
                Retour au module
              </Button>
            </Box>
          </VStack>
        </Container>
      </Box>
    )
  }

  const currentQuiz = quizData[currentQuestion]

  return (
    <Box bg={bgColor} minH="100vh" display="flex" flexDirection="column">
      {/* Header Navigation */}
      <Box bg={headerBg} borderBottom="1px" borderColor={borderColor} position="sticky" top={0} zIndex={100}>
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

      {/* Contenu principal avec split-screen */}
      <Box flex="1" display="flex" position="relative" overflow="hidden">
        {/* Panneau gauche : Coach IA */}
        <Box 
          w={{ base: '100%', lg: '400px' }} 
          flexShrink={0} 
          display={{ base: showAICoach ? 'block' : 'none', lg: 'block' }}
          position={{ base: 'absolute', lg: 'relative' }}
          zIndex={{ base: 10, lg: 0 }}
          h={{ base: 'calc(100vh - 64px)', lg: 'auto' }}
          bg={{ base: headerBg, lg: 'transparent' }}
          borderRight={{ base: 'none', lg: '1px' }}
          borderColor={{ base: 'none', lg: borderColor }}
        >
          <AICoach
            ref={aiCoachRef}
            moduleId={moduleId}
            lessonId={`quiz-${moduleId}`}
            moduleTitle={moduleData?.title || 'Quiz'}
            lessonTitle={`Quiz: ${moduleData?.title || ''}`}
            userLevel={getUserLevel()}
            lessonContent=""
            moduleDescription={moduleData?.description || ''}
            currentProgress={0}
            completedLessons={[]}
            totalLessons={0}
            recentQuizErrors={[...recentQuizErrors, ...quizErrors]}
            quizContext={{
              currentQuestion: currentQuiz,
              allQuestions: quizData,
              currentIndex: currentQuestion,
              totalQuestions: quizData.length,
              sessionErrors: quizErrors,
              score: score
            }}
          />
          {/* Bouton fermer sur mobile */}
          {showAICoach && (
            <Button
              position="absolute"
              top={4}
              right={4}
              size="sm"
              onClick={() => setShowAICoach(false)}
              display={{ base: 'block', lg: 'none' }}
            >
              Fermer
            </Button>
          )}
        </Box>

        {/* Panneau droit : Quiz */}
        <Box flex="1" overflowY="auto" maxH="calc(100vh - 64px)">
          <Container maxW="container.lg" py={8} px={6}>
            <HStack justify="space-between" mb={6}>
              <Button
                leftIcon={<FaArrowLeft />}
                variant="ghost"
                onClick={() => navigate(`/modules/${moduleId}`)}
              >
                Retour au module
              </Button>
              {/* Bouton pour afficher le Coach IA sur mobile */}
              <Button
                leftIcon={<FaBook />}
                colorScheme="green"
                size="sm"
                onClick={() => setShowAICoach(true)}
                display={{ base: 'flex', lg: 'none' }}
              >
                Coach IA
              </Button>
            </HStack>

            <VStack spacing={6} align="stretch">
              {/* Alerte pour erreurs répétitives */}
              {hasRepetitiveErrors && (
                <Alert status="warning" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <Text fontWeight="bold">⚠️ Erreurs répétitives détectées</Text>
                    <Text fontSize="sm">
                      Vous avez fait des erreurs répétitives. Le Coach IA peut vous aider ! Ouvrez le panneau du Coach IA à gauche.
                    </Text>
                  </Box>
                </Alert>
              )}
              
              <Box>
                <Heading as="h1" size="xl" mb={2}>Quiz</Heading>
                <Text color="gray.600" mb={2}>
                  Question {currentQuestion + 1} sur {quizData.length}
                </Text>
                <Progress value={progress} size="sm" colorScheme="blue" mt={2} />
              </Box>

              <Box
                bg="white"
                p={6}
                borderRadius="lg"
                boxShadow="md"
              >
                <HStack mb={4}>
                  <Badge colorScheme="blue">{currentQuiz.difficulty || 'INTERMEDIATE'}</Badge>
                  {currentQuiz.tags && currentQuiz.tags.length > 0 && (
                    <HStack spacing={2}>
                      {currentQuiz.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" colorScheme="gray">
                          {tag}
                        </Badge>
                      ))}
                    </HStack>
                  )}
                </HStack>

                <Text fontSize="xl" fontWeight="medium" mb={6}>
                  {currentQuiz.question}
                </Text>

                <RadioGroup 
                  onChange={(value) => setSelectedIndex(parseInt(value))} 
                  value={selectedIndex?.toString()}
                  mb={6}
                  isDisabled={isAnswerSubmitted}
                >
                  <Stack spacing={4}>
                    {currentQuiz.choices.map((choice, index) => {
                      const isSelected = selectedIndex === index
                      const isCorrectAnswer = index === currentQuiz.correctIndex
                      let colorScheme = 'gray'
                      
                      if (isAnswerSubmitted) {
                        if (isCorrectAnswer) {
                          colorScheme = 'green'
                        } else if (isSelected && !isCorrectAnswer) {
                          colorScheme = 'red'
                        }
                      }
                      
                      return (
                        <Radio 
                          key={index} 
                          value={index.toString()}
                          colorScheme={colorScheme}
                        >
                          {choice}
                          {isAnswerSubmitted && isCorrectAnswer && (
                            <Badge ml={2} colorScheme="green">✓ Bonne réponse</Badge>
                          )}
                          {isAnswerSubmitted && isSelected && !isCorrectAnswer && (
                            <Badge ml={2} colorScheme="red">✗ Votre réponse</Badge>
                          )}
                        </Radio>
                      )
                    })}
                  </Stack>
                </RadioGroup>

                {/* Afficher le résultat après soumission */}
                {isAnswerSubmitted && (
                  <Alert 
                    status={lastAnswerResult === 'correct' ? 'success' : 'error'} 
                    mb={4}
                    borderRadius="md"
                  >
                    <AlertIcon />
                    <Box>
                      <Text fontWeight="bold">
                        {lastAnswerResult === 'correct' 
                          ? '✓ Excellente réponse !' 
                          : '✗ Mauvaise réponse'}
                      </Text>
                      {lastAnswerResult === 'incorrect' && currentQuiz.correctIndex !== undefined && currentQuiz.choices && (
                        <Text fontSize="sm" mt={1}>
                          La bonne réponse est : <strong>{currentQuiz.choices[currentQuiz.correctIndex] || 'Non disponible'}</strong>
                        </Text>
                      )}
                      {currentQuiz.rationale && (
                        <Text fontSize="sm" mt={2}>
                          <strong>Explication :</strong> {currentQuiz.rationale}
                        </Text>
                      )}
                    </Box>
                  </Alert>
                )}

                {/* Bouton Soumettre ou Question suivante */}
                {!isAnswerSubmitted ? (
                  <Button
                    colorScheme="blue"
                    onClick={handleSubmit}
                    size="lg"
                    width="full"
                    mt={4}
                    isDisabled={selectedIndex === null}
                  >
                    Soumettre ma réponse
                  </Button>
                ) : (
                  <Button
                    colorScheme="blue"
                    onClick={handleNextQuestion}
                    size="lg"
                    width="full"
                    mt={4}
                  >
                    {currentQuestion === quizData.length - 1 ? "Voir les résultats" : "Question suivante"}
                  </Button>
                )}
              </Box>
            </VStack>
          </Container>
        </Box>
      </Box>
    </Box>
  )
}

export default Quiz
