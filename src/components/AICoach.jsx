import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  IconButton,
  useColorModeValue,
  Heading,
  Badge,
  Flex,
  Icon,
  Spinner,
  Textarea,
  Divider,
} from '@chakra-ui/react'
import { FaRobot, FaPaperPlane, FaVolumeUp, FaTrash, FaFileAlt } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const AICoach = forwardRef(({ 
  moduleId, 
  lessonId, 
  moduleTitle, 
  lessonTitle, 
  userLevel = 'BEGINNER',
  lessonContent = '',
  moduleDescription = '',
  currentProgress = 0,
  completedLessons = [],
  totalLessons = 0,
  recentQuizErrors = [],
  quizContext = null // Nouveau : contexte du quiz
}, ref) => {
  const { user } = useAuth()
  const userId = user?.id || 'anonymous'
  
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const messagesEndRef = useRef(null)
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const textColor = useColorModeValue('gray.800', 'white')
  const textSecondary = useColorModeValue('gray.600', 'gray.400')
  const greenColor = '#03EF62'
  const darkBlue = '#03045E'

  // Message de bienvenue initial et chargement de l'historique
  useEffect(() => {
    const fetchHistoryAndWelcome = async () => {
      setIsInitializing(true)
      try {
        const historyResponse = await fetch(`http://localhost:8000/ai/history/${userId}/${lessonId}`)
        const historyData = await historyResponse.json()

        const formattedHistory = historyData.map(msg => ({
          id: msg.id,
          type: msg.role === 'assistant' ? 'ai' : msg.role,
          text: msg.content,
          timestamp: new Date(msg.timestamp),
        }))
        
        if (formattedHistory.length > 0) {
          setMessages(formattedHistory)
        } else {
          const welcomeMessage = {
            id: 'welcome',
            type: 'ai',
            text: `Bonjour ${user?.name || ''} ! Je suis votre Coach IA pour cette leçon : "${lessonTitle}". Je suis là pour vous aider à comprendre les concepts, répondre à vos questions et vous guider dans votre apprentissage. N'hésitez pas à me poser des questions !`,
            timestamp: new Date(),
          }
          setMessages([welcomeMessage])
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'historique:', error)
        const welcomeMessage = {
          id: 'welcome',
          type: 'ai',
          text: `Bonjour ${user?.name || ''} ! Je suis votre Coach IA pour cette leçon : "${lessonTitle}". Je suis là pour vous aider à comprendre les concepts, répondre à vos questions et vous guider dans votre apprentissage. N'hésitez pas à me poser des questions !`,
          timestamp: new Date(),
        }
        setMessages([welcomeMessage])
      } finally {
        setIsInitializing(false)
      }
    }
    fetchHistoryAndWelcome()
  }, [lessonId, lessonTitle, user?.name, userId])

  // Scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Fonction helper pour envoyer un message avec un texte spécifique
  const sendMessageWithText = async (messageText, hideUserMessage = false) => {
    if (!messageText.trim() || isLoading) return

    // Ne pas afficher le message utilisateur si hideUserMessage est true
    if (!hideUserMessage) {
      const userMessage = {
        id: Date.now(),
        type: 'user',
        text: messageText,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
    }
    
    setInputMessage('')
    setIsLoading(true)

    try {
      // Préparer le contexte enrichi
      const enrichedContext = {
        lessonTitle: lessonTitle,
        lessonContent: lessonContent,
        moduleTitle: moduleTitle,
        moduleDescription: moduleDescription,
        currentProgress: currentProgress,
        completedLessons: completedLessons,
        totalLessons: totalLessons,
        recentQuizErrors: recentQuizErrors,
        quizContext: quizContext
      }

      // Appel à l'API du Brain (Python FastAPI)
      const response = await fetch('http://localhost:8000/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          message: messageText,
          user_level: userLevel,
          lesson_id: lessonId,
          module_id: moduleId,
          context: enrichedContext,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la communication avec le Coach IA')
      }

      const data = await response.json()
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: data.response || data.message || 'Je n\'ai pas pu traiter votre demande. Pouvez-vous reformuler ?',
        timestamp: new Date(),
        suggestedPrompt: data.suggested_prompt,
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error('Erreur:', error)
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: 'Désolé, je rencontre un problème technique. Voici une réponse générique :\n\n' +
              `Pour la leçon "${lessonTitle}", je vous recommande de :\n` +
              '1. Lire attentivement le contenu de la leçon\n' +
              '2. Prendre des notes sur les points clés\n' +
              '3. Me poser des questions spécifiques si quelque chose n\'est pas clair\n\n' +
              'Le service IA sera bientôt disponible !',
        timestamp: new Date(),
        isError: true,
      }
      
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return
    await sendMessageWithText(inputMessage)
  }

  // Exposer la méthode sendAutoClarification via ref
  useImperativeHandle(ref, () => ({
    sendAutoClarification: async (errorData) => {
      // Construire le message automatique de clarification
      const clarificationMessage = `J'ai fait une erreur sur cette question : "${errorData.question}". J'ai choisi "${errorData.selectedAnswer}" mais la bonne réponse est "${errorData.correctAnswer}". ${errorData.rationale ? `Explication : ${errorData.rationale}` : ''} Peux-tu m'aider à mieux comprendre ce concept ?`
      
      // Envoyer le message automatiquement SANS afficher le message utilisateur
      // Cela donne l'impression que l'IA propose vraiment la solution de manière proactive
      await sendMessageWithText(clarificationMessage, true) // true = cacher le message utilisateur
    }
  }))

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = async () => {
    if (window.confirm('Voulez-vous vraiment effacer l\'historique de cette conversation ?')) {
      try {
        const response = await fetch(`http://localhost:8000/ai/history/${userId}/${lessonId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const welcomeMessage = {
            id: 'welcome',
            type: 'ai',
            text: `Bonjour ${user?.name || ''} ! Je suis votre Coach IA pour cette leçon : "${lessonTitle}". Je suis là pour vous aider à comprendre les concepts, répondre à vos questions et vous guider dans votre apprentissage. N'hésitez pas à me poser des questions !`,
            timestamp: new Date(),
          }
          setMessages([welcomeMessage])
        } else {
          throw new Error('Erreur lors de l\'effacement de l\'historique')
        }
      } catch (error) {
        console.error('Erreur lors de l\'effacement de l\'historique:', error)
        alert('Impossible d\'effacer l\'historique. Veuillez réessayer.')
      }
    }
  }

  return (
    <Box
      h="calc(100vh - 64px)"
      display="flex"
      flexDirection="column"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
    >
      {/* Header */}
      <Box
        p={4}
        borderBottom="1px"
        borderColor={borderColor}
        bg={useColorModeValue('gray.50', 'gray.700')}
      >
        <HStack justify="space-between" align="center">
          <HStack spacing={3}>
            <Icon as={FaRobot} boxSize={5} color={greenColor} />
            <VStack align="start" spacing={0}>
              <Heading size="sm" color={textColor}>
                Coach IA
              </Heading>
              <Text fontSize="xs" color={textSecondary}>
                {moduleTitle} / {lessonTitle}
              </Text>
            </VStack>
          </HStack>
          <HStack spacing={2}>
            <IconButton
              icon={<FaVolumeUp />}
              size="sm"
              variant="ghost"
              aria-label="Écouter"
              title="Écouter le tutoriel"
            />
            <IconButton
              icon={<FaTrash />}
              size="sm"
              variant="ghost"
              aria-label="Effacer"
              onClick={clearChat}
              title="Effacer la conversation"
            />
          </HStack>
        </HStack>
      </Box>

      {/* Messages */}
      <Box flex="1" overflowY="auto" p={4}>
        <VStack spacing={4} align="stretch">
          {isInitializing ? (
            <Flex justify="center" py={8}>
              <Spinner size="lg" color={greenColor} />
            </Flex>
          ) : (
            messages.map((message) => (
              <Box key={message.id}>
                {message.type === 'user' ? (
                  <Box
                    bg={useColorModeValue('blue.50', 'blue.900')}
                    p={3}
                    borderRadius="lg"
                    ml="auto"
                    maxW="85%"
                  >
                    <Text fontSize="sm" color={textColor}>
                      {message.text}
                    </Text>
                  </Box>
                ) : (
                  <Box
                    bg={useColorModeValue('gray.100', 'gray.700')}
                    p={3}
                    borderRadius="lg"
                    maxW="85%"
                  >
                    <HStack spacing={2} mb={2}>
                      <Icon as={FaRobot} boxSize={3} color={greenColor} />
                      <Text fontSize="xs" fontWeight="bold" color={textSecondary}>
                        Coach IA
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color={textColor} whiteSpace="pre-wrap">
                      {message.text}
                    </Text>
                    
                    {/* Suggested Prompt */}
                    {message.suggestedPrompt && (
                      <Box
                        mt={3}
                        p={3}
                        bg={useColorModeValue('white', 'gray.600')}
                        borderRadius="md"
                        borderLeft="3px solid"
                        borderColor={greenColor}
                      >
                        <Text fontSize="xs" fontWeight="bold" color={textSecondary} mb={2}>
                          Exemple personnalisé :
                        </Text>
                        <Text fontSize="sm" color={textColor} fontStyle="italic">
                          "{message.suggestedPrompt}"
                        </Text>
                        <Button
                          size="xs"
                          mt={2}
                          colorScheme="green"
                          variant="outline"
                          onClick={() => setInputMessage(message.suggestedPrompt)}
                        >
                          Utiliser cette suggestion
                        </Button>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            ))
          )}
          
          {isLoading && (
            <Box
              bg={useColorModeValue('gray.100', 'gray.700')}
              p={3}
              borderRadius="lg"
              maxW="85%"
            >
              <HStack spacing={2}>
                <Spinner size="sm" color={greenColor} />
                <Text fontSize="sm" color={textSecondary}>
                  Le Coach IA réfléchit...
                </Text>
              </HStack>
            </Box>
          )}
          
          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      {/* Input */}
      <Box
        p={4}
        borderTop="1px"
        borderColor={borderColor}
        bg={useColorModeValue('gray.50', 'gray.700')}
      >
        <VStack spacing={2}>
          <HStack w="100%" spacing={2}>
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Posez votre question au Coach IA..."
              size="sm"
              resize="none"
              rows={2}
              bg={bgColor}
              _focus={{
                borderColor: greenColor,
                boxShadow: `0 0 0 1px ${greenColor}`,
              }}
            />
            <IconButton
              icon={<FaPaperPlane />}
              colorScheme="green"
              aria-label="Envoyer"
              onClick={sendMessage}
              isLoading={isLoading}
              isDisabled={!inputMessage.trim()}
            />
          </HStack>
          <Text fontSize="xs" color={textSecondary} alignSelf="flex-start">
            Appuyez sur Entrée pour envoyer, Maj+Entrée pour une nouvelle ligne
          </Text>
        </VStack>
      </Box>
    </Box>
  )
})

export default AICoach

