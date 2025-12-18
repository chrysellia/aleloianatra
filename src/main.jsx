import React from 'react'
import { createRoot } from 'react-dom/client'  // Ajoutez cette ligne
import { ChakraProvider } from '@chakra-ui/react'
import App from './App'
import theme from './theme'
import './styles/index.css'  
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

const root = createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <AuthProvider>  
          <App />
        </AuthProvider>  
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
)