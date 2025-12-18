import React, { useState } from 'react'
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
  AlertIcon
} from '@chakra-ui/react'

const Quiz = () => {
  // Données de démonstration pour le quiz
  const quizData = [
    {
      question: "Quelle est la capitale de la France ?",
      options: ["Londres", "Paris", "Berlin", "Madrid"],
      correctAnswer: "Paris"
    },
    {
      question: "Quel est le plus grand océan du monde ?",
      options: ["Atlantique", "Indien", "Arctique", "Pacifique"],
      correctAnswer: "Pacifique"
    },
    {
      question: "Qui a peint la Joconde ?",
      options: ["Van Gogh", "Picasso", "De Vinci", "Michel-Ange"],
      correctAnswer: "De Vinci"
    }
  ]

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState('')
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const toast = useToast()

  const handleNext = () => {
    if (!selectedOption) {
      toast({
        title: "Sélectionnez une réponse",
        status: "warning",
        duration: 2000,
        isClosable: true,
      })
      return
    }

    // Vérifier la réponse
    if (selectedOption === quizData[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }

    // Passer à la question suivante ou afficher les résultats
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption('')
    } else {
      setShowResult(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedOption('')
    setScore(0)
    setShowResult(false)
    setIsSubmitted(false)
  }

  const progress = ((currentQuestion) / quizData.length) * 100

  if (showResult) {
    return (
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
            >
              Recommencer le quiz
            </Button>
          </Box>
        </VStack>
      </Container>
    )
  }

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading as="h1" size="xl" mb={2}>Quiz</Heading>
          <Text color="gray.600">Question {currentQuestion + 1} sur {quizData.length}</Text>
          <Progress value={progress} size="sm" colorScheme="blue" mt={2} />
        </Box>

        <Box
          bg="white"
          p={6}
          borderRadius="lg"
          boxShadow="md"
        >
          <Text fontSize="xl" fontWeight="medium" mb={6}>
            {quizData[currentQuestion].question}
          </Text>

          <RadioGroup 
            onChange={setSelectedOption} 
            value={selectedOption}
            mb={6}
          >
            <Stack spacing={4}>
              {quizData[currentQuestion].options.map((option, index) => (
                <Radio 
                  key={index} 
                  value={option}
                  isDisabled={isSubmitted}
                >
                  {option}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>

          {isSubmitted && (
            <Alert status={selectedOption === quizData[currentQuestion].correctAnswer ? "success" : "error"} mb={4}>
              <AlertIcon />
              {selectedOption === quizData[currentQuestion].correctAnswer 
                ? "Bonne réponse !" 
                : `Mauvaise réponse. La bonne réponse est : ${quizData[currentQuestion].correctAnswer}`}
            </Alert>
          )}

          <Button
            colorScheme="blue"
            onClick={handleNext}
            size="lg"
            width="full"
            mt={4}
          >
            {currentQuestion === quizData.length - 1 ? "Voir les résultats" : "Question suivante"}
          </Button>
        </Box>
      </VStack>
    </Container>
  )
}

export default Quiz