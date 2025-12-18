import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Divider,
  Badge,
  useColorModeValue,
  Progress,
  Icon,
  Link,
  List,
  ListItem,
  ListIcon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
} from '@chakra-ui/react'
import { FaArrowLeft, FaCheckCircle, FaBook, FaVideo, FaLink } from 'react-icons/fa'
import { richDadPoorDadModule } from '../../data/modules/rich-dad-poor-dad'

export default function RichDadPoorDadModule() {
  const navigate = useNavigate()
  const toast = useToast()
  const [currentSection, setCurrentSection] = useState(0)
  const [completedSections, setCompletedSections] = useState([0])
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')
  const sectionBg = useColorModeValue('gray.50', 'gray.900')
  
  const progress = Math.round((completedSections.length / richDadPoorDadModule.content.length) * 100)
  
  const handleNext = () => {
    if (currentSection < richDadPoorDadModule.content.length - 1) {
      setCurrentSection(currentSection + 1)
      
      // Marquer la section comme complétée si ce n'est pas déjà fait
      if (!completedSections.includes(currentSection + 1)) {
        setCompletedSections([...completedSections, currentSection + 1])
      }
    }
  }
  
  const handlePrev = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }
  
  const startQuiz = () => {
    navigate(`/quiz?module=${richDadPoorDadModule.id}`)
  }
  
  const renderContent = () => {
    const section = richDadPoorDadModule.content[currentSection]
    
    switch(section.type) {
      case 'text':
        return (
          <Box p={6} bg={bgColor} borderRadius="md" boxShadow="sm">
            <Heading size="lg" mb={4}>{section.title}</Heading>
            <Text whiteSpace="pre-line">{section.content}</Text>
          </Box>
        )
      case 'quiz':
        return (
          <Box p={6} bg={bgColor} borderRadius="md" boxShadow="sm">
            <Heading size="lg" mb={4}>{section.title}</Heading>
            <Text mb={6}>Testez vos connaissances avec ce quiz de {section.questions.length} questions.</Text>
            <Button colorScheme="green" onClick={startQuiz}>
              Commencer le quiz
            </Button>
          </Box>
        )
      default:
        return null
    }
  }
  
  return (
    <Container maxW="container.lg" py={8}>
      <Button 
        leftIcon={<FaArrowLeft />} 
        variant="ghost" 
        mb={6} 
        onClick={() => navigate('/modules')}
      >
        Retour aux modules
      </Button>
      
      <VStack spacing={6} align="stretch">
        <Box>
          <Badge colorScheme={richDadPoorDadModule.color} fontSize="0.8em" mb={2}>
            {richDadPoorDadModule.category}
          </Badge>
          <Heading size="xl" mb={2}>{richDadPoorDadModule.title}</Heading>
          <Text color={useColorModeValue('gray.600', 'gray.400')} mb={4}>
            {richDadPoorDadModule.description}
          </Text>
          
          <HStack spacing={4} mb={6}>
            <HStack>
              <Icon as={FaBook} color="gray.500" />
              <Text fontSize="sm" color="gray.500">{richDadPoorDadModule.duration}</Text>
            </HStack>
            <Badge colorScheme={richDadPoorDadModule.color} variant="subtle">
              {richDadPoorDadModule.level}
            </Badge>
          </HStack>
          
          <Progress value={progress} size="sm" colorScheme={richDadPoorDadModule.color} mb={6} />
        </Box>
        
        <HStack align="start" spacing={6}>
          <Box flex={2}>
            {renderContent()}
            
            <HStack mt={6} justifyContent="space-between">
              <Button 
                leftIcon={<FaArrowLeft />} 
                isDisabled={currentSection === 0}
                onClick={handlePrev}
              >
                Précédent
              </Button>
              
              {currentSection < richDadPoorDadModule.content.length - 1 ? (
                <Button 
                  colorScheme="blue" 
                  rightIcon={<FaCheckCircle />}
                  onClick={handleNext}
                >
                  Suivant
                </Button>
              ) : (
                <Button 
                  colorScheme="green" 
                  rightIcon={<FaCheckCircle />}
                  onClick={() => toast({
                    title: "Module terminé !",
                    description: "Félicitations, vous avez terminé ce module.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                  })}
                >
                  Terminer le module
                </Button>
              )}
            </HStack>
          </Box>
          
          <Box flex={1}>
            <Box p={4} bg={sectionBg} borderRadius="md" boxShadow="sm" position="sticky" top="20px">
              <Heading size="md" mb={4}>Contenu du module</Heading>
              <List spacing={2}>
                {richDadPoorDadModule.content.map((item, index) => (
                  <ListItem 
                    key={item.id}
                    p={2} 
                    borderRadius="md"
                    bg={currentSection === index ? 'blue.50' : 'transparent'}
                    color={currentSection === index ? 'blue.600' : 'inherit'}
                    _hover={{ bg: hoverBg, cursor: 'pointer' }}
                    onClick={() => setCurrentSection(index)}
                  >
                    <HStack>
                      <Box w={5}>
                        {completedSections.includes(index) ? (
                          <Icon as={FaCheckCircle} color="green.500" />
                        ) : (
                          <Text as="span" fontWeight="bold" color="gray.400">{index + 1}.</Text>
                        )}
                      </Box>
                      <Text>{item.title}</Text>
                    </HStack>
                  </ListItem>
                ))}
              </List>
              
              {richDadPoorDadModule.resources && richDadPoorDadModule.resources.length > 0 && (
                <>
                  <Divider my={4} />
                  <Heading size="sm" mb={2}>Ressources supplémentaires</Heading>
                  <List spacing={2}>
                    {richDadPoorDadModule.resources.map((resource, index) => (
                      <ListItem key={index}>
                        <Link href={resource.url} isExternal color="blue.500">
                          <HStack>
                            <Icon as={resource.type === 'video' ? FaVideo : FaLink} />
                            <Text>{resource.title}</Text>
                          </HStack>
                        </Link>
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
            </Box>
          </Box>
        </HStack>
      </VStack>
    </Container>
  )
}
