"use client"

import { useEffect, useState, useMemo } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import { Layers } from "lucide-react"
import { useLocalTheme } from "../context/useLocalTheme"

const API = "http://192.168.9.115:4000/api/control-modulos"

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
  // TRANSFORMAR DATA (PIVOT)
  // =========================
  const groupedData = useMemo(() => {

    const map = {}

    data.forEach(item => {
      if (!map[item.id_camp]) {
        map[item.id_camp] = {
          id_camp: item.id_camp,
          nombre: item.nombre,
          monitor: false,
          busqueda: false,
          bases: false
        }
      }

      if (item.id_modulo === 1) map[item.id_camp].monitor = item.modulo_activo
      if (item.id_modulo === 2) map[item.id_camp].busqueda = item.modulo_activo
      if (item.id_modulo === 3) map[item.id_camp].bases = item.modulo_activo
    })

    return Object.values(map)

  }, [data])

  // =========================
  // TOGGLE
  // =========================
  const handleToggle = async (item, moduloKey) => {
    try {
      const { headers } = getAuthConfig()

      const moduloMap = {
        monitor: 1,
        busqueda: 2,
        bases: 3
      }

      const idModulo = moduloMap[moduloKey]
      const newState = !item[moduloKey]

      await axios.put(
        `${API}`,
        {
          idCamp: item.id_camp,
          idModulo,
          modulo_activo: newState
        },
        { headers }
      )

      // update optimista
      setData(prev =>
        prev.map(d =>
          d.id_camp === item.id_camp && d.id_modulo === idModulo
            ? { ...d, modulo_activo: newState }
            : d
        )
      )

    } catch (err) {
      console.error("Error actualizando módulo:", err)
    }
  }

  // =========================
  // UI
  // =========================
  return (
    <div className={`min-h-screen p-6 transition-colors ${
      isDark
        ? "bg-[#1F2029] text-white"
        : "bg-gray-100 text-slate-800"
    }`}>

      {/* BREADCRUMB */}
      <div className="mb-6">
        <span className={`text-xl ${
          isDark ? "text-slate-400 font-semibold" : "text-slate-500 font-semibold"
        }`}>
          Módulos / <span className="font-semibold text-black-500">Control de Módulos</span>
        </span>
      </div>

      {/* TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          rounded-xl shadow-md overflow-hidden
          ${isDark ? "bg-slate-900" : "bg-white"}
        `}
      >

        <table className="w-full text-sm">

          <thead className={isDark ? "bg-slate-800" : "bg-gray-200"}>
            <tr>
              <th className="px-4 py-3 text-left">ID CAMP</th>
              <th className="px-4 py-3 text-left">CAMPAÑA</th>
              <th className="px-4 py-3 text-center">MONITOR</th>
              <th className="px-4 py-3 text-center">BUSQUEDA</th>
              <th className="px-4 py-3 text-center">BASES</th>
            </tr>
          </thead>

          <tbody>

            {!loading && groupedData.map((item) => (

              <tr
                key={item.id_camp}
                className={`border-t ${
                  isDark ? "border-slate-700" : "border-slate-200"
                }`}
              >
                <td className="px-4 py-3">{item.id_camp}</td>
                <td className="px-4 py-3">{item.nombre}</td>

                <td className="px-4 py-3 text-center">
                  <ToggleSwitch
                    checked={item.monitor}
                    onChange={() => handleToggle(item, "monitor")}
                    isDark={isDark}
                  />
                </td>

                <td className="px-4 py-3 text-center">
                  <ToggleSwitch
                    checked={item.busqueda}
                    onChange={() => handleToggle(item, "busqueda")}
                    isDark={isDark}
                  />
                </td>

                <td className="px-4 py-3 text-center">
                  <ToggleSwitch
                    checked={item.bases}
                    onChange={() => handleToggle(item, "bases")}
                    isDark={isDark}
                  />
                </td>

              </tr>

            ))}

          </tbody>

        </table>

        {!loading && groupedData.length === 0 && (
          <div className="p-6 text-center opacity-60">
            Sin datos
          </div>
        )}

      </motion.div>

    </div>
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