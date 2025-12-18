import React from 'react'
import { Box, Container, Heading, Text, SimpleGrid, Button, VStack, HStack, useColorModeValue } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FaGraduationCap, FaSearch, FaChartLine, FaUsers } from 'react-icons/fa'
import Logo from '../components/Logo'

const features = [
  {
    title: 'Modules d\'apprentissage',
    description: 'Découvrez nos parcours pédagogiques adaptés au contexte malgache et africain.',
    icon: FaGraduationCap,
    link: '/modules'
  },
  {
    title: 'Quiz interactifs',
    description: 'Testez vos connaissances avec nos quiz intelligents et adaptatifs.',
    icon: FaSearch,
    link: '/quiz'
  },
  {
    title: 'Suivi de progression',
    description: 'Visualisez vos progrès et obtenez des recommandations personnalisées.',
    icon: FaChartLine,
    link: '/dashboard'
  },
  {
    title: 'Communauté',
    description: 'Échangez et apprenez avec d\'autres apprenants passionnés.',
    icon: FaUsers,
    link: '/community'
  }
]

export default function Home() {
  const bgGradient = useColorModeValue(
    'linear(to-r, primary.400, primary.600)',
    'linear(to-r, primary.500, primary.700)'
  )

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        bgGradient="linear(135deg, #03045E 0%, #0A0A2E 100%)" 
        color="white" 
        py={20}
      >
        <Container maxW="container.xl">
          <VStack spacing={8} textAlign="center">
            {/* Logo en grand */}
            <HStack spacing={4} justify="center">
              <Box
                w="80px"
                h="80px"
                bg="white"
                borderRadius="2xl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="lg"
              >
                <Text color="#03045E" fontSize="48px" fontWeight="bold">A</Text>
              </Box>
              <VStack spacing={0} align="start">
                <Heading 
                  as="h1" 
                  fontSize={{ base: '3xl', md: '5xl' }} 
                  fontWeight="bold"
                  color="white"
                >
                  ALELO'IA
                </Heading>
                <Text 
                  fontSize={{ base: 'lg', md: '2xl' }} 
                  fontWeight="bold" 
                  color="#03EF62"
                  letterSpacing="8px"
                >
                  NATRA
                </Text>
              </VStack>
            </HStack>

            <Heading as="h2" size="lg" fontWeight="normal" opacity={0.9}>
              Renforcez votre esprit critique
            </Heading>
            <Text fontSize="xl" maxW="2xl" opacity={0.8}>
              Une plateforme éducative interactive pour développer votre esprit critique 
              et votre analyse des médias dans le contexte malgache et africain.
            </Text>
            <HStack spacing={4} mt={4}>
              <Button 
                as={RouterLink} 
                to="/register" 
                bg="#03EF62" 
                color="#03045E"
                size="lg" 
                fontWeight="bold"
                _hover={{ bg: '#00D97E', transform: 'translateY(-2px)' }}
                boxShadow="lg"
              >
                Commencer gratuitement
              </Button>
              <Button 
                as={RouterLink} 
                to="/modules" 
                variant="outline" 
                borderColor="white"
                color="white"
                size="lg"
                _hover={{ bg: 'whiteAlpha.200' }}
              >
                Explorer les cours
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="7xl" py={16}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
          {features.map((feature, index) => (
            <Box
              key={index}
              p={6}
              bg={useColorModeValue('white', 'gray.800')}
              rounded="lg"
              shadow="md"
              textAlign="center"
              _hover={{ transform: 'translateY(-5px)', transition: 'all 0.2s' }}
            >
              <Box
                as={feature.icon}
                size="3rem"
                color="primary.500"
                mb={4}
                mx="auto"
              />
              <Heading as="h3" size="lg" mb={3}>
                {feature.title}
              </Heading>
              <Text color={useColorModeValue('gray.600', 'gray.300')} mb={4}>
                {feature.description}
              </Text>
              <Button as={RouterLink} to={feature.link} colorScheme="primary" variant="link">
                En savoir plus →
              </Button>
            </Box>
          ))}
        </SimpleGrid>
      </Container>

      {/* Call to Action */}
      <Box bg={useColorModeValue('gray.50', 'gray.900')} py={16}>
        <Container maxW="4xl" textAlign="center">
          <Heading as="h2" size="xl" mb={6}>
            Prêt à développer votre esprit critique ?
          </Heading>
          <Text fontSize="lg" mb={8}>
            Rejoignez notre communauté d'apprenants et accédez à des ressources éducatives de qualité,
            spécialement conçues pour le contexte malgache et africain.
          </Text>
          <Button as={RouterLink} to="/register" colorScheme="primary" size="lg">
            S'inscrire maintenant
          </Button>
        </Container>
      </Box>
    </Box>
  )
}
