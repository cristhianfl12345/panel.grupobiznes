// front/src/pages/AgregarAgente.jsx

"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"

import {
  FileText,
  Clock3,
  ShieldCheck,
  Loader2,
  User,
  KeyRound,
  Search,
  UserCheck,
} from "lucide-react"

import { INDICE_CAMPS } from "../context/indiceCamps"

const API_URL = "http://192.168.9.115:4000"

export default function AgregarAgente({ user }) {

  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  )

  useEffect(() => {

    const handleStorage = () => {

      const theme =
        localStorage.getItem("theme") === "dark"

      setIsDark(theme)

    }

    window.addEventListener(
      "storage",
      handleStorage
    )

    return () => {

      window.removeEventListener(
        "storage",
        handleStorage
      )

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
const token = localStorage.getItem("token")
      setSearchingDni(true)

      setError("")
      setPersonaData(null)
      setResponseData(null)

      const res = await fetch(
        `${API_URL}/api/agentes/persona/${form.numero_documento}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
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
      const token = localStorage.getItem("token")

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
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
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

  const cardClass = `
    relative overflow-hidden
    rounded-[28px]
    border
    p-5
    transition-all
    shadow-xl
    ${
      isDark
        ? `
          border-[#343746]
          bg-gradient-to-br
          from-[#232530]
          to-[#1C1D25]
        `
        : `
          border-slate-200
          bg-gradient-to-br
          from-white
          to-slate-50
        `
    }
  `

  const inputClass = `
    h-12 w-full rounded-2xl
    border pl-12 pr-4
    text-sm font-semibold
    outline-none
    transition-all
    shadow-lg
    ${
      isDark
        ? `
          border-[#3B3E4E]
          bg-[#2A2C38]
          text-white
          placeholder:text-slate-500
          hover:border-blue-500/40
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-500/20
        `
        : `
          border-slate-200
          bg-white
          text-slate-700
          hover:border-slate-300
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-100
        `
    }
  `

  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div
      className={`
        transition-all duration-500
        ${isDark ? "text-white" : "text-slate-800"}
      `}
    >


      {/* FORM */}

      <motion.form
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        onSubmit={handleSubmit}
        className={`
          relative overflow-hidden
          rounded-[34px]
          border
          p-6
          shadow-[0_25px_80px_rgba(0,0,0,0.25)]
          ${
            isDark
              ? `
                border-[#343746]
                bg-[#1B1C24]
              `
              : `
                border-slate-200
                bg-white
              `
          }
        `}
      >

        <div
          className="
            absolute top-0 right-0
            h-80 w-80 rounded-full blur-3xl opacity-10
            bg-blue-500
            pointer-events-none
          "
        />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

          {/* DNI */}

<motion.div
  whileHover={{ y: -2 }}
  className={cardClass}
>

  <Glow color="bg-blue-500" />

  <Label
    icon={FileText}
    text="Documento"
    isDark={isDark}
    iconColor="text-blue-400"
  />

  <div className="flex gap-3">

    <div className="relative flex-1">

      <InputIcon
        icon={FileText}
        gradient="from-blue-600 to-indigo-500"
        shadow="shadow-blue-500/30"
      />

      <input
        type="text"
        name="numero_documento"
        maxLength={8}
        value={form.numero_documento}
        onChange={handleChange}
        disabled={searchingDni}
        placeholder="Ingrese DNI"
        className={inputClass}
        required
      />

      {searchingDni && (
        <Loader2
          className="
            absolute right-4 top-1/2
            -translate-y-1/2
            animate-spin text-blue-500
          "
          size={18}
        />
      )}

    </div>

    <motion.button
      whileHover={{
        scale: 1.03,
        y: -1
      }}
      whileTap={{
        scale: 0.96
      }}
      type="button"
      onClick={handleBuscarPersona}
      disabled={
        searchingDni ||
        form.numero_documento.length !== 8
      }
      className="
        flex items-center gap-2
        rounded-2xl
        bg-gradient-to-r
        from-green-700
        via-emerald-500
        to-green-500
        px-5
        text-sm font-bold text-white
        shadow-2xl shadow-green-500/30
        transition-all
        hover:shadow-green-500/50
        disabled:opacity-50 cursor-pointer
      "
    >

      <Search size={18} />

      Buscar

    </motion.button>

  </div>

</motion.div>

{/* NOMBRE */}

<Card isDark={isDark}>

  <Glow color="bg-blue-500" />

  <Label
    icon={User}
    text="Nombre"
    isDark={isDark}
    iconColor="text-blue-400"
  />

  <div className="relative">

    <InputIcon
      icon={User}
      gradient="from-blue-600 to-indigo-500"
      shadow="shadow-blue-500/30"
    />

    <input
      type="text"
      value={form.nombre}
      disabled
      className={`
        ${inputClass}
        opacity-80
        cursor-not-allowed
        uppercase
      `}
    />

  </div>

</Card>

{/* USUARIO */}

<Card isDark={isDark}>

  <Glow color="bg-cyan-500" />

  <Label
    icon={UserCheck}
    text="Usuario"
    isDark={isDark}
    iconColor="text-cyan-400"
  />

  <div className="relative">

    <InputIcon
      icon={UserCheck}
      gradient="from-cyan-500 to-sky-500"
      shadow="shadow-cyan-500/30"
    />

    <input
      type="text"
      value={form.usuario}
      disabled
      className={`
        ${inputClass}
        opacity-80
        cursor-not-allowed
        uppercase
      `}
    />

  </div>

</Card>

{/* PASSWORD */}

<Card isDark={isDark}>

  <Glow color="bg-amber-500" />

  <Label
    icon={KeyRound}
    text="Contraseña"
    isDark={isDark}
    iconColor="text-amber-400"
  />

  <div className="relative">

    <InputIcon
      icon={KeyRound}
      gradient="from-amber-500 to-yellow-500"
      shadow="shadow-amber-500/30"
    />

    <input
      type="text"
      value={form.password}
      disabled
      className={`
        ${inputClass}
        opacity-80
        cursor-not-allowed
        uppercase
      `}
    />

  </div>

</Card>

{/* CAMPAÑA */}

<Card isDark={isDark}>

  <Glow color="bg-cyan-500" />

  <Label
    icon={ShieldCheck}
    text="Campaña"
    isDark={isDark}
    iconColor="text-cyan-400"
  />

  <div className="relative">

    <InputIcon
      icon={ShieldCheck}
      gradient="from-cyan-500 to-sky-500"
      shadow="shadow-cyan-500/30"
    />

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
        opacity-80
        cursor-not-allowed
        font-bold
      `}
    />

  </div>

</Card>

{/* HORA ENTRADA */}

<Card isDark={isDark}>

  <Glow color="bg-slate-500" />

  <Label
    icon={Clock3}
    text="Hora Entrada"
    isDark={isDark}
    iconColor="text-slate-400"
  />

  <div className="relative">

    <InputIcon
      icon={Clock3}
      gradient="from-slate-600 to-slate-500"
      shadow="shadow-slate-500/30"
    />

    <input
      type="time"
      name="hora_in"
      value={form.hora_in}
      onChange={handleChange}
      className={inputClass}
      required
    />

  </div>

</Card>

{/* HORA SALIDA */}

<Card isDark={isDark}>

  <Glow color="bg-slate-500" />

  <Label
    icon={Clock3}
    text="Hora Salida"
    isDark={isDark}
    iconColor="text-slate-400"
  />

  <div className="relative">

    <InputIcon
      icon={Clock3}
      gradient="from-slate-600 to-slate-500"
      shadow="shadow-slate-500/30"
    />

    <input
      type="time"
      name="hora_out"
      value={form.hora_out}
      onChange={handleChange}
      className={inputClass}
      required
    />

  </div>

</Card>
</div>

        {/* ERROR */}

        {error && (

          <motion.div
            initial={{
              opacity: 0,
              y: 8
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className={`
              mt-6 rounded-2xl border px-5 py-4
              text-sm font-semibold
              shadow-lg
              ${
                isDark
                  ? `
                    border-red-500/30
                    bg-red-500/10
                    text-red-300
                  `
                  : `
                    border-red-200
                    bg-red-50
                    text-red-600
                  `
              }
            `}
          >
            {error}
          </motion.div>

        )}

        {/* SUCCESS */}

        {responseData && (

          <motion.div
            initial={{
              opacity: 0,
              y: 8
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className={`
              mt-6 rounded-2xl border px-5 py-4
              text-sm font-semibold
              shadow-lg
              ${
                isDark
                  ? `
                    border-emerald-500/30
                    bg-emerald-500/10
                    text-emerald-300
                  `
                  : `
                    border-emerald-200
                    bg-emerald-50
                    text-emerald-700
                  `
              }
            `}
          >
            Agregado a la campaña correctamente
          </motion.div>

        )}

        {/* FOOTER */}

        <div className="mt-8 flex justify-end">

          <motion.button
            whileHover={{
              scale: 1.03,
              y: -1
            }}
            whileTap={{
              scale: 0.96
            }}
            type="submit"
            disabled={
              loading ||
              !personaData
            }
            className="
              flex items-center gap-2
              rounded-2xl
              bg-gradient-to-r
              from-emerald-700
              via-emerald-500
              to-green-500
              px-6 py-3
              text-sm font-bold text-white
              shadow-2xl shadow-green-500/30
              transition-all
              hover:shadow-green-500/50
              disabled:opacity-50 cursor-pointer
            "
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
                  <UserCheck size={18} />
                  Agregar Agente
                </>
              )
            }

          </motion.button>

        </div>

      </motion.form>

    </div>
  )
}

/* ========================================================= */
/* COMPONENTS */
/* ========================================================= */

function Card({
  children,
  isDark
}) {

  return (

    <motion.div
      whileHover={{ y: -2 }}
      className={`
        relative overflow-hidden
        rounded-[28px]
        border
        p-5
        transition-all
        shadow-xl
        ${
          isDark
            ? `
              border-[#343746]
              bg-gradient-to-br
              from-[#232530]
              to-[#1C1D25]
            `
            : `
              border-slate-200
              bg-gradient-to-br
              from-white
              to-slate-50
            `
        }
      `}
    >
      {children}
    </motion.div>

  )
}

function Glow({ color }) {

  return (

    <div
      className={`
        absolute top-0 right-0
        h-28 w-28 rounded-full
        blur-3xl opacity-20
        ${color}
      `}
    />

  )
}

function Label({
  icon: Icon,
  text,
  isDark,
  iconColor = "text-blue-500"
}) {

  return (

    <label
      className={`
        mb-3 flex items-center gap-2
        text-sm font-black uppercase tracking-wide
        ${
          isDark
            ? "text-slate-300"
            : "text-slate-700"
        }
      `}
    >

      <Icon
        size={16}
        className={iconColor}
      />

      {text}

    </label>

  )
}

function InputIcon({
  icon: Icon,
  gradient = "from-blue-600 to-cyan-500",
  shadow = "shadow-blue-500/30"
}) {

  return (

    <div
      className={`
        absolute left-3 top-1/2
        flex h-7 w-7
        -translate-y-1/2
        items-center justify-center
        rounded-lg
        bg-gradient-to-br
        ${gradient}
        text-white
        shadow-lg
        ${shadow}
      `}
    >

      <Icon size={14} />

    </div>

  )
}