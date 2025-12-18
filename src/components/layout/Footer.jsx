import { Box, Container, Text, Link, Flex, VStack, HStack, useColorModeValue } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import Logo from '../Logo'

export const Footer = () => {
  const bg = useColorModeValue('gray.50', 'gray.900')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box as="footer" bg={bg} borderTop="1px" borderColor={borderColor} py={10} mt={8}>
      <Container maxW="7xl">
        <Flex 
          direction={{ base: 'column', md: 'row' }} 
          justify="space-between" 
          align={{ base: 'center', md: 'flex-start' }}
          gap={8}
        >
          {/* Logo & Description */}
          <VStack align={{ base: 'center', md: 'flex-start' }} spacing={4} maxW="300px">
            <Logo size="md" linkToHome={true} />
            <Text fontSize="sm" color="gray.500" textAlign={{ base: 'center', md: 'left' }}>
              Plateforme d'éducation à la littératie médiatique pour Madagascar et l'Afrique.
            </Text>
          </VStack>

          {/* Links */}
          <HStack spacing={8} wrap="wrap" justify="center">
            <VStack align="flex-start" spacing={2}>
              <Text fontWeight="bold" fontSize="sm" color="gray.700">Apprendre</Text>
              <Link as={RouterLink} to="/modules" fontSize="sm" color="gray.500" _hover={{ color: '#03EF62' }}>
                Modules
              </Link>
              <Link as={RouterLink} to="/quiz" fontSize="sm" color="gray.500" _hover={{ color: '#03EF62' }}>
                Quiz
              </Link>
              <Link as={RouterLink} to="/dashboard" fontSize="sm" color="gray.500" _hover={{ color: '#03EF62' }}>
                Mon parcours
              </Link>
            </VStack>

            <VStack align="flex-start" spacing={2}>
              <Text fontWeight="bold" fontSize="sm" color="gray.700">Légal</Text>
              <Link as={RouterLink} to="/privacy" fontSize="sm" color="gray.500" _hover={{ color: '#03EF62' }}>
                Confidentialité
              </Link>
              <Link as={RouterLink} to="/terms" fontSize="sm" color="gray.500" _hover={{ color: '#03EF62' }}>
                Conditions
              </Link>
              <Link as={RouterLink} to="/contact" fontSize="sm" color="gray.500" _hover={{ color: '#03EF62' }}>
                Contact
              </Link>
            </VStack>
          </HStack>
        </Flex>

        {/* Copyright */}
        <Box mt={8} pt={6} borderTop="1px" borderColor={borderColor} textAlign="center">
          <Text fontSize="sm" color="gray.500">
            © {new Date().getFullYear()} ALELO'IA NATRA. Tous droits réservés.
          </Text>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
