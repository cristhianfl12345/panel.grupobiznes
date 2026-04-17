"use client"

import { useState, useMemo } from 'react'
import LeadRow from './LeadRow'
import { useLocalTheme } from '../../context/useLocalTheme'
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRightLeft } from "lucide-react"

export default function LeadTable({ 
  leads = [], 
  loading, 
  searched, 
  onCopy,
  columns,
  setColumns
}) {

  const { theme } = useLocalTheme()
  const isDark = theme === 'dark'

  const [draggedKey, setDraggedKey] = useState(null)

  const visibleColumns = columns?.filter(col => col.visible) || []

  const getKey = (col) => col.key || col.query_vista
  const getLabel = (col) => col.label || col.Vista

  const handleDragStart = (key) => {
    setDraggedKey(key)
  }

const handleDrop = (targetKey) => {
  if (!draggedKey) return

  // no permitir mover index
  if (draggedKey === "index") return

  // no permitir que nada se coloque antes de index
  if (targetKey === "index") return

  const newColumns = [...columns]

  const fromIndex = newColumns.findIndex(c => (c.key || c.query_vista) === draggedKey)
  const toIndex = newColumns.findIndex(c => (c.key || c.query_vista) === targetKey)

  if (fromIndex === -1 || toIndex === -1) return

  const [moved] = newColumns.splice(fromIndex, 1)
  newColumns.splice(toIndex, 0, moved)

  setColumns(newColumns)
  setDraggedKey(null)
}
  // PAGINACIÓN
  const rowsPerPage = 20
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(leads.length / rowsPerPage)

  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    const end = start + rowsPerPage
    return leads.slice(start, end)
  }, [leads, currentPage])

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (

    <div className="w-full h-[calc(100vh-220px)] flex flex-col">

      {/* CONTENEDOR TABLA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className={`
          flex-1 overflow-auto
          rounded-xl
          shadow-md
          transition-colors
          ${isDark ? "bg-slate-900" : "bg-white"}
        `}
      >

        <table className={`
          w-full
          table-auto
          text-xs
          border-collapse
          ${isDark 
            ? 'text-slate-200' 
            : 'text-slate-800'
          }
        `}>

          {/* HEADER */}
          <thead className={`
            sticky top-0 z-20
            backdrop-blur
            ${isDark ? 'bg-slate-800/95' : 'bg-gray-100/95'}
          `}>

            <tr>

              <AnimatePresence initial={false}>

                {visibleColumns.map((col, i) => {

                  const key = getKey(col)
                  const label = getLabel(col)

                  return (

                    <th
                      key={key}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(key)}
                      className={`
                        border
                        px-3 py-2
                        text-left
                        whitespace-nowrap
                        transition-colors
                        ${isDark ? 'border-slate-700' : 'border-slate-300'}
                        ${i === 0 ? "rounded-tl-xl" : ""}
                        ${i === visibleColumns.length - 1 ? "rounded-tr-xl" : ""}
                      `}
                    >

                      <motion.div
  draggable={key !== "index"}
  onDragStart={() => key !== "index" && handleDragStart(key)}
  whileHover={key !== "index" ? { scale: 1.05 } : {}}
  whileTap={key !== "index" ? { scale: 0.95 } : {}}
  className={`flex items-center gap-2 select-none ${
    key === "index" ? "" : "cursor-move group"
  }`}
>

                       {key !== "index" && (
  <motion.div
    whileHover={{ rotate: 90, scale: 1.2 }}
    transition={{ type: "spring", stiffness: 300 }}
    className="text-slate-400 group-hover:text-blue-500"
  >
    <ArrowRightLeft size={14}/>
  </motion.div>
)}

                        <span className="font-medium whitespace-nowrap">
                          {label}
                        </span>

                      </motion.div>

                    </th>

                  )

                })}

              </AnimatePresence>

            </tr>

          </thead>

          {/* BODY */}
<tbody key={currentPage}>
  {!loading && paginatedLeads.map((lead, index) => (
    <LeadRow
      key={`${lead.idkey}-${currentPage}-${index}`} // solucion de renderizado sobrescrito
      lead={lead}
      index={leads.length - ((currentPage - 1) * rowsPerPage + index)}
      onCopy={onCopy}
      columns={visibleColumns}
      isDark={isDark}
    />
  ))}
</tbody>

        </table>

      </motion.div>


      {/* PAGINADOR */}
      {!loading && leads.length > 0 && (

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className={`
            flex
            justify-center
            items-center
            gap-2
            p-4
            border-t
            flex-wrap
            ${isDark ? 'border-slate-700' : 'border-slate-300'}
          `}
        >

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg border disabled:opacity-40"
          >
            «
          </motion.button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (

            <motion.button
              key={page}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => goToPage(page)}
              className={`
                px-3 py-1
                rounded-lg
                border
                transition
                ${
                  currentPage === page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : isDark
                      ? 'hover:bg-slate-700'
                      : 'hover:bg-slate-200'
                }
              `}
            >
              {page}
            </motion.button>

          ))}

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg border disabled:opacity-40"
          >
            »
          </motion.button>

        </motion.div>

      )}

    </div>
  )
}