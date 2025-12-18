import { Box, Container, Text, Link, Flex, useColorModeValue } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

export const Footer = () => {
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box as="footer" bg={bg} borderTop="1px" borderColor={borderColor} py={6} mt={8}>
      <Container maxW="7xl">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align="center">
          <Text fontSize="sm" mb={{ base: 4, md: 0 }}>
            © {new Date().getFullYear()} Alelo-IA-Anatra. Tous droits réservés.
          </Text>
          <Flex gap={6}>
            <Link as={RouterLink} to="/about" fontSize="sm" _hover={{ textDecoration: 'none', color: 'primary.500' }}>
              À propos
            </Link>
            <Link as={RouterLink} to="/privacy" fontSize="sm" _hover={{ textDecoration: 'none', color: 'primary.500' }}>
              Confidentialité
            </Link>
            <Link as={RouterLink} to="/terms" fontSize="sm" _hover={{ textDecoration: 'none', color: 'primary.500' }}>
              Conditions d'utilisation
            </Link>
            <Link as={RouterLink} to="/contact" fontSize="sm" _hover={{ textDecoration: 'none', color: 'primary.500' }}>
              Contact
            </Link>
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}

export default Footer
