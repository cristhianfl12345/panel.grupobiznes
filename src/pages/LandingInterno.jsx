"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import axios from "axios"

import {
  CalendarDays,
  Loader2,
  User2,
  Phone,
  Mail,
  MapPin,
  FileText,
  ShieldCheck,
  Briefcase,
  Boxes,
  Layers3,
  BadgeCheck,
  CheckCircle2,
  ChevronRight,
  Home,
  Info,
  X,
  BookOpen,
  Search
} from "lucide-react"
import { CgInsertAfterO } from "react-icons/cg"
import { motion, AnimatePresence } from "framer-motion"

import { INDICE_CAMPS } from "../context/indiceCamps"

const API = "http://192.168.9.115:4000/api/landing-interno"
//const API = "http://192.168.9.115:4000/api/landing-interno"

export default function LandingInterno() {

  // =====================================================
  // THEME
  // =====================================================

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

  // =====================================================
  // USER
  // =====================================================

  const [user, setUser] = useState(null)

  useEffect(() => {

    const storedUser = localStorage.getItem("user")

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

  }, [])

  const nroDoc = user?.nro_doc || ""
  const nombres = user?.nombres || ""
  const apellidos = user?.apellidos || ""
  const fullname = `${nombres} ${apellidos}`.trim()

  // =====================================================
  // QUERY PARAMS
  // =====================================================

  const [searchParams] = useSearchParams()

  const camp = searchParams.get("camp")

  // =====================================================
  // INDICE CAMPAÑAS
  // =====================================================

  const campInfo = INDICE_CAMPS.find(
    c => String(c.id_camp) === String(camp)
  )

  const nombreCampania =
    campInfo?.campania ||
    campInfo?.Campana ||
    campInfo?.nombre ||
    campInfo?.descripcion ||
    `Campaña ${camp}`

  // =====================================================
  // DATE DEFAULT
  // =====================================================

  const hoy = new Date().toISOString().split("T")[0]

  // =====================================================
  // STATES
  // =====================================================

  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  const [tiposBase, setTiposBase] = useState([])

  const [campanias, setCampanias] = useState([])
  const [productos, setProductos] = useState([])

  const [success, setSuccess] = useState(false)
  const [openInfo, setOpenInfo] = useState(false)
  // IDKEY
  const [idOrigen, setIdOrigen] = useState("")
  const [telefonoOrigen, setTelefonoOrigen] = useState("")
  const [loadingTelefono, setLoadingTelefono] = useState(false)
  const [busquedaRealizada, setBusquedaRealizada] = useState(false)

  const [form, setForm] = useState({
    fecha_ingreso: hoy,

    nombres: "",
    apellidos: "",
    dni: "",
    telefono: "",
    email: "",
    provincia: "",
    comentario: "",
    permitellamada: 0,

    id_tipobase: "",

    campania: "",
    producto: "",
    id_anuncio: ""
  })

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {

    if (!camp) return

    loadData()

  }, [camp])

  const loadData = async () => {

    try {
const token = localStorage.getItem("token")
      setLoadingData(true)

      const [
        campaniaRes,
        tiposBaseRes
      ] = await Promise.all([
        axios.get(`${API}/campania?camp=${camp}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),
        axios.get(`${API}/tipos-base?camp=${camp}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      ])

      const campaniaData = campaniaRes.data.data

      const campArray = Array.isArray(campaniaData)
        ? campaniaData
        : [campaniaData]

      // ===============================================
      // REMOVE DUPLICATES
      // ===============================================

      const campaniasDisponibles = [
        ...new Set(
          campArray
            .map(item => item?.inicampania)
            .filter(Boolean)
        )
      ]

      const productosDisponibles = [
        ...new Set(
          campArray
            .map(item => item?.producto)
            .filter(Boolean)
        )
      ]

      setCampanias(campaniasDisponibles)

      setProductos(productosDisponibles)

      setTiposBase(tiposBaseRes.data.data || [])

      setForm(prev => ({
        ...prev,
        campania: campaniasDisponibles[0] || "",
        producto: productosDisponibles[0] || ""
      }))

    } catch (error) {

      console.error(error)

      alert("Error cargando información")

    } finally {

      setLoadingData(false)
    }
  }

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target

    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // =====================================================
  // BUSCAR TELEFONO POR IDKEY
  // =====================================================

  const buscarTelefono = async () => {

    try {

      if (!idOrigen.trim()) {
        alert("Ingrese un Id origen")
        return
      }
      setBusquedaRealizada(false)

      setLoadingTelefono(true)

      const { data } = await axios.get(
        `${API}/telefono/${idOrigen}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const telefono =
  data?.data?.numero_telefono || ""

const idkey =
  data?.data?.idkey || ""

setTelefonoOrigen(telefono)

setForm(prev => ({
  ...prev,
  
  id_anuncio: idkey
}))
      setBusquedaRealizada(true)


    } catch (error) {

      console.error(error)

      setTelefonoOrigen("")
      setBusquedaRealizada(true)

      alert(
        error?.response?.data?.message ||
        "Error buscando teléfono"
      )

    } finally {

      setLoadingTelefono(false)
    }
  }
  // =====================================================
  // SUBMIT
  // =====================================================

const handleSubmit = async (e) => {

  e.preventDefault()

  try {
    const token = localStorage.getItem("token")

    setLoading(true)

    await axios.post(`${API}/crear`, {
      ...form,
      permitellamada: form.permitellamada ? 1 : 0,
      idcampania: camp,
      idusuario: nroDoc,
      id_anuncio: idOrigen,
      headers: {
        Authorization: `Bearer ${token}`
      }
    }, {
      
    })

    // =========================================
    // ALERT SUCCESS
    // =========================================

    alert("Lead añadido correctamente")

    setSuccess(true)

    setTimeout(() => {
      setSuccess(false)
    }, 2500)

    setForm(prev => ({
      ...prev,
      fecha_ingreso: hoy,
      nombres: "",
      apellidos: "",
      dni: "",
      telefono: "",
      email: "",
      provincia: "",
      comentario: "",
      permitellamada: 0,
      id_tipobase: ""
    }))

  } catch (error) {

    console.error(error)

    alert(
      error?.response?.data?.message ||
      "Error registrando lead"
    )

  } finally {

    setLoading(false)
  }
}

  // =====================================================
  // LOADING
  // =====================================================

  if (loadingData) {

    return (
      <div
        className={`
          min-h-screen flex items-center justify-center
          ${isDark ? "bg-[#1F2029]" : "bg-gray-100"}
        `}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Loader2 className="w-14 h-14 text-red-500" />
        </motion.div>
      </div>
    )
  }

  return (

    <div
      className={`
        min-h-screen p-1 transition-colors duration-500
        ${isDark ? "bg-[#1F2029] text-white" : "bg-gray-100 text-black"}
      `}
    >

      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="max-w-6xl mx-auto"
      >

        {/* BREADCRUMB */}

        <div className="mb-2">

          <span
            className={`
              text-xl font-semibold
              ${isDark
                ? "text-white"
                : "text-gray-600"}
            `}
          >

            Operativos /

            <span className="mx-2">
              {nombreCampania}
            </span>

            /

            <span
              className={`
                font-semibold
                ${isDark
                  ? "text-white"
                  : "text-gray-600"}
              `}
            >
              Landing Interno
            </span>

          </span>

        </div>

      {/* MAIN CARD */}

<div
  className={`
    overflow-hidden rounded-3xl border backdrop-blur-xl
    shadow-[0_10px_40px_rgba(0,0,0,0.18)]
    ${isDark
      ? "bg-[#272833] border-[#3A3B47]"
      : "bg-white border-gray-300"}
  `}
>

  {/* HEADER */}

  <div
    className={`
      px-8 py-2 border-b
      flex items-center justify-between
      ${isDark
        ? "border-[#3A3B47] bg-[#1F2029]"
        : "border-gray-200 bg-gray-50"}
    `}
  >

    {/* LEFT */}

    <div className="flex items-center gap-3">

      <CgInsertAfterO className="w-7 h-7 text-red-500" />

      <h2 className="text-2xl font-bold">
        Insertar Leads
      </h2>

    </div>

    {/* RIGHT BUTTON */}

    <motion.button
      type="button"
      whileHover={{
        scale: 1.08
      }}
      whileTap={{
        scale: 0.95
      }}
      onClick={() => setOpenInfo(true)}
      className="
        w-11 h-11 rounded-2xl
        bg-gradient-to-br from-yellow-500 to-yellow-600
        text-white shadow-lg
        flex items-center justify-center
      "
    >

      <Info className="w-5 h-5" />

    </motion.button>

  </div>

  <form
    onSubmit={handleSubmit}
    className="p-8"
  >
    

    {/* SUCCESS */}

    <AnimatePresence>

      {success && (

        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="
            mb-6 flex items-center gap-3
            bg-emerald-500 text-white
            px-5 py-4 rounded-2xl
            shadow-lg
          "
        >
          <CheckCircle2 className="w-5 h-5" />

          <span className="font-medium">
            Lead registrado correctamente
          </span>

        </motion.div>

      )}

    </AnimatePresence>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
{/* USER */}

<InputField
  icon={User2}
  label="Usuario"
>

  <input
    type="text"
    value={`${fullname || "-"} - ${nroDoc || "-"}`}
    disabled
    className={`
      ${inputClass(isDark)}
      opacity-70 cursor-not-allowed
      font-bold
      ${isDark
        ? "bg-[#252632]"
        : "bg-gray-300"}
    `}
  />

</InputField>

{/* FECHA */}

<InputField
  icon={CalendarDays}
  label="Fecha ingreso"
>

  <input
    type="date"
    name="fecha_ingreso"
    value={form.fecha_ingreso}
    onChange={handleChange}
    className={inputClass(isDark)}
  />

</InputField>

         {/* FORM */}



  <InputField
    icon={Layers3}
    label={
      <div className="flex items-center gap-4">
        <span>Origen</span>

        <span
          className={`
            text-[11px] font-medium
            ${isDark
              ? "text-red-400"
              : "text-red-500"}
          `}
        >
          (obligatorio)
        </span>
      </div>
    }
  >
    <select
      name="id_tipobase"
      value={form.id_tipobase}
      onChange={handleChange}
      className={inputClass(isDark)}
    >

      <option value="">
        Seleccione origen
      </option>

      {tiposBase.map((item) => (

        <option
          key={item.id_tipobase}
          value={item.id_tipobase}
        >
          {item.id_tipobase} - {item.medio} - {item.segmento}
        </option>

      ))}

    </select>
  </InputField>

  <InputField
    icon={Briefcase}
    label={
      <div className="flex items-center gap-4">
        <span>IniCampania</span>

        <span
          className={`
            text-[11px] font-medium
            ${isDark
              ? "text-red-400"
              : "text-red-500"}
          `}
        >
          (obligatorio)
        </span>
      </div>
    }
  >
    <select
      name="campania"
      value={form.campania}
      onChange={handleChange}
      className={inputClass(isDark)}
    >

      <option value="">
        Seleccione campaña
      </option>

      {campanias.map((item, index) => (

        <option
          key={index}
          value={item}
        >
          {item}
        </option>

      ))}

    </select>
  </InputField>

  <InputField
    icon={Boxes}
    label={
      <div className="flex items-center gap-4">
        <span>Producto</span>

        <span
          className={`
            text-[11px] font-medium
            ${isDark
              ? "text-red-400"
              : "text-red-500"}
          `}
        >
          (obligatorio)
        </span>
      </div>
    }
  >
    <select
      name="producto"
      value={form.producto}
      onChange={handleChange}
      className={inputClass(isDark)}
    >

      <option value="">
        Seleccione producto
      </option>

      {productos.map((item, index) => (

        <option
          key={index}
          value={item}
        >
          {item}
        </option>

      ))}

    </select>
  </InputField>

  <InputField
    icon={User2}
    label={
      <div className="flex items-center gap-4">
        <span>Nombres</span>

        <span
          className={`
            text-[11px] font-medium
            ${isDark
              ? "text-red-400"
              : "text-red-500"}
          `}
        >
          (obligatorio)
        </span>
      </div>
    }
  >
    <input
      type="text"
      name="nombres"
      value={form.nombres}
      onChange={handleChange}
      className={inputClass(isDark)}
    />
  </InputField>

  <InputField
    icon={User2}
    label="Apellidos"
  >
    <input
      type="text"
      name="apellidos"
      value={form.apellidos}
      onChange={handleChange}
      className={inputClass(isDark)}
    />
  </InputField>

  <InputField
    icon={BadgeCheck}
    label={
      <div className="flex items-center gap-4">
        <span>DNI</span>

        <span
          className={`
            text-[11px] font-medium
            ${isDark
              ? "text-red-400"
              : "text-red-500"}
          `}
        >
          (obligatorio)
        </span>
      </div>
    }
  >
    <input
      type="text"
      name="dni"
      value={form.dni}
      onChange={handleChange}
      className={inputClass(isDark)}
    />
  </InputField>

  <InputField
    icon={Phone}
    label={
      <div className="flex items-center gap-4">
        <span>Teléfono</span>

        <span
          className={`
            text-[11px] font-medium
            ${isDark
              ? "text-red-400"
              : "text-red-500"}
          `}
        >
          (obligatorio)
        </span>
      </div>
    }
  >
    <input
      type="text"
      name="telefono"
      value={form.telefono}
      onChange={handleChange}
      className={inputClass(isDark)}
    />
  </InputField>

  <InputField
    icon={Mail}
    label="Email"
  >
    <input
      type="email"
      name="email"
      value={form.email}
      onChange={handleChange}
      className={inputClass(isDark)}
    />
  </InputField>

  <InputField
    icon={MapPin}
    label="Provincia"
  >
    <input
      type="text"
      name="provincia"
      value={form.provincia}
      onChange={handleChange}
      className={inputClass(isDark)}
    />
  </InputField>
{/* OBSERVACIONES */}


  <InputField
    icon={FileText}
    label="Observaciones"
  >
    <input
      type="text"
      name="comentario"
      value={form.comentario}
      onChange={handleChange}
      className={inputClass(isDark)}
    />
  </InputField>

</div>



{/* ID ORIGEN */}

{Number(form.id_tipobase) === 37 && (

  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mt-6"
  >

    <InputField
      icon={Search}
      label="ID ORIGEN"
    >

      <div className="flex gap-3">

        <input
          type="text"
          value={idOrigen}
          onChange={(e) =>
            setIdOrigen(e.target.value)
          }
          placeholder="Ingrese idkey"
          className={inputClass(isDark)}
        />

        <button
          type="button"
          onClick={buscarTelefono}
          disabled={loadingTelefono}
          className="
            px-5 rounded-2xl
            bg-red-600 hover:bg-red-700
            text-white font-semibold
            flex items-center gap-2
          "
        >

          {loadingTelefono ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}

          Buscar

        </button>

      </div>

    </InputField>

    {/* RESULTADO */}

    {busquedaRealizada && !loadingTelefono && (

  telefonoOrigen ? (

        <div
          className={`
            mt-3 rounded-2xl border px-4 py-3
            text-sm font-semibold
            ${isDark
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-emerald-50 border-emerald-200 text-emerald-700"}
          `}
        >
          Número encontrado: {telefonoOrigen}
        </div>

      ) : (

        <div
          className={`
            mt-3 rounded-2xl border px-4 py-3
            text-sm font-semibold
            ${isDark
              ? "bg-red-500/10 border-red-500/30 text-red-400"
              : "bg-red-50 border-red-200 text-red-700"}
          `}
        >
          No se encontraron resultados
        </div>

      )

    )}

  </motion.div>

)}
        
{/* ID ORIGEN */}

{Number(form.id_tipobase) === 34 && (

  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mt-6"
  >

    <InputField
      icon={Search}
      label="ID_ANUNCIO"
    >

      <div className="flex gap-3">

        <input
          type="text"
          value={idOrigen}
          onChange={(e) =>
            setIdOrigen(e.target.value)
          }
          placeholder="Ingrese idkey"
          className={inputClass(isDark)}
        />

        <button
          type="button"
          onClick={buscarTelefono}
          disabled={loadingTelefono}
          className="
            px-5 rounded-2xl
            bg-red-600 hover:bg-red-700
            text-white font-semibold
            flex items-center gap-2
          "
        >

          {loadingTelefono ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}

          Buscar

        </button>

      </div>

    </InputField>

    {/* RESULTADO */}

    {busquedaRealizada && !loadingTelefono && (

  telefonoOrigen ? (

        <div
          className={`
            mt-3 rounded-2xl border px-4 py-3
            text-sm font-semibold
            ${isDark
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-emerald-50 border-emerald-200 text-emerald-700"}
          `}
        >
          Número encontrado: {telefonoOrigen}
        </div>

      ) : (

        <div
          className={`
            mt-3 rounded-2xl border px-4 py-3
            text-sm font-semibold
            ${isDark
              ? "bg-red-500/10 border-red-500/30 text-red-400"
              : "bg-red-50 border-red-200 text-red-700"}
          `}
        >
          No se encontraron resultados
        </div>

      )

    )}

  </motion.div> )}
            

            {/* CHECKBOX */}

            <motion.div
              whileHover={{ scale: 1.01 }}
              className={`
                mt-8 rounded-2xl border p-5
                flex items-center justify-between
                ${isDark
                  ? "bg-[#1F2029] border-[#3A3B47]"
                  : "bg-gray-50 border-gray-200"}
              `}
            >

              <div>

                <div className="font-semibold text-lg">
                  Autoriza llamada
                </div>

                <div className="text-sm opacity-70 mt-1">
                {/*   Activado = 1 | Desactivado = 0 */}
                </div>

              </div>

              <label className="relative inline-flex items-center cursor-pointer">

                <input
                  type="checkbox"
                  checked={form.permitellamada === 1}
                  onChange={(e) =>
                    setForm(prev => ({
                      ...prev,
                      permitellamada: e.target.checked ? 1 : 0
                    }))
                  }
                  className="sr-only peer"
                />

                <div
                  className="
                    w-16 h-9 bg-gray-300 rounded-full
                    peer peer-checked:bg-emerald-500
                    transition-all duration-300
                    after:content-['']
                    after:absolute after:top-[4px] after:left-[4px]
                    after:bg-white after:w-7 after:h-7
                    after:rounded-full after:transition-all
                    peer-checked:after:translate-x-7
                  "
                />

              </label>

            </motion.div>

            {/* BUTTON */}

            <motion.button
              whileHover={{
                scale: 1.015
              }}
              whileTap={{
                scale: 0.98
              }}
              type="submit"
              disabled={loading}
              className="
                mt-8 w-full py-4 rounded-2xl
                bg-gradient-to-r from-red-600 to-red-900
                hover:from-red-700 hover:to-red-900
                transition-all duration-300
                text-white font-bold text-lg
                flex items-center justify-center gap-3
                shadow-xl disabled:opacity-60
              "
            >

              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Registrando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  Registrar Lead
                </>
              )}

            </motion.button>

          </form>

        </div>

      </motion.div>
      {/* ===================================================== */}
      {/* FLOATING INFO BUTTON */}
      {/* ===================================================== */}

      <AnimatePresence>

        {openInfo && (

          <>

            {/* OVERLAY */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenInfo(false)}
              className="
                fixed inset-0 bg-black/40 z-40
                backdrop-blur-[2px]
              "
            />

            {/* PANEL */}

            <motion.div
              initial={{ x: 420, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 420, opacity: 0 }}
              transition={{
                type: "spring",
                damping: 24,
                stiffness: 260
              }}
              className={`
                fixed top-0 right-0 h-full w-full sm:w-[460px]
                z-50 shadow-2xl border-l
                overflow-hidden
                ${isDark
                  ? "bg-[#272833] border-[#3A3B47]"
                  : "bg-white border-gray-300"}
              `}
            >

              {/* HEADER */}

              <div
                className={`
                  px-6 py-5 border-b
                  flex items-center justify-between
                  ${isDark
                    ? "border-[#3A3B47] bg-[#1F2029]"
                    : "border-gray-200 bg-gray-50"}
                `}
              >

                <div className="flex items-center gap-3">

                  <div
                    className="
                      w-12 h-12 rounded-2xl
                      bg-gradient-to-br from-red-600 to-red-900
                      flex items-center justify-center
                      shadow-lg
                    "
                  >
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>

                  <div>

                    <div className="text-lg font-bold">
                      Información
                    </div>

                    <div className="text-sm opacity-70">
                      Tipos base disponibles
                    </div>

                  </div>

                </div>

                <button
                  onClick={() => setOpenInfo(false)}
                  className={`
                    w-10 h-10 rounded-xl
                    flex items-center justify-center
                    transition-all
                    ${isDark
                      ? "hover:bg-[#3A3B47]"
                      : "hover:bg-gray-200"}
                  `}
                >
                  <X className="w-5 h-5" />
                </button>

              </div>

              {/* BODY */}

              <div className="p-5 overflow-y-auto h-[calc(100%-90px)]">

                <div className="space-y-4">

                  {tiposBase.map((item, index) => (

                    <motion.div
                      key={`${item.id_tipobase}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.03
                      }}
                      className={`
                        rounded-2xl border p-4
                        transition-all duration-300
                        hover:scale-[1.01]
                        ${isDark
                          ? "bg-[#1F2029] border-[#3A3B47]"
                          : "bg-gray-50 border-gray-200"}
                      `}
                    >

                      {/* TOP */}

                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <div
                            className="
                              text-xs uppercase tracking-wider
                              opacity-60 mb-1
                            "
                          >
                            Id_tipobase
                          </div>

                          <div
                            className="
                              text-lg font-semibold
                            "
                          >
                            {item.id_tipobase}
                          </div>

                        </div>

                        <div
                          className="
                            px-3 py-1 rounded-full
                            text-xs font-semibold
                            bg-red-500/10 text-red-500
                          "
                        >
                          {item.segmento || "-"}
                        </div>

                      </div>

                      {/* CONTENT */}

                      <div className="mt-4 space-y-3">

                        <div>

                          <div className="text-xs opacity-60 mb-1">
                            Medio
                          </div>

                          <div className="font-semibold">
                            {item.medio || "-"}
                          </div>

                        </div>

                        <div>

                          <div className="text-xs opacity-60 mb-1">
                            Descripción
                          </div>

                          <div className="text-sm leading-relaxed opacity-90">
                            {item.des_tipobase || "-"}
                          </div>

                        </div>

                      </div>

                    </motion.div>

                  ))}

                </div>

              </div>

            </motion.div>

          </>

        )}

      </AnimatePresence>

      {/* FLOAT BUTTON 

      <motion.button
        type="button"
        whileHover={{
          scale: 1.08
        }}
        whileTap={{
          scale: 0.95
        }}
        onClick={() => setOpenInfo(true)}
        className="
          fixed right-6 bottom-6 z-30
          w-16 h-16 rounded-full
          bg-gradient-to-br from-red-600 to-red-900
          text-white shadow-2xl
          flex items-center justify-center
        "
      >

        <div className="flex flex-col items-center">

          <Info className="w-5 h-5" />

          <span className="text-[10px] font-bold mt-[2px]">
            INFO
          </span>

        </div>

      </motion.button> */}
    </div>
  )
} 

// =====================================================
// INPUT FIELD
// =====================================================

function InputField({
  label,
  icon: Icon,
  children
}) {

  return (

    <motion.div
      whileHover={{ y: -2 }}
      className="space-y-2"
    >

      <label
        className="
          flex items-center gap-2
          text-sm font-semibold opacity-90
        "
      >
        <Icon className="w-4 h-4 text-red-500" />
        {label}
      </label>

      {children}

    </motion.div>
  )
}

// =====================================================
// INFO CARD
// =====================================================

function InfoCard({
  icon: Icon,
  label,
  value,
  isDark
}) {

  return (

    <motion.div
      whileHover={{ y: -3 }}
      className={`
        rounded-2xl p-5 border
        flex items-center gap-4
        shadow-sm
        ${isDark
          ? "bg-[#1F2029] border-[#3A3B47]"
          : "bg-white border-gray-200"}
      `}
    >

      <div
        className="
          w-14 h-14 rounded-2xl
          bg-gradient-to-br from-red-500 to-red-700
          flex items-center justify-center
          shadow-md
        "
      >
        <Icon className="w-6 h-6 text-white" />
      </div>

      <div>

        <div className="text-sm opacity-70">
          {label}
        </div>

        <div className="font-bold text-lg">
          {value}
        </div>

      </div>

    </motion.div>
  )
}

// =====================================================
// INPUT CLASS
// =====================================================

function inputClass(isDark) {

  return `
    w-full rounded-2xl px-4 py-3 border outline-none
    transition-all duration-300
    focus:scale-[1.01]
    focus:ring-2 focus:ring-red-500/40
    ${isDark
      ? "bg-[#1F2029] border-[#3A3B47] text-white placeholder:text-gray-500"
      : "bg-white border-gray-300 text-black"}
  `
}