import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Spinner from './Spinner'

function PrivateRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return <Spinner />
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoute