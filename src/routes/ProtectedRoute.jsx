import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const isAuth = localStorage.getItem('user')
  const location = useLocation() // Opcional: para recordar de dónde venía

  if (!isAuth) {
    // Redirigir a /login, no a /home
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}