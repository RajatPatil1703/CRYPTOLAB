import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { CatalogProvider } from './context/CatalogContext.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <CatalogProvider>
          <App />
        </CatalogProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
