//front/src/components/leads/ControlVistas.jsx
"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"
import { useLocalTheme } from "../../context/useLocalTheme"

export default function ControlVistas() {

  const { theme } = useLocalTheme()
  const isDark = theme === "dark"

  const [searchParams] = useSearchParams()
  const idCamp = searchParams.get("camp")

  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState([])

  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!idCamp) return

    loadData()
  }, [idCamp])

  const loadData = async () => {
    try {

      setLoading(true)

      const token = localStorage.getItem("token")

      const res = await fetch(
        `http://192.168.9.115:4000/api/control-vistas/${idCamp}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await res.json()

      if (data.ok) {
        setRows(data.data)
      }

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const saveRow = async (row) => {

    try {

      const token = localStorage.getItem("token")

      await fetch(
        "http://192.168.9.115:4000/api/control-vistas",
        {
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
        }
      )

    } catch (err) {
      console.error(err)
    }
  }

const toggleActivo = async (idOrdenVista) => {

  const updated = rows.map(row => {

    if (row.id_orden_vista !== idOrdenVista) return row

    const newRow = {
      ...row,
      activo: !row.activo
    }

    saveRow(newRow)

    return newRow
  })

  setRows(updated)
}

const changeNivel = async (idOrdenVista, nivel) => {

  const updated = rows.map(row => {

    if (row.id_orden_vista !== idOrdenVista) return row

    const newRow = {
      ...row,
      nivel_vista: Number(nivel)
    }

    saveRow(newRow)

    return newRow
  })

  setRows(updated)
}

const changeOrden = async (idOrdenVista, nuevoOrden) => {

  nuevoOrden = Number(nuevoOrden)

  let duplicatedVista = null

  const updated = rows.map(row => {

    if (
      row.id_orden_vista !== idOrdenVista &&
      Number(row.orden) === nuevoOrden
    ) {

      duplicatedVista = row.Vista

      const cleared = {
        ...row,
        orden: null
      }

      saveRow(cleared)

      return cleared
    }

    if (row.id_orden_vista === idOrdenVista) {

      const modified = {
        ...row,
        orden: nuevoOrden
      }

      saveRow(modified)

      return modified
    }

    return row
  })

  setRows(updated)

  if (duplicatedVista) {

    setToast(
      `"${duplicatedVista}" perdió el orden ${nuevoOrden}`
    )

    setTimeout(() => {
      setToast(null)
    }, 3500)
  }
}

  if (loading) {
    return (
      <div className="p-6">
        Cargando...
      </div>
    )
  }
  const handleGuardar = () => {
  window.location.reload()
}

  return (
    <div className="w-full">

      <div
        className={`
          rounded-2xl
          border
          shadow-xl
          overflow-hidden
          ${isDark
            ? "bg-slate-900 border-slate-700"
            : "bg-white border-slate-200"
          }
        `}
      >

        {/* HEADER */}

        <div
          className={`
            px-5 py-4
            border-b
            font-semibold
            text-sm
            ${isDark
              ? "border-slate-700 text-slate-200"
              : "border-slate-200 text-slate-700"
            }
          `}
        >
          Control de Vistas
        </div>

        {/* TABLA */}

       <div
  className="
    overflow-y-auto
    overflow-x-hidden
    max-h-[520px]
  "
>

  <table className="w-full text-sm">

            <thead>

              <tr
                className={
                  isDark
                    ? "bg-slate-800 text-slate-300"
                    : "bg-slate-50 text-slate-700"
                }
              >
                <th className="text-left px-4 py-3">
                  Vista
                </th>

                <th className="text-center px-4 py-3">
                  Activo
                </th>

                <th className="text-center px-4 py-3">
                  Orden
                </th>

                <th className="text-center px-4 py-3">
                  Nivel Vista
                </th>
              </tr>

            </thead>

            <tbody>

              {rows.map(row => (

                <tr
                  key={row.id_orden_vista}
                  className={
                    isDark
                      ? "border-t border-slate-800"
                      : "border-t border-slate-100"
                  }
                >

                  {/* VISTA */}

                  <td
                    className="
                      px-4
                      py-3
                      font-medium
                    "
                  >
                    {row.Vista}
                  </td>

                  {/* ACTIVO */}

                  <td className="px-4 py-3 text-center">

                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      className="
                        inline-flex
                        cursor-pointer
                      "
                      onClick={() =>
                        toggleActivo(row.id_orden_vista)
                      }
                    >
                      {row.activo
                        ? (
                          <Eye
                            size={18}
                            className="text-green-500"
                          />
                        )
                        : (
                          <EyeOff
                            size={18}
                            className="text-red-500"
                          />
                        )
                      }
                    </motion.div>

                  </td>

                  {/* ORDEN */}

                  <td className="px-4 py-3 text-center">

                    <input
                      type="number"
                      value={row.orden ?? ""}
                      min="1"
                      className={`
                        w-20
                        px-2
                        py-1
                        rounded-lg
                        border
                        text-center
                        ${isDark
                          ? "bg-slate-800 border-slate-700"
                          : "bg-white border-slate-300"
                        }
                      `}
                      onChange={(e) =>
                        changeOrden(
  row.id_orden_vista,
  e.target.value
)
                      }
                    />

                  </td>

                  {/* NIVEL */}

                  <td className="px-4 py-3 text-center">

                    <select
                      value={row.nivel_vista ?? 1}
                      onChange={(e) =>
                        changeNivel(
  row.id_orden_vista,
  e.target.value
)
                      }
                      className={`
                        px-3
                        py-1
                        rounded-lg
                        border
                        ${isDark
                          ? "bg-slate-800 border-slate-700"
                          : "bg-white border-slate-300"
                        }
                      `}
                    >
                      <option value={1}>
                        1
                      </option>

                      <option value={2}>
                        2
                      </option>

                    </select>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
            <div
        className={`
          sticky
          bottom-0
          flex
          justify-end
          gap-3
          px-5
          py-4
          border-t
          ${isDark
            ? "bg-slate-900 border-slate-700"
            : "bg-white border-slate-200"
          }
        `}
      >

        <button
          type="button"
          onClick={handleGuardar}
          className="
            px-5
            py-2
            rounded-lg
            bg-green-600
            text-white
            font-medium
            hover:bg-green-700
            transition-colors
          "
        >
          Guardar cambios
        </button>

      </div>

      {/* TOAST */}

      <AnimatePresence>

        {toast && (

          <motion.div
            initial={{
              opacity: 0,
              y: 40
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: 40
            }}
            className="
              fixed
              bottom-6
              right-6
              z-[999]
              bg-amber-500
              text-white
              px-4
              py-3
              rounded-xl
              shadow-xl
              text-sm
            "
          >
            {toast}
          </motion.div>

        )}

      </AnimatePresence>

    </div>
  )
}