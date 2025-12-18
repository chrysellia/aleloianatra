import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, VStack, Heading, Text, Button, HStack, Icon,
  useColorModeValue, Spinner, Center, Badge, Flex,
  keyframes, ScaleFade, SlideFade
} from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FaDownload, FaHome, FaTrophy, FaCheckCircle, FaStar, FaRocket } from 'react-icons/fa'
import confetti from 'canvas-confetti'
import jsPDF from 'jspdf'
import Certificate from '../components/Certificate'
import { useAuth } from '../context/AuthContext'

const MotionBox = motion(Box)

// Animations keyframes
const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(3, 239, 98, 0.4); }
  50% { box-shadow: 0 0 40px rgba(3, 239, 98, 0.8); }
`

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`

const shine = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`

export default function CourseComplete() {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const certificateRef = useRef(null)
  
  const [module, setModule] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCertificate, setShowCertificate] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [xpEarned] = useState(100) // XP gagné pour compléter le cours

  const bgColor = useColorModeValue('gray.50', '#03045E')
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.800', 'white')
  const greenColor = '#03EF62'
  const darkBlue = '#03045E'

  // Animation de confetti spectaculaire
  const fireConfetti = () => {
    const duration = 4000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // Confetti des deux côtés
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#03EF62', '#FFD700', '#03045E', '#FF6B6B', '#4ECDC4']
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#03EF62', '#FFD700', '#03045E', '#FF6B6B', '#4ECDC4']
      })
    }, 250)

    // Canon central
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#03EF62', '#FFD700']
      })
    }, 500)
  }

  // Charger les infos du module
  useEffect(() => {
    const fetchModule = async () => {
      try {
        // Essayer l'API backend
        const res = await fetch(`http://localhost:5000/api/modules/${moduleId}`)
        const data = await res.json()
        if (data.success) {
          setModule(data.data)
        }
      } catch (error) {
        // Fallback: utiliser les données locales
        console.log('Utilisation des données locales')
        const localModules = await import('../content/modules.json')
        const foundModule = localModules.default?.find(m => m.id === moduleId)
        if (foundModule) {
          setModule(foundModule)
        } else {
          // Module par défaut pour la démo
          setModule({
            id: moduleId,
            title: 'Vérification des informations',
            description: 'Cours sur la littératie médiatique',
            level: 'BEGINNER'
          })
        }
      } finally {
        setLoading(false)
      }
    }
    fetchModule()
  }, [moduleId])

  // Lancer l'animation au chargement
  useEffect(() => {
    if (!loading && module) {
      fireConfetti()
      // Afficher le certificat après l'animation
      setTimeout(() => setShowCertificate(true), 2000)
    }
  }, [loading, module])

  // Télécharger le certificat en PDF (génération directe)
  const downloadCertificate = async () => {
    setDownloading(true)
    try {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })
      
      const pageWidth = pdf.internal.pageSize.getWidth() // 297mm
      const pageHeight = pdf.internal.pageSize.getHeight() // 210mm
      const centerX = pageWidth / 2
      
      // Background
      pdf.setFillColor(248, 249, 250)
      pdf.rect(0, 0, pageWidth, pageHeight, 'F')
      
      // Border corners - Top Left
      pdf.setDrawColor(3, 4, 94) // #03045E
      pdf.setLineWidth(1.5)
      pdf.line(15, 15, 15, 35)
      pdf.line(15, 15, 35, 15)
      
      // Top Right
      pdf.line(pageWidth - 15, 15, pageWidth - 15, 35)
      pdf.line(pageWidth - 15, 15, pageWidth - 35, 15)
      
      // Bottom Left
      pdf.line(15, pageHeight - 15, 15, pageHeight - 35)
      pdf.line(15, pageHeight - 15, 35, pageHeight - 15)
      
      // Bottom Right
      pdf.line(pageWidth - 15, pageHeight - 15, pageWidth - 15, pageHeight - 35)
      pdf.line(pageWidth - 15, pageHeight - 15, pageWidth - 35, pageHeight - 15)
      
      // Green inner border
      pdf.setDrawColor(3, 239, 98) // #03EF62
      pdf.setLineWidth(0.8)
      pdf.roundedRect(25, 25, pageWidth - 50, pageHeight - 50, 3, 3, 'S')
      
      // Logo box
      pdf.setFillColor(3, 4, 94)
      pdf.roundedRect(centerX - 35, 35, 18, 18, 3, 3, 'F')
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text('A', centerX - 26, 47, { align: 'center' })
      
      // Brand name
      pdf.setTextColor(3, 4, 94)
      pdf.setFontSize(20)
      pdf.text("ALELO'IA", centerX + 5, 45, { align: 'left' })
      pdf.setTextColor(3, 239, 98)
      pdf.setFontSize(8)
      pdf.text('NATRA', centerX + 5, 51, { align: 'left' })
      
      // Certificate type
      pdf.setTextColor(100, 100, 100)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.text('CERTIFICAT DE RÉUSSITE', centerX, 65, { align: 'center' })
      
      // Main title
      pdf.setTextColor(3, 4, 94)
      pdf.setFontSize(36)
      pdf.setFont('times', 'italic')
      pdf.text('Certificate of Completion', centerX, 85, { align: 'center' })
      
      // Green line
      pdf.setDrawColor(3, 239, 98)
      pdf.setLineWidth(1)
      pdf.line(centerX - 30, 92, centerX + 30, 92)
      
      // Awarded to text
      pdf.setTextColor(85, 85, 85)
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.text('Ce certificat est décerné à', centerX, 105, { align: 'center' })
      
      // User name
      pdf.setTextColor(3, 4, 94)
      pdf.setFontSize(28)
      pdf.setFont('times', 'bold')
      const displayName = user?.name || 'Apprenant'
      pdf.text(displayName, centerX, 122, { align: 'center' })
      
      // Underline for name
      const nameWidth = pdf.getTextWidth(displayName)
      pdf.setDrawColor(3, 239, 98)
      pdf.setLineWidth(0.8)
      pdf.line(centerX - nameWidth/2 - 5, 126, centerX + nameWidth/2 + 5, 126)
      
      // For completing text
      pdf.setTextColor(85, 85, 85)
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      pdf.text('pour avoir complété avec succès le cours', centerX, 140, { align: 'center' })
      
      // Course title box
      const courseTitle = module?.title || 'Cours'
      pdf.setFillColor(230, 255, 240)
      pdf.setDrawColor(3, 239, 98)
      pdf.setLineWidth(0.5)
      const titleWidth = pdf.getTextWidth(`« ${courseTitle} »`) + 20
      pdf.roundedRect(centerX - titleWidth/2, 147, titleWidth, 14, 2, 2, 'FD')
      
      pdf.setTextColor(3, 4, 94)
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`« ${courseTitle} »`, centerX, 157, { align: 'center' })
      
      // Date
      const formattedDate = new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
      pdf.setTextColor(120, 120, 120)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Délivré le ${formattedDate}`, centerX, 172, { align: 'center' })
      
      // Signatures
      pdf.setDrawColor(3, 4, 94)
      pdf.setLineWidth(0.5)
      
      // Left signature line
      pdf.line(50, 188, 100, 188)
      pdf.setTextColor(85, 85, 85)
      pdf.setFontSize(9)
      pdf.text('Directeur Pédagogique', 75, 193, { align: 'center' })
      
      // Right signature line
      pdf.line(pageWidth - 100, 188, pageWidth - 50, 188)
      pdf.text('Responsable Formation', pageWidth - 75, 193, { align: 'center' })
      
      // Center seal
      pdf.setDrawColor(3, 4, 94)
      pdf.setLineWidth(1)
      pdf.circle(centerX, 185, 12, 'S')
      pdf.setFillColor(3, 4, 94)
      pdf.circle(centerX, 185, 9, 'F')
      pdf.setTextColor(3, 239, 98)
      pdf.setFontSize(10)
      pdf.text('✓', centerX, 183, { align: 'center' })
      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(6)
      pdf.text('CERTIFIÉ', centerX, 188, { align: 'center' })
      
      // Certificate ID
      const certId = `CERT-${moduleId?.toUpperCase() || 'COURSE'}-${Date.now().toString(36).toUpperCase()}`
      pdf.setTextColor(180, 180, 180)
      pdf.setFontSize(7)
      pdf.text(`ID: ${certId}`, centerX, 200, { align: 'center' })
      
      // Save
      pdf.save(`Certificat_${module?.title?.replace(/\s+/g, '_') || 'Cours'}.pdf`)
    } catch (error) {
      console.error('Erreur téléchargement:', error)
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <Center minH="100vh" bg={bgColor}>
        <VStack spacing={4}>
          <Spinner size="xl" color={greenColor} thickness="4px" />
          <Text color={textColor}>Chargement...</Text>
        </VStack>
      </Center>
    )
  }

  return (
    <Box minH="100vh" bg={bgColor} py={10} px={4}>
      {/* Celebration Header */}
      <VStack spacing={6} mb={10}>
        <MotionBox
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <Box
            w="120px"
            h="120px"
            borderRadius="full"
            bg={greenColor}
            display="flex"
            alignItems="center"
            justifyContent="center"
            animation={`${pulseGlow} 2s ease-in-out infinite`}
          >
            <Icon as={FaTrophy} boxSize={16} color={darkBlue} />
          </Box>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <VStack spacing={2}>
            <Badge
              colorScheme="green"
              fontSize="md"
              px={4}
              py={1}
              borderRadius="full"
              animation={`${float} 3s ease-in-out infinite`}
            >
              🎉 FÉLICITATIONS ! 🎉
            </Badge>
            
            <Heading
              size="2xl"
              color={textColor}
              textAlign="center"
              bgGradient={`linear(to-r, ${greenColor}, #FFD700, ${greenColor})`}
              bgClip="text"
              bgSize="200% auto"
              animation={`${shine} 3s linear infinite`}
            >
              Cours Terminé !
            </Heading>
            
            <Text fontSize="xl" color="gray.500" textAlign="center">
              Tu as complété avec succès
            </Text>
            
            <Heading size="lg" color={greenColor} textAlign="center">
              « {module?.title} »
            </Heading>
          </VStack>
        </MotionBox>

        {/* Stats Cards */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <HStack spacing={6} wrap="wrap" justify="center">
            <Box
              bg={cardBg}
              p={6}
              borderRadius="xl"
              boxShadow="lg"
              textAlign="center"
              minW="150px"
            >
              <Icon as={FaStar} boxSize={8} color="#FFD700" mb={2} />
              <Text fontSize="3xl" fontWeight="bold" color={greenColor}>
                +{xpEarned}
              </Text>
              <Text color="gray.500">XP Gagnés</Text>
            </Box>
            
            <Box
              bg={cardBg}
              p={6}
              borderRadius="xl"
              boxShadow="lg"
              textAlign="center"
              minW="150px"
            >
              <Icon as={FaCheckCircle} boxSize={8} color={greenColor} mb={2} />
              <Text fontSize="3xl" fontWeight="bold" color={darkBlue}>
                100%
              </Text>
              <Text color="gray.500">Complété</Text>
            </Box>
            
            <Box
              bg={cardBg}
              p={6}
              borderRadius="xl"
              boxShadow="lg"
              textAlign="center"
              minW="150px"
            >
              <Icon as={FaRocket} boxSize={8} color="#FF6B6B" mb={2} />
              <Text fontSize="3xl" fontWeight="bold" color={darkBlue}>
                +1
              </Text>
              <Text color="gray.500">Badge Débloqué</Text>
            </Box>
          </HStack>
        </MotionBox>
      </VStack>

      {/* Certificate Section */}
      <ScaleFade in={showCertificate} initialScale={0.9}>
        <VStack spacing={6}>
          <Heading size="lg" color={textColor}>
            🎓 Ton Certificat
          </Heading>
          
          {/* Certificate Preview */}
          <Box
            bg={cardBg}
            p={6}
            borderRadius="xl"
            boxShadow="2xl"
            maxW="100%"
            overflowX="auto"
            overflowY="hidden"
          >
            <Box
              width={{ base: '450px', md: '674px', lg: '898px' }}
              height={{ base: '318px', md: '476px', lg: '635px' }}
              overflow="hidden"
              mx="auto"
              position="relative"
            >
              <Box
                position="absolute"
                top="0"
                left="0"
                transform={{ base: 'scale(0.4)', md: 'scale(0.6)', lg: 'scale(0.8)' }}
                transformOrigin="top left"
              >
                <Certificate
                  ref={certificateRef}
                  userName={user?.name || 'Apprenant'}
                  courseTitle={module?.title || 'Cours Alelo\'IA'}
                  completionDate={new Date().toISOString()}
                  certificateId={`CERT-${moduleId?.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`}
                />
              </Box>
            </Box>
          </Box>

          {/* Action Buttons */}
          <HStack spacing={4} wrap="wrap" justify="center">
            <Button
              leftIcon={<FaDownload />}
              bg={greenColor}
              color={darkBlue}
              size="lg"
              onClick={downloadCertificate}
              isLoading={downloading}
              loadingText="Génération..."
              _hover={{ bg: '#00C96E', transform: 'translateY(-2px)' }}
              boxShadow="lg"
            >
              Télécharger le PDF
            </Button>
            
            <Button
              leftIcon={<FaHome />}
              variant="outline"
              borderColor={greenColor}
              color={greenColor}
              size="lg"
              onClick={() => navigate('/dashboard')}
              _hover={{ bg: `${greenColor}20` }}
            >
              Retour au Dashboard
            </Button>
          </HStack>

          {/* Next Steps */}
          <Box
            bg={`${greenColor}10`}
            border="1px solid"
            borderColor={greenColor}
            borderRadius="xl"
            p={6}
            maxW="600px"
            textAlign="center"
          >
            <Heading size="md" color={textColor} mb={3}>
              🚀 Prochaines étapes
            </Heading>
            <Text color="gray.500" mb={4}>
              Continue ton apprentissage pour débloquer plus de certificats !
            </Text>
            <Button
              bg={darkBlue}
              color="white"
              onClick={() => navigate('/modules')}
              _hover={{ bg: '#050580' }}
            >
              Explorer d'autres cours
            </Button>
          </Box>
        </VStack>
      </ScaleFade>
    </Box>
  )
}

