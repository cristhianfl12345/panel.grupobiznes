import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PopUpAdmin from "../routes/PopUpAdmin";
import PopUpSupervisor from "../routes/PopUpSupervisor";
import ProtectedFiles, { ROLES } from "../routes/ProtectedFiles" 
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
  const [openSistema, setOpenSistema] = useState(false)
  const [openModulos, setOpenModulos] = useState(false);
  
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

const [openNotif, setOpenNotif] = useState(false);
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
        `http://192.168.9.115:4000/api/auth/mis-campanas/${user.id}`
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
//kpis seguin seccion
const [kpis, setKpis] = useState(null)
//monitor segun campañas
const [modulosMap, setModulosMap] = useState({});
const [openKpi, setOpenKpi] = useState({
  operativos: false,
  calidad: false,
  rentabilidad: false,
  rrhh: false
})
const [openKpiCampaña, setOpenKpiCampaña] = useState({})
useEffect(() => {
  const loadKpis = async () => { 
    try {
      const token = localStorage.getItem("token")
      


const res = await fetch("http://192.168.9.115:4000/api/kpis", {
  headers: {
    Authorization: `Bearer ${token}`
  }
})

      const data = await res.json()

      if (data.ok) {
        setKpis(data.data)
      } else {
        console.error("Error KPIs:", data.message)
      }

    } catch (error) {
      console.error("Error cargando KPIs:", error)
    }
  }

  loadKpis()
}, [])
const abrirVista = (level, idcamp, vistaNombre) => {
  navigate(
    `/visor/${level}/${idcamp}/${encodeURIComponent(vistaNombre)}`
  )
}
const limpiarNombreVista = (nombre) => {
  return nombre.replace(/<[^>]*>/g, "").trim()
}
 useEffect(() => {
  const fetchModulos = async () => {
    try {
      const res = await fetch("http://192.168.9.115:4000/api/control-modulos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const json = await res.json();

      if (json.ok) {
        const activos = json.data.filter(m => m.modulo_activo);

        const map = {};

        activos.forEach(m => {
          if (!map[m.id_camp]) map[m.id_camp] = [];

          map[m.id_camp].push({
            idModulo: m.id_modulo,
            nombre:
              m.id_modulo === 1
                ? "MONITOR DE LEADS"
                : m.id_modulo === 2
                ? "BUSQUEDA"
                : m.id_modulo === 3
                ? "MONITOR DE BASES"
                : "MODULO",
            ruta:
              m.id_modulo === 1
                ? "monitor"
                : m.id_modulo === 2
                ? "busqueda"
                : m.id_modulo === 3
                ? "monitor-bases"
                : "modulo"

          });
        });

        setModulosMap(map);
      }

    } catch (err) {
      console.error("Error cargando módulos:", err);
    }
  };

  fetchModulos();
}, []);
//CONTADOR DE LAS NOTIFICACIONES ADMIN
 const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const el = document.getElementById("notificaciones-contador");
      if (el) {
        const value = Number(el.getAttribute("data-count")) || 0;
        setCount(value);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);
  //contador de notificaciones supervisor
  const [openSupervisor, setOpenSupervisor] = useState(false);

  //restriccion de notificaicones por roles:
  const tipoUsuario = Number(localStorage.getItem("id_tipo_usuario"));

const esSupervisor = [3,4,5].includes(tipoUsuario);
const esAdmin = [1,2,6].includes(tipoUsuario);

// cierre de sesion
const handleLogout = () => {
  // Borrar todo (Recomendado para limpieza total)
 //localStorage.clear();

  // borrar solo lo relacionado al usuario pero mantener el tema (Dark/Light)
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("id_tipo_usuario");
  //localStorage.removeItem("notificaciones_cerradas_supervisor");
 // localStorage.removeItem("notificaciones_cerradas_admin");

  // Redirigir al login y usar replace para que no puedan volver atrás
  navigate("/", { replace: true });
};
return (

    <div
      className={`
      h-screen flex overflow-hidden transition-colors duration-500
      ${isDark ? "bg-[#1F2029] text-white" : "bg-[#F5F5F5] text-slate-800"}
      `}
    >

      {/* SIDEBAR */}
{/*       <aside
        className={`
        transition-all duration-300 flex-shrink-0
        ${sidebarOpen ? "w-64" : "w-0 overflow-hidden"}

        ${isDark
            ? "bg-gradient-to-b from-[#4A0909] to-[#B53838] text-white"
            : "bg-gradient-to-b from-[#C23030] to-red-700 text-white"}
        `}
      >*/}

      <aside
        className={`
        transition-all duration-300 flex-shrink-0
        ${sidebarOpen ? "w-64" : "w-20"}

        ${isDark
            ? "bg-gradient-to-b from-[#4A0909] to-[#B53838] text-white"
            : "bg-gradient-to-b from-[#C23030] to-red-700 text-white"}
        `}
      >

        <div className="h-full flex flex-col">

          <nav className="flex-1 p-4 text-sm space-y-1 overflow-y-auto">

           <button
              onClick={() => navigate("/home")}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-red-500/70 transition ${!sidebarOpen ? 'justify-center' : ''}`}
            >
              <Home size={18} />
              {sidebarOpen && <span>Inicio</span>} 
            </button><ProtectedFiles allow={[ROLES.ADMIN, ROLES.SISTEMAS, ROLES.GERENCIA]}>
  {/* Solo mostramos el título de sección si el sidebar está abierto */}
<p className={`text-xs uppercase opacity-70 mt-4 mb-2 px-3 flex ${!sidebarOpen ? 'justify-center' : ''}`}>
  {sidebarOpen ? (
    "Reportes Clientes"
  ) : (
    <span className="font-bold text-xs tracking-tighter">RC</span>
  )}
</p>

  {/* Campañas Clientes inicio */}
  <button
    onClick={() => {
      // Si el sidebar está cerrado, quizás quieras abrirlo al hacer clic o 
      // simplemente no permitir que se despliegue el submenú si está colapsado.
      if (sidebarOpen) setOpenCampanasClientes(!openCampanasClientes);
    }}
    title={!sidebarOpen ? "Campañas" : ""} // Tooltip nativo para cuando esté colapsado
    className={`
      flex items-center w-full px-3 py-2 rounded hover:bg-red-500/70 transition
      ${sidebarOpen ? "justify-between" : "justify-center"} 
    `}
  >
    <div className="flex items-center gap-3">
      <Grid size={18} />
      {/* Ocultamos el texto si sidebarOpen es false */}
      {sidebarOpen && <span>Campañas</span>}
    </div>

    {/* Ocultamos la flecha si sidebarOpen es false */}
    {sidebarOpen && (
      <ChevronRight
        size={16}
        className={`transition-transform ${openCampanasClientes ? "rotate-90" : ""}`}
      />
    )}
  </button>

  {/* El submenú solo debería ser visible si el sidebar está abierto */}
  {sidebarOpen && openCampanasClientes && (
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
  {/* Campañas Clientes fin */}
</ProtectedFiles>
                        {/* Solo mostramos el título "Dashboard" si el sidebar está abierto */}
           <p className={`text-xs uppercase opacity-70 mt-4 mb-2 px-3 flex ${!sidebarOpen ? 'justify-center' : ''}`}>
  {sidebarOpen ? (
    "Dashboard"
  ) : (
    <span className="font-bold text-xs tracking-tight">DASH</span>
  )}
</p>

            <button 
              title={!sidebarOpen ? "Control Supervisor" : ""}
              className={`
                flex items-center w-full px-3 py-2 rounded hover:bg-red-500/70 transition
                ${sidebarOpen ? "justify-between" : "justify-center"}
              `}
            >
              <div className="flex items-center gap-3">
                <BarChart3 size={18} />
                {/* El texto desaparece cuando sidebarOpen es false */}
                {sidebarOpen && <span>Control Supervisor</span>}
              </div>

              {/* La flecha desaparece cuando sidebarOpen es false */}
              {sidebarOpen && <ChevronRight size={16} />}
            </button>

         {/* KPI */}
<p className="font-bold text-xs uppercase opacity-70 mt-4 mb-2 px-3">
  KPI
</p>

{/* ========= OPERATIVOS ========= */}
<button
  onClick={() => sidebarOpen && setOpenKpi({ ...openKpi, operativos: !openKpi.operativos })}
  className={`flex items-center w-full px-3 py-2 rounded hover:bg-red-500/70 transition ${sidebarOpen ? 'justify-between' : 'justify-center'}`}
>
  <div className="flex items-center gap-3">
    <MonitorCog size={18} />
    {sidebarOpen && <span>Operativos</span>}
  </div>
  
  {sidebarOpen && (
    <ChevronRight
      size={16}
      className={`transition-transform ${openKpi.operativos ? 'rotate-90' : ''}`}
    />
  )}
</button>

{openKpi.operativos && (
  <div className="ml-5 mt-1 flex flex-col gap-1 border-l-2 border-red-50/30 pl-4">

    {Object.entries(kpis?.operativos || {}).map(([campId, camp]) => {
      const isOpen = openKpiCampaña.operativos === campId;

      return (
        <div key={campId}>

          {/* CAMPAÑA */}
          <button
            onClick={() =>
              setOpenKpiCampaña({
                ...openKpiCampaña,
                operativos: isOpen ? null : campId
              })
            }
            className="flex items-center text-left justify-between w-full px-3 py-2 rounded hover:bg-red-500/40 transition text-sm"
          >
            <span>{camp.nombreCampana}</span>

            <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
              <ChevronRight size={14} />
            </motion.div>
          </button>

          {/* CONTENIDO */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="ml-4 mt-1 flex flex-col gap-1 border-l border-red-200/20 pl-3 overflow-hidden"
              >

                {/* MODULOS (NUEVO) */}
                {modulosMap[Number(campId)] &&
                  modulosMap[Number(campId)].map(mod => (
                    <motion.button
                      key={`mod-${mod.idModulo}`}
                      whileHover={{ x: 5 }}
                      onClick={() => {
  navigate(`/${mod.ruta}?camp=${campId}`);
}}
                      className="text-left px-2 py-1 rounded bg-red-600/40 hover:bg-red-600/70 transition text-xs font-semibold"
                    >
                      {mod.nombre}
                    </motion.button>
                  ))
                }

                {/* 🔽 VISTAS (YA EXISTENTE) */}
                {(camp.vistas || []).map(vista => (
                  <motion.button
                    key={vista.id}
                    whileHover={{ x: 5 }}
                    onClick={() => abrirVista(1, campId, limpiarNombreVista(vista.nombre))}
                    className="text-left px-2 py-1 rounded hover:bg-red-500/30 transition text-xs"
                  >
                    <span dangerouslySetInnerHTML={{ __html: vista.nombre }} />
                  </motion.button>
                ))}

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      );
    })}

  </div>
)}
{/* ========= CALIDAD ========= */}
<button
  onClick={() => sidebarOpen && setOpenKpi({ ...openKpi, calidad: !openKpi.calidad })}
  title={!sidebarOpen ? "Calidad" : ""}
  className={`flex items-center w-full px-3 py-2 rounded hover:bg-red-500/70 transition ${
    sidebarOpen ? "justify-between" : "justify-center"
  }`}
>
  <div className="flex items-center gap-3">
    <Cross size={18} />
    {sidebarOpen && <span>Calidad</span>}
  </div>
  {sidebarOpen && (
    <ChevronRight
      size={16}
      className={`transition-transform ${openKpi.calidad ? "rotate-90" : ""}`}
    />
  )}
</button>

{sidebarOpen && openKpi.calidad && (
  <div className="ml-5 mt-1 flex flex-col gap-1 border-l-2 border-red-50/30 pl-4">
    {Object.entries(kpis?.calidad || {}).map(([campId, camp]) => {
      const isOpen = openKpiCampaña.calidad === campId;
      return (
        <div key={campId}>
          <button
            onClick={() =>
              setOpenKpiCampaña({
                ...openKpiCampaña,
                calidad: isOpen ? null : campId,
              })
            }
            className="flex items-center text-left justify-between w-full px-3 py-2 rounded hover:bg-red-500/40 transition text-sm"
          >
            <span>{camp.nombreCampana}</span>
            <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
              <ChevronRight size={14} />
            </motion.div>
          </button>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="ml-4 mt-1 flex flex-col gap-1 border-l border-red-200/20 pl-3 overflow-hidden"
              >
                {(camp.vistas || []).map((vista) => (
                  <motion.button
                    key={vista.id}
                    whileHover={{ x: 5 }}
                    onClick={() => abrirVista(2, campId, limpiarNombreVista(vista.nombre))}
                    className="text-left px-2 py-1 rounded hover:bg-red-500/30 transition text-xs"
                  >
                    <span dangerouslySetInnerHTML={{ __html: vista.nombre }} />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    })}
  </div>
)}

{/* ========= RENTABILIDAD ========= */}
<button
  onClick={() => sidebarOpen && setOpenKpi({ ...openKpi, rentabilidad: !openKpi.rentabilidad })}
  title={!sidebarOpen ? "Rentabilidad" : ""}
  className={`flex items-center w-full px-3 py-2 rounded hover:bg-red-500/70 transition ${
    sidebarOpen ? "justify-between" : "justify-center"
  }`}
>
  <div className="flex items-center gap-3">
    <ChartSpline size={18} />
    {sidebarOpen && <span>Rentabilidad</span>}
  </div>
  {sidebarOpen && (
    <ChevronRight
      size={16}
      className={`transition-transform ${openKpi.rentabilidad ? "rotate-90" : ""}`}
    />
  )}
</button>

{sidebarOpen && openKpi.rentabilidad && (
  <div className="ml-5 mt-1 flex flex-col gap-1 border-l-2 border-red-50/30 pl-4">
    {Object.entries(kpis?.rentabilidad || {}).map(([campId, camp]) => {
      const isOpen = openKpiCampaña.rentabilidad === campId;
      return (
        <div key={campId}>
          <button
            onClick={() =>
              setOpenKpiCampaña({
                ...openKpiCampaña,
                rentabilidad: isOpen ? null : campId,
              })
            }
            className="flex items-center text-left justify-between w-full px-3 py-2 rounded hover:bg-red-500/40 transition text-sm"
          >
            <span>{camp.nombreCampana}</span>
            <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
              <ChevronRight size={14} />
            </motion.div>
          </button>
          <AnimatePresence>
            {isOpen && (
              <motion.div className="ml-4 mt-1 flex flex-col gap-1 border-l border-red-200/20 pl-3">
                {(camp.vistas || []).map((vista) => (
                  <motion.button
                    key={vista.id}
                    whileHover={{ x: 5 }}
                    onClick={() => abrirVista(3, campId, limpiarNombreVista(vista.nombre))}
                    className="text-left px-2 py-1 rounded hover:bg-red-500/30 text-xs"
                  >
                    <span dangerouslySetInnerHTML={{ __html: vista.nombre }} />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    })}
  </div>
)}

{/* ========= RRHH ========= */}
<button
  onClick={() => sidebarOpen && setOpenKpi({ ...openKpi, rrhh: !openKpi.rrhh })}
  title={!sidebarOpen ? "RRHH" : ""}
  className={`flex items-center w-full px-3 py-2 rounded hover:bg-red-500/70 transition ${
    sidebarOpen ? "justify-between" : "justify-center"
  }`}
>
  <div className="flex items-center gap-3">
    <UsersRound size={18} />
    {sidebarOpen && <span>RRHH</span>}
  </div>
  {sidebarOpen && (
    <ChevronRight
      size={16}
      className={`transition-transform ${openKpi.rrhh ? "rotate-90" : ""}`}
    />
  )}
</button>

{sidebarOpen && openKpi.rrhh && (
  <div className="ml-5 mt-1 flex flex-col gap-1 border-l-2 border-red-50/30 pl-4">
    {Object.entries(kpis?.rrhh || {}).map(([campId, camp]) => {
      const isOpen = openKpiCampaña.rrhh === campId;
      return (
        <div key={campId}>
          <button
            onClick={() =>
              setOpenKpiCampaña({
                ...openKpiCampaña,
                rrhh: isOpen ? null : campId,
              })
            }
            className="flex items-center text-left justify-between w-full px-3 py-2 rounded hover:bg-red-500/40 transition text-sm"
          >
            <span>{camp.nombreCampana}</span>
            <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
              <ChevronRight size={14} />
            </motion.div>
          </button>
          <AnimatePresence>
            {isOpen && (
              <motion.div className="ml-4 mt-1 flex flex-col gap-1 border-l border-red-200/20 pl-3">
                {(camp.vistas || []).map((vista) => (
                  <motion.button
                    key={vista.id}
                    whileHover={{ x: 5 }}
                    onClick={() => abrirVista(4, campId, limpiarNombreVista(vista.nombre))}
                    className="text-left px-2 py-1 rounded hover:bg-red-500/30 text-xs"
                  >
                    <span dangerouslySetInnerHTML={{ __html: vista.nombre }} />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    })}
  </div>
)}
       
  
  {/* TITULO - Solo visible si está abierto */}
 <p className={`text-xs uppercase opacity-70 mt-4 mb-2 px-3 flex ${!sidebarOpen ? 'justify-center' : ''}`}>
  {sidebarOpen ? (
    "Configuración"
  ) : (
    <span className="font-bold text-xs tracking-tighter">CONFIG</span>
  )}
</p>
   <ProtectedFiles allow={[ROLES.ADMIN, ROLES.SISTEMAS, ROLES.GERENCIA]}>
  {/* MENU PRINCIPAL (Control de módulos) */}
  <button
    onClick={() => sidebarOpen && setOpenModulos(!openModulos)}
    title={!sidebarOpen ? "Control de módulos" : ""}
    className={`flex items-center w-full px-3 py-2 rounded hover:bg-red-500/70 transition ${
      sidebarOpen ? "justify-between" : "justify-center"
    }`}
  >
    <div className="flex items-center gap-3">
      <Settings size={18} />
      {sidebarOpen && <span className="flex-1 text-left">Control de módulos</span>}
    </div>

    {sidebarOpen && (
      <ChevronRight
        size={16}
        className={`transition-transform ${openModulos ? 'rotate-90' : ''}`}
      />
    )}
  </button>

  {/* SUBMENÚ - Solo si está abierto y expandido */}
  {sidebarOpen && openModulos && (
    <div className="relative ml-5 mt-1 flex flex-col gap-1 border-l-2 border-red-50/30 pl-4">
      <button
        onClick={() => navigate("/home")}
        className="text-left px-3 py-1 rounded hover:bg-red-500/40 transition text-sm relative"
      >
        <span className="absolute -left-4 top-1/2 w-4 h-[2px] bg-red-200/30"></span>
        Control de campaña
      </button>

      <button
        onClick={() => navigate("/control-modulos")}
        className="text-left px-3 py-1 rounded hover:bg-red-500/40 transition text-sm relative"
      >
        <span className="absolute -left-4 top-1/2 w-4 h-[2px] bg-red-200/30"></span>
        Monitor de Leads
      </button>
    </div>
  )}

</ProtectedFiles>

<div className="relative">
  {/* CONTROL DE MARCADORES */}
  <button
    onClick={() => sidebarOpen && setOpenMarcadores(!openMarcadores)}
    title={!sidebarOpen ? "Control de Marcadores" : ""}
    className={`flex items-center w-full px-3 py-2 rounded hover:bg-red-500/70 transition ${
      sidebarOpen ? "justify-between" : "justify-center"
    }`}
  >
    <div className="flex items-center gap-3">
      <Hash size={18} />
      {sidebarOpen && <span className="flex-1 text-left">Control de Marcadores</span>}
    </div>

    {sidebarOpen && (
      <ChevronRight
        size={16}
        className={`transition-transform ${openMarcadores ? 'rotate-90' : ''}`}
      />
    )}
  </button>

  {/* SUBMENÚ MARCADORES */}
  {sidebarOpen && openMarcadores && (
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
</div><ProtectedFiles allow={[ROLES.ADMIN, ROLES.SISTEMAS, ROLES.GERENCIA]}>
  {/* Título de sección condicional */}
 <p className={`text-xs uppercase opacity-70 mt-4 mb-2 px-3 flex ${!sidebarOpen ? 'justify-center' : ''}`}>
  {sidebarOpen ? (
    "ADMIN"
  ) : (
    <span className="font-bold text-xs tracking-tighter">ADMIN</span>
  )}
</p>

  <button
    onClick={() => sidebarOpen && setOpenSistema(!openSistema)}
    title={!sidebarOpen ? "Sistema" : ""}
    className={`flex items-center w-full px-3 py-2 rounded hover:bg-red-500/70 transition ${
      sidebarOpen ? "justify-between" : "justify-center"
    }`}
  >
    <div className="flex items-center gap-3">
      <Settings size={18} />
      {sidebarOpen && <span className="flex-1 text-left">Sistema</span>}
    </div>

    {sidebarOpen && (
      <ChevronRight
        size={16}
        className={`transition-transform ${openSistema ? 'rotate-90' : ''}`}
      />
    )}
  </button>

  {/* Submenú de Gestión - Solo si el sidebar está abierto */}
  {sidebarOpen && openSistema && (
    <div className="relative ml-5 mt-1 flex flex-col gap-1 border-l-2 border-red-50/30 pl-4">
      <button
        onClick={() => navigate("/createuser")}
        className="text-left px-3 py-1 rounded hover:bg-red-500/40 transition text-sm relative"
      >
        <span className="absolute -left-4 top-1/2 w-4 h-[2px] bg-red-200/30"></span>
        Gestion de Usuarios
      </button>

      <button
        onClick={() => navigate("/createview")}
        className="text-left px-3 py-1 rounded hover:bg-red-500/40 transition text-sm relative"
      >
        <span className="absolute -left-4 top-1/2 w-4 h-[2px] bg-red-200/30"></span>
        Crear Vista
      </button>
    </div>
  )}
</ProtectedFiles>

{/* Título de sección condicional */}
<p className={`text-xs uppercase opacity-70 mt-4 mb-2 px-3 flex ${!sidebarOpen ? 'justify-center' : ''}`}>
  {sidebarOpen ? (
    "Usuario"
  ) : (
    <span className="font-bold text-xs tracking-tighter">USER</span>
  )}
</p>

<button
  onClick={handleLogout}
  title={!sidebarOpen ? "Salir" : ""}
  className={`
    flex items-center w-full px-3 py-2 rounded hover:bg-red-500/70 transition mt-auto text-white
    ${sidebarOpen ? "justify-start gap-3" : "justify-center"}
  `}
>
  <LogOut size={18} />
  {/* Ocultamos el texto "Salir" si el sidebar está colapsado */}
  {sidebarOpen && <span>Salir</span>}
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
                  {/*  <span className="text-sm font-medium">
                      Dark
                    </span> */}
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
                  {/*  <span className="text-sm font-medium">
                      Light
                    </span> */}
                  </motion.div>

                )}

              </AnimatePresence>

            </motion.button>

{/* NOTIFICACIONES */}
<div className="flex items-center ml-2">
{esAdmin && (
  <>
<div
  className="relative cursor-pointer -ml-5"
  onClick={() => setOpenNotif((prev) => !prev)}
>
  <Bell
    size={20}
    className={`transition ${
      isDark ? "text-gray-200" : "text-gray-700"
    } hover:scale-110`}
  />

  {count > 0 && (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center"
    >
      {count > 99 ? "99+" : count}
    </motion.span>
  )}
</div>
      <PopUpAdmin open={openNotif} setOpen={setOpenNotif} />
      </>
      
)} 
{/* NOTIFICACIONES SUPERVISOR */}

{esSupervisor && (
  <>
<div
  className="relative cursor-pointer -ml-5"
  onClick={() => setOpenSupervisor((prev) => !prev)}
>
  <Bell
    size={20}
    className={`transition ${
      isDark ? "text-blue-300" : "text-blue-600"
    } hover:scale-110`}
  />
</div>

<PopUpSupervisor
  open={openSupervisor}
  setOpen={setOpenSupervisor}
/>
  </>
)} </div>
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
                      onClick={handleLogout}
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