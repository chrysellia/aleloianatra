import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Box, Container } from '@chakra-ui/react'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard'
import Modules from './pages/modules'
import ModuleDetail from './pages/modules/[moduleId]'
import Quiz from './pages/Quiz'
import Analyzer from './pages/Analyzer'
import Adaptive from './pages/Adaptive'
import { AuthProvider } from './context/AuthContext'
import Community from './pages/Community'
import CourseComplete from './pages/CourseComplete'
import Lesson from './pages/Lesson'
import ProtectedRoute from './components/ProtectedRoute'

function Layout({ children }) {
  const location = useLocation()
  const isDashboard = location.pathname === '/dashboard'
  const isModules = location.pathname === '/modules' || location.pathname.startsWith('/modules/')
  const isCourseComplete = location.pathname.startsWith('/course-complete')

  if (isDashboard || isModules || isCourseComplete) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <Box as="main" flex="1" py={8}>
        <Container maxW="7xl" px={4}>
          {children}
        </Container>
      </Box>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Box minH="100vh" display="flex" flexDirection="column">
        <Layout>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Routes protégées */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/modules" element={
              <ProtectedRoute>
                <Modules />
              </ProtectedRoute>
            } />
            <Route path="/modules/:moduleId" element={
              <ProtectedRoute>
                <ModuleDetail />
              </ProtectedRoute>
            } />
            <Route path="/modules/:moduleId/lessons/:lessonId" element={
              <ProtectedRoute>
                <Lesson />
              </ProtectedRoute>
            } />
            <Route path="/modules/:moduleId/quiz" element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            } />
            <Route path="/quiz" element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            } />
            <Route path="/analyze" element={
              <ProtectedRoute>
                <Analyzer />
              </ProtectedRoute>
            } />
            <Route path="/adaptive" element={
              <ProtectedRoute>
                <Adaptive />
              </ProtectedRoute>
            } />
            <Route path="/community" element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            } />
            <Route path="/course-complete/:moduleId" element={
              <ProtectedRoute>
                <CourseComplete />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
      </Box>
    </AuthProvider>
  )
}
