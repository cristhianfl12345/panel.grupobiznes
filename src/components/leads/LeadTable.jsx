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
  setColumns,
  detailColumns
}) {

  const { theme } = useLocalTheme()

  const isDark = theme === 'dark'

  const [draggedKey, setDraggedKey] = useState(null)

  const visibleColumns =
    columns?.filter(col => col.visible) || []

  const getKey = (col) =>
    col.key || col.query_vista

  const getLabel = (col) =>
    col.label || col.Vista

  const handleDragStart = (key) => {
    setDraggedKey(key)
  }

  const handleDrop = (targetKey) => {

    if (!draggedKey) return

    if (draggedKey === "index") return

    if (targetKey === "index") return

    const newColumns = [...columns]

    const fromIndex = newColumns.findIndex(
      c =>
        (c.key || c.query_vista) === draggedKey
    )

    const toIndex = newColumns.findIndex(
      c =>
        (c.key || c.query_vista) === targetKey
    )

    if (
      fromIndex === -1 ||
      toIndex === -1
    ) return

    const [moved] = newColumns.splice(
      fromIndex,
      1
    )

    newColumns.splice(toIndex, 0, moved)

    setColumns(newColumns)

    setDraggedKey(null)

  }

  // =========================================================
  // PAGINACIÓN
  // =========================================================

  const rowsPerPage = 20

  const [currentPage, setCurrentPage] =
    useState(1)

  const totalPages = Math.ceil(
    leads.length / rowsPerPage
  )

  const paginatedLeads = useMemo(() => {

    const start =
      (currentPage - 1) * rowsPerPage

    const end = start + rowsPerPage

    return leads.slice(start, end)

  }, [leads, currentPage])

  const goToPage = (page) => {

    if (
      page >= 1 &&
      page <= totalPages
    ) {
      setCurrentPage(page)
    }

  }

  return (

    <div className="w-full h-[calc(100vh-220px)] flex flex-col">

      {/* ========================================================= */}
      {/* TABLA */}
      {/* ========================================================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.28
        }} //antes el rounded estaba en 28
        className={`
          relative
          flex-1
          overflow-hidden
          rounded-[0px] 
          border
          shadow-[0_20px_60px_rgba(0,0,0,0.25)]
          transition-all
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

        {/* GLOW */}
        <div
          className="
            pointer-events-none
            absolute inset-0
            bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_30%)]
          "
        />

        {/* SCROLL */}
        <div className="h-full overflow-auto">

          <table
            className={`
              w-full
              table-auto
              border border-spacing-0
              text-xs
              ${
                isDark
                  ? 'text-white'
                  : 'text-slate-800'
              }
            `}
          >

            {/* ========================================================= */}
            {/* HEADER */}
            {/* ========================================================= */}

            <thead
              className={`
                sticky top-0 z-20
                backdrop-blur-xl
                border-b
                ${
                  isDark
                    ? `
                      border-[#343746]
                      bg-[#20222C]/95
                    `
                    : `
                      border-slate-200
                      bg-slate-500
                    `
                }
              `}
            >

              <tr>

               <AnimatePresence initial={false}>

  {visibleColumns.map((col, i) => {

    const key = getKey(col)

    const label = getLabel(col)

    return (

      <th
        key={key}
        onDragOver={(e) =>
          e.preventDefault()
        }
        onDrop={() =>
          handleDrop(key)
        }
        className={`
          relative
          px-5 py-4
          text-left
          whitespace-nowrap
          border-r
          border-b
          transition-all
          ${
            isDark
              ? `
                bg-[#252834]
                border-[#404454]/95
              `
              : `
                bg-red-300
                border-black/95
              `
          }
          ${
            i === visibleColumns.length - 1
              ? 'border-r-0'
              : ''
          }
        `}
      >

        {/* LINEA SUPERIOR */}
        <div
          className="
            absolute top-0 left-0
            h-px w-full
            bg-gradient-to-r
            from-transparent
            via-red-500/50
            to-transparent
          "
        />

        <motion.div
          draggable={
            key !== "index"
          }
          onDragStart={() =>
            key !== "index" &&
            handleDragStart(key)
          }
          whileHover={
            key !== "index"
              ? {
                  scale: 1.02
                }
              : {}
          }
          whileTap={
            key !== "index"
              ? {
                  scale: 0.96
                }
              : {}
          }
          className={`
            flex items-center gap-2
            select-none
            ${
              key === "index"
                ? ""
                : "cursor-move group"
            }
          `}
        >
{/* 
          {key !== "index" && (

            <motion.div
              whileHover={{
                rotate: 90,
                scale: 1.15
              }}
              transition={{
                type: "spring",
                stiffness: 280
              }}
              className={`
                flex h-7 w-7
                items-center justify-center
                rounded-xl
                border
                transition-all
                ${
                  isDark
                    ? `
                      border-[#3B3E4E]
                      bg-[#2A2C38]
                      text-slate-400
                      group-hover:border-blue-500/40
                      group-hover:text-blue-400
                    `
                    : `
                      border-slate-200
                      bg-slate-50
                      text-slate-500
                      group-hover:border-blue-300
                      group-hover:text-blue-500
                    `
                }
              `}
            >
              <ArrowRightLeft size={13} />
            </motion.div>

          )}
*/}
          <span
            className={`
              text-[11px]
              font-black
              uppercase
              tracking-[0.12em]
              ${
                isDark
                  ? 'text-slate-50'
                  : 'text-slate-800'
              }
            `}
          >
            {label}
          </span>

        </motion.div>

      </th>

    )

  })}

</AnimatePresence>

              </tr>

            </thead>

            {/* ========================================================= */}
            {/* BODY */}
            {/* ========================================================= */}

            <tbody key={currentPage}>

              {!loading && paginatedLeads.map(
                (lead, index) => (

                  <LeadRow
                    key={`${lead.idkey}-${currentPage}-${index}`}
                    lead={lead}
                    index={
                      leads.length -
                      (
                        (
                          currentPage - 1
                        ) * rowsPerPage +
                        index
                      )
                    }
                    onCopy={onCopy}
                    columns={visibleColumns}
                    detailColumns={detailColumns}
                    isDark={isDark}
                  />

                )
              )}

            </tbody>

          </table>

          {/* EMPTY */}
          {!loading &&
            searched &&
            paginatedLeads.length === 0 && (

              <div
                className={`
                  flex flex-col
                  items-center justify-center
                  py-20
                  text-center
                  ${
                    isDark
                      ? 'text-slate-400'
                      : 'text-slate-500'
                  }
                `}
              >

                <div
                  className={`
                    mb-4
                    flex h-20 w-20
                    items-center justify-center
                    rounded-full
                    border
                    ${
                      isDark
                        ? `
                          border-[#343746]
                          bg-[#232530]
                        `
                        : `
                          border-slate-200
                          bg-slate-50
                        `
                    }
                  `}
                >
                  <ArrowRightLeft
                    size={28}
                  />
                </div>

                <h3 className="text-lg font-bold">
                  No se encontraron resultados
                </h3>

                <p className="mt-1 text-sm opacity-80">
                  Ajusta los filtros o realiza una nueva búsqueda
                </p>

              </div>

            )}

        </div>

      </motion.div>

      {/* ========================================================= */}
      {/* PAGINADOR */}
      {/* ========================================================= */}

      {!loading && leads.length > 0 && (

        <motion.div
          initial={{
            opacity: 0,
            y: 8
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.25
          }}
          className={`
            relative
            mt-4
            overflow-hidden
            rounded-b-[28px]
            border-b
            border-r
            border-l
            px-5 py-4
            shadow-xl
            backdrop-blur-xl
            flex items-center justify-center gap-2 flex-wrap
            ${
              isDark
                ? `
                  border-[#343746]
                  bg-[#1B1C24]/95
                `
                : `
                  border-slate-400
                  bg-white/95
                `
            }
          `}
        >

          {/* GLOW */}
          <div
            className="
              pointer-events-none
              absolute inset-x-0 top-0 h-px
              bg-gradient-to-r
              from-transparent
              via-blue-500/40
              to-transparent
            "
          />

          {/* PREV */}
          <motion.button
            whileHover={{
              scale: 1.06,
              y: -1
            }}
            whileTap={{
              scale: 0.94
            }}
            onClick={() =>
              goToPage(currentPage - 1)
            }
            disabled={currentPage === 1}
            className={`
              h-10 min-w-[42px]
              rounded-2xl
              border
              text-sm font-black
              transition-all
              shadow-lg
              disabled:opacity-40
              ${
                isDark
                  ? `
                    border-[#343746]
                    bg-[#232530]
                    text-slate-200
                    hover:bg-[#2A2C38]
                  `
                  : `
                    border-slate-200
                    bg-white
                    text-slate-700
                    hover:bg-slate-50
                  `
              }
            `}
          >
            «
          </motion.button>

          {/* PAGINAS */}
          {Array.from(
            { length: totalPages },
            (_, i) => i + 1
          ).map((page) => (

            <motion.button
              key={page}
              whileHover={{
                scale: 1.08,
                y: -1
              }}
              whileTap={{
                scale: 0.94
              }}
              onClick={() =>
                goToPage(page)
              }
              className={`
                h-10 min-w-[42px]
                rounded-2xl
                border
                px-3
                text-sm font-black
                transition-all
                shadow-lg
                ${
                  currentPage === page
                    ? `
                      border-blue-500/30
                      bg-gradient-to-r
                      from-red-600
                      via-red-500
                      to-red-400
                      text-white
                      shadow-red-500/30
                    `
                    : isDark
                      ? `
                        border-[#343746]
                        bg-[#232530]
                        text-slate-300
                        hover:bg-[#2A2C38]
                      `
                      : `
                        border-slate-200
                        bg-white
                        text-slate-700
                        hover:bg-slate-50
                      `
                }
              `}
            >
              {page}
            </motion.button>

          ))}

          {/* NEXT */}
          <motion.button
            whileHover={{
              scale: 1.06,
              y: -1
            }}
            whileTap={{
              scale: 0.94
            }}
            onClick={() =>
              goToPage(currentPage + 1)
            }
            disabled={
              currentPage === totalPages
            }
            className={`
              h-10 min-w-[42px]
              rounded-2xl
              border
              text-sm font-black
              transition-all
              shadow-lg
              disabled:opacity-40
              ${
                isDark
                  ? `
                    border-[#343746]
                    bg-[#232530]
                    text-slate-200
                    hover:bg-[#2A2C38]
                  `
                  : `
                    border-slate-200
                    bg-white
                    text-slate-700
                    hover:bg-slate-50
                  `
              }
            `}
          >
            »
          </motion.button>

        </motion.div>

      )}

    </div>

  )

}