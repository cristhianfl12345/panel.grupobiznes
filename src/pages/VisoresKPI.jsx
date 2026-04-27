import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"

export default function VisoresKPI() {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {

    const handleStorage = () => {
      const theme = localStorage.getItem("theme") === "dark";
      setIsDark(theme);
      window.location.reload(); // recarga al cambiar modo
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };

  }, []);

  const API = "http://192.168.9.115:4000/api"

  const { level, idcamp, vista } = useParams()

  const [urlVista, setUrlVista] = useState("")
  const [loading, setLoading] = useState(true)

  // Obtener vista desde backend
  const obtenerVista = async () => {
    try {
      setLoading(true)

      const res = await fetch(
        `${API}/vistas?level=${level}&idcamp=${idcamp}`
      )

      const data = await res.json()

      const limpiar = (txt) =>
        txt.replace(/<[^>]*>/g, "").trim().toLowerCase()

      const vistaBuscada = limpiar(decodeURIComponent(vista))

      const vistaEncontrada = data.find(
        (v) => limpiar(v.name_vista) === vistaBuscada
      )

      if (vistaEncontrada) {
        setUrlVista(vistaEncontrada.url_vista)
      } else {
        setUrlVista("")
      }

    } catch (error) {
      console.error("Error cargando vista:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (level && idcamp && vista) {
      obtenerVista()
    }
  }, [level, idcamp, vista])

  // Breadcrumb dinámico
  const getNombreLevel = (lvl) => {
    switch (parseInt(lvl)) {
      case 1: return "Operativos"
      case 2: return "Calidad"
      case 3: return "Rentabilidad"
      case 4: return "RRHH"
      default: return "KPI"
    }
  }

  return (
    <div className="w-full h-full flex flex-col">

      {/* BREADCRUMB */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`px-6 py-4 text-xl ${
          isDark ? "text-gray-200" : "text-gray-700"
        }`}
      >
        <span
          className={`font-bold${
            isDark ? "text-gray-100" : "text-gray-800"
          }`}
        >
          {getNombreLevel(level)}
        </span>

        <span className="mx-1"> / </span>

        <span
          className={`${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Campaña {idcamp}
        </span>

        <span className="mx-1"> / </span>

        <span
          className={`font-semibold ${
            isDark ? "text-gray-100" : "text-gray-900"
          }`}
        >
          {decodeURIComponent(vista)}
        </span>
      </motion.div>

      {/*  VISOR */}
      <div className="flex-1 px-4 pb-4">

        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-400">Cargando visor...</p>
          </div>
        ) : urlVista ? (
          <motion.iframe
            key={urlVista}
            src={urlVista}
            className="w-full h-full rounded-xl border shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-red-400">
              No se encontró la vista
            </p>
          </div>
        )}

      </div>

    </div>
  )
}