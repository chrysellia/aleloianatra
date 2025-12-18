import React from 'react'
import { createRoot } from 'react-dom/client'  // Ajoutez cette ligne
import { ChakraProvider } from '@chakra-ui/react'
import App from './App'
import theme from './theme'
import './styles/index.css'  
<<<<<<< HEAD
import { BrowserRouter, unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'
=======
import { BrowserRouter } from 'react-router-dom'
>>>>>>> 53fa89dd23aad9ac4f4ad818d1ad296ecbca1712
import { AuthProvider } from './context/AuthContext'

const root = createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
<<<<<<< HEAD
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
=======
    <BrowserRouter>
>>>>>>> 53fa89dd23aad9ac4f4ad818d1ad296ecbca1712
      <ChakraProvider theme={theme}>
        <AuthProvider>  
          <App />
        </AuthProvider>  
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
)