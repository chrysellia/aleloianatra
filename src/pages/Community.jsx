import React from 'react'
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Avatar,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Badge,
  Divider,
  useColorModeValue
} from '@chakra-ui/react'
import { FiSearch, FiMessageSquare, FiThumbsUp, FiShare2, FiMoreHorizontal } from 'react-icons/fi'

const Community = () => {
  // Données de démonstration
  const onlineUsers = [
    { id: 1, name: 'Alice Dupont', role: 'Étudiante', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { id: 2, name: 'Jean Martin', role: 'Développeur', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: 3, name: 'Sophie Leroy', role: 'Designer', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
    { id: 4, name: 'Thomas Bernard', role: 'Étudiant', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' }
  ]

  const groups = [
    { id: 1, name: 'Débutants en programmation', members: 125, isNew: true },
    { id: 2, name: 'Experts en IA', members: 89, isNew: false },
    { id: 3, name: 'Design UX/UI', members: 64, isNew: false },
    { id: 4, name: 'Projets collaboratifs', members: 42, isNew: true }
  ]

  const posts = [
    {
      id: 1,
      user: { name: 'Marie Laurent', role: 'Mentor', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
      content: "Bonjour à tous ! Je partage avec vous cette ressource incroyable sur les dernières avancées en machine learning. Qu'en pensez-vous ? #ML #IA",
      time: "Il y a 2 heures",
      likes: 24,
      comments: 8,
      shares: 3
    },
    {
      id: 2,
      user: { name: 'Pierre Dubois', role: 'Étudiant', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
      content: "Quelqu'un aurait un conseil pour un projet de fin d'études en développement web ? Je cherche des idées innovantes !",
      time: "Il y a 5 heures",
      likes: 12,
      comments: 15,
      shares: 2
    }
  ]

  const cardBg = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  return (
    <Container maxW="7xl" py={8}>
      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
        {/* Colonne de gauche - Utilisateurs en ligne */}
        <Box>
          <VStack spacing={4} align="stretch">
            <Heading size="md">En ligne maintenant</Heading>
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  {onlineUsers.map(user => (
                    <HStack key={user.id} spacing={3}>
                      <Avatar name={user.name} src={user.avatar} />
                      <Box>
                        <Text fontWeight="medium">{user.name}</Text>
                        <Text fontSize="sm" color="gray.500">{user.role}</Text>
                      </Box>
                    </HStack>
                  ))}
                </VStack>
              </CardBody>
            </Card>

            <Heading size="md" mt={6}>Groupes recommandés</Heading>
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  {groups.map(group => (
                    <HStack key={group.id} justify="space-between">
                      <Text>{group.name}</Text>
                      <HStack>
                        <Text fontSize="sm" color="gray.500">{group.members} membres</Text>
                        {group.isNew && <Badge colorScheme="green">Nouveau</Badge>}
                      </HStack>
                    </HStack>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </Box>

        {/* Colonne du milieu - Fil d'actualité */}
        <Box>
          <VStack spacing={4} align="stretch">
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <HStack>
                  <Avatar name="Votre nom" />
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiMessageSquare} color="gray.400" />
                    </InputLeftElement>
                    <Input placeholder="Partagez quelque chose avec la communauté..." />
                  </InputGroup>
                </HStack>
                <HStack justify="flex-end" mt={4}>
                  <Button size="sm" colorScheme="blue">Publier</Button>
                </HStack>
              </CardBody>
            </Card>

            {posts.map(post => (
              <Card key={post.id} bg={cardBg} borderWidth="1px" borderColor={borderColor}>
                <CardHeader pb={2}>
                  <HStack>
                    <Avatar name={post.user.name} src={post.user.avatar} />
                    <Box>
                      <Text fontWeight="medium">{post.user.name}</Text>
                      <Text fontSize="sm" color="gray.500">{post.user.role} • {post.time}</Text>
                    </Box>
                  </HStack>
                </CardHeader>
                <CardBody py={2}>
                  <Text>{post.content}</Text>
                </CardBody>
                <Divider />
                <CardFooter>
                  <HStack spacing={4} color="gray.500">
                    <Button variant="ghost" leftIcon={<Icon as={FiThumbsUp} />} size="sm">
                      {post.likes} J'aime
                    </Button>
                    <Button variant="ghost" leftIcon={<Icon as={FiMessageSquare} />} size="sm">
                      {post.comments} Commentaires
                    </Button>
                    <Button variant="ghost" leftIcon={<Icon as={FiShare2} />} size="sm">
                      Partager
                    </Button>
                  </HStack>
                </CardFooter>
              </Card>
            ))}
          </VStack>
        </Box>

        {/* Colonne de droite - Événements et annonces */}
        <Box>
          <VStack spacing={4} align="stretch">
            <Heading size="md">Événements à venir</Heading>
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text fontWeight="medium">Atelier React.js avancé</Text>
                    <Text fontSize="sm" color="gray.500">Demain, 14h00 - 16h00</Text>
                    <Text fontSize="sm">En ligne</Text>
                  </Box>
                  <Button size="sm" colorScheme="blue">S'inscrire</Button>
                </VStack>
              </CardBody>
            </Card>

            <Heading size="md" mt={6}>Annonces</Heading>
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <Text fontSize="sm">Nouvelle fonctionnalité : Messagerie instantanée disponible !</Text>
                <Text fontSize="xs" color="gray.500" mt={2}>Il y a 2 jours</Text>
              </CardBody>
            </Card>
          </VStack>
        </Box>
      </SimpleGrid>
    </Container>
  )
}

export default Community