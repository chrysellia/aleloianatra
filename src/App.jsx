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

function Layout({ children }) {
  const location = useLocation()
  const isDashboard = location.pathname === '/dashboard'

  if (isDashboard) {
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
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/modules" element={<Modules />} />
            <Route path="/modules/:moduleId" element={<ModuleDetail />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/analyze" element={<Analyzer />} />
            <Route path="/adaptive" element={<Adaptive />} />
            <Route path="/community" element={<Community />} />
          </Routes>
        </Layout>
      </Box>
    </AuthProvider>
  )
}
