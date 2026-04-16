"use client"

import { useState, useEffect } from 'react'
import { FiSearch } from 'react-icons/fi'
import { motion, AnimatePresence } from "motion/react"
import { LayoutGrid } from "lucide-react"
import { useLocalTheme } from '../../context/useLocalTheme'
import { getSubcampanias } from '../../services/leads.service'
import ColumnCustomizer from './ColumnCustomizer'

function LeadFilters({ onSearch, columns, setColumns }) {

  const { theme } = useLocalTheme()
  const isDark = theme === 'dark'

  const [fecha, setFecha] = useState(() => {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  })

  const [idCamp, setIdCamp] = useState(null)
  const [subcampanias, setSubcampanias] = useState([])
  const [iniCampania, setIniCampania] = useState('')
  const [showColumnPanel, setShowColumnPanel] = useState(false)

  // cargar campaña y subcampañas
useEffect(() => {

  const params = new URLSearchParams(window.location.search)
  const campFromURL = params.get("camp")

  const finalCamp = campFromURL || localStorage.getItem('id_campana')

  if (!finalCamp) return

  const parsedCamp = parseInt(finalCamp)
  setIdCamp(parsedCamp)

  getSubcampanias(parsedCamp)
    .then(data => {
      setSubcampanias(data || [])
      setIniCampania('')
    })
    .catch(err => {
      console.error('Error cargando subcampañas:', err)
      setSubcampanias([])
    })

}, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!fecha) {
      alert('Debe seleccionar una fecha')
      return
    }

    if (!idCamp) {
      alert('No hay campaña seleccionada')
      return
    }

    onSearch({
      IdCamp: idCamp,
      FechaIngreso: fecha,
      inicampania: iniCampania
    })
  }

  return (

    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`w-full p-4 rounded-xl shadow-md mb-6 transition-all duration-300 ${
        isDark
          ? 'bg-slate-800 shadow-black/20 hover:shadow-black/40'
          : 'bg-white shadow-slate-200 hover:shadow-slate-300'
      }`}
    >

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4 items-end justify-between flex-wrap"
      >

        <div className="flex flex-col sm:flex-row gap-4 items-end flex-wrap">

          {/* FECHA */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="flex flex-col"
          >

            <label className="text-sm mb-1 font-medium">
              Fecha
            </label>

            <motion.input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              whileFocus={{ scale: 1.02 }}
              className={`px-3 py-2 rounded-lg border cursor-pointer transition-all duration-200 focus:ring-2 ${
                isDark
                  ? 'bg-slate-700 text-white border-slate-600 focus:ring-blue-500/40'
                  : 'bg-slate-100 text-slate-800 border-slate-300 focus:ring-blue-400/40'
              }`}
            />

          </motion.div>

          {/* SUBCAMPAÑA */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="flex flex-col w-64"
          >

            <label className="text-sm mb-1 font-medium">
              Inicampania
            </label>

            <motion.select
              value={iniCampania}
              onChange={(e) => setIniCampania(e.target.value)}
              whileFocus={{ scale: 1.02 }}
              className={`px-3 py-2 rounded-lg border cursor-pointer transition-all duration-200 focus:ring-2 ${
                isDark
                  ? 'bg-slate-700 text-white border-slate-600 focus:ring-blue-500/40'
                  : 'bg-slate-100 text-slate-800 border-slate-300 focus:ring-blue-400/40'
              }`}
            >

              <option value="">Todas</option>

              {subcampanias.map((item) => {
  if (!item?.IniCampania) return null

  return (
    <option
      key={item.IniCampania}
      value={item.IniCampania}
    >
      {item.IniCampania}
    </option>
  )
})}

            </motion.select>

          </motion.div>

          {/* BOTÓN BUSCAR */}
          <motion.button
            type="submit"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.15 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md ${
              isDark
                ? 'bg-[#74F2F2] text-black hover:bg-[#30BABA]'
                : 'bg-[#354196] text-white hover:bg-[#1f3147]'
            }`}
          >

            <motion.span
              whileHover={{ rotate: 12 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center"
            >
              <FiSearch />
            </motion.span>

            Buscar

          </motion.button>

        </div>

        {/* PANEL DE COLUMNAS */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.2 }}
          className="relative"
        >

          <motion.button
            type="button"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 260 }}
            onClick={() => setShowColumnPanel(!showColumnPanel)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm border shadow-sm transition-all duration-200 hover:shadow-md ${
              isDark
                ? 'bg-slate-700 hover:bg-slate-600 text-white border-slate-600'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
          >

            <motion.span
              animate={{ rotate: showColumnPanel ? 90 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              <LayoutGrid size={18} />
            </motion.span>

            Vista

          </motion.button>

          <AnimatePresence>

            {showColumnPanel && (

              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 mt-2 z-50"
              >

                <ColumnCustomizer
                  columns={columns}
                  setColumns={setColumns}
                  show={showColumnPanel}
                  setShow={setShowColumnPanel}
                />

              </motion.div>

            )}

          </AnimatePresence>

        </motion.div>

      </form>

    </motion.div>

  )

}

export default LeadFilters