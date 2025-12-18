import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import coursesData from '../data/courses.json';
import {
  Container, Box, Button, Heading, Text, VStack, HStack, Icon,
  Badge, Progress, useColorModeValue, useToast, Alert, AlertIcon, 
  AlertTitle, AlertDescription, Spinner, Divider, Fade, ScaleFade,
  useDisclosure
} from '@chakra-ui/react';
import { FaArrowLeft, FaCheck, FaClock, FaArrowRight, FaTrophy, FaLock, FaBook } from 'react-icons/fa';

const Lesson = () => {
  const { moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [moduleData, setModuleData] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [isAllLessonsCompleted, setIsAllLessonsCompleted] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Effet pour gérer l'affichage de la notification de fin de module
  useEffect(() => {
    if (isAllLessonsCompleted) {
      onOpen();
      // Masquer la notification après 10 secondes
      const timer = setTimeout(() => {
        onClose();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isAllLessonsCompleted, onOpen, onClose]);

  // Charger les données de la leçon
  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        setIsLoading(true);
        
        // Vérifier d'abord si c'est le module rich-dad-poor-dad (gestion spéciale)
        if (moduleId === 'rich-dad-poor-dad') {
          const module = await import('../data/modules/rich-dad-poor-dad');
          const moduleData = module.richDadPoorDadModule;
          
          const formattedData = {
            id: moduleData.id,
            title: moduleData.title,
            lessons: moduleData.content
              .filter(item => item && (item.type === 'text' || item.type === 'lesson') && item.id && item.title)
              .map(lesson => ({
                id: lesson.id,
                title: lesson.title,
                content: [{
                  title: lesson.title,
                  text: lesson.content || 'Contenu non disponible'
                }]
              }))
          };
          
          setModuleData(formattedData);
          
          const lesson = formattedData.lessons.find(l => l.id === lessonId);
          
          if (!lesson) {
            throw new Error('Leçon non trouvée');
          }
          setCurrentLesson(lesson);
          
          const savedCompleted = JSON.parse(localStorage.getItem(`completedLessons_${moduleId}`) || '[]');
          setCompletedLessons(savedCompleted);
          
          const allCompleted = formattedData.lessons.every(l => savedCompleted.includes(l.id));
          setIsAllLessonsCompleted(allCompleted);
          
          setIsLoading(false);
          return;
        }
        
        // Charger depuis courses.json
        const course = coursesData.find(c => c.id === moduleId);
        
        if (!course) {
          throw new Error('Cours non trouvé');
        }
        
        // Trouver la leçon dans le cours
        const lessonFromCourse = course.lessons?.find(l => l.id === lessonId);
        
        if (!lessonFromCourse) {
          throw new Error('Leçon non trouvée');
        }
        
        // Formater les données du cours avec contenu détaillé
        const formattedData = {
          id: course.id,
          title: course.title,
          lessons: (course.lessons || []).map(lesson => {
            // Générer un contenu texte détaillé à partir du résumé
            const detailedContent = lesson.summary 
              ? `${lesson.title}\n\n${lesson.summary}\n\n` +
                `Cette leçon fait partie du cours "${course.title}". ` +
                `Elle vous permettra de comprendre et d'appliquer les concepts abordés dans le résumé ci-dessus.\n\n` +
                `Objectifs d'apprentissage :\n` +
                `- Comprendre les concepts clés de ${lesson.title}\n` +
                `- Appliquer les connaissances acquises dans votre contexte\n` +
                `- Développer une compréhension approfondie du sujet\n\n` +
                `Contenu détaillé :\n\n` +
                `${lesson.summary}\n\n` +
                `Pour approfondir ce sujet, prenez le temps de réfléchir aux exemples concrets ` +
                `et aux applications pratiques dans votre contexte local. N'hésitez pas à prendre des notes ` +
                `et à revenir sur cette leçon si nécessaire.`
              : `Contenu de la leçon: ${lesson.title}\n\nCette leçon fait partie du cours "${course.title}".\n\n` +
                `Les détails de cette leçon seront bientôt disponibles.`;
            
            return {
              id: lesson.id,
              title: lesson.title,
              content: [{
                title: lesson.title,
                text: detailedContent
              }]
            };
          })
        };
        
        setModuleData(formattedData);
        
        // Trouver la leçon actuelle
        const lesson = formattedData.lessons.find(l => l.id === lessonId);
        
        if (!lesson) {
          throw new Error('Leçon non trouvée');
        }
        
        setCurrentLesson(lesson);
        
        // Récupérer les leçons complétées depuis le stockage local
        const savedCompleted = JSON.parse(localStorage.getItem(`completedLessons_${moduleId}`) || '[]');
        setCompletedLessons(savedCompleted);
        
        // Vérifier si toutes les leçons sont complétées
        const allCompleted = formattedData.lessons.every(l => savedCompleted.includes(l.id));
        setIsAllLessonsCompleted(allCompleted);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement de la leçon:', error);
        toast({
          title: 'Erreur',
          description: `Impossible de charger la leçon: ${error.message}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        navigate('/modules');
      }
    };
    
    fetchLessonData();
  }, [moduleId, lessonId, navigate, toast]);

  const completeLesson = useCallback(() => {
    if (!completedLessons.includes(lessonId)) {
      const updatedCompleted = [...completedLessons, lessonId];
      setCompletedLessons(updatedCompleted);
      
      // Sauvegarder dans le stockage local
      localStorage.setItem(`completedLessons_${moduleId}`, JSON.stringify(updatedCompleted));
      
      // Vérifier si toutes les leçons sont maintenant complétées
      const allCompleted = moduleData.lessons.every(lesson => 
        updatedCompleted.includes(lesson.id)
      );
      
      setIsAllLessonsCompleted(allCompleted);
      
      // Afficher la notification de fin de module
      if (allCompleted) {
        setShowCompletion(true);
      }
      
      toast({
        position: 'top-right',
        title: 'Leçon terminée !',
        description: allCompleted ? 'Félicitations ! Vous avez terminé toutes les leçons.' : 'Bien joué ! Passez à la suite.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      return allCompleted;
    }
    return false;
  }, [completedLessons, lessonId, moduleId, moduleData, toast]);

  const goToQuiz = () => {
    navigate(`/modules/${moduleId}/quiz`);
  };

  const goToNextLesson = useCallback(async () => {
    const currentIndex = moduleData.lessons.findIndex(l => l.id === lessonId);
    if (currentIndex < moduleData.lessons.length - 1) {
      // Marquer la leçon comme complétée avant de passer à la suivante
      const allCompleted = await completeLesson();
      if (!allCompleted) {
        navigate(`/modules/${moduleId}/lessons/${moduleData.lessons[currentIndex + 1].id}`);
      }
    }
  }, [moduleData, lessonId, completeLesson, moduleId, navigate]);

  const isLastLesson = moduleData && 
                      currentLesson && 
                      moduleData.lessons[moduleData.lessons.length - 1].id === currentLesson.id;

  // Vérifier si la leçon actuelle est complétée
  const isLessonCompleted = completedLessons.includes(lessonId);

  // Fonction pour gérer la complétion de la leçon et la navigation
  const handleCompleteAndNavigate = useCallback(async () => {
    const allCompleted = await completeLesson();
    if (!allCompleted && !isLastLesson) {
      goToNextLesson();
    }
  }, [completeLesson, goToNextLesson, isLastLesson]);

  if (isLoading) {
    return (
      <Container maxW="container.md" py={10} centerContent>
        <Spinner size="xl" color="blue.500" />
        <Text mt={4}>Chargement de la leçon...</Text>
      </Container>
    );
  }

  if (!currentLesson) {
    return (
      <Container maxW="container.md" py={10}>
        <Alert status="error">
          <AlertIcon />
          <Box>
            <AlertTitle>Leçon non trouvée</AlertTitle>
            <AlertDescription>
              La leçon demandée n'existe pas ou n'est pas disponible pour le moment.
            </AlertDescription>
          </Box>
        </Alert>
        <Button
          leftIcon={<FaArrowLeft />}
          mt={4}
          onClick={() => navigate(-1)}
        >
          Retour
        </Button>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={10}>
      <Button
        leftIcon={<FaArrowLeft />}
        variant="ghost"
        mb={6}
        onClick={() => navigate(`/modules/${moduleId}`)}
      >
        Retour au module
      </Button>

      <Box mb={8}>
        <Badge 
          colorScheme={isLessonCompleted ? 'green' : 'blue'} 
          mb={2}
          display="flex"
          alignItems="center"
          gap={2}
          py={1}
          px={3}
          borderRadius="full"
        >
          {isLessonCompleted ? (
            <>
              <FaCheck /> Leçon terminée
            </>
          ) : (
            <>
              <FaBook /> Leçon en cours
            </>
          )}
        </Badge>
        
        <Box mb={4}>
          <Text fontSize="sm" color="gray.500" mb={1}>
            Leçon {moduleData.lessons.findIndex(l => l.id === lessonId) + 1} sur {moduleData.lessons.length}
          </Text>
          <Heading as="h1" size="xl" mb={2}>{currentLesson.title}</Heading>
          
          <Box mt={4} mb={6}>
            <Text fontSize="sm" color="gray.500" mb={1}>
              Progression du module
            </Text>
            <Box mb={1}>
              <Progress 
                value={(completedLessons.length / moduleData.lessons.length) * 100} 
                size="sm" 
                colorScheme="blue" 
                borderRadius="full"
              />
            </Box>
            <Text fontSize="sm" color="gray.600">
              {completedLessons.length} / {moduleData.lessons.length} leçons complétées
            </Text>
          </Box>
        </Box>
        
        <Divider my={4} />
        
        {/* Contenu de la leçon */}
        <VStack spacing={8} align="stretch" mb={8}>
          {currentLesson.content?.map((item, index) => (
            <Box key={index} p={6} borderWidth="1px" borderRadius="lg" boxShadow="sm">
              <Heading as="h3" size="md" mb={4} color="blue.600">{item.title}</Heading>
              <Text whiteSpace="pre-line" lineHeight="tall">
                {item.text}
              </Text>
            </Box>
          ))}
        </VStack>
        
        <Divider my={6} />
        
        {/* Notification de fin de module */}
        <ScaleFade in={isAllLessonsCompleted && isOpen} initialScale={0.9}>
          <Alert 
            status="success" 
            mb={6} 
            borderRadius="md"
            variant="left-accent"
            flexDirection="column"
            alignItems="flex-start"
          >
            <HStack mb={2}>
              <AlertIcon boxSize="24px" />
              <AlertTitle>Félicitations !</AlertTitle>
            </HStack>
            <Box>
              <AlertDescription mb={4}>
                Vous avez terminé toutes les leçons de ce module. Vous êtes maintenant prêt à passer au quiz final pour valider vos connaissances.
              </AlertDescription>
              <Button 
                colorScheme="green" 
                size="sm" 
                onClick={() => {
                  onClose();
                  goToQuiz();
                }}
                rightIcon={<FaTrophy />}
              >
                Passer au quiz final
              </Button>
            </Box>
          </Alert>
        </ScaleFade>
        
        <HStack spacing={4} justify="flex-end" mt={8}>
          {!isAllLessonsCompleted && (
            <>
              <Button
                colorScheme={isLessonCompleted ? 'green' : 'blue'}
                size="lg"
                onClick={handleCompleteAndNavigate}
                rightIcon={isLessonCompleted ? <FaCheck /> : <FaArrowRight />}
                isLoading={isLoading}
              >
                {isLessonCompleted ? 'Terminé' : isLastLesson ? 'Terminer le module' : 'Terminer et continuer'}
              </Button>
              
              {!isLastLesson && !isLessonCompleted && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={goToNextLesson}
                  rightIcon={<FaArrowRight />}
                >
                  Passer à la suite
                </Button>
              )}
            </>
          )}
          
          {isAllLessonsCompleted && (
            <Button
              colorScheme="green"
              size="lg"
              onClick={goToQuiz}
              rightIcon={<FaTrophy />}
            >
              Passer au quiz final
            </Button>
          )}
        </HStack>
        
        {/* Section d'aide */}
        {!isAllLessonsCompleted && (
          <Box mt={12} p={4} bg="blue.50" borderRadius="md" borderLeft="4px solid" borderColor="blue.400">
            <Text fontSize="sm" color="blue.800" mb={2} fontWeight="medium">
              <Icon as={FaBook} mr={2} /> Conseils pour réussir :
            </Text>
            <Text fontSize="sm" color="blue.700">
              Prenez le temps de bien comprendre chaque leçon avant de passer à la suivante. 
              {!isLessonCompleted && "N'oubliez pas de marquer la leçon comme terminée une fois que vous avez terminé de la lire."}
            </Text>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Lesson;

