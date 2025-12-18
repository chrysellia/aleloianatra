import React from 'react'
import { HStack, Box, Text, VStack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

/**
 * Logo officiel Alelo'IA NATRA
 * @param {object} props
 * @param {string} props.size - 'sm' | 'md' | 'lg' | 'xl'
 * @param {boolean} props.showText - Afficher le texte ou juste l'icône
 * @param {boolean} props.linkToHome - Rendre le logo cliquable vers l'accueil
 */
export const Logo = ({ size = 'md', showText = true, linkToHome = true }) => {
  const sizes = {
    sm: { box: '32px', fontSize: '16px', brand: '16px', sub: '8px', gap: '8px' },
    md: { box: '40px', fontSize: '20px', brand: '20px', sub: '10px', gap: '10px' },
    lg: { box: '50px', fontSize: '26px', brand: '26px', sub: '12px', gap: '12px' },
    xl: { box: '60px', fontSize: '32px', brand: '32px', sub: '14px', gap: '14px' }
  }

  const s = sizes[size] || sizes.md

  const LogoContent = () => (
    <HStack spacing={s.gap} align="center">
      {/* Logo Icon */}
      <Box
        w={s.box}
        h={s.box}
        bg="#03045E"
        borderRadius="lg"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
      >
        <Text
          color="white"
          fontSize={s.fontSize}
          fontWeight="bold"
          lineHeight="1"
        >
          A
        </Text>
      </Box>

      {/* Logo Text */}
      {showText && (
        <VStack spacing={0} align="start">
          <Text
            fontSize={s.brand}
            fontWeight="bold"
            color="#03045E"
            lineHeight="1.1"
            letterSpacing="1px"
          >
            ALELO'IA
          </Text>
          <Text
            fontSize={s.sub}
            fontWeight="bold"
            color="#03EF62"
            letterSpacing="3px"
            lineHeight="1"
          >
            NATRA
          </Text>
        </VStack>
      )}
    </HStack>
  )

  if (linkToHome) {
    return (
      <Box
        as={RouterLink}
        to="/"
        _hover={{ opacity: 0.9, transform: 'scale(1.02)' }}
        transition="all 0.2s"
      >
        <LogoContent />
      </Box>
    )
  }

  return <LogoContent />
}

export default Logo

