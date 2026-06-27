// front/src/components/leads/ControlVistas.jsx
"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, ChevronDown, ChevronRight } from "lucide-react"
import { useLocalTheme } from "../../context/useLocalTheme"

export default function ControlVistas({ onClose }) {

  const { theme } = useLocalTheme()
  const isDark = theme === "dark"

  const [searchParams] = useSearchParams()
  const idCamp = searchParams.get("camp")

  const [loading, setLoading] = useState(true)

  // MONITOR
  const [rowsMonitor, setRowsMonitor] = useState([])
  const [openMonitor, setOpenMonitor] = useState(false)

  // CARTERIZACION
  const [rowsCarterizacion, setRowsCarterizacion] = useState([])
  const [openCarterizacion, setOpenCarterizacion] = useState(false)

  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!idCamp) return
    loadAll()
  }, [idCamp])

  const loadData = async (url, setter) => {
    try {
      const token = localStorage.getItem("token")

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json()

      if (data.ok) {
        setter(data.data)
      }

    } catch (err) {
      console.error(err)
    }
  }

  const loadAll = async () => {
    setLoading(true)

    await Promise.all([
      loadData(
        `http://192.168.9.115:4000/api/control-vistas/${idCamp}`,
        setRowsMonitor
      ),
      loadData(
        `http://192.168.9.115:4000/api/control-vistas/vista-agente/${idCamp}`,
        setRowsCarterizacion
      )
    ])

    setLoading(false)
  }

  const saveRow = async (endpoint, row) => {
    try {
      const token = localStorage.getItem("token")

      await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          idOrdenVista: row.id_orden_vista,
          activo: row.activo,
          orden: row.orden,
          nivel_vista: row.nivel_vista
        })
      })

    } catch (err) {
      console.error(err)
    }
  }
    const toggleActivo = (id, rows, setRows, endpoint) => {

    const updated = rows.map(row => {

      if (row.id_orden_vista !== id) return row

      const newRow = {
        ...row,
        activo: !row.activo
      }

      saveRow(endpoint, newRow)

      return newRow
    })

    setRows(updated)
  }

const changeNivel = (id, nivel) => {

  const updated = rowsMonitor.map(row => {

    if (row.id_orden_vista !== id) return row

    const newRow = {
      ...row,
      nivel_vista: Number(nivel)
    }

    saveRow(
      "http://192.168.9.115:4000/api/control-vistas",
      newRow
    )

    return newRow
  })

  setRowsMonitor(updated)
}

  const changeOrden = (id, nuevoOrden) => {

    nuevoOrden = Number(nuevoOrden)

    let duplicatedVista = null

    const updated = rowsMonitor.map(row => {

      if (
        row.id_orden_vista !== id &&
        Number(row.orden) === nuevoOrden
      ) {

        duplicatedVista = row.Vista

        const cleared = {
          ...row,
          orden: null
        }

        saveRow(
          "http://192.168.9.115:4000/api/control-vistas",
          cleared
        )

        return cleared
      }

      if (row.id_orden_vista === id) {

        const modified = {
          ...row,
          orden: nuevoOrden
        }

        saveRow(
          "http://192.168.9.115:4000/api/control-vistas",
          modified
        )

        return modified
      }

      return row
    })

    setRowsMonitor(updated)

    if (duplicatedVista) {
      setToast(`"${duplicatedVista}" perdió el orden ${nuevoOrden}`)

      setTimeout(() => setToast(null), 3500)
    }
  }
  const renderMonitor = () => (

<div
  className={`rounded-2xl border shadow-xl overflow-hidden
  ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}
>

    {/* HEADER */}
    <button
      type="button"
      onClick={() => setOpenMonitor(prev => !prev)}
      className={`
        w-full flex items-center justify-between px-5 py-4 border-b
        font-semibold text-sm
        ${isDark
          ? "border-slate-700 text-slate-200 hover:bg-slate-800"
          : "border-slate-200 text-slate-700 hover:bg-slate-50"
        }
      `}
    >
      <span>Vista de Monitor</span>
      {openMonitor ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
    </button>

    <AnimatePresence initial={false}>
      {openMonitor && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >

          <div className="overflow-y-auto overflow-x-hidden max-h-[520px]">

            <table className="w-full text-sm">

              <thead>
                <tr className={isDark ? "bg-slate-800 text-slate-300" : "bg-slate-50 text-slate-700"}>
                  <th className="text-left px-4 py-3">Vista</th>
                  <th className="text-center px-4 py-3">Activo</th>
                  <th className="text-center px-4 py-3">Orden</th>
                  <th className="text-center px-4 py-3">Nivel Vista</th>
                </tr>
              </thead>

              <tbody>
                {rowsMonitor.map(row => (
                  <tr
                    key={row.id_orden_vista}
                    className={isDark ? "border-t border-slate-800" : "border-t border-slate-100"}
                  >

                    <td className="px-4 py-3 font-medium">{row.Vista}</td>

                    <td className="px-4 py-3 text-center">
                      <motion.div
                        whileTap={{ scale: 0.9 }}
                        className="inline-flex cursor-pointer"
                        onClick={() =>
                          toggleActivo(
                            row.id_orden_vista,
                            rowsMonitor,
                            setRowsMonitor,
                            "http://192.168.9.115:4000/api/control-vistas"
                          )
                        }
                      >
                        {row.activo ? (
                          <Eye size={18} className="text-green-500" />
                        ) : (
                          <EyeOff size={18} className="text-red-500" />
                        )}
                      </motion.div>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        value={row.orden ?? ""}
                        min="1"
                        className={`
                          w-20 px-2 py-1 rounded-lg border text-center
                          ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"}
                        `}
                        onChange={(e) =>
                          changeOrden(row.id_orden_vista, e.target.value)
                        }
                      />
                    </td>

                    <td className="px-4 py-3 text-center">
                      <select
                        value={row.nivel_vista ?? 1}
                        onChange={(e) =>
                          changeNivel(row.id_orden_vista, e.target.value)
                        }
                        className={`
                          px-3 py-1 rounded-lg border
                          ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"}
                        `}
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                      </select>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        </motion.div>
      )}
    </AnimatePresence>

  </div>
)
const changeOrdenCarterizacion = (id, nuevoOrden) => {

  nuevoOrden = Number(nuevoOrden)

  let duplicatedVista = null

  const updated = rowsCarterizacion.map(row => {

    if (
      row.id_orden_vista !== id &&
      Number(row.orden) === nuevoOrden
    ) {

      duplicatedVista = row.Vista

      const cleared = {
        ...row,
        orden: null
      }

      saveRow(
        "http://192.168.9.115:4000/api/control-vistas/vista-agente",
        cleared
      )

      return cleared
    }

    if (row.id_orden_vista === id) {

      const modified = {
        ...row,
        orden: nuevoOrden
      }

      saveRow(
        "http://192.168.9.115:4000/api/control-vistas/vista-agente",
        modified
      )

      return modified
    }

    return row
  })

  setRowsCarterizacion(updated)

  if (duplicatedVista) {
    setToast(`"${duplicatedVista}" perdió el orden ${nuevoOrden}`)
    setTimeout(() => setToast(null), 3500)
  }
}
const renderCarterizacion = () => (

  <div
    className={`rounded-2xl border shadow-xl overflow-hidden
    ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}
  >

    {/* HEADER */}
    <button
      type="button"
      onClick={() => setOpenCarterizacion(prev => !prev)}
      className={`
        w-full flex items-center justify-between px-5 py-4 border-b
        font-semibold text-sm
        ${isDark
          ? "border-slate-700 text-slate-200 hover:bg-slate-800"
          : "border-slate-200 text-slate-700 hover:bg-slate-50"
        }
      `}
    >
      <span>Vista de Carterización</span>

      {openCarterizacion
        ? <ChevronDown size={18} />
        : <ChevronRight size={18} />
      }
    </button>

    <AnimatePresence initial={false}>
      {openCarterizacion && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >

          <div className="overflow-y-auto overflow-x-hidden max-h-[520px]">

            <table className="w-full text-sm">

              <thead>
                <tr className={isDark ? "bg-slate-800 text-slate-300" : "bg-slate-50 text-slate-700"}>
                  <th className="text-left px-4 py-3">Vista</th>
                  <th className="text-center px-4 py-3">Activo</th>
                  <th className="text-center px-4 py-3">Orden</th>
                </tr>
              </thead>

              <tbody>

                {rowsCarterizacion.map(row => (
                  <tr
                    key={row.id_orden_vista}
                    className={isDark ? "border-t border-slate-800" : "border-t border-slate-100"}
                  >

                    {/* VISTA */}
                    <td className="px-4 py-3 font-medium">
                      {row.Vista}
                    </td>

                    {/* ACTIVO */}
                    <td className="px-4 py-3 text-center">
                      <motion.div
                        whileTap={{ scale: 0.9 }}
                        className="inline-flex cursor-pointer"
                        onClick={() =>
                          toggleActivo(
                            row.id_orden_vista,
                            rowsCarterizacion,
                            setRowsCarterizacion,
                            "http://192.168.9.115:4000/api/control-vistas/vista-agente"
                          )
                        }
                      >
                        {row.activo ? (
                          <Eye size={18} className="text-green-500" />
                        ) : (
                          <EyeOff size={18} className="text-red-500" />
                        )}
                      </motion.div>
                    </td>

                    {/* ORDEN */}
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        value={row.orden ?? ""}
                        min="1"
                        className={`
                          w-20 px-2 py-1 rounded-lg border text-center
                          ${isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-300"}
                        `}
                        onChange={(e) =>
                          changeOrdenCarterizacion(row.id_orden_vista, e.target.value)
                        }
                      />
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </motion.div>
      )}
    </AnimatePresence>

  </div>
)
const handleGuardar = () => {
  window.location.reload()
}

if (loading) {
  return <div className="p-6">Cargando...</div>
}

return (
  <div className="w-full">

    {renderMonitor()}
    
    {renderCarterizacion()}

    {/* FOOTER */}
    <div className={`
      sticky bottom-0 flex justify-end gap-3 px-5 py-4 border-t
      ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}
    `}>

      <button
        type="button"
        onClick={onClose}
        className="px-5 py-2 rounded-lg bg-slate-500 text-white hover:bg-slate-600"
      >
        Cerrar
      </button>

      <button
        type="button"
        onClick={handleGuardar}
        className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
      >
        Guardar cambios
      </button>

    </div>

    {/* TOAST */}
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-6 right-6 z-[999] bg-amber-500 text-white px-4 py-3 rounded-xl shadow-xl text-sm"
        >
          {toast}
        </motion.div>
      )}
    </AnimatePresence>

  </div>
) }