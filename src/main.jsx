import React from 'react'
import { createRoot } from 'react-dom/client'  // Ajoutez cette ligne
import { ChakraProvider } from '@chakra-ui/react'
import App from './App'
import theme from './theme'
import './styles/index.css'  
import { BrowserRouter, unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

const root = createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <ChakraProvider theme={theme}>
        <AuthProvider>  
          <App />
        </AuthProvider>  
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
)