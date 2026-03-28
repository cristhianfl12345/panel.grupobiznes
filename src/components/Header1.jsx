import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Login from "../routes/Login";
import {
  Menu,
  Bell,
  ChevronDown,
  Home,
  BarChart3,
  Settings,
  LogOut,
  Grid,
  User,
  ChevronRight,
  Lightbulb,
  LightbulbOff,
  Hash,
  ChartSpline,
  UsersRound,
  MonitorCog,
  Cross
} from "lucide-react";



export default function HeaderLayout({ children }) {

  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenu, setUserMenu] = useState(false);
  
  
  const [user, setUser] = useState(null);
  useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
}, []);
const fullName = user
  ? `${user.nombres} ${user.apellidos}`
  : "";

//campañas por usuario inicio


  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };
const [campanas, setCampanas] = useState([])
const [openMarcadores, setOpenMarcadores] = useState(false)
const [openCampanasClientes, setOpenCampanasClientes] = useState(false)
useEffect(() => {
  const loadCampanas = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      const user = JSON.parse(storedUser);

      const res = await fetch(
        `http://localhost:4000/api/auth/mis-campanas/${user.id}`
      );

      const data = await res.json();

      if (data.ok) {
        setCampanas(data.campanas);
      } else {
        console.error("Error backend:", data.message);
      }

    } catch (error) {
      console.error("Error cargando campañas:", error);
    }
  };

  loadCampanas();
}, []);

return (

    <div
      className={`
      h-screen flex overflow-hidden transition-colors duration-500
      ${isDark ? "bg-[#1F2029] text-white" : "bg-[#F5F5F5] text-slate-800"}
      `}
    >

      {/* SIDEBAR */}

      <aside
        className={`
        transition-all duration-300 flex-shrink-0
        ${sidebarOpen ? "w-64" : "w-0 overflow-hidden"}

        ${isDark
            ? "bg-gradient-to-b from-[#4A0909] to-[#B53838] text-white"
            : "bg-gradient-to-b from-[#C23030] to-red-700 text-white"}
        `}
      >

        <div className="h-full flex flex-col">

          <nav className="flex-1 p-4 text-sm space-y-1 overflow-y-auto">

            <button
             onClick={() => navigate("/home")}
             className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-red-500/70 transition">
              <Home size={18} />
              <span>Inicio</span>
              
            </button>

            <p className="text-xs uppercase opacity-70 mt-4 mb-2 px-3">
              Reportes Clientes
            </p>
{/* Campañas Clientes  inicio*/}
            <button
            onClick={() =>setOpenCampanasClientes(!openCampanasClientes)}
            className="flex items-center justify-between w-full px-3 py-2 rounded hover:bg-red-500/70 transition">
              <div className="flex items-center gap-3">
                <Grid size={18} />
                <span>Campañas</span>
              </div>
              <ChevronRight size={16} 
              className={`transition-transform ${openCampanasClientes ? 'rotate-90' : ''}`}
              />
            </button>
            {openCampanasClientes && (
              <div className="relative ml-5 mt-1 flex flex-col gap-1 border-l-2 border-red-50/30 pl-4">
                {campanas.length > 0 ? (
                  campanas.map((c) => (
                    <button
                      key={c.IdCamp}
                      onClick={() => {
                        navigate(`/reportes-clientes?camp=${c.IdCamp}`);
                        window.location.reload();
                      }}
                      className="text-left px-3 py-1 rounded hover:bg-red-500/40 transition text-sm relative"
                    >
                      <span className="absolute -left-4 top-1/2 w-4 h-[2px] bg-red-200/30"></span>
                      {c.Campana}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No hay campañas disponibles
                  </p>
                )}
              </div>
            )}

{/* Campañas Clientes  fin*/}
            <p className="text-xs uppercase opacity-70 mt-4 mb-2 px-3">
              Dashboard
            </p>

            <button className="flex items-center justify-between w-full px-3 py-2 rounded hover:bg-red-500/70 transition">
              <div className="flex items-center gap-3">
                <BarChart3 size={18} />
                <span>Control Supervisor</span>
              </div>
              <ChevronRight size={16} />
            </button>

            {/* KPI */}

            <p className="text-xs uppercase opacity-70 mt-4 mb-2 px-3">
              KPI
            </p>

            <button className="flex items-center justify-between w-full px-3 py-2 rounded hover:bg-red-500/70 transition">
              <div className="flex items-center gap-3">
                <MonitorCog size={18} />
                <span>Operativos</span>
              </div>
              <ChevronRight size={16} />
            </button>

            <button className="flex items-center justify-between w-full px-3 py-2 rounded hover:bg-red-500/70 transition">
              <div className="flex items-center gap-3">
                <Cross size={18} />
                <span>Calidad</span>
              </div>
              <ChevronRight size={16} />
            </button>

            <button className="flex items-center justify-between w-full px-3 py-2 rounded hover:bg-red-500/70 transition">
              <div className="flex items-center gap-3">
                <ChartSpline size={18} />
                <span>Rentabilidad</span>
              </div>
              <ChevronRight size={16} />
            </button>

            <button className="flex items-center justify-between w-full px-3 py-2 rounded hover:bg-red-500/70 transition">
              <div className="flex items-center gap-3">
                <UsersRound size={18} />
                <span>RRHH</span>
              </div>
              <ChevronRight size={16} />
            </button>

            <p className="text-xs uppercase opacity-70 mt-4 mb-2 px-3">
              Configuración
            </p>

            <button className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-red-500/70 transition">
              <Settings size={18} />
              <span>Control de Campaña</span>
            </button>

<div className="relative">

  <button
    onClick={() => setOpenMarcadores(!openMarcadores)}
    className="flex items-center justify-between w-full px-3 py-2 rounded hover:bg-red-500/70 transition z-10 relative"
  >
    <Hash size={18} className="mr-2" />

    <span className="flex-1 text-left">
      Control de Marcadores
    </span>

    <ChevronRight
      size={16}
      className={`transition-transform ${openMarcadores ? 'rotate-90' : ''}`}
    />

  </button>

  {openMarcadores && (

    <div className="relative ml-5 mt-1 flex flex-col gap-1 border-l-2 border-red-50/30 pl-4">

      {campanas.length > 0 ? (

        campanas.map((c) => (

          <button
            key={c.IdCamp}
            onClick={() => {
    navigate(`/control-marcadores?camp=${c.IdCamp}`);
    window.location.reload();
  }}
            
              
            
            className="text-left px-3 py-1 rounded hover:bg-red-500/40 transition text-sm relative"
          >

            <span className="absolute -left-4 top-1/2 w-4 h-[2px] bg-red-200/30"></span>

            {c.Campana}
            

          </button>

        ))

      ) : (

        <span className="text-sm text-gray-400 px-3 py-1 italic">
          Sin campañas
        </span>

      )}

    </div>

  )}

</div>
               <p className="text-xs uppercase opacity-70 mt-4 mb-2 px-3">
              ADMIN
            </p>

            <button className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-red-500/70 transition">
              <Settings size={18} />
              <span>Sistema</span>
            </button>

            <p className="text-xs uppercase opacity-70 mt-4 mb-2 px-3">
              Usuario
            </p>
            
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-red-500/70 transition mt-auto"
            >
              <LogOut size={18} />
              <span>Salir</span>
            </button>

          </nav>

        </div>

      </aside>

      {/* MAIN */}

      <div className="flex-1 flex flex-col min-w-0">

        {/* HEADER */}

        <header
          className={`
          sticky top-0 z-50
          h-14 flex items-center justify-between px-6 border-b transition-colors
          ${isDark
              ? "bg-[#272833] border-[#343541]"
              : "bg-[#e9ecef] border-gray-200"}
          `}
        >

          {/* LEFT */}

          <div className="flex items-center gap-4">

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="cursor-pointer"
            >
              <Menu size={22} />
            </button>

            <span className="font-semibold text-lg cursor-pointer" onClick={() => navigate("/home")}>
              Wireless Lab
            </span>

          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-6">

            {/* DARKMODE */}

            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={toggleTheme}
              className={`
              flex items-center gap-2 px-3 py-1.5 rounded-lg
              transition-all duration-300

              ${isDark
                  ? "bg-[#343541] hover:bg-[#40414f]"
                  : "bg-white hover:bg-gray-200"}
              `}
            >

              <AnimatePresence mode="wait">

                {isDark ? (

                  <motion.div
                    key="dark"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2"
                  >
                    <LightbulbOff size={18} />
                    <span className="text-sm font-medium">
                      Dark
                    </span>
                  </motion.div>

                ) : (

                  <motion.div
                    key="light"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2"
                  >
                    <Lightbulb size={18} />
                    <span className="text-sm font-medium">
                      Light
                    </span>
                  </motion.div>

                )}

              </AnimatePresence>

            </motion.button>

            {/* NOTIFICACIONES */}

            <div className="relative cursor-pointer">

              <Bell size={20} />

              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                99+
              </span>

            </div>

            {/* USER MENU */}

            <div className="relative">

              <button
                onClick={() => setUserMenu(!userMenu)}
                className="flex items-center gap-2"
              >

                <span className="text-sm hidden sm:inline">
  {fullName || "Cargando..."}
</span>

                <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white">
                  <User size={16} />
                </div>

                <ChevronDown
                  size={16}
                  className={`transition-transform ${userMenu ? "rotate-180" : ""}`}
                />

              </button>

              <AnimatePresence>

                {userMenu && (

                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`
                    absolute right-0 mt-2 w-48 rounded-lg shadow-lg border text-sm overflow-hidden z-50
                    ${isDark
                        ? "bg-[#272833] border-[#343541]"
                        : "bg-white border-gray-200"}
                    `}
                  >

                    <button className="w-full text-left px-4 py-2.5 hover:bg-gray-100 transition">
                      Perfil
                    </button>

                    <button className="w-full text-left px-4 py-2.5 hover:bg-gray-100 transition border-b">
                      Configuración
                    </button>

                    <button
                      onClick={() => navigate("/")}
                      className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-100 text-red-500 transition font-medium"
                    >
                      <LogOut size={18} />
                      Cerrar Sesión
                    </button>

                  </motion.div>

                )}

              </AnimatePresence>

            </div>

          </div>

        </header>

        {/* CONTENT */}

        <main className="flex-1 p-6 overflow-y-auto transition-colors duration-500">
          {children}
        </main>

      </div>

    </div>
  );
}