//front/src/pages/CrearCampana.jsx

"use client"

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import {
  FaPlus,
  FaSearch,
  FaTrash,
  FaTimes,
  FaFolderOpen,
  FaDatabase,
  FaCheckCircle,
  FaLayerGroup,
  FaHashtag
} from "react-icons/fa"
import { IoMdWarning } from "react-icons/io"
import { FaCircleInfo } from "react-icons/fa6"
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Pencil,
  Plus,
  Trash2,
  Ban
} from "lucide-react"

// ======================================================
// API
// ======================================================

const API =
  "http://192.168.9.115:4000/api/crear-campanas"

// ======================================================
// PAGINATION
// ======================================================

const ITEMS_PER_PAGE = 10

export default function CrearCampana() {

  // ======================================================
  // THEME
  // ======================================================

  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  )

  useEffect(() => {

    const handleStorage = () => {

      setIsDark(
        localStorage.getItem("theme") === "dark"
      )

    }

    window.addEventListener("storage", handleStorage)

    return () => {
      window.removeEventListener("storage", handleStorage)
    }

  }, [])

  // ======================================================
  // STATES
  // ======================================================

  const [campanas, setCampanas] = useState([])

  const [loading, setLoading] = useState(true)

  const [loadingCreate, setLoadingCreate] = useState(false)

  const [search, setSearch] = useState("")

  const [page, setPage] = useState(1)

  const [showCreate, setShowCreate] = useState(false)

  const [success, setSuccess] = useState("")

  const [error, setError] = useState("")

  // ======================================================
  // FORM
  // ======================================================

  const [idCamp, setIdCamp] = useState("")

  const [nombre, setNombre] = useState("")

  const [activa, setActiva] = useState(true)

  const [iniCampania, setIniCampania] = useState("")

  const [producto, setProducto] = useState("")

  const [campaniaName, setCampaniaName] = useState("")
  //edicion
const [editingId, setEditingId] = useState(null)

const [editForm, setEditForm] = useState({
  nombre: "",
  activa: true,

  iniRows: [],

  deletedRows: []
})
const [editableFields, setEditableFields] = useState({})
const [loadingEdit, setLoadingEdit] = useState(false)
  // ======================================================
  // ALERTS
  // ======================================================

  const clearMessages = () => {

    setSuccess("")

    setError("")

  }

  // ======================================================
  // GET ALL CAMPAÑAS
  // ======================================================

  const getCampanas = async () => {

    try {
      const token = localStorage.getItem("token")
      setLoading(true)

      clearMessages()

      // ======================================================
      // get all campañas
      // ======================================================

      const res = await fetch(
        `${API}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await res.json()

      if (!res.ok) {

        throw new Error(
          data.message || "Error al obtener campañas"
        )

      }

      setCampanas(data?.data || [])

    } catch (err) {

      setError(err.message)

    } finally {

      setLoading(false)

    }

  }

  useEffect(() => {

    getCampanas()

  }, [])
// normalizacion de datos enviar
const normalizeCoreIni = (coreIni) => {

  if (!coreIni) {
    return []
  }

  if (Array.isArray(coreIni)) {
    return coreIni
  }

  if (Array.isArray(coreIni.rows)) {
    return coreIni.rows
  }

  return [coreIni]

}

  // ======================================================
  // FILTER
  // ======================================================

  const filtered = useMemo(() => {

    return campanas.filter((item) => {

      const txt =
        `
          ${item?.admin?.id_camp || ""}
          ${item?.admin?.nombre || ""}
        `
          .toLowerCase()

      return txt.includes(
        search.toLowerCase()
      )

    })

  }, [campanas, search])

  // ======================================================
  // PAGINATION
  // ======================================================

  const totalPages = Math.ceil(
    filtered.length / ITEMS_PER_PAGE
  )

  const paginated = useMemo(() => {

    const start =
      (page - 1) * ITEMS_PER_PAGE

    const end =
      start + ITEMS_PER_PAGE

    return filtered.slice(start, end)

  }, [filtered, page])

  // ======================================================
  // CREATE
  // ======================================================

  const handleCreate = async () => {

    clearMessages()

    if (!idCamp) {
      return setError("ID requerido")
    }

    if (!nombre.trim()) {
      return setError("Nombre requerido")
    }

    try {
      const token = localStorage.getItem("token")

      setLoadingCreate(true)

      const res = await fetch(
        `${API}/crear`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
  idCampana: Number(idCamp),
  nombre,
  activa,
  iniCampania,
  producto,
  campaniaName
})
        }
      )

      const data = await res.json()

      if (!res.ok) {

        throw new Error(
          data.message || "Error creando campaña"
        )

      }

      setSuccess(
        "Campaña creada correctamente"
      )

      setShowCreate(false)

      setIdCamp("")
      setNombre("")
      setActiva(true)
      setIniCampania("")
      setProducto("")
      setCampaniaName("")

      getCampanas()

    } catch (err) {

      setError(err.message)

    } finally {

      setLoadingCreate(false)

    }

  }

  // ======================================================
  // DELETE
  // ======================================================

  const handleDelete = async (id) => {

    const ok = confirm(
      "¿Eliminar campaña completamente?"
    )

    if (!ok) return

    try {

      clearMessages()

      const token = localStorage.getItem("token")

      const res = await fetch(
        `${API}/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await res.json()

      if (!res.ok) {

        throw new Error(
          data.message || "Error eliminando campaña"
        )

      }

      setSuccess(
        "Campaña eliminada correctamente"
      )

      getCampanas()

    } catch (err) {

      setError(err.message)

    }

  }
// ======================================================
// OPEN EDIT
// ======================================================

const handleOpenEdit = (item) => {

  const admin = item?.admin || {}

  const coreIni = Array.isArray(item?.core_ini)
    ? item.core_ini
    : Array.isArray(item?.core_ini?.rows)
      ? item.core_ini.rows
      : []

  setEditingId(admin.id_camp)

  setEditForm({
  nombre: admin.nombre || "",
  activa: admin.activa || false,

  deletedRows: [],

 //   producto:
   //   coreIni?.[0]?.producto || "",

    campania_name:
      coreIni?.[0]?.campania_name || "",

   iniRows:
  coreIni.length > 0
    ? coreIni.map((row) => ({
        id_orden: row.id_orden,

        ini_campania:
          row.ini_campania || "",

        producto:
          row.producto || "",

        campania_name:
          row.campania_name || "",

        original: {
          ini_campania:
            row.ini_campania || "",

          producto:
            row.producto || "",

          campania_name:
            row.campania_name || ""
        },

        isNew: false,
        isEdited: false
      }))
        : [
            {
              id_orden: null,
              ini_campania: "",
              isNew: true
            }
          ]
  })

}
// ======================================================
// EDIT INPUTS
// ======================================================

const handleEditChange = (
  field,
  value
) => {

  setEditForm((prev) => ({
    ...prev,
    [field]: value
  }))

}
const handleIniChange = (
  index,
  field,
  value
) => {

  setEditForm((prev) => {

    const updated = [...prev.iniRows]

    updated[index][field] = value

    const current =
      updated[index]

    current.isEdited =
      current.ini_campania !== current.original?.ini_campania ||
      current.producto !== current.original?.producto ||
      current.campania_name !== current.original?.campania_name

    return {
      ...prev,
      iniRows: updated
    }

  })

}
// ======================================================
// ADD INI
// ======================================================

const handleAddIni = () => {
  const newIndex = editForm.iniRows.length

  setEditForm((prev) => ({
    ...prev,
    iniRows: [
      ...prev.iniRows,
      {
        id_orden: null,
        ini_campania: "",
        producto: "",
        campania_name: "",
        isNew: true
      }
    ]
  }))
    setEditableFields((prev) => ({
    ...prev,

    [`ini_${newIndex}`]: true,

    [`producto_${newIndex}`]: true
  }))



}
// ======================================================
// REMOVE INI ROW
// ======================================================

const handleRemoveIni = (index) => {

  setEditForm((prev) => {

    const row =
      prev.iniRows[index]

    const updated =
      prev.iniRows.filter(
        (_, i) => i !== index
      )

    const deletedRows = [
      ...prev.deletedRows
    ]

    // ======================================================
    // SOLO AGREGAR A DELETES
    // SI YA EXISTÍA EN DB
    // ======================================================

    if (
      row.id_orden &&
      !row.isNew
    ) {

      deletedRows.push({
        id_orden: row.id_orden
      })

    }

    return {
      ...prev,
      iniRows: updated,
      deletedRows
    }

  })

}
// ======================================================
// UPDATE
// ======================================================

const handleUpdate = async (idCamp) => {

  try {
    const token = localStorage.getItem("token")

    clearMessages()

    setLoadingEdit(true)

    // ======================================================
    // LIMPIAR FILAS
    // ======================================================

    const rowsCleaned =
      editForm.iniRows.filter(
        (row) =>
          row.ini_campania?.trim() !== ""
      )

    // ======================================================
    // UPDATES
    // ======================================================

const updates =
  rowsCleaned.filter(
    (row) =>
      !row.isNew &&
      row.isEdited
  )
// ======================================================
// INSERTS
// ======================================================

const inserts =
  rowsCleaned
    .filter(
      (row) => row.isNew
    )
    .map((row, index) => ({

      ...row,

      // ======================================================
      // SOLO LA PRIMERA FILA
      // GUARDA PRODUCTO Y CAMPANIA_NAME
      // ======================================================

      producto:
        index === 0
          ? row.producto || ""
          : "" ,

  //    campania_name:
    //    index === 0
      //    ? editForm.campania_name || ""
        //  : ""

    }))

    // ======================================================
    // DELETES
    // ======================================================

    const deletes =
  editForm.deletedRows || []

    // ======================================================
    // REQUEST
    // ======================================================

    const res = await fetch(
      `${API}/editar/${idCamp}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: editForm.nombre,
          activa: editForm.activa,
          producto: editForm.producto,
          updates,
          inserts,
          deletes
        })
      }
    )

    const data = await res.json()

    if (!res.ok) {

      throw new Error(
        data.message || "Error editando"
      )

    }

    setSuccess(
      "Campaña actualizada correctamente"
    )

    setEditingId(null)

    getCampanas()

  } catch (err) {

    setError(err.message)

  } finally {

    setLoadingEdit(false)

  }

}
  // ======================================================
  // STYLES
  // ======================================================

  const inputClass = `
    h-11 w-full rounded-2xl border px-4 text-sm
    outline-none transition-all
    ${isDark
      ? `
        border-[#3b3d4d]
        bg-[#1F2029]
        text-white
        placeholder:text-slate-500
        focus:border-cyan-500
        focus:ring-4
        focus:ring-cyan-500/20
      `
      : `
        border-slate-200
        bg-white
        text-slate-700
        focus:border-cyan-500
        focus:ring-4
        focus:ring-cyan-100
      `
    }
  `

  // ======================================================
  // RENDER
  // ======================================================

  return (

    <div
      className={`
        min-h-screen p-6 transition-colors duration-500
        ${isDark
          ? "bg-[#1F2029]"
          : "bg-gray-100"
        }
      `}
    >

      {/* ====================================================== */}
      {/* BREADCRUMB */}
      {/* ====================================================== */}

      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >

        <div
          className={`
            flex flex-wrap items-center gap-2
            text-sm font-semibold tracking-wide
            ${isDark
              ? "text-slate-300"
              : "text-slate-600"
            }
          `}
        >

          <span className="text-lg font-semibold uppercase">
            Configuración
          </span>

          <span>/</span>

          <span className="text-lg font-semibold uppercase">
            Modulos
          </span>

          <span>/</span>

          <span className="text-lg font-semibold uppercase">
            creacion de campañas
          </span>

        </div>

      </motion.div>

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div
        className={`
          mb-8 rounded-3xl border p-6
          shadow-[0_15px_50px_rgba(0,0,0,0.08)]
          transition-all
          ${isDark
            ? `
              border-[#343746]
              bg-[#272833]
            `
            : `
              border-slate-200
              bg-white
            `
          }
        `}
      >

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h1
              className={`
                text-xl font-black tracking-tight
                ${isDark
                  ? "text-white"
                  : "text-slate-800"
                }
              `}
            >
              Gestión de Campañas
            </h1>
{ /* 
            <p
              className={`
                mt-2 text-sm
                ${isDark
                  ? "text-slate-400"
                  : "text-slate-500"
                }
              `}

              
            >
              Creacion
            </p>
*/}
          </div>

          <div className="flex items-center gap-3">

            {/* SEARCH */}

            <div className="relative">

              <FaSearch
                className={`
                  absolute left-3 top-1/2 -translate-y-1/2
                  ${isDark
                    ? "text-slate-500"
                    : "text-slate-400"
                  }
                `}
              />

              <input
                value={search}
                onChange={(e) => {

                  setSearch(e.target.value)

                  setPage(1)

                }}
                placeholder="Buscar por ID o nombre..."
                className={`
                  h-11 w-[280px]
                  rounded-2xl border pl-10 pr-4 text-sm
                  outline-none transition-all
                  ${isDark
                    ? `
                      border-[#3b3d4d]
                      bg-[#1F2029]
                      text-white
                      placeholder:text-slate-500
                      focus:border-cyan-500
                      focus:ring-4
                      focus:ring-cyan-500/20
                    `
                    : `
                      border-slate-200
                      bg-white
                      text-slate-700
                      focus:border-cyan-500
                      focus:ring-4
                      focus:ring-cyan-100
                    `
                  }
                `}
              />

            </div>

            {/* ADD */}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreate(true)}
              className="
                flex h-11 items-center gap-2
                rounded-2xl bg-emerald-500/70 px-5
                font-bold text-black
                shadow-xl shadow-emerald-500/20
              "
            >

              <FaPlus />

              Nueva Campaña

            </motion.button>

          </div>

        </div>

      </div>

      {/* ====================================================== */}
      {/* ALERTS */}
      {/* ====================================================== */}

      <AnimatePresence>

        {success && (

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="
              mb-5 flex items-center gap-3
              rounded-2xl border border-emerald-500/30
              bg-emerald-500/10 p-4
              text-emerald-300
            "
          >

            <CheckCircle2 className="h-5 w-5" />

            {success}

          </motion.div>

        )}

      </AnimatePresence>

      <AnimatePresence>

        {error && (

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="
              mb-5 flex items-center gap-3
              rounded-2xl border border-red-500/30
              bg-red-500/10 p-4
              text-red-300
            "
          >

            <AlertCircle className="h-5 w-5" />

            {error}

          </motion.div>

        )}

      </AnimatePresence>

      {/* ====================================================== */}
      {/* GRID */}
      {/* ====================================================== */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3
2xl:grid-cols-4">

        {loading ? (

          <div
            className={`
              col-span-full flex h-[400px]
              items-center justify-center
              rounded-3xl border
              ${isDark
                ? `
                  border-[#343746]
                  bg-[#272833]
                  text-slate-400
                `
                : `
                  border-slate-200
                  bg-white
                  text-slate-500
                `
              }
            `}
          >

            <Loader2 className="h-8 w-8 animate-spin" />

          </div>

        ) : paginated.length === 0 ? (

          <div
            className={`
              col-span-full flex h-[300px]
              items-center justify-center
              rounded-3xl border
              text-lg font-semibold
              ${isDark
                ? `
                  border-[#343746]
                  bg-[#272833]
                  text-slate-400
                `
                : `
                  border-slate-200
                  bg-white
                  text-slate-500
                `
              }
            `}
          >

            No hay campañas

          </div>

        ) : (

          paginated.map((item, index) => {

            const admin = item?.admin || {}

            const coreIni = normalizeCoreIni(item?.core_ini)

            return (

              <motion.div
                key={admin.id_camp}
                initial={{
                  opacity: 0,
                  y: 15
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: index * 0.04
                }}
                whileHover={{
                  y: -3
                }}
                className={`
                  rounded-[28px] border p-4
                  shadow-[0_15px_50px_rgba(0,0,0,0.08)]
                  transition-all
                  ${isDark
                    ? `
                      border-[#343746]
                      bg-[#272833]
                    `
                    : `
                      border-slate-200
                      bg-white
                    `
                  }
                `}
              >

                {/* TOP */}

                <div className="mb-4 flex items-start justify-between">

                  <div
                    className="
                      flex h-12 w-12 items-center justify-center
                      rounded-2xl bg-cyan-500/10
                      text-slate-400
                    "
                  >

                    <FaFolderOpen className="text-xl" />

                  </div>

                  <div className="flex items-center gap-2">

                    <div
                      className={`
                        rounded-xl px-3 py-1 text-xs font-black
                        ${admin.activa
                          ? `
                            bg-emerald-500/15
                            text-emerald-400
                          `
                          : `
                            bg-red-500/15
                            text-red-400
                          `
                        }
                      `}
                    >
                      {admin.activa
                        ? "ACTIVA"
                        : "INACTIVA"}
                    </div>

                  </div>

                </div>

               {/* BODY */}

<div>

  {editingId === admin.id_camp ? (

    <div className="space-y-4">

      <input
        type="text"
        value={editForm.nombre}
        onChange={(e) =>
          handleEditChange(
            "nombre",
            e.target.value
          )
        }
        className={inputClass}
      />

      <div className="flex items-center gap-3">

        <span
          className={`text-sm font-bold ${
            isDark
              ? "text-slate-300"
              : "text-slate-700"
          }`}
        >
          CAMPAÑA ACTIVA
        </span>

        <input
          type="checkbox"
          checked={editForm.activa}
          onChange={(e) =>
            handleEditChange(
              "activa",
              e.target.checked
            )
          }
        />

      </div>
{/* PRODUCTO 

<div className="space-y-2">

  <label
    className={`text-sm font-bold ${
      isDark
        ? "text-slate-300"
        : "text-slate-700"
    }`}
  >
    Producto
  </label>

  <div className="relative">

    <Pencil
      className="
        absolute left-3 top-1/2
        -translate-y-1/2
        h-4 w-4 text-cyan-400
      "
    />

    <input
      type="text"
      value={editForm.producto}
      onChange={(e) =>
        handleEditChange(
          "producto",
          e.target.value
        )
      }
      className={`${inputClass} pl-10`}
    />

  </div>

</div>
*/}
{/* CAMPANIA NAME */}

<div className="space-y-2">

  <label
    className={`text-sm font-bold ${
      isDark
        ? "text-slate-300"
        : "text-slate-700"
    }`}
  >
    Campania Name
  </label>

  <div className="relative">

    <Ban
      className="
        absolute left-3 top-1/2
        -translate-y-1/2
        h-4 w-4 text-red-400
      "
    />

    <input
      type="text"
      disabled // para no editar
      value={editForm.campania_name}
      onChange={(e) =>
        handleEditChange(
          "campania_name",
          e.target.value
        )
      }
      className={`${inputClass} pl-10 disabled:cursor-not-allowed disabled:opacity-50`}
    />

  </div>

</div> 
      {/* INIS */}

      <div className="space-y-4">

        {editForm.iniRows.map(
          (row, index) => (

            <div
              key={index}
              className={`
                rounded-2xl border p-4
                space-y-3
                ${isDark
                  ? `
                    border-[#343746]
                    bg-[#1F2029]
                  `
                  : `
                    border-slate-200
                    bg-slate-50
                  `
                }
              `}
            >

              <div className="flex items-center justify-between">

  <div className="flex items-center gap-2">

    {row.isNew ? (
      <Plus className="h-4 w-4 text-emerald-400" />
    ) : (
      <Pencil className="h-4 w-4 text-cyan-400" />
    )}

    <span
      className={`
        text-xs font-black uppercase
        ${isDark
          ? "text-slate-400"
          : "text-slate-500"
        }
      `}
    >
      {row.isNew
        ? "Nueva Ini_campaña"
        : "Editar fila"}
    </span>

  </div>

  <button
    onClick={() =>
      handleRemoveIni(index)
    }
    className="
      text-red-400
      hover:text-red-500
    "
  >
    <Trash2 className="h-4 w-4" />
  </button>

</div>

     {/* INI CAMPANIA */}
<div className="relative">

  <input
    type="text"
    placeholder="Ini Campania"
    value={row.ini_campania}
    disabled={
      !editableFields[`ini_${index}`]
    }
    onChange={(e) =>
      handleIniChange(
        index,
        "ini_campania",
        e.target.value
      )
    }
    className={`
      ${inputClass}
      pr-14
      disabled:cursor-not-allowed
      disabled:opacity-70
    `}
  />

  <div className="group">

    <button
      type="button"
      onClick={() =>
        setEditableFields((prev) => ({
          ...prev,
          [`ini_${index}`]:
            !prev[`ini_${index}`]
        }))
      }
      className={`
        absolute right-3 top-1/2
        flex h-8 w-8
        -translate-y-1/2
        items-center justify-center
        rounded-full border
        transition-all duration-200
        hover:scale-110

        ${editableFields[`ini_${index}`]
          ? `
            border-red-500/30
            bg-red-500/15
            text-red-600
            hover:bg-red-500/25
          `
          : `
            border-yellow-500/30
            bg-yellow-500/15
            text-yellow-600
            hover:bg-yellow-500/25
          `
        }
      `}
    >

      {editableFields[`ini_${index}`]
        ? (
          <Ban className="h-4 w-4" />
        )
        : (
          <Pencil className="h-4 w-4" />
        )
      }

    </button>

    <div
      className="
        pointer-events-none absolute
        right-0 top-[-42px]
        z-50

        rounded-xl
        border border-slate-700
        bg-[#151821]

        px-3 py-2

        text-[11px]
        font-bold
        text-white

        opacity-0
        shadow-2xl
        transition-all duration-200

        group-hover:opacity-100
      "
    >
      {editableFields[`ini_${index}`]
        ? "Deshabilitar edición"
        : "Habilitar edición"
      }
    </div>

  </div>

</div>

{/* PRODUCTO input */}

{index === 0 && (

  <div className="relative">

    <input
      type="text"
      placeholder="Producto"
      value={row.producto}
      disabled={
        !editableFields[`producto_${index}`]
      }
      onChange={(e) =>
        handleIniChange(
          index,
          "producto",
          e.target.value
        )
      }
      className={`
        ${inputClass}
        pr-14
        disabled:cursor-not-allowed
        disabled:opacity-70
      `}
    />

    <div className="group">

      <button
        type="button"
        onClick={() =>
          setEditableFields((prev) => ({
            ...prev,
            [`producto_${index}`]:
              !prev[`producto_${index}`]
          }))
        }
        className={`
          absolute right-3 top-1/2
          flex h-8 w-8
          -translate-y-1/2
          items-center justify-center
          rounded-full border
          transition-all duration-200
          hover:scale-110

          ${editableFields[`producto_${index}`]
            ? `
              border-red-500/30
              bg-red-500/15
              text-red-600
              hover:bg-red-500/25
            `
            : `
              border-yellow-500/30
              bg-yellow-500/15
              text-yellow-600
              hover:bg-yellow-500/25
            `
          }
        `}
      >

        {editableFields[`producto_${index}`]
          ? (
            <Ban className="h-4 w-4" />
          )
          : (
            <Pencil className="h-4 w-4" />
          )
        }

      </button>

      <div
        className="
          pointer-events-none absolute
          right-0 top-[-42px]
          z-50

          rounded-xl
          border border-slate-700
          bg-[#151821]

          px-3 py-2

          text-[11px]
          font-bold
          text-white

          opacity-0
          shadow-2xl
          transition-all duration-200

          group-hover:opacity-100
        "
      >
        {editableFields[`producto_${index}`]
          ? "Deshabilitar edición"
          : "Habilitar edición"
        }
      </div>

    </div>

  </div>

)}
{/*
              <input
                type="text"
           //     placeholder="Campania Name"
                value={row.campania_name}
                onChange={(e) =>
                  handleIniChange(
                    index,
                    "campania_name",
                    e.target.value
                  )
                }
                className={inputClass}
              />
*/}
            </div>

          )
        )}

      </div>

      {/* ADD INI */}

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleAddIni}
        className="
          flex h-11 w-full items-center
          justify-center gap-2 rounded-2xl
          bg-cyan-500/70 opacity-90 font-bold text-black
        "
      >

        <FaPlus />

        Agregar Ini Campania

      </motion.button>

    </div>

  ) : (

    <>
    
      <div
        className={`
          text-lg font-black uppercase
          leading-tight
          ${isDark
            ? "text-white"
            : "text-slate-800"
          }
        `}
      >
        {admin.nombre}
      </div>

      <div
        className={`
          mt-1 text-xs
          ${isDark
            ? "text-slate-500"
            : "text-slate-500"
          }
        `}
      >
        ID Campaña : {admin.id_camp}
      </div>

      <div className="mt-5 flex flex-col gap-4">

{coreIni.length > 0 ? (

  coreIni
    .filter((row) =>
      row.producto?.trim() ||
      row.ini_campania?.trim() ||
      row.campania_name?.trim()
    )
    .map((row, index) => (

      <div
        key={row.id_orden || index}
        className={`
          rounded-2xl border p-3 space-y-3
          ${isDark
            ? "border-[#343746] bg-[#1F2029]"
            : "border-slate-200 bg-slate-50"
          }
        `}
      >

        {row.producto?.trim() && (
          <InfoRow
            icon={<FaDatabase />}
            label="Producto"
            value={row.producto}
            isDark={isDark}
          />
        )}

        {row.ini_campania?.trim() && (
          <InfoRow
            icon={<FaLayerGroup />}
            label="Ini Campaña"
            value={row.ini_campania}
            isDark={isDark}
          />
        )}

        {row.campania_name?.trim() && (
          <InfoRow
            icon={<FaCheckCircle />}
            label="Campaña Name"
            value={row.campania_name}
            isDark={isDark}
          />
        )}

      </div>

    ))

) : (

    <div
      className={`
        rounded-2xl border p-3 space-y-3
        ${isDark
          ? "border-[#343746] bg-[#1F2029]"
          : "border-slate-200 bg-slate-50"
        }
      `}
    >

      <InfoRow
        icon={<FaDatabase />}
        label="Producto"
        value="-"
        isDark={isDark}
      />

      <InfoRow
        icon={<FaLayerGroup />}
        label="Ini Campaña"
        value="-"
        isDark={isDark}
      />

      <InfoRow
        icon={<FaCheckCircle />}
        label="Campaña Name"
        value="-"
        isDark={isDark}
      />

    </div>

  )}

</div>
    </>

  )}

</div>

                {/* ACTIONS */}

<div className="mt-5 flex items-center gap-3">

  {editingId === admin.id_camp ? (

    <>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={() =>
          handleUpdate(admin.id_camp)
        }
        disabled={loadingEdit}
        className="
          flex h-11 w-full items-center
          justify-center rounded-2xl
          bg-emerald-500/70 font-bold text-black
        "
      >

        {loadingEdit
          ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          )
          : "Guardar"
        }

      </motion.button>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        onClick={() =>
          setEditingId(null)
        }
        className="
          flex h-11 w-full items-center
          justify-center rounded-2xl
          bg-slate-500 font-bold text-white
        "
      >
        Cancelar
      </motion.button>

    </>

  ) : (

    <>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() =>
          handleOpenEdit(item)
        }
        className="
          flex h-11 w-full items-center
          justify-center gap-2 rounded-2xl
          bg-yellow-500/70 font-bold text-black
        "
      >

        Editar

      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() =>
          handleDelete(admin.id_camp)
        }
        className="
          flex h-11 w-full items-center
          justify-center gap-2 rounded-2xl
          bg-red-500/90 font-bold text-white
        "
      >

        <Trash2 className="h-4 w-4" />

        Eliminar

      </motion.button>

    </>

  )}

</div>
              
              </motion.div>

            )

          })

        )}

      </div>

      {/* ====================================================== */}
      {/* PAGINATION */}
      {/* ====================================================== */}

      {!loading && totalPages > 1 && (

        <div className="mt-8 flex items-center justify-center gap-3">

          {Array.from({
            length: totalPages
          }).map((_, index) => {

            const current = index + 1

            return (

              <motion.button
                key={current}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage(current)}
                className={`
                  flex h-11 w-11 items-center
                  justify-center rounded-2xl
                  text-sm font-black transition-all
                  ${page === current
                    ? `
                      bg-slate-500
                      text-black
                    `
                    : isDark
                      ? `
                        bg-[#272833]
                        text-slate-300
                        border border-[#343746]
                      `
                      : `
                        bg-white
                        text-slate-700
                        border border-slate-200
                      `
                  }
                `}
              >
                {current}
              </motion.button>

            )

          })}

        </div>

      )}

      {/* ====================================================== */}
      {/* MODAL CREATE */}
      {/* ====================================================== */}

      <AnimatePresence>

        {showCreate && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed inset-0 z-[999]
              flex items-center justify-center
              bg-black/60 backdrop-blur-md
              p-5
            "
          >

            <motion.div
              initial={{
                scale: 0.9,
                opacity: 0,
                y: 30
              }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0
              }}
              exit={{
                scale: 0.9,
                opacity: 0
              }}
              transition={{
                duration: 0.22,
                ease: "easeOut"
              }}
              className={`
                relative w-full max-w-3xl
                rounded-[32px] border
                shadow-2xl overflow-hidden
                ${isDark
                  ? `
                    border-[#343746]
                    bg-[#272833]
                  `
                  : `
                    border-slate-200
                    bg-white
                  `
                }
              `}
            >

              {/* HEADER */}

              <div
                className={`
                  flex items-center justify-between
                  border-b px-6 py-5
                  ${isDark
                    ? "border-[#343746]"
                    : "border-slate-200"
                  }
                `}
              >

                <div>

                  <h2
                    className={`
                      text-2xl font-black
                      ${isDark
                        ? "text-white"
                        : "text-slate-800"
                      }
                    `}
                  >
                    Crear campaña
                  </h2>

                  <p
                    className={`
                      mt-1 text-sm
                      ${isDark
                        ? "text-slate-400"
                        : "text-slate-500"
                      }
                    `}
                  >
                    Antes de crear una nueva campaña, asegurate de leer los indices de cada campo
                  </p>

                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setShowCreate(false)
                  }
                  className={`
                    flex h-11 w-11 items-center
                    justify-center rounded-2xl
                    transition-all
                    ${isDark
                      ? `
                        bg-[#1F2029]
                        text-slate-300
                        hover:bg-red-500
                        hover:text-white
                      `
                      : `
                        bg-slate-100
                        text-slate-700
                        hover:bg-red-500
                        hover:text-white
                      `
                    }
                  `}
                >

                  <FaTimes className="text-lg" />

                </motion.button>

              </div>
{/* ALERTAS MODAL */}

<div className="px-6 pt-5">

  <AnimatePresence>

    {success && (

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="
          mb-4 flex items-center gap-3
          rounded-2xl border border-emerald-500/30
          bg-emerald-500/10 p-4
          text-emerald-300
        "
      >

        <CheckCircle2 className="h-5 w-5" />

        <span className="text-sm font-semibold">
          {success}
        </span>

      </motion.div>

    )}

  </AnimatePresence>

  <AnimatePresence>

    {error && (

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="
          mb-4 flex items-center gap-3
          rounded-2xl border border-red-500/30
          bg-red-500/10 p-4
          text-red-300
        "
      >

        <AlertCircle className="h-5 w-5" />

        <span className="text-sm font-semibold">
          {error}
        </span>

      </motion.div>

    )}

  </AnimatePresence>

</div>
              {/* BODY */}

<div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">

  <div>

    <label
      className="
        mb-2 flex items-center gap-2
        text-sm font-semibold text-slate-400
      "
    >
      ID Campaña

      <div className="group relative flex items-center">

        <FaCircleInfo
          className="
            cursor-pointer text-[15px]
            text-slate-400 transition-all
            duration-200 hover:scale-110
            hover:text-slate-300
          "
        />

        <div
          className="
            pointer-events-none absolute
            left-1/2 top-[140%]
            z-[999]

            w-max max-w-[240px]
            -translate-x-1/2

            rounded-xl
            border border-slate-700
            bg-[#151821]

            px-3 py-2

            text-center text-xs
            font-semibold text-white

            whitespace-normal
            break-words

            opacity-0
            shadow-2xl
            transition-all duration-200
            group-hover:opacity-100
          "
        >
          Este es el numero con el que se identificara a la campaña, debe ser unico y no se puede repetir
        </div>

      </div>

    </label>

    <input
      type="number"
      value={idCamp}
      onChange={(e) =>
        setIdCamp(e.target.value)
      }
      className={inputClass}
    />

  </div>

  <div>

    <label
      className="
        mb-2 flex items-center gap-2
        text-sm font-semibold text-slate-400
      "
    >
      Nombre

      <div className="group relative flex items-center">

        <IoMdWarning
          className="
            cursor-pointer text-[17px]
            text-[#CC9923] transition-all
            duration-200 hover:scale-110
            hover:text-[#CC9923]
          "
        />

        <div
          className="
            pointer-events-none absolute
            left-1/2 top-[140%]
            z-[999]

            w-max max-w-[240px]
            -translate-x-1/2

            rounded-xl
            border border-yellow-500/30
            bg-[#151821]

            px-3 py-2

            text-center text-xs
            font-semibold text-yellow-200

            whitespace-normal
            break-words

            opacity-0
            shadow-2xl
            transition-all duration-200
            group-hover:opacity-100
          "
        >
          Este es el nombre que se mostrará para la campaña en la plataforma
        </div>

      </div>

    </label>

    <input
      type="text"
      value={nombre}
      onChange={(e) =>
        setNombre(e.target.value)
      }
      className={inputClass}
    />

  </div>

  <div>

    <label
      className="
        mb-2 flex items-center gap-2
        text-sm font-semibold text-slate-400
      "
    >
      Ini Campania

      <div className="group relative flex items-center">

        <FaCircleInfo
          className="
            cursor-pointer text-[15px]
            text-slate-400 transition-all
            duration-200 hover:scale-110
            hover:text-slate-300
          "
        />

        <div
          className="
            pointer-events-none absolute
            left-1/2 top-[140%]
            z-[999]

            w-max max-w-[240px]
            -translate-x-1/2

            rounded-xl
            border border-slate-700
            bg-[#151821]

            px-3 py-2

            text-center text-xs
            font-semibold text-white

            whitespace-normal
            break-words

            opacity-0
            shadow-2xl
            transition-all duration-200
            group-hover:opacity-100
          "
        >
          Este es el Ini_campania asignado a tu nueva campaña
        </div>

      </div>

    </label>

    <input
      type="text"
      value={iniCampania}
      onChange={(e) =>
        setIniCampania(e.target.value)
      }
      className={inputClass}
    />

  </div>

  <div>

    <label
      className="
        mb-2 flex items-center gap-2
        text-sm font-semibold text-slate-400
      "
    >
      Producto

      <div className="group relative flex items-center">

        <FaCircleInfo
          className="
            cursor-pointer text-[15px]
            text-slate-400 transition-all
            duration-200 hover:scale-110
            hover:text-slate-300
          "
        />

        <div
          className="
            pointer-events-none absolute
            left-1/2 top-[140%]
            z-[999]

            w-max max-w-[240px]
            -translate-x-1/2

            rounded-xl
            border border-slate-700
            bg-[#151821]

            px-3 py-2

            text-center text-xs
            font-semibold text-white

            whitespace-normal
            break-words

            opacity-0
            shadow-2xl
            transition-all duration-200
            group-hover:opacity-100
          "
        >
          Este es el producto asociado a la campaña
        </div>

      </div>

    </label>

    <input
      type="text"
      value={producto}
      onChange={(e) =>
        setProducto(e.target.value)
      }
      className={inputClass}
    />

  </div>

  <div className="md:col-span-2">

    <label
      className="
        mb-2 flex items-center gap-2
        text-sm font-semibold text-slate-400
      "
    >
      Campania Name

      <div className="group relative flex items-center">

        <IoMdWarning
          className="
            cursor-pointer text-[17px]
            text-[#CC9923] transition-all
            duration-200 hover:scale-110
            hover:text-[#CC9923]
          "
        />

        <div
          className="
            pointer-events-none absolute
            left-1/2 top-[140%]
            z-[999]

            w-max max-w-[240px]
            -translate-x-1/2

            rounded-xl
            border border-yellow-500/30
            bg-[#151821]

            px-3 py-2

            text-center text-xs
            font-semibold text-yellow-200

            whitespace-normal
            break-words

            opacity-0
            shadow-2xl
            transition-all duration-200
            group-hover:opacity-100
          "
        >
          Este es el nombre de la campaña que se inserta en la base de datos
        </div>

      </div>

    </label>

    <input
      type="text"
      value={campaniaName}
      onChange={(e) =>
        setCampaniaName(e.target.value)
      }
      className={inputClass}
    />

  </div>

  <div
    className={`
      flex items-center justify-between
      rounded-2xl border p-4
      md:col-span-2
      ${isDark
        ? `
          border-[#343746]
          bg-[#1F2029]
        `
        : `
          border-slate-200
          bg-slate-50
        `
      }
    `}
  >

    <span
      className={`
        flex items-center gap-2
        text-sm font-semibold
        ${isDark
          ? "text-slate-300"
          : "text-slate-700"
        }
      `}
    >
      Campaña activa

      <div className="group relative flex items-center">

        <FaCircleInfo
          className="
            cursor-pointer text-[15px]
            text-slate-400 transition-all
            duration-200 hover:scale-110
            hover:text-slate-300
          "
        />

        <div
          className="
            pointer-events-none absolute
            left-1/2 top-[140%]
            z-[999]

            w-max max-w-[240px]
            -translate-x-1/2

            rounded-xl
            border border-slate-700
            bg-[#151821]

            px-3 py-2

            text-center text-xs
            font-semibold text-white

            whitespace-normal
            break-words

            opacity-0
            shadow-2xl
            transition-all duration-200
            group-hover:opacity-100
          "
        >
          La campaña a agregar puede estar inicialmente inactiva
        </div>

      </div>

    </span>

    <input
      type="checkbox"
      checked={activa}
      onChange={(e) =>
        setActiva(e.target.checked)
      }
      className="h-5 w-5"
    />

  </div>

  <div className="md:col-span-2">

    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCreate}
      disabled={loadingCreate}
      className="
        flex h-12 w-full items-center
        justify-center gap-2 rounded-2xl
        bg-emerald-500/70 font-black text-black
        shadow-lg shadow-emerald-500/20
        disabled:opacity-60
      "
    >

      {loadingCreate
        ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        )
        : (
          <FaPlus />
        )
      }

      Crear Campaña

    </motion.button>

  </div>

</div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>

  )

}

// ======================================================
// INFO ROW
// ======================================================

function InfoRow({
  icon,
  label,
  value,
  isDark
}) {

  return (

    <div
      className={`
        flex items-center gap-3 rounded-2xl
        border px-3 py-3
        ${isDark
          ? `
            border-[#343746]
            bg-[#1F2029]
          `
          : `
            border-slate-200
            bg-slate-50
          `
        }
      `}
    >

      <div
        className="
          flex h-9 w-9 items-center justify-center
          rounded-xl bg-cyan-500/10 text-slate-400
        "
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">

        <div
          className={`
            text-[10px] font-black uppercase tracking-wide
            ${isDark
              ? "text-slate-500"
              : "text-slate-500"
            }
          `}
        >
          {label}
        </div>

        <div
          className={`
            truncate text-sm font-bold
            ${isDark
              ? "text-slate-200"
              : "text-slate-700"
            }
          `}
        >
          {value}
        </div>

      </div>

    </div>

  )

}