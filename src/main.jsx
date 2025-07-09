import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './App.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId="437704361838-lhmigku3t9k6moslubrokol875af8ruq.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </BrowserRouter>
)
