// front/src/pages/AgregarAgente.jsx

"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"

import {
  FileText,
  Clock3,
  ShieldCheck,
  Send,
  Loader2,
  User,
  KeyRound,
  Search,
  UserCheck
} from "lucide-react"

import { INDICE_CAMPS } from "../context/indiceCamps"

const API_URL = "https://panel.bizapp.pe"
// const API_URL = "https://panel.bizapp.pe"

export default function AgregarAgente({ user }) {

  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  )

  useEffect(() => {

    const handleStorage = () => {
      const theme = localStorage.getItem("theme") === "dark"
      setIsDark(theme)
      window.location.reload()
    }

    window.addEventListener("storage", handleStorage)

    return () => {
      window.removeEventListener("storage", handleStorage)
    }

  }, [])

  const [searchParams] = useSearchParams()

  const camp = searchParams.get("camp")

  const campInfo = INDICE_CAMPS.find(
    c => String(c.id_camp) === String(camp)
  )

  const [loading, setLoading] = useState(false)

  const [searchingDni, setSearchingDni] = useState(false)

  const [personaData, setPersonaData] = useState(null)

  const [error, setError] = useState("")

  const [responseData, setResponseData] = useState(null)

  const [form, setForm] = useState({
    numero_documento: "",
    nombre: "",
    usuario: "",
    password: "",
    hora_in: "08:00",
    hora_out: "18:00",
    id_campana: camp || ""
  })

  // =========================================================
  // ACTUALIZAR CAMPAÑA
  // =========================================================

  useEffect(() => {

    setForm(prev => ({
      ...prev,
      id_campana: camp || ""
    }))

  }, [camp])

  // =========================================================
  // BUSCAR PERSONA
  // =========================================================

  const handleBuscarPersona = async () => {

    if (form.numero_documento.length !== 8) {
      return
    }

    try {

      setSearchingDni(true)

      setError("")
      setPersonaData(null)
      setResponseData(null)

      const res = await fetch(
        `${API_URL}/api/agentes/persona/${form.numero_documento}`
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "No encontrado")
      }

      setPersonaData(data)

      setForm(prev => ({
        ...prev,
        nombre: data.nombre?.toUpperCase() || "",
        usuario: data.usuario?.toUpperCase() || "",
        password: data.password?.toUpperCase() || ""
      }))

    } catch (err) {

      setPersonaData(null)

      setForm(prev => ({
        ...prev,
        nombre: "",
        usuario: "",
        password: ""
      }))

      setError(err.message)

    } finally {

      setSearchingDni(false)

    }
  }

  // =========================================================
  // INPUTS
  // =========================================================

  const handleChange = (e) => {

    const { name, value } = e.target

    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {

    e.preventDefault()

    setLoading(true)

    setError("")

    setResponseData(null)

    try {

      const body = {
  numero_documento: form.numero_documento,
  hora_in: form.hora_in,
  hora_out: form.hora_out,
  id_campana: Number(form.id_campana)
}

      const res = await fetch(
        `${API_URL}/api/agentes/actualizar-horario-campana`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Error")
      }

      setResponseData(data)

    } catch (err) {

      console.error(err)

      setError(err.message)

    } finally {

      setLoading(false)

    }
  }

  // =========================================================
  // CLASSES
  // =========================================================

  const inputClass = useMemo(() => {

    return `
      w-full rounded-xl px-4 py-3 outline-none border transition-all duration-300
      ${
        isDark
          ? `
            bg-[#1F2029]
            border-[#343746]
            text-white
            placeholder:text-gray-400
            focus:border-red-500
          `
          : `
            bg-white
            border-gray-300
            text-gray-800
            placeholder:text-gray-500
            focus:border-red-500
          `
      }
    `

  }, [isDark])

  const redButtonClass = `
    px-6 py-3 rounded-xl
    bg-gradient-to-r
    from-red-600
    via-red-500
    to-rose-500
    hover:from-red-700
    hover:via-red-600
    hover:to-rose-600
    text-white font-semibold
    transition-all duration-300
    flex items-center gap-2
    shadow-lg shadow-red-500/20
    hover:shadow-red-500/40
    disabled:opacity-50
    disabled:cursor-not-allowed
  `

  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div
      className={`
      min-h-screen p-6 transition-colors duration-500
      ${isDark ? "bg-[#1F2029] text-white" : "bg-gray-100 text-gray-800"}
      `}
    >

      {/* BREADCRUMB */}

      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >

        <div
          className={`
          text-xl font-semibold
          ${isDark ? "text-slate-300" : "text-slate-700"}
          `}
        >
          Operativos / {campInfo?.nombre || "-"} / Agregar Agente
        </div>

      </motion.div>

      {/* FORM */}

      <motion.form
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className={`
          rounded-2xl border p-6
          ${
            isDark
              ? "bg-[#272833] border-[#343746]"
              : "bg-white border-gray-200"
          }
        `}
      >

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* DNI */}

          <div>

            <label
              className={`
              text-sm font-medium mb-2 flex items-center gap-2
              ${isDark ? "text-gray-200" : "text-gray-700"}
              `}
            >
              <FileText size={16} />
              Documento
            </label>

            <div className="flex gap-3">

              <div className="relative flex-1">

                <input
                  type="text"
                  name="numero_documento"
                  maxLength={8}
                  value={form.numero_documento}
                  onChange={handleChange}
                  disabled={searchingDni}
                  className={inputClass}
                  placeholder="Ingrese DNI"
                  required
                />

                {searchingDni && (
                  <Loader2
                    size={18}
                    className="
                      absolute right-4 top-3.5
                      animate-spin text-red-500
                    "
                  />
                )}

              </div>

              <button
                type="button"
                onClick={handleBuscarPersona}
                disabled={
                  searchingDni ||
                  form.numero_documento.length !== 8
                }
                className={redButtonClass}
              >

                <Search size={18} />

                Buscar

              </button>

            </div>

          </div>

          {/* NOMBRE */}

          <div>

            <label
              className={`
              text-sm font-medium mb-2 flex items-center gap-2
              ${isDark ? "text-gray-200" : "text-gray-700"}
              `}
            >
              <User size={16} />
              Nombre
            </label>

            <input
              type="text"
              value={form.nombre}
              disabled
              className={`
                ${inputClass}
                opacity-70 cursor-not-allowed font-semibold
              `}
            />

          </div>

          {/* USUARIO */}

          <div>

            <label
              className={`
              text-sm font-medium mb-2 flex items-center gap-2
              ${isDark ? "text-gray-200" : "text-gray-700"}
              `}
            >
              <User size={16} />
              Usuario
            </label>

            <input
              type="text"
              value={form.usuario}
              disabled
              className={`
                ${inputClass}
                opacity-70 cursor-not-allowed font-semibold uppercase
              `}
            />

          </div>

          {/* PASSWORD */}

          <div>

            <label
              className={`
              text-sm font-medium mb-2 flex items-center gap-2
              ${isDark ? "text-gray-200" : "text-gray-700"}
              `}
            >
              <KeyRound size={16} />
              Contraseña
            </label>

            <input
              type="text"
              value={form.password}
              disabled
              className={`
                ${inputClass}
                opacity-70 cursor-not-allowed font-semibold uppercase
              `}
            />

          </div>

          {/* CAMPAÑA */}

          <div>

            <label
              className={`
              text-sm font-medium mb-2 flex items-center gap-2
              ${isDark ? "text-gray-200" : "text-gray-700"}
              `}
            >
              <ShieldCheck size={16} />
              Campaña
            </label>

            <input
              type="text"
              value={
                campInfo
                  ? `${campInfo.nombre}`
                  : "-"
              }
              disabled
              className={`
                ${inputClass}
                opacity-70 cursor-not-allowed font-semibold
              `}
            />

          </div>

          {/* HORA IN */}

          <div>

            <label
              className={`
              text-sm font-medium mb-2 flex items-center gap-2
              ${isDark ? "text-gray-200" : "text-gray-700"}
              `}
            >
              <Clock3 size={16} />
              Hora Entrada
            </label>

            <input
              type="time"
              name="hora_in"
              value={form.hora_in}
              onChange={handleChange}
              className={inputClass}
              required
            />

          </div>

          {/* HORA OUT */}

          <div>

            <label
              className={`
              text-sm font-medium mb-2 flex items-center gap-2
              ${isDark ? "text-gray-200" : "text-gray-700"}
              `}
            >
              <Clock3 size={16} />
              Hora Salida
            </label>

            <input
              type="time"
              name="hora_out"
              value={form.hora_out}
              onChange={handleChange}
              className={inputClass}
              required
            />

          </div>

        </div>

        {/* ERROR */}

        {error && (

          <div
            className={`
            mt-5 rounded-xl px-4 py-3 text-sm border
            ${
              isDark
                ? "bg-red-500/10 border-red-500/30 text-red-300"
                : "bg-red-50 border-red-200 text-red-600"
            }
            `}
          >
            {error}
          </div>

        )}

        {/* SUCCESS */}

        {responseData && (

          <div
            className={`
            mt-5 rounded-xl px-4 py-4 text-sm border
            ${
              isDark
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-emerald-50 border-emerald-200 text-emerald-700"
            }
            `}
          >
            Agregado a la campaña correctamente
          </div>

        )}

        {/* BUTTON */}

        <div className="mt-8 flex justify-end">

          <button
            type="submit"
            disabled={
              loading ||
              !personaData
            }
            className={redButtonClass}
          >

            {loading
              ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                  Procesando...
                </>
              )
              : (
                <>
                  <UserCheck  size={18} />
                  Agregar Agente
                </>
              )
            }

          </button>

        </div>

      </motion.form>

    </div>
  )
}