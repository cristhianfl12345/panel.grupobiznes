//front/src/pages/RegistroAgente.jsx

"use client"

import { useMemo, useState, useEffect } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"

import {
  Search,
  User2,
  MapPin,
  CalendarDays,
  FileText,
  IdCard,
  AlertTriangle,
  UserCircle2,
  Save,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  BriefcaseBusiness
} from "lucide-react"

import { useLocalTheme } from "../context/useLocalTheme"

const API = "http://192.168.9.115:4000/api"
//const API = "http://192.168.9.115:4000/api"

// =========================
// AUTH
// =========================
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

// =========================
// EMPTY FORM
// =========================
const EMPTY_FORM = {
  nombres: "",
  ap_pat: "",
  ap_mat: "",
  direccion: "",
  fecha_nacimiento: "",
  cadena: "",
  sexo: "N"
}

export default function RegistroAgente() {

  const { theme } = useLocalTheme()

  const isDark = theme === "dark"

  const currentYear = new Date().getFullYear()

  const years = useMemo(() => {

    const arr = []

    for (let i = currentYear; i >= 1940; i--) {
      arr.push(i)
    }

    return arr

  }, [currentYear])

  const days = Array.from({ length: 31 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  )

  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  )

  // =========================
  // STATES
  // =========================
  const [tipoDocumento, setTipoDocumento] = useState("DNI")

  const [numeroDocumento, setNumeroDocumento] = useState("")

  const [loading, setLoading] = useState(false)

  const [saving, setSaving] = useState(false)

  const [notFound, setNotFound] = useState(false)

  const [errorMessage, setErrorMessage] = useState("")

  const [successMessage, setSuccessMessage] = useState("")

  const [fechaAutoCompleta, setFechaAutoCompleta] = useState(false)

  const [fechaManual, setFechaManual] = useState({
    dia: "",
    mes: "",
    anio: ""
  })

  const [form, setForm] = useState(EMPTY_FORM)
  //nuevos fields usuario y contraseña
  const [cargo, setCargo] = useState("Seleccione cargo")

const [credenciales, setCredenciales] = useState({
  usuario: "",
  password: ""
})

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {

    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // =========================
  // FECHA MANUAL
  // =========================
  const handleFechaManual = (field, value) => {

    const updated = {
      ...fechaManual,
      [field]: value
    }

    setFechaManual(updated)

    if (
      updated.dia &&
      updated.mes &&
      updated.anio
    ) {
      setFechaAutoCompleta(false)

      setForm(prev => ({
        ...prev,
        fecha_nacimiento: `${updated.dia}/${updated.mes}/${updated.anio}`
      }))
    }
  }

  // =========================
  // CAMBIO TIPO DOC
  // =========================
  const handleTipoDocumento = (value) => {

    setTipoDocumento(value)

    setNumeroDocumento("")

    setNotFound(false)

    setErrorMessage("")

    setSuccessMessage("")

    setFechaManual({
      dia: "",
      mes: "",
      anio: ""
    })
    setFechaAutoCompleta(false)

    setForm(EMPTY_FORM)
  }

  // =========================
  // BUSCAR DNI
  // =========================
  const buscarDni = async () => {

    setErrorMessage("")
    setSuccessMessage("")

    if (tipoDocumento !== "DNI") {
      return
    }

    if (!numeroDocumento || numeroDocumento.length !== 8) {

      setErrorMessage(
        "El DNI debe tener exactamente 8 dígitos"
      )

      return
    }

    try {

      setLoading(true)

      setNotFound(false)

      const { headers } = getAuthConfig()

      const res = await axios.get(
        `${API}/detalle-persona/${numeroDocumento}`,
        { headers }
      )

      const data = res.data.data

      setForm({
        nombres: data.nombres || "",
        ap_pat: data.ap_pat || "",
        ap_mat: data.ap_mat || "",
        direccion: data.direccion || "",
        fecha_nacimiento: data.fecha_nacimiento || "",
        cadena: data.cadena || "",
        sexo: "N"
      })

      setFechaAutoCompleta(true)

      setFechaManual({
        dia: "",
        mes: "",
        anio: ""
      })

    } catch (error) {

      console.error(error)

      setForm({
        
        ...EMPTY_FORM
      })
      setFechaAutoCompleta(false)

      setFechaManual({
        dia: "",
        mes: "",
        anio: ""
      })

      if (error?.response?.status === 404) {

        setNotFound(true)

      } else {

        setErrorMessage(
          error?.response?.data?.message ||
          "Error obteniendo datos"
        )

      }

    } finally {

      setLoading(false)

    }
  }

  // =========================
  // GUARDAR
  // =========================
  const guardarPersona = async () => {

    try {

      setSaving(true)

      setErrorMessage("")
      setSuccessMessage("")
      setFechaAutoCompleta(false)

      if (
        tipoDocumento === "DNI" &&
        numeroDocumento.length !== 8
      ) {

        setErrorMessage(
          "El DNI debe tener exactamente 8 dígitos"
        )

        return
      }

      const { headers } = getAuthConfig()

      // =========================
      // ULTIMA PALABRA DESPUES
      // DEL ULTIMO GUION
      // =========================
      let distritoFinal = ""

      if (form.cadena) {

        const partes = form.cadena
          .split("-")
          .map(p => p.trim())
          .filter(Boolean)

        distritoFinal = partes[partes.length - 1] || ""
      }

      // =========================
      // DIRECCION CONCATENADA
      // =========================
      const direccionCompleta = [
        form.direccion,
        distritoFinal
      ]
        .filter(Boolean)
        .join(" - ")

      const payload = {
  tipo_documento: tipoDocumento,
  numero_documento: numeroDocumento,
  nombres: form.nombres,
  ape_paterno: form.ap_pat,
  ape_materno: form.ap_mat,
  fecha_nacimiento: form.fecha_nacimiento || null,
  sexo: form.sexo,
  direccion: direccionCompleta,
  estado: true,
  cargo
}
      await axios.post(
        `${API}/crear-persona`,
        payload,
        { headers }
      )
      // =========================
// CREAR AGENTE
// =========================
if (cargo === "AGENTE") {
const token = localStorage.getItem("token")
  const body = {
    usuario: credenciales.usuario,
    password: credenciales.password,
    id_plataforma: 4,
    numero_documento: numeroDocumento,
    hora_in: "08:00",
  hora_out: "22:00",
  id_campana: 0
  }

  await fetch(
    `${API}/agentes/crear-agente`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    }
  )
}

      setSuccessMessage(
        "Persona registrada correctamente"
      )

      setNumeroDocumento("")

      setNotFound(false)

      setFechaManual({
        dia: "",
        mes: "",
        anio: ""
      })

      setForm(EMPTY_FORM)

    } catch (error) {

      console.error(error)

      const msg =
        error?.response?.data?.message ||
        "Error registrando persona"

      if (
        msg.toLowerCase().includes("registrado") ||
        msg.toLowerCase().includes("duplicate")
      ) {

        setErrorMessage(
          "El DNI ya se encuentra registrado"
        )

      } else {

        setErrorMessage(msg)

      }

    } finally {

      setSaving(false)

    }
  }
  // para el cargo, generar user y contra
  useEffect(() => {

  if (cargo !== "AGENTE") {

    setCredenciales({
      usuario: "",
      password: ""
    })

    return
  }

  const nombres =
    form.nombres?.trim() || ""

  const apePaterno =
    form.ap_pat?.trim() || ""

  if (!nombres || !apePaterno || !numeroDocumento) {
    return
  }

  const usuario = (
    nombres.charAt(0).toLowerCase() +
    apePaterno.toLowerCase() +
    numeroDocumento.substring(0, 3) +
    "@"
  ).replace(/\s+/g, "")

  const password =
    `${numeroDocumento}_${apePaterno.substring(0, 2).toLowerCase()}`

  setCredenciales({
    usuario: usuario.toUpperCase(),
    password: password.toUpperCase()
  })

}, [
  cargo,
  form.nombres,
  form.ap_pat,
  numeroDocumento
])

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
          isDark
            ? "text-slate-400 font-semibold"
            : "text-slate-500 font-semibold"
        }`}>
          EMPRESA / Personal /{" "}
          <span className="font-semibold text-gray-500">
            Registro Agente
          </span>
        </span>
      </div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          rounded-2xl overflow-hidden shadow-md
          ${isDark ? "bg-slate-900" : "bg-white"}
        `}
      >

        {/* HEADER */}
        <div className={`
          px-6 py-5 border-b
          ${isDark ? "border-slate-700" : "border-slate-200"}
        `}>

          <div className="flex items-center gap-3">

            <div className={`
              p-3 rounded-xl
              ${isDark
                ? "bg-slate-500/10 text-slate-400"
                : "bg-slate-100 text-slate-600"
              }
            `}>
              <IdCard size={22} />
            </div>

            <div>
              <h1 className="text-xl font-bold">
                Registro de personal
              </h1>

              <p className={`
                text-sm mt-1
                ${isDark ? "text-slate-400" : "text-slate-500"}
              `}>
                Formulario para registro de trabajador
              </p>
            </div>

          </div>

        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">

          {/* SEARCH */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* TIPO DOCUMENTO */}
            <div>

              <label className={`
                text-sm mb-2 block font-medium
                ${isDark ? "text-slate-300" : "text-slate-600"}
              `}>
                Tipo Documento
              </label>

              <select
                value={tipoDocumento}
                onChange={(e) =>
                  handleTipoDocumento(e.target.value)
                }
                className={`
                  w-full rounded-xl border px-4 py-3 outline-none transition
                  ${isDark
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-slate-300 text-slate-800"
                  }
                `}
              >
                <option value="DNI">DNI</option>
                <option value="CE">CE</option>
                <option value="Pasaporte">Pasaporte</option>
              </select>

            </div>

            {/* NUMERO DOCUMENTO */}
            <div>

              <label className={`
                text-sm mb-2 block font-medium
                ${isDark ? "text-slate-300" : "text-slate-600"}
              `}>
                Número Documento
              </label>

              <input
                type="text"
                maxLength={tipoDocumento === "DNI" ? 8 : 20}
                value={numeroDocumento}
                onChange={(e) =>
                  setNumeroDocumento(e.target.value)
                }
                placeholder="Ingrese documento"
                className={`
                  w-full rounded-xl border px-4 py-3 outline-none transition
                  ${isDark
                    ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-red-500"
                    : "bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-red-500"
                  }
                `}
              />

            </div>

            {/* BOTON */}
            <div className="flex items-end">

              {tipoDocumento === "DNI" && (
                <button
                  onClick={buscarDni}
                  disabled={loading}
                  className="
                    h-[48px]
                    w-full
                    px-6
                    rounded-xl
                    bg-red-500 hover:bg-red-600
                    text-white
                    font-medium
                    flex items-center justify-center gap-2
                    transition
                    disabled:opacity-60
                  "
                >
                  <Search size={18} />

                  {loading ? "Buscando..." : "Buscar DNI"}

                </button>
              )}

            </div>

          </div>

          {/* ERROR MESSAGE */}
          <AnimatePresence>

            {errorMessage && (

              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`
                  rounded-xl border px-4 py-3 flex items-center gap-3
                  ${isDark
                    ? "bg-red-500/10 border-red-500/20 text-red-300"
                    : "bg-red-50 border-red-200 text-red-700"
                  }
                `}
              >

                <AlertCircle size={18} />

                <span className="text-sm font-medium">
                  {errorMessage}
                </span>

              </motion.div>

            )}

          </AnimatePresence>

          {/* SUCCESS MESSAGE */}
          <AnimatePresence>

            {successMessage && (

              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`
                  rounded-xl border px-4 py-3 flex items-center gap-3
                  ${isDark
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                    : "bg-emerald-50 border-emerald-200 text-emerald-700"
                  }
                `}
              >

                <CheckCircle2 size={18} />

                <span className="text-sm font-medium">
                  {successMessage}
                </span>

              </motion.div>

            )}

          </AnimatePresence>

          {/* ALERT */}
          <AnimatePresence>

            {notFound && (

              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`
                  rounded-xl border px-4 py-3 flex items-center gap-3
                  ${isDark
                    ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-300"
                    : "bg-yellow-50 border-yellow-200 text-yellow-700"
                  }
                `}

              >

                <AlertTriangle size={18} />

                <span className="text-sm font-medium">
                  No se encontraron datos del personal, registrar manualmente.
                </span>

              </motion.div>

            )}

          </AnimatePresence>

          {/* FORM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* CARGO */}
<div>

  <label className={`
    mb-2 text-sm font-medium flex items-center gap-2
    ${isDark ? "text-slate-300" : "text-slate-600"}
  `}>
    <BriefcaseBusiness size={18} />
    Cargo
  </label>

  <select
    value={cargo}
    onChange={(e) => setCargo(e.target.value)}
    className={`
      w-full rounded-xl border px-4 py-3 outline-none transition

      ${isDark
        ? "bg-slate-800 border-slate-700 text-white"
        : "bg-white border-slate-300 text-slate-800"
      }
    `}
  >

    <option value="AGENTE">
      Agente
    </option>

    <option value="Seleccione cargo" disabled>
      Seleccione cargo
    </option>

  </select>

</div>

            <Field
              icon={<User2 size={18} />}
              label="Nombres"
              name="nombres"
              value={form.nombres}
              onChange={handleChange}
              isDark={isDark}
            />

            <Field
              icon={<User2 size={18} />}
              label="Apellido Paterno"
              name="ap_pat"
              value={form.ap_pat}
              onChange={handleChange}
              isDark={isDark}
            />

            <Field
              icon={<User2 size={18} />}
              label="Apellido Materno"
              name="ap_mat"
              value={form.ap_mat}
              onChange={handleChange}
              isDark={isDark}
            />

{cargo === "AGENTE" && (
  <>
    {/* USUARIO */}
    <div>

      <label className={`
        mb-2 text-sm font-medium flex items-center gap-2
        ${isDark ? "text-slate-300" : "text-slate-600"}
      `}>
        <User2 size={18} />
        Usuario
      </label>

      <input
        type="text"
        value={credenciales.usuario}
        disabled
        className={`
          w-full rounded-xl border px-4 py-3 outline-none
          opacity-70 cursor-not-allowed font-semibold uppercase

          ${isDark
            ? "bg-slate-800 border-green-700 text-white"
            : "bg-white border-green-400 text-slate-800"
          }
        `}
      />

    </div>

    {/* PASSWORD */}
    <div>

      <label className={`
        mb-2 text-sm font-medium flex items-center gap-2
        ${isDark ? "text-slate-300" : "text-slate-600"}
      `}>
        <KeyRound size={18} />
        Contraseña
      </label>

      <input
        type="text"
        value={credenciales.password}
        disabled
        className={`
          w-full rounded-xl border px-4 py-3 outline-none
          opacity-70 cursor-not-allowed font-semibold uppercase

          ${isDark
            ? "bg-slate-800 border-green-700 text-white"
            : "bg-white border-green-400 text-slate-800"
          }
        `}
      />

    </div>
  </>
)}
            {/* SEXO */}
            <div>

              <label className={`
                mb-2 text-sm font-medium flex items-center gap-2
                ${isDark ? "text-slate-300" : "text-slate-600"}
              `}>
                <UserCircle2 size={18} />
                Sexo
              </label>

              <select
                name="sexo"
                value={form.sexo}
                onChange={handleChange}
                className={`
                  w-full rounded-xl border px-4 py-3 outline-none transition

                  ${isDark
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-slate-300 text-slate-800"
                  }
                `}
              >
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="N">No especificado</option>
              </select>

            </div>

            {/* FECHA */}
            <div className="md:col-span-2">

              <label className={`
                mb-2 text-sm font-medium flex items-center gap-2
                ${isDark ? "text-slate-300" : "text-slate-600"}
              `}>
                <CalendarDays size={18} />
                Fecha Nacimiento
              </label>

              {fechaAutoCompleta ? (

                <input
                  type="text"
                  value={form.fecha_nacimiento}
                  disabled
                  className={`
                    w-full rounded-xl border px-4 py-3 outline-none transition opacity-70 cursor-not-allowed

                    ${isDark
                      ? "bg-slate-800 border-slate-700 text-white"
                      : "bg-white border-slate-300 text-slate-800"
                    }
                  `}
                />

              ) : (

                <div className="grid grid-cols-3 gap-2">

                  <select
                    value={fechaManual.dia}
                    onChange={(e) =>
                      handleFechaManual("dia", e.target.value)
                    }
                    className={`
                      rounded-xl border px-3 py-3 outline-none transition
                      ${isDark
                        ? "bg-slate-800 border-slate-700 text-white"
                        : "bg-white border-slate-300 text-slate-800"
                      }
                    `}
                  >
                    <option value="">Día</option>

                    {days.map(day => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}

                  </select>

                  <select
                    value={fechaManual.mes}
                    onChange={(e) =>
                      handleFechaManual("mes", e.target.value)
                    }
                    className={`
                      rounded-xl border px-3 py-3 outline-none transition
                      ${isDark
                        ? "bg-slate-800 border-slate-700 text-white"
                        : "bg-white border-slate-300 text-slate-800"
                      }
                    `}
                  >
                    <option value="">Mes</option>

                    {months.map(month => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}

                  </select>

                  <select
                    value={fechaManual.anio}
                    onChange={(e) =>
                      handleFechaManual("anio", e.target.value)
                    }
                    className={`
                      rounded-xl border px-3 py-3 outline-none transition
                      ${isDark
                        ? "bg-slate-800 border-slate-700 text-white"
                        : "bg-white border-slate-300 text-slate-800"
                      }
                    `}
                  >
                    <option value="">Año</option>

                    {years.map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}

                  </select>

                </div>

              )}

            </div>

            {/* DIRECCION */}
            <div className="md:col-span-2">

              <Field
                icon={<MapPin size={18} />}
                label="Dirección"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                isDark={isDark}
              />

            </div>

            {/* CADENA */}
            <div className="md:col-span-2">

              <Field
                icon={<FileText size={18} />}
                label="DEPARTAMENTO - PROVINCIA - DISTRITO"
                name="cadena"
                value={form.cadena}
                onChange={handleChange}
                isDark={isDark}
              />

            </div>

          </div>

          {/* ACTIONS */}
          <div className="flex justify-end">

            <button
              onClick={guardarPersona}
              disabled={saving}
              className="
                px-6 py-3 rounded-xl
                bg-emerald-500 hover:bg-emerald-600
                text-white font-medium
                flex items-center gap-2
                transition
                disabled:opacity-60
              "
            >
              <Save size={18} />

              {saving ? "Guardando..." : "Registrar Persona"}

            </button>

          </div>

        </div>

      </motion.div>

    </div>
  )
}

// =========================
// FIELD
// =========================
function Field({
  icon,
  label,
  name,
  value,
  onChange,
  isDark,
  disabled = false,
  className = ""
}) {

  return (
    <div>

      <label className={`
        mb-2 text-sm font-medium flex items-center gap-2
        ${isDark ? "text-slate-300" : "text-slate-600"}
      `}>
        {icon}
        {label}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full rounded-xl border px-4 py-3 outline-none transition

          ${isDark
            ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-red-500"
            : "bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-red-500"
          }

          ${disabled
            ? "opacity-60 cursor-not-allowed"
            : ""
          }

          ${className}
        `}
      />

    </div>
  )
}