import React from 'react'
import { Flex, IconButton, useColorMode, useColorModeValue, Heading, Button, Box } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Link as RouterLink } from 'react-router-dom'

export const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const bg = useColorModeValue('white', 'gray.800')

  return (
    <Box as="header" bg={bg} px={4} shadow="sm" position="sticky" top={0} zIndex={10}>
      <Flex h={16} alignItems="center" justifyContent="space-between" maxW="7xl" mx="auto">
        <Heading as={RouterLink} to="/" size="md" color="primary.500">
          Alelo-IA-Anatra
        </Heading>
        
        <Flex alignItems="center" gap={4}>
          <IconButton
            onClick={toggleColorMode}
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            variant="ghost"
            aria-label="Toggle theme"
          />
          <Button as={RouterLink} to="/login" colorScheme="primary" variant="outline">
            Se connecter
          </Button>
          <Button as={RouterLink} to="/register" colorScheme="primary">
            S'inscrire
          </Button>
        </Flex>
      </Flex>
    </Box>
  )
}

export default Header
