import React from 'react'
import { Box, Container, Heading, Text, SimpleGrid, Button, VStack, useColorModeValue } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FaGraduationCap, FaSearch, FaChartLine, FaUsers } from 'react-icons/fa'

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
      <Box bg={bgGradient} color="white" py={20}>
        <Container maxW="container.xl">
          <VStack spacing={6} textAlign="center">
            <Heading as="h1" size="2xl" fontWeight="bold">
              Renforcez votre esprit critique avec Alelo-IA-Anatra
            </Heading>
            <Text fontSize="xl" maxW="2xl">
              Une plateforme éducative interactive pour développer votre esprit critique et votre analyse des médias dans le contexte malgache et africain.
            </Text>
            <Button as={RouterLink} to="/register" colorScheme="white" variant="outline" size="lg" mt={4}>
              Commencer maintenant
            </Button>
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
