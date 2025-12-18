<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaClock, FaCheck } from 'react-icons/fa';
import courseQuizzes from '../data/course-quizzes.json';
import coursesData from '../data/courses.json';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
=======
import React, { useState } from 'react'
>>>>>>> 53fa89dd23aad9ac4f4ad818d1ad296ecbca1712
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
<<<<<<< HEAD
  HStack,
  Icon,
  useColorModeValue,
  Badge,
  Image,
  AspectRatio,
  Textarea,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  FaArrowLeft,
  FaArrowRight,
  FaTimes,
  FaTrophy,
  FaPlay,
  FaBook,
  FaChartLine,
  FaPiggyBank,
  FaMobileAlt,
  FaSeedling,
  FaBriefcase,
  FaRobot,
  FaUser,
  FaCheckCircle,
  FaMedal,
  FaChevronRight,
  FaRedo,
  FaDownload
} from 'react-icons/fa';

// Types de cours disponibles
const courseTypes = [
  { id: 'budget', name: 'Budget personnel', icon: FaChartLine, color: 'blue' },
  { id: 'credit', name: 'Crédit & Dette', icon: FaBook, color: 'green' },
  { id: 'epargne', name: 'Épargne', icon: FaPiggyBank, color: 'teal' },
  { id: 'entrepreneur', name: 'Finance pour entrepreneurs', icon: FaBriefcase, color: 'purple' },
  { id: 'digital', name: 'Finance digitale', icon: FaMobileAlt, color: 'orange' },
  { id: 'agricole', name: 'Finance agricole / Microfinance', icon: FaSeedling, color: 'brown' }
];

const Quiz = () => {
  const { moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const [moduleData, setModuleData] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [quizData, setQuizData] = useState([]);
  const [userQuestion, setUserQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isAskingAI, setIsAskingAI] = useState(false);
  const chatEndRef = useRef(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [allLessonsCompleted, setAllLessonsCompleted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const toast = useToast();

  // Définir les couleurs et styles
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const correctColor = useColorModeValue('green.100', 'green.900');
  const incorrectColor = useColorModeValue('red.100', 'red.900');

  // Définir courseType ici, après la définition de moduleData
  const courseType = courseTypes.find(type => type.id === moduleData?.type) || courseTypes[0];
  const CourseIcon = courseType?.icon;

  // Charger les données du module et du quiz
  useEffect(() => {
    const fetchModuleAndQuiz = async () => {
      try {
        setIsLoading(true);
        
        // Charger le cours depuis courses.json
        const course = coursesData.find(c => c.id === moduleId);
        
        if (!course) {
          // Vérifier si c'est le module rich-dad-poor-dad
          if (moduleId === 'rich-dad-poor-dad') {
            const module = await import('../data/modules/rich-dad-poor-dad');
            const moduleData = module.richDadPoorDadModule;
            
            const formattedData = {
              id: moduleData.id,
              title: moduleData.title,
              description: moduleData.description,
              type: 'education-financiere',
              icon: FaBook,
              color: 'green',
              lessons: moduleData.content.filter(item => item.type === 'text'),
              quiz: moduleData.content.find(item => item.type === 'quiz')?.questions || []
            };
            
            setModuleData(formattedData);
            setQuizData(formattedData.quiz);
            setShowQuiz(true);
            setAnswers(new Array(formattedData.quiz.length).fill(null));
            setIsLoading(false);
            return;
          }
          
          throw new Error('Cours non trouvé');
        }
        
        // Formater les données du cours
        const formattedData = {
          id: course.id,
          title: course.title,
          description: course.description,
          type: course.id.split('-')[0] || 'budget',
          level: course.level,
          lessons: course.lessons || []
        };
        
        setModuleData(formattedData);
        
        // Charger les questions de quiz depuis course-quizzes.json
        const quizQuestions = courseQuizzes[moduleId] || [];
        
        if (quizQuestions.length === 0) {
          toast({
            title: 'Avertissement',
            description: 'Aucune question de quiz disponible pour ce cours.',
            status: 'warning',
            duration: 3000,
            isClosable: true,
          });
          navigate(`/modules/${moduleId}`);
          return;
        }
        
        setQuizData(quizQuestions);
        setShowQuiz(true);
        setAnswers(new Array(quizQuestions.length).fill(null));
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement du quiz:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger le quiz. Veuillez réessayer.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        navigate(`/modules/${moduleId}`);
      }
    };
    
    fetchModuleAndQuiz();
  }, [moduleId, navigate, toast]);
  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        // Données simulées avec plusieurs leçons
        const response = await new Promise(resolve => {
          setTimeout(() => {
            resolve({
              id: moduleId,
              title: 'Gestion de budget personnel',
              description: 'Maîtrisez les bases de la gestion de votre budget',
              type: 'budget',
              level: 'Débutant',
              estimatedMinutes: 60,
              lessons: [
                {
                  id: 'lecon-1',
                  title: 'Les bases du budget',
                  description: 'Apprenez les fondements de la gestion budgétaire',
                  duration: 15,
                  content: [
                    {
                      type: 'text',
                      title: 'Pourquoi faire un budget ?',
                      text: 'Un budget est essentiel pour :\n- Contrôler vos dépenses\n- Économiser pour vos projets\n- Éviter les dettes\n- Atteindre vos objectifs financiers'
                    },
                    {
                      type: 'text',
                      title: 'Comment créer un budget simple',
                      text: '1. Listez tous vos revenus\n2. Notez toutes vos dépenses fixes (loyer, factures...)\n3. Estimez vos dépenses variables (courses, loisirs...)\n4. Soustraire les dépenses des revenus'
                    }
                  ]
                },
                {
                  id: 'lecon-2',
                  title: 'Épargne et investissement',
                  description: 'Découvrez comment faire fructifier votre argent',
                  duration: 20,
                  content: [
                    {
                      type: 'text',
                      title: 'L\'importance de l\'épargne',
                      text: 'Il est recommandé d\'épargner :\n- 10% de vos revenus pour les urgences\n- 20% pour vos projets à moyen/long terme\n- 5% pour votre retraite'
                    },
                    {
                      type: 'text',
                      title: 'Les bases de l\'investissement',
                      text: 'Commencer à investir peut sembler intimidant, mais voici quelques options accessibles :\n- Comptes épargne rémunérés\n- Fonds communs de placement\n- Bons du Trésor\n- Actions et obligations'
                    }
                  ]
                }
              ]
            });
          }, 500);
        });

        setModuleData(response);

        // Si un ID de leçon est fourni dans l'URL, charger cette leçon
        if (lessonId) {
          const lesson = response.lessons.find(l => l.id === lessonId);
          if (lesson) {
            setCurrentLesson(lesson);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement du module:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModuleData();
  }, [moduleId, lessonId]);

  const completeLesson = (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      const newCompletedLessons = [...completedLessons, lessonId];
      setCompletedLessons(newCompletedLessons);

      // Vérifier si toutes les leçons sont terminées
      const allCompleted = moduleData.lessons.every(lesson =>
        newCompletedLessons.includes(lesson.id) || lesson.id === lessonId
      );

      if (allCompleted) {
        setAllLessonsCompleted(true);
        toast({
          title: "Félicitations !",
          description: "Vous avez terminé toutes les leçons. Prêt pour le quiz ?",
          status: "success",
          duration: null, // Ne pas fermer automatiquement
          isClosable: true,
          position: "top",
          render: ({ onClose }) => (
            <Box
              p={4}
              bg="white"
              borderRadius="md"
              boxShadow="lg"
              borderLeft="4px"
              borderColor="green.500"
            >
              <HStack justify="space-between" align="center">
                <Box>
                  <Text fontWeight="bold">Félicitations !</Text>
                  <Text>Vous avez terminé toutes les leçons. Prêt pour le quiz ?</Text>
                </Box>
                <Button
                  colorScheme="green"
                  size="sm"
                  onClick={() => {
                    startQuiz();
                    onClose();
                  }}
                >
                  Commencer le quiz
                </Button>
              </HStack>
            </Box>
          )
        });
      } else {
        // Aller à la leçon suivante
        const currentIndex = moduleData.lessons.findIndex(lesson => lesson.id === lessonId);
        const nextLesson = moduleData.lessons[currentIndex + 1];
        if (nextLesson) {
          setCurrentLesson(nextLesson);
        }
      }
    }
  };

  const startQuiz = () => {
    setShowQuiz(true);
    // Réinitialiser les états du quiz
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption('');
    setShowResult(false);
    setAnswers([]);
  };

  const completeQuiz = () => {
    setQuizCompleted(true);
    setShowQuiz(false);
    setAllLessonsCompleted(false);

    // Calculer le score en pourcentage
    const percentage = Math.round((score / quizData.length) * 100);

    toast({
      title: "Quiz terminé !",
      description: `Votre score : ${score}/${quizData.length} (${percentage}%)`,
      status: "success",
      duration: null, // Ne pas fermer automatiquement
      isClosable: true,
    });
  };

  // Si le module est en cours de chargement
  if (isLoading || !moduleData) {
    return (
      <Container maxW="container.md" py={10} textAlign="center">
        <Text>Chargement du module...</Text>
        <Progress size="xs" isIndeterminate mt={4} />
      </Container>
    );
  }

  // Si le quiz est terminé, afficher le badge/certificat
  if (quizCompleted) {
    const percentage = Math.round((score / quizData.length) * 100);
    const passed = percentage >= 70; // 70% pour réussir

    return (
      <Container maxW="container.md" py={10} textAlign="center">
        <Box
          p={8}
          borderWidth="2px"
          borderRadius="lg"
          borderColor={passed ? 'green.500' : 'red.500'}
          boxShadow="lg"
          maxW="600px"
          mx="auto"
          bg="white"
        >
          <Icon
            as={passed ? FaTrophy : FaRedo}
            boxSize={16}
            color={passed ? 'yellow.400' : 'red.500'}
            mb={6}
          />

          <Heading as="h1" size="xl" mb={4} color={passed ? 'green.600' : 'red.600'}>
            {passed ? 'Félicitations !' : 'Quiz terminé'}
          </Heading>

          <Text fontSize="xl" mb={6}>
            Vous avez obtenu {score} bonnes réponses sur {quizData.length}
          </Text>

          <Box
            p={6}
            bg={passed ? 'green.50' : 'red.50'}
            borderRadius="md"
            mb={8}
            textAlign="left"
          >
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              {passed
                ? '🎉 Bravo !'
                : '📝 Encore un effort !'}
            </Text>
            <Text>
              {passed
                ? 'Vous avez réussi le quiz avec succès ! Vous pouvez maintenant appliquer ces connaissances dans votre vie quotidienne.'
                : 'Ne vous inquiétez pas ! Vous pouvez réviser les leçons et réessayer le quiz plus tard.'}
            </Text>
          </Box>

          <Button
            colorScheme={passed ? 'green' : 'red'}
            size="lg"
            rightIcon={<FaArrowLeft />}
            onClick={() => {
              setQuizCompleted(false);
              setCurrentLesson(null);
            }}
          >
            Retour aux leçons
          </Button>

          {passed && (
            <Button
              ml={4}
              colorScheme="blue"
              size="lg"
              rightIcon={<FaDownload />}
              onClick={() => {
                // Ici, vous pouvez ajouter la logique pour télécharger le certificat
                toast({
                  title: 'Téléchargement du certificat',
                  description: 'Le certificat sera bientôt disponible !',
                  status: 'info',
                  duration: 3000,
                });
              }}
            >
              Télécharger le certificat
            </Button>
          )}
        </Box>
      </Container>
    );
  }

  // Fonction pour soumettre la réponse
  const handleSubmit = () => {
    if (selectedOption === '') {
      toast({
        title: 'Sélectionnez une réponse',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    const isCorrect = parseInt(selectedOption) === quizData[currentQuestion].correctAnswer;
    const updatedAnswers = [...answers];
    const previousAnswer = updatedAnswers[currentQuestion];
    
    updatedAnswers[currentQuestion] = {
      question: quizData[currentQuestion].question,
      userAnswer: parseInt(selectedOption),
      isCorrect,
      correctAnswer: quizData[currentQuestion].correctAnswer,
      explanation: quizData[currentQuestion].explanation
    };
    
    setAnswers(updatedAnswers);
    
    // Mettre à jour le score seulement si la réponse change
    if (!previousAnswer || previousAnswer.isCorrect !== isCorrect) {
      if (isCorrect && (!previousAnswer || !previousAnswer.isCorrect)) {
        setScore(prev => prev + 1);
      } else if (!isCorrect && previousAnswer && previousAnswer.isCorrect) {
        setScore(prev => Math.max(0, prev - 1));
      }
    }

    setIsSubmitted(true);
  };

  // Fonction pour passer à la question suivante
  const handleNext = () => {
    if (!isSubmitted) {
      toast({
        title: 'Soumettez d\'abord votre réponse',
        status: 'warning',
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption('');
      setIsSubmitted(false);
    } else {
      // Quiz terminé - calculer le score final basé sur toutes les réponses
      const finalScore = answers.filter(a => a && a.isCorrect).length;
      const percentage = Math.round((finalScore / quizData.length) * 100);
      const passed = percentage >= 70;
      
      // Mettre à jour le score pour correspondre au calcul final
      setScore(finalScore);
      
      // Sauvegarder le résultat du quiz
      localStorage.setItem(`quizCompleted_${moduleId}`, 'true');
      localStorage.setItem(`quizScore_${moduleId}`, JSON.stringify({
        score: finalScore,
        total: quizData.length,
        percentage: percentage,
        passed: passed,
        date: new Date().toISOString()
      }));
      
      // Sauvegarder pour le dashboard
      const dashboardResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
      dashboardResults.push({
        moduleId: moduleId,
        moduleTitle: moduleData?.title || 'Cours',
        score: finalScore,
        total: quizData.length,
        percentage: percentage,
        passed: passed,
        date: new Date().toISOString()
      });
      localStorage.setItem('quizResults', JSON.stringify(dashboardResults));
      
      setQuizCompleted(true);
      setShowQuiz(false);
      
      // Afficher le feedback avec modal
      onOpen();
    }
  };

  // Fonction pour recommencer le quiz
  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption('');
    setIsSubmitted(false);
    setAnswers(new Array(quizData.length).fill(null));
    setQuizCompleted(false);
    setShowQuiz(true);
    localStorage.removeItem(`quizCompleted_${moduleId}`);
  };

  // Fonction pour générer et télécharger le certificat
  const downloadCertificate = async () => {
    try {
      const quizResult = JSON.parse(localStorage.getItem(`quizScore_${moduleId}`) || '{}');
      const finalScore = quizResult.score || 0;
      const total = quizResult.total || quizData.length;
      const percentage = quizResult.percentage || 0;
      const courseTitle = moduleData?.title || 'Cours';
      const userName = localStorage.getItem('userName') || 'Apprenant';
      const date = new Date().toLocaleDateString('fr-FR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      // Créer un élément HTML pour le certificat
      const certificateDiv = document.createElement('div');
      certificateDiv.style.width = '800px';
      certificateDiv.style.height = '600px';
      certificateDiv.style.padding = '60px';
      certificateDiv.style.backgroundColor = '#ffffff';
      certificateDiv.style.border = '8px solid #2563eb';
      certificateDiv.style.fontFamily = 'Arial, sans-serif';
      certificateDiv.style.textAlign = 'center';
      certificateDiv.style.position = 'absolute';
      certificateDiv.style.left = '-9999px';
      certificateDiv.innerHTML = `
        <div style="border: 3px solid #fbbf24; padding: 40px; height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <h1 style="color: #2563eb; font-size: 48px; margin: 0 0 20px 0; font-weight: bold;">CERTIFICAT</h1>
            <h2 style="color: #1e40af; font-size: 24px; margin: 0 0 40px 0; font-weight: normal;">DE COMPLÉTION</h2>
            <p style="color: #374151; font-size: 18px; margin: 30px 0; line-height: 1.6;">
              Ceci certifie que
            </p>
            <h3 style="color: #1e40af; font-size: 32px; margin: 20px 0; font-weight: bold; text-decoration: underline;">
              ${userName}
            </h3>
            <p style="color: #374151; font-size: 18px; margin: 30px 0; line-height: 1.6;">
              a complété avec succès le cours
            </p>
            <h4 style="color: #2563eb; font-size: 28px; margin: 20px 0; font-weight: bold;">
              ${courseTitle}
            </h4>
            <p style="color: #374151; font-size: 18px; margin: 30px 0; line-height: 1.6;">
              avec un score de <strong style="color: #059669; font-size: 24px;">${finalScore}/${total}</strong> (${percentage}%)
            </p>
          </div>
          <div style="margin-top: 40px;">
            <p style="color: #6b7280; font-size: 16px; margin: 20px 0;">
              Date: ${date}
            </p>
            <div style="margin-top: 40px; display: flex; justify-content: space-around; align-items: flex-end;">
              <div style="text-align: center;">
                <div style="border-top: 2px solid #374151; width: 200px; margin: 0 auto; padding-top: 10px;">
                  <p style="color: #374151; font-size: 14px; margin: 0;">Signature</p>
                </div>
              </div>
              <div style="text-align: center;">
                <div style="border-top: 2px solid #374151; width: 200px; margin: 0 auto; padding-top: 10px;">
                  <p style="color: #374151; font-size: 14px; margin: 0;">Date</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(certificateDiv);

      // Convertir en image avec html2canvas
      const canvas = await html2canvas(certificateDiv, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });

      // Créer un PDF avec jsPDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'px', [800, 600]);
      pdf.addImage(imgData, 'PNG', 0, 0, 800, 600);

      // Télécharger le PDF
      const fileName = `Certificat_${courseTitle.replace(/\s+/g, '_')}_${userName.replace(/\s+/g, '_')}.pdf`;
      pdf.save(fileName);

      // Nettoyer
      document.body.removeChild(certificateDiv);

      toast({
        title: 'Certificat téléchargé !',
        description: 'Votre certificat a été téléchargé avec succès.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erreur lors de la génération du certificat:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de générer le certificat. Veuillez réessayer.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Si le quiz est terminé, afficher le feedback
  if (quizCompleted && !showQuiz) {
    const quizResult = JSON.parse(localStorage.getItem(`quizScore_${moduleId}`) || '{}');
    const finalScore = quizResult.score || 0;
    const total = quizResult.total || quizData.length;
    const percentage = quizResult.percentage || 0;
    const passed = quizResult.passed || false;

    return (
      <Container maxW="container.md" py={10}>
        <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textAlign="center">
              <Icon
                as={passed ? FaTrophy : FaRedo}
                boxSize={12}
                color={passed ? 'yellow.400' : 'orange.400'}
                mb={4}
                mx="auto"
                display="block"
              />
              <Heading size="lg" color={passed ? 'green.600' : 'orange.600'}>
                {passed ? 'Félicitations !' : 'Quiz terminé'}
              </Heading>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody textAlign="center">
              <VStack spacing={4}>
                <Box>
                  <Text fontSize="3xl" fontWeight="bold" color={passed ? 'green.500' : 'orange.500'}>
                    {finalScore} / {total}
                  </Text>
                  <Text fontSize="xl" color="gray.600" mt={2}>
                    {percentage}% de bonnes réponses
                  </Text>
                </Box>
                
                <Box
                  p={4}
                  bg={passed ? 'green.50' : 'orange.50'}
                  borderRadius="md"
                  width="100%"
                >
                  <Text fontSize="md" color={passed ? 'green.800' : 'orange.800'}>
                    {passed
                      ? '🎉 Excellent travail ! Vous avez réussi le quiz avec succès. Vous pouvez maintenant appliquer ces connaissances dans votre vie quotidienne.'
                      : '📝 Bon effort ! Vous pouvez réviser les leçons et réessayer le quiz pour améliorer votre score.'}
                  </Text>
                </Box>

                <Progress 
                  value={percentage} 
                  colorScheme={passed ? 'green' : 'orange'} 
                  size="lg" 
                  width="100%"
                  borderRadius="full"
                />
              </VStack>
            </ModalBody>
            <ModalFooter justifyContent="center" flexDirection="column" gap={3}>
              {passed && (
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={downloadCertificate}
                  rightIcon={<FaDownload />}
                  width="100%"
                >
                  Télécharger le certificat
                </Button>
              )}
              <Button
                colorScheme={passed ? 'green' : 'orange'}
                size="lg"
                onClick={() => {
                  onClose();
                  navigate('/dashboard');
                }}
                rightIcon={<FaChartLine />}
                width="100%"
              >
                Voir mon dashboard
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Box
          p={8}
          borderWidth="2px"
          borderRadius="lg"
          borderColor={passed ? 'green.500' : 'orange.500'}
          boxShadow="lg"
          maxW="600px"
          mx="auto"
          bg="white"
          textAlign="center"
        >
          <Icon
            as={passed ? FaTrophy : FaRedo}
            boxSize={16}
            color={passed ? 'yellow.400' : 'orange.500'}
            mb={6}
          />

          <Heading as="h1" size="xl" mb={4} color={passed ? 'green.600' : 'orange.600'}>
            {passed ? 'Félicitations !' : 'Quiz terminé'}
          </Heading>

          <Text fontSize="xl" mb={6}>
            Vous avez obtenu {finalScore} bonnes réponses sur {total}
          </Text>

          <Box
            p={6}
            bg={passed ? 'green.50' : 'orange.50'}
            borderRadius="md"
            mb={8}
            textAlign="left"
          >
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              {passed ? '🎉 Bravo !' : '📝 Encore un effort !'}
            </Text>
            <Text>
              {passed
                ? 'Vous avez réussi le quiz avec succès ! Vous pouvez maintenant appliquer ces connaissances dans votre vie quotidienne.'
                : 'Ne vous inquiétez pas ! Vous pouvez réviser les leçons et réessayer le quiz plus tard.'}
            </Text>
          </Box>

          {passed && (
            <Button
              colorScheme="blue"
              size="lg"
              onClick={downloadCertificate}
              rightIcon={<FaDownload />}
              mb={4}
              width="100%"
            >
              Télécharger le certificat
            </Button>
=======
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
>>>>>>> 53fa89dd23aad9ac4f4ad818d1ad296ecbca1712
          )}

          <Button
            colorScheme="blue"
<<<<<<< HEAD
            size="lg"
            onClick={() => navigate('/dashboard')}
            rightIcon={<FaChartLine />}
            mb={4}
            width="100%"
          >
            Voir mon dashboard
          </Button>

          <Button
            colorScheme={passed ? 'green' : 'orange'}
            size="lg"
            variant="outline"
            onClick={() => navigate(`/modules/${moduleId}`)}
            rightIcon={<FaArrowLeft />}
            width="100%"
          >
            Retour au cours
          </Button>
        </Box>
      </Container>
    );
  }

  // Si le quiz est en cours, afficher la question actuelle
  if (showQuiz) {

    return (
      <Container maxW="container.md" py={10}>
        <Button
          leftIcon={<FaArrowLeft />}
          variant="ghost"
          mb={6}
          onClick={() => navigate(`/modules/${moduleId}`)}
        >
          Retour aux leçons
        </Button>

        <Box mb={8}>
          <Badge colorScheme={courseType.color} mb={2}>
            Quiz
          </Badge>
          <Heading as="h1" size="xl" mb={2}>{moduleData.title}</Heading>
          <Text color="gray.600" mb={6}>{moduleData.description}</Text>

          {/* Contenu du quiz */}
          <VStack spacing={8} align="stretch" mb={8}>
            <Box 
              p={6} 
              borderWidth="1px" 
              borderRadius="lg" 
              bg="white"
              boxShadow="sm"
            >
              <Heading as="h3" size="md" mb={4} color={courseType.color}>
                {quizData[currentQuestion].question}
              </Heading>
              <RadioGroup 
                onChange={(value) => setSelectedOption(value)} 
                value={selectedOption}
              >
                <Stack spacing={4}>
                  {quizData[currentQuestion].options.map((option, index) => (
                    <Radio 
                      key={index} 
                      value={index.toString()}
                      colorScheme={courseType.color}
                    >
                      {option}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
              {isSubmitted && (
                <Box 
                  mt={4} 
                  p={4} 
                  bg={answers[currentQuestion]?.isCorrect ? correctColor : incorrectColor}
                  borderRadius="md"
                >
                  <HStack mb={2}>
                    <Icon 
                      as={answers[currentQuestion]?.isCorrect ? FaCheckCircle : FaTimes} 
                      color={answers[currentQuestion]?.isCorrect ? 'green.500' : 'red.500'}
                      boxSize={5}
                    />
                    <Text 
                      fontWeight="bold" 
                      color={answers[currentQuestion]?.isCorrect ? 'green.700' : 'red.700'}
                    >
                      {answers[currentQuestion]?.isCorrect ? 'Bonne réponse !' : 'Mauvaise réponse'}
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="gray.700" mb={2}>
                    <strong>Réponse correcte :</strong> {quizData[currentQuestion].options[quizData[currentQuestion].correctAnswer]}
                  </Text>
                  <Text fontSize="sm" color="gray.700">
                    <strong>Explication :</strong> {quizData[currentQuestion].explanation}
                  </Text>
                </Box>
              )}
            </Box>
          </VStack>

          <HStack spacing={4} mb={4}>
            <Text fontSize="sm" color="gray.600">
              Question {currentQuestion + 1} sur {quizData.length}
            </Text>
            <Progress 
              value={((currentQuestion + 1) / quizData.length) * 100} 
              colorScheme={courseType.color} 
              size="sm" 
              flex={1}
              borderRadius="full"
            />
          </HStack>

          {!isSubmitted ? (
            <Button 
              colorScheme={courseType.color} 
              size="lg" 
              onClick={handleSubmit}
              rightIcon={<FaCheck />}
              width="100%"
              py={6}
              isDisabled={selectedOption === ''}
            >
              Soumettre la réponse
            </Button>
          ) : (
            <Button 
              colorScheme={courseType.color} 
              size="lg" 
              onClick={handleNext}
              rightIcon={currentQuestion < quizData.length - 1 ? <FaArrowRight /> : <FaTrophy />}
              width="100%"
              py={6}
            >
              {currentQuestion < quizData.length - 1 ? 'Question suivante' : 'Terminer le quiz'}
            </Button>
          )}

          <Button 
            colorScheme="red" 
            size="lg" 
            onClick={restartQuiz}
            rightIcon={<FaRedo />}
            width="100%"
            py={6}
            mt={4}
          >
            Recommencer
          </Button>
        </Box>
      </Container>
    );
  }

  // Si aucune leçon n'est sélectionnée, afficher la liste des leçons
  if (!currentLesson) {
    return (
      <Container maxW="container.md" py={10}>
        <Button
          leftIcon={<FaArrowLeft />}
          variant="ghost"
          mb={6}
          onClick={() => navigate('/modules')}
        >
          Retour aux modules
        </Button>

        {/* Liste des leçons */}
        <Box>
          <Heading as="h2" size="lg" mb={6}>Leçons disponibles</Heading>
          <VStack spacing={4} align="stretch">
            {moduleData.lessons?.map((lesson) => (
              <Box
                key={lesson.id}
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                borderColor={borderColor}
                _hover={{ bg: hoverBg, cursor: 'pointer' }}
                onClick={() => setCurrentLesson(lesson)}
              >
                <HStack justify="space-between">
                  <Box>
                    <Text fontWeight="bold">{lesson.title}</Text>
                    <Text fontSize="sm" color="gray.600">{lesson.description}</Text>
                    <HStack mt={2} spacing={4}>
                      <Text fontSize="xs" color="gray.500">
                        <Icon as={FaClock} mr={1} /> {lesson.duration} min
                      </Text>
                      {completedLessons.includes(lesson.id) && (
                        <Badge colorScheme="green" size="sm">
                          <HStack spacing={1}><FaCheck size={10} /> Terminé</HStack>
                        </Badge>
                      )}
                    </HStack>
                  </Box>
                  <Icon as={FaChevronRight} color="gray.400" />
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Bouton pour passer au quiz si toutes les leçons sont terminées */}
        {allLessonsCompleted && (
          <Box mt={8} textAlign="center">
            <Text fontSize="lg" mb={4} fontWeight="medium">
              Vous avez terminé toutes les leçons !
            </Text>
            <Button
              colorScheme="green"
              size="lg"
              rightIcon={<FaArrowRight />}
              onClick={startQuiz}
              px={8}
              py={6}
            >
              Passer au quiz
            </Button>
          </Box>
        )}
      </Container>
    );
  }

  // Afficher la leçon en cours
  return (
    <Container maxW="container.md" py={10}>
      <Button
        leftIcon={<FaArrowLeft />}
        variant="ghost"
        mb={6}
         onClick={() => navigate(`/modules/${moduleId}`)}
      >
        Retour aux leçons
      </Button>

      <Box mb={8}>
        <Badge colorScheme={courseType.color} mb={2}>
          Leçon
        </Badge>
        <Heading as="h1" size="xl" mb={2}>{currentLesson.title}</Heading>
        <Text color="gray.600" mb={6}>{currentLesson.description}</Text>

        {/* Contenu de la leçon */}
        <VStack spacing={8} align="stretch" mb={8}>
          {currentLesson.content?.map((item, index) => (
            <Box 
              key={index} 
              p={6} 
              borderWidth="1px" 
              borderRadius="lg" 
              bg="white"
              boxShadow="sm"
            >
              <Heading as="h3" size="md" mb={4} color={courseType.color}>
                {item.title}
              </Heading>
              <Text whiteSpace="pre-line" color="gray.700">
                {item.text}
              </Text>
            </Box>
          ))}
        </VStack>

        <Button 
          colorScheme={courseType.color} 
          size="lg" 
          onClick={() => completeLesson(currentLesson.id)}
          rightIcon={<FaCheck />}
          width="100%"
          py={6}
        >
          {completedLessons.includes(currentLesson.id) 
            ? "Leçon terminée" 
            : "Marquer comme terminé"}
        </Button>
      </Box>
    </Container>
  );
}

export default Quiz;
=======
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
>>>>>>> 53fa89dd23aad9ac4f4ad818d1ad296ecbca1712
