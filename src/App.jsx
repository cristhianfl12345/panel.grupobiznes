import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"

import HeaderLayout from "./components/Header"
import Login from "./routes/Login"
import Home from "./pages/Home"
import PublicRoute from "./routes/PublicRoute"
import ProtectedRoute from "./routes/ProtectedRoute"
import ControlMarcadores from "./pages/ControlMarcadores"
import VisoresKPI from "./pages/VisoresKPI"
import CrearVista from "./pages/CrearVista"
import CrearUser from "./pages/CrearUser"
import Control_Modulos from "./pages/Control_Modulos"
import ProtectedFiles, { ROLES } from "./routes/ProtectedFiles"

import Loader from './pages/Loader'
import Monitor from './routes/Monitor'
import ModuloBases from "./pages/Modulo_bases"
const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
    filter: "blur(6px)"
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: "blur(6px)",
    transition: {
      duration: 0.25,
      ease: "easeIn"
    }
  }
}

function AppRoutes() {

  const location = useLocation()
  const [loadingRoute, setLoadingRoute] = useState(false)

  useEffect(() => {

    setLoadingRoute(true)

    const timer = setTimeout(() => {
      setLoadingRoute(false)
    }, 650)

    return () => clearTimeout(timer)

  }, [location.pathname])

  const isAuth = localStorage.getItem("auth")

  return (
    <>
      {/* LOADER GLOBAL */}
      <Loader show={loadingRoute} />

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ height: "100%" }}
        >

          <Routes location={location}>

            {/* LOGIN */}
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

            {/* MONITOR */}
            <Route
              path="/monitor"
              element={
                <ProtectedRoute>
                  <HeaderLayout>
                    <Monitor />
                  </HeaderLayout>
                </ProtectedRoute>
              }
            />
              {/* MONITOR */}
            <Route
              path="/monitor-bases"
              element={
                <ProtectedRoute>
                  <HeaderLayout>
                    <ModuloBases />
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
                    <ProtectedFiles allow={[ROLES.ADMIN, ROLES.SISTEMAS, ROLES.GERENCIA]}>
                      <CrearVista />
                    </ProtectedFiles>
                  </HeaderLayout>
                </ProtectedRoute>
              }
            />

            {/* CREAR USER */}
            <Route
              path="/createuser"
              element={
                <ProtectedRoute>
                  <HeaderLayout>
                    <ProtectedFiles allow={[ROLES.ADMIN, ROLES.SISTEMAS, ROLES.GERENCIA]}>
                      <CrearUser />
                    </ProtectedFiles>
                  </HeaderLayout>
                </ProtectedRoute>
              }
            />
            {/* CONTROL DE MODULOS */}
            <Route
              path="/control-modulos"
              element={
                <ProtectedRoute>
                  <HeaderLayout>
                    <ProtectedFiles allow={[ROLES.ADMIN, ROLES.SISTEMAS, ROLES.GERENCIA]}>
                      <Control_Modulos />
                    </ProtectedFiles>
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

        </motion.div>
      </AnimatePresence>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App