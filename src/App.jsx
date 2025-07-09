import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AuthProvider from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Chat from './pages/Chat'
import Friends from './pages/Friends'
import Profile from './pages/Profile'
import Layout from './components/Layout'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Chat />} />
              <Route path="/chat/:id" element={<Chat />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/profile" element={<Profile/>}/>
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App