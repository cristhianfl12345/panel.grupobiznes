import { BrowserRouter, Routes, Route } from "react-router-dom"

import HeaderLayout from "./components/Header"
import Login from "./routes/Login"
import Home from "./pages/Home"
import ControlMarcadores from "./pages/ControlMarcadores"
import VisoresKPI from "./pages/VisoresKPI"
import CrearVista from "./pages/CrearVista"
import CrearUser from "./pages/CrearUser"
function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route
          path="/home"
          element={
            <HeaderLayout>
              <Home />
            </HeaderLayout>
          }
        />

        <Route
          path="/control-marcadores"
          element={
            <HeaderLayout>
              <ControlMarcadores />
            </HeaderLayout>
          }
        />
        <Route
          path="/visor/:level/:idcamp/:vista"
          element={
            <HeaderLayout>
              <VisoresKPI />
            </HeaderLayout>
          }
        />
         <Route
          path="/createview"
          element={
            <HeaderLayout>
              <CrearVista />
            </HeaderLayout>
          }
        />
                 <Route
          path="/createuser"
          element={
            <HeaderLayout>
              <CrearUser />
            </HeaderLayout>
          }
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App