// Dans App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Container } from '@chakra-ui/react';
import { Header } from './components/layout/Header';  // Chemin corrigé
import { Footer } from './components/layout/Footer';  // Chemin corrigé
import Home from './pages/Home';
import Login from './pages/auth/Login';  // Chemin corrigé
import Register from './pages/auth/Register';  // Chemin corrigé
import Dashboard from './pages/dashboard';  // Chemin corrigé
import Modules from './pages/modules';  // Chemin corrigé
import ModuleDetail from './pages/modules/[moduleId]';  // Chemin corrigé
import Quiz from './pages/Quiz';
import Analyzer from './pages/Analyzer';
import Adaptive from './pages/Adaptive';
import { AuthProvider } from './context/AuthContext';
import Community from './pages/Community';
import Lesson from './pages/Lesson';

export default function App() {
  return (
    <AuthProvider>
      <Box minH="100vh" display="flex" flexDirection="column">
        <Header />
        <Box as="main" flex="1" py={8}>
          <Container maxW="7xl" px={4}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/modules" element={<Modules />} />
              <Route path="/modules/:moduleId" element={<ModuleDetail />} />
              <Route path="/modules/:moduleId/lessons/:lessonId" element={<Lesson />} />
              <Route path="/modules/:moduleId/quiz" element={<Quiz />} />
              <Route path="/analyze" element={<Analyzer />} />
              <Route path="/adaptive" element={<Adaptive />} />
              <Route path="/community" element={<Community />} />
            </Routes>
          </Container>
        </Box>
        <Footer />
      </Box>
    </AuthProvider>
  );
}