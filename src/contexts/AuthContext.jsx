import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'

const API_URL = 'http://localhost:5262/api/User';
const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) 

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/me`, { withCredentials: true })
      console.log("Fetch successful", response.data)
      setUser(response.data)
    } catch (error) {
      console.error("Fetch failed", error.response?.data || error.message)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await axios.post(
        `${API_URL}/login`,
        { email, password },
        { withCredentials: true }
      )
      console.log("Login successful", response.data)
      await fetchProfile()
      toast.success('Login successful!')
      return true
    } catch (error) {
      console.error("Login failed", error.response?.data || error.message)
      toast.error(error.response?.data?.message || 'Login failed')
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (email, password, name) => {
    try {
      setLoading(true)
      const response = await axios.post(
        `${API_URL}/register`,
        { email, password, name },
        { withCredentials: true }
      )
      console.log("Registration successful", response.data)
      await fetchProfile()
      toast.success('Registration successful!')
      return true
    } catch (error) {
      console.error("Registration failed", error.response?.data || error.message)
      toast.error(error.response?.data?.message || 'Registration failed')
      return false
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = async (idToken) => {
    try {
      setLoading(true)
      const response = await axios.post(
        `${API_URL}/loginwithGoogle`,
        { idToken },
        { withCredentials: true }
      )
      toast.success('Login with Google successful!')
      await fetchProfile()
    } catch (error) {
      console.error("Google login failed", error)
      toast.error('Google login failed')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    toast.success('Logged out successfully!')
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    fetchProfile,
    loginWithGoogle
  }

  // ✅ hiển thị spinner nếu đang loading (lần đầu load trang)
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider