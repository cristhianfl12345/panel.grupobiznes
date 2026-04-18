//front/src/pages/Control_Modulos.jsx
"use client"

import { useEffect, useState, useMemo } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { Layers, Search } from "lucide-react"
import { useLocalTheme } from "../context/useLocalTheme"

const API = "http://localhost:4000/api/control-modulos"

// helper auth
const getAuthConfig = () => {
  const token = localStorage.getItem("token")

  if (!token) {
    throw new Error("No autenticado")
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
}

export default function Control_Modulos() {

  const { theme } = useLocalTheme()
  const isDark = theme === "dark"

  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(1) // 1 = Monitor, 2 = Busqueda

  // =========================
  // FETCH DATA
  // =========================
  const fetchData = async () => {
    setLoading(true)
    try {
      const { headers } = getAuthConfig()

      const res = await axios.get(API, { headers })

      setData(res.data?.data || [])

    } catch (err) {
      console.error("Error cargando módulos:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // =========================
  // TOGGLE
  // =========================
  const handleToggle = async (item) => {
    try {
      const { headers } = getAuthConfig()

      const newState = !item.modulo_activo

await axios.put(
  `${API}`,
  {
    idCamp: item.id_camp,
    idModulo: item.id_modulo,
    modulo_activo: newState
  },
  { headers }
)

      // update local state optimista
      setData(prev =>
        prev.map(d =>
          d.id_camp === item.id_camp &&
          d.id_modulo === item.id_modulo
            ? { ...d, modulo_activo: newState }
            : d
        )
      )

    } catch (err) {
      console.error("Error actualizando módulo:", err)
    }
  }

  // =========================
  // FILTRO POR TAB
  // =========================
  const filteredData = useMemo(() => {
    return data.filter(d => d.id_modulo === activeTab)
  }, [data, activeTab])

  // =========================
  // UI
  // =========================
  return (
    <div className={`min-h-screen p-6 transition-colors ${
      isDark
        ? "bg-[#1F2029] text-white"
        : "bg-slate-50 text-slate-800"
    }`}>

      {/* TABS */}
      <div className="flex gap-3 mb-6">

        <TabButton
          active={activeTab === 1}
          onClick={() => setActiveTab(1)}
          icon={<Layers size={16}/>}
          label="MONITOR DE LEADS"
          isDark={isDark}
        />

        <TabButton
          active={activeTab === 2}
          onClick={() => setActiveTab(2)}
          icon={<Search size={16}/>}
          label="BUSQUEDA"
          isDark={isDark}
        />

      </div>

      {/* TAB CONTENT */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          rounded-xl
          shadow-md
          overflow-hidden
          ${isDark ? "bg-slate-900" : "bg-white"}
        `}
      >

        <table className="w-full text-sm">

          <thead className={`
            ${isDark ? "bg-slate-800" : "bg-gray-100"}
          `}>
            <tr>
              <th className="px-4 py-3 text-left">ID CAMP</th>
              <th className="px-4 py-3 text-left">CAMPAÑA</th>
             {/* <th className="px-4 py-3 text-left">MÓDULO</th> */}
              <th className="px-4 py-3 text-center">ACTIVO</th>
            </tr>
          </thead>

          <tbody>

            <AnimatePresence>

              {!loading && filteredData.map((item) => (

                <motion.tr
                  key={`${item.id_camp}-${item.id_modulo}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`
                    border-t
                    ${isDark ? "border-slate-700" : "border-slate-200"}
                  `}
                >

                  <td className="px-4 py-3">{item.id_camp}</td>
                  <td className="px-4 py-3">{item.nombre}</td>
                 {/* <td className="px-4 py-3">
                    {item.id_modulo === 1 ? "MONITOR" : "BUSQUEDA"}
                  </td> */}

                  <td className="px-4 py-3 text-center">

                    {/* TOGGLE */}
                    <ToggleSwitch
                      checked={item.modulo_activo}
                      onChange={() => handleToggle(item)}
                      isDark={isDark}
                    />

                  </td>

                </motion.tr>

              ))}

            </AnimatePresence>

          </tbody>

        </table>

        {!loading && filteredData.length === 0 && (
          <div className="p-6 text-center opacity-60">
            Sin datos
          </div>
        )}

      </motion.div>

    </div>
  )
}


// =========================
// TAB BUTTON
// =========================
function TabButton({ active, onClick, icon, label, isDark }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl border transition
        ${
          active
            ? "bg-red-800 text-white border-red-600"
            : isDark
              ? "border-slate-700 hover:bg-slate-800"
              : "border-slate-300 hover:bg-slate-200"
        }
      `}
    >
      {icon}
      {label}
    </motion.button>
  )
}


// =========================
// TOGGLE SWITCH
// =========================
function ToggleSwitch({ checked, onChange, isDark }) {
  return (
    <div
      onClick={onChange}
      className={`
        w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition
        ${checked ? "bg-green-500" : isDark ? "bg-slate-600" : "bg-gray-300"}
      `}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-4 h-4 bg-white rounded-full shadow-md"
        style={{
          x: checked ? 20 : 0
        }}
      />
    </div>
  )
}