// front/src/routes/ProtectedFiles.jsx
import { Navigate } from "react-router-dom"

// 🎯 MAPA DE ROLES CENTRALIZADO
export const ROLES = {
  ADMIN: 1,
  SISTEMAS: 2,
  USUARIO: 3,
  COORDINADOR: 4,
  SUPERVISOR: 5,
  GERENCIA: 6,
}

export default function ProtectedFiles({ children, allow = [] }) {

  const idTipoUsuario = Number(localStorage.getItem("id_tipo_usuario"))

  // 🚫 sin sesión
  if (!idTipoUsuario) {
    return <Navigate to="/login" replace />
  }

  // 🔐 validación por roles
  const isAllowed = allow.includes(idTipoUsuario)

  if (!isAllowed) {
    return null // 👈 oculta completamente el componente
  }

  return children
}