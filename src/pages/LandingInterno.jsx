"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import axios from "axios"
import {
  CalendarDays,
  Loader2
} from "lucide-react"

import { INDICE_CAMPS } from "../context/indiceCamps"

const API = "http://192.168.9.115:4000/api/landing-interno"

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

  // IMPORTANTE:
  // intenta distintos nombres posibles
  const nombreCampania =
    campInfo?.campania ||
    campInfo?.Campana ||
    campInfo?.nombre ||
    campInfo?.descripcion ||
    `Campaña ${camp}`

  // =====================================================
  // STATES
  // =====================================================

  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  const [tiposBase, setTiposBase] = useState([])

  // SELECTS DINAMICOS
  const [campanias, setCampanias] = useState([])
  const [productos, setProductos] = useState([])

  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    dni: "",
    telefono: "",
    email: "",
    provincia: "",
    comentario: "",
    permitellamada: false,

    id_tipobase: "",

    campania: "",
    producto: ""
  })

  // =====================================================
  // DATE
  // =====================================================

  const fechaActual = useMemo(() => {

    const hoy = new Date()

    return hoy.toLocaleDateString("es-PE")

  }, [])

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {

    if (!camp) return

    loadData()

  }, [camp])

  const loadData = async () => {

    try {

      setLoadingData(true)

      const [
        campaniaRes,
        tiposBaseRes
      ] = await Promise.all([
        axios.get(`${API}/campania?camp=${camp}`),
        axios.get(`${API}/tipos-base?camp=${camp}`)
      ])

      // =================================================
      // DATA CAMPAÑAS
      // =================================================

      const campaniaData = campaniaRes.data.data

      // soporta array o objeto
      const campArray = Array.isArray(campaniaData)
        ? campaniaData
        : [campaniaData]

      // =================================================
      // CAMPAÑAS SELECT
      // =================================================

      const campaniasDisponibles = campArray
        .map(item => item?.IniCampania)
        .filter(Boolean)

      // =================================================
      // PRODUCTOS SELECT
      // =================================================

      const productosDisponibles = campArray
        .map(item => item?.producto)
        .filter(Boolean)

      setCampanias(campaniasDisponibles)

      setProductos(productosDisponibles)

      // =================================================
      // TIPOS BASE
      // =================================================

      setTiposBase(tiposBaseRes.data.data || [])

      // =================================================
      // DEFAULT VALUES
      // =================================================

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
      value,
      type,
      checked
    } = e.target

    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox"
        ? checked
        : value
    }))
  }

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault()

    try {

      setLoading(true)

      await axios.post(`${API}/crear`, {
        ...form,
        idcampania: camp,
        idusuario: nroDoc
      })

      alert("Lead registrado correctamente")

      setForm(prev => ({
        ...prev,
        nombres: "",
        apellidos: "",
        dni: "",
        telefono: "",
        email: "",
        provincia: "",
        comentario: "",
        permitellamada: false,
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
        <Loader2 className="w-10 h-10 animate-spin text-red-500" />
      </div>
    )
  }

  return (

    <div
      className={`
        min-h-screen p-6 transition-colors duration-500
        ${isDark ? "bg-[#1F2029] text-white" : "bg-gray-100 text-black"}
      `}
    >

      <div
        className={`
          max-w-5xl mx-auto rounded-xl shadow-sm overflow-hidden border
          ${isDark
            ? "bg-[#272833] border-[#3A3B47]"
            : "bg-white border-gray-300"}
        `}
      >

        {/* HEADER */}

        <div
          className={`
            px-5 py-4 border-b text-lg font-semibold
            ${isDark
              ? "border-[#3A3B47] bg-[#2F3040]"
              : "border-gray-200 bg-gray-50"}
          `}
        >
          {camp || "-"} Ingresar datos:
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-5"
        >

          {/* TOP */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

            {/* USER */}

            <div>

              <input
                type="text"
                value={nroDoc}
                disabled
                className={`
                  w-full rounded-md px-4 py-3 border outline-none
                  ${isDark
                    ? "bg-[#1F2029] border-red-500 text-white"
                    : "bg-white border-red-400 text-black"}
                `}
              />

            </div>

            {/* CAMPAÑA */}

            <div>

              <div
                className="
                  bg-red-600 text-white rounded-md px-4 py-3
                  font-semibold
                "
              >
                {nombreCampania}
              </div>

            </div>

          </div>

          {/* FECHA */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">

            <div className="flex items-center gap-4">

              <label className="font-semibold min-w-[170px]">
                Fecha de ingreso:
              </label>

              <div className="relative w-full">

                <CalendarDays
                  className="
                    absolute right-3 top-1/2 -translate-y-1/2
                    w-5 h-5 text-gray-400
                  "
                />

                <input
                  type="text"
                  disabled
                  value={fechaActual}
                  className={inputClass(isDark)}
                />

              </div>

            </div>

          </div>

          {/* ORIGEN */}

          <FormRow label="Origen:">

            <select
              name="id_tipobase"
              value={form.id_tipobase}
              onChange={handleChange}
              className={inputClass(isDark)}
            >

              <option value="">
                Seleccione
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

          </FormRow>

          {/* CAMPAÑA */}

          <FormRow label="Campaña:">

            <select
              name="campania"
              value={form.campania}
              onChange={handleChange}
              className={inputClass(isDark)}
            >

              <option value="">
                Seleccione Campaña
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

          </FormRow>

          {/* PRODUCTO */}

          <FormRow label="Producto:">

            <select
              name="producto"
              value={form.producto}
              onChange={handleChange}
              className={inputClass(isDark)}
            >

              <option value="">
                Seleccione Producto
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

          </FormRow>

          {/* NOMBRES */}

          <FormRow label="Nombres:">

            <input
              type="text"
              name="nombres"
              value={form.nombres}
              onChange={handleChange}
              className={inputClass(isDark)}
            />

          </FormRow>

          {/* APELLIDOS */}

          <FormRow label="Apellidos:">

            <input
              type="text"
              name="apellidos"
              value={form.apellidos}
              onChange={handleChange}
              className={inputClass(isDark)}
            />

          </FormRow>

          {/* DNI Y FONO */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">

            <div className="grid grid-cols-[80px_1fr] gap-4 items-center">

              <label>Dni:</label>

              <input
                type="text"
                name="dni"
                value={form.dni}
                onChange={handleChange}
                className={inputClass(isDark)}
              />

            </div>

            <div className="grid grid-cols-[80px_1fr] gap-4 items-center">

              <label>Fono:</label>

              <input
                type="text"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                className={inputClass(isDark)}
              />

            </div>

          </div>

          {/* EMAIL */}

          <FormRow label="Email:">

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={inputClass(isDark)}
            />

          </FormRow>

          {/* PROVINCIA */}

          <FormRow label="Provincia:">

            <input
              type="text"
              name="provincia"
              value={form.provincia}
              onChange={handleChange}
              className={inputClass(isDark)}
            />

          </FormRow>

          {/* OBS */}

          <FormRow label="obs:">

            <input
              type="text"
              name="comentario"
              value={form.comentario}
              onChange={handleChange}
              className={inputClass(isDark)}
            />

          </FormRow>

          {/* AUTORIZA */}

          <div
            className={`
              mt-8 border-t pt-6
              ${isDark ? "border-[#3A3B47]" : "border-gray-300"}
            `}
          >

            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 items-center">

              <label>
                Autoriza Llamada:
              </label>

              <select
                name="permitellamada"
                value={form.permitellamada ? "1" : "0"}
                onChange={(e) =>
                  setForm(prev => ({
                    ...prev,
                    permitellamada: e.target.value === "1"
                  }))
                }
                className={`
                  rounded-md px-4 py-3 border outline-none max-w-xs
                  ${isDark
                    ? "bg-[#1F2029] border-[#3A3B47] text-white"
                    : "bg-white border-gray-300 text-black"}
                `}
              >
                <option value="0">
                  No Autoriza
                </option>

                <option value="1">
                  Autoriza
                </option>
              </select>

            </div>

          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="
              mt-8 w-full bg-blue-600 hover:bg-blue-700
              transition-all text-white py-3 rounded-md
              font-semibold flex items-center justify-center gap-2
              disabled:opacity-50
            "
          >

            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Registrando...
              </>
            ) : (
              "Registrar"
            )}

          </button>

        </form>

      </div>

    </div>
  )
}


// =====================================================
// FORM ROW
// =====================================================

function FormRow({
  label,
  children
}) {

  return (

    <div className="grid grid-cols-1 md:grid-cols-[170px_1fr] gap-4 mb-4 items-center">

      <label className="font-semibold">
        {label}
      </label>

      {children}

    </div>
  )
}


// =====================================================
// INPUT CLASS
// =====================================================

function inputClass(isDark) {

  return `
    w-full rounded-md px-4 py-3 border outline-none
    ${isDark
      ? "bg-[#1F2029] border-[#3A3B47] text-white"
      : "bg-white border-gray-300 text-black"}
  `
}