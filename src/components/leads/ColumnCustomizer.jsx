"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"
import { useEffect, useRef } from "react"
import { useLocalTheme } from "../../context/useLocalTheme"

export default function ColumnCustomizer({
  columns = [],
  setColumns,
  show,
  setShow
}) {

  const { theme } = useLocalTheme()
  const isDark = theme === "dark"

  const panelRef = useRef(null)

  const toggleColumnVisibility = (key) => {
    setColumns(prev =>
      prev.map(col =>
        col.key === key
          ? { ...col, visible: !col.visible }
          : col
      )
    )
  }

  // cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setShow(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [setShow])

  return (
    <div className="relative">

      <AnimatePresence>
        {show && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className={`
              absolute right-0 mt-3 z-50
              w-[340px]
              max-h-[420px]
              overflow-y-auto
              rounded-2xl
              border
              backdrop-blur-md
              shadow-2xl
              p-4
              ${isDark
                ? "bg-slate-900/95 border-slate-700 text-slate-200"
                : "bg-white/95 border-slate-300 text-slate-800"
              }
            `}
          >

            {/* HEADER */}
            <div className={`
              mb-3 pb-2 border-b text-sm font-semibold
              ${isDark ? "border-slate-700" : "border-slate-200"}
            `}>
              Personalizar columnas
            </div>

            <div className="space-y-2 text-sm">

              {columns.map(col => (
                <div
                  key={col.key}
                  className={`
                    flex items-center justify-between
                    px-2 py-1.5 rounded-lg
                    transition-colors
                    ${isDark
                      ? "hover:bg-slate-800"
                      : "hover:bg-slate-100"
                    }
                  `}
                >

                  <span className="truncate">
                    {col.label}
                  </span>

                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    onClick={() => toggleColumnVisibility(col.key)}
                    className="cursor-pointer"
                  >
                    {col.visible
                      ? <Eye size={18} className="text-green-500" />
                      : <EyeOff size={18} className={isDark ? "text-slate-500" : "text-slate-400"} />
                    }
                  </motion.div>

                </div>
              ))}

            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}