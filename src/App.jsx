import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import HeaderLayout from "./components/Header"
import Login from "./routes/Login"
import Home from "./pages/Home"
import PublicRoute from "./routes/PublicRoute"
import ProtectedRoute from "./routes/ProtectedRoute"
import ControlMarcadores from "./pages/ControlMarcadores"
import VisoresKPI from "./pages/VisoresKPI"
import CrearVista from "./pages/CrearVista"
import CrearUser from "./pages/CrearUser"

function App() {

  const isAuth = localStorage.getItem("auth")

  return (
    <BrowserRouter>

      <Routes>

        {/* LOGIN (PUBLIC) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* HOME */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HeaderLayout>
                <Home />
              </HeaderLayout>
            </ProtectedRoute>
          }
        />

        {/* CONTROL MARCADORES */}
        <Route
          path="/control-marcadores"
          element={
            <ProtectedRoute>
              <HeaderLayout>
                <ControlMarcadores />
              </HeaderLayout>
            </ProtectedRoute>
          }
        />

        {/* VISOR KPI */}
        <Route
          path="/visor/:level/:idcamp/:vista"
          element={
            <ProtectedRoute>
              <HeaderLayout>
                <VisoresKPI />
              </HeaderLayout>
            </ProtectedRoute>
          }
        />

        {/* CREAR VISTA */}
        <Route
          path="/createview"
          element={
            <ProtectedRoute>
              <HeaderLayout>
                <CrearVista />
              </HeaderLayout>
            </ProtectedRoute>
          }
        />

        {/* CREAR USUARIO */}
        <Route
          path="/createuser"
          element={
            <ProtectedRoute>
              <HeaderLayout>
                <CrearUser />
              </HeaderLayout>
            </ProtectedRoute>
          }
        />

        {/* REDIRECCIÓN GLOBAL */}
        <Route
          path="*"
          element={
            <Navigate
              to={isAuth ? "/home" : "/login"}
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App