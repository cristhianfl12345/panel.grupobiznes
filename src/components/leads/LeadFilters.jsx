"use client"

import { useState, useEffect, useMemo } from 'react'
import { FiSearch, FiFilter } from 'react-icons/fi'
import { motion, AnimatePresence } from "framer-motion"
import { LayoutGrid } from "lucide-react"
import { useLocalTheme } from '../../context/useLocalTheme'
import { getSubcampanias } from '../../services/leads.service'
import ColumnCustomizer from './ColumnCustomizer'
import { INDICE_CAMPS } from '../../context/indiceCamps'

function LeadFilters({ onSearch, columns, setColumns, leads = [], onFilterChange }) {

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

  const [showFilters, setShowFilters] = useState(false)

  const [columnFilters, setColumnFilters] = useState({
    pautanameanuncio: '',
    CampaOrigen: '',
    Alias: ''
  })

  const campInfo = useMemo(() => {
    if (!idCamp) return null
    return INDICE_CAMPS.find(c => String(c.id_camp) === String(idCamp)) || null
  }, [idCamp])

  const uniqueValues = useMemo(() => {

    const extract = (key) => {
      const set = new Set()

      leads.forEach(l => {
        const val = l[key]
        if (val !== null && val !== undefined && val !== '') {
          set.add(val)
        }
      })

      return Array.from(set).sort()
    }

    return {
      pautanameanuncio: extract('pautanameanuncio'),
      CampaOrigen: extract('CampaOrigen'),
      Alias: extract('Alias')
    }

  }, [leads])

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(columnFilters)
    }
  }, [columnFilters])

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

  const handleFilterChange = (key, value) => {
    setColumnFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (

    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`w-full p-4 rounded-xl shadow-md mb-6 relative ${
        isDark ? 'bg-slate-800' : 'bg-white'
      }`}
    >


{/* HEADER ALINEADO A LA IZQUIERDA CON OFFSET */}
{campInfo && (
  <div className="text-lg absolute left-0 -top-9 translate-y-[1px] z-10 px-4 py-1">
    <span className={`text-xll font-semibold whitespace-nowrap ${
      isDark ? 'text-slate-300' : 'text-slate-700'
    }`}>
      KPI / Operativos / {campInfo.nombre} / Monitor de Leads 
    </span>
  </div>
)}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >

        <div className="flex flex-col sm:flex-row gap-4 items-end justify-between flex-wrap">

          <div className="flex flex-col sm:flex-row gap-4 items-end flex-wrap">

            <div className="flex flex-col">
              <label className="text-sm mb-1 font-medium">Fecha</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className={`px-3 py-2 rounded-lg border ${
                  isDark ? 'bg-slate-700 text-white' : 'bg-slate-100'
                }`}
              />
            </div>

            <div className="flex flex-col w-64">
              <label className="text-sm mb-1 font-medium">Inicampania</label>
              <select
                value={iniCampania}
                onChange={(e) => setIniCampania(e.target.value)}
                className={`px-3 py-2 rounded-lg border ${
                  isDark ? 'bg-slate-700 text-white' : 'bg-slate-100'
                }`}
              >
                <option value="">Todas</option>
                {subcampanias.map((item) => (
                  item?.IniCampania && (
                    <option key={item.IniCampania} value={item.IniCampania}>
                      {item.IniCampania}
                    </option>
                  )
                ))}
              </select>
            </div>

            <button
              type="submit"
              className={`flex items-center gap-2 px-5 py-2 rounded-lg ${
                isDark ? 'bg-[#6E0303]' : 'bg-[#CC0404] text-white'
              }`}
            >
              <FiSearch />
              Buscar
            </button>

            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border"
            >
              <FiFilter />
              Filtros
            </button>

          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColumnPanel(!showColumnPanel)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border"
            >
              <LayoutGrid size={18} />
              Vista
            </button>

            {showColumnPanel && (
              <div className="absolute right-0 mt-2 z-50">
                <ColumnCustomizer
                  columns={columns}
                  setColumns={setColumns}
                  show={showColumnPanel}
                  setShow={setShowColumnPanel}
                />
              </div>
            )}
          </div>

        </div>

<AnimatePresence>
  {showFilters && (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className={`grid grid-cols-1 md:grid-cols-3 gap-4 mt-2 ${
        isDark ? 'bg-slate-800/50' : 'bg-slate-50'
      } p-3 rounded-lg`}
    >

      <div className="flex flex-col">
        <label className={`text-xs mb-1 ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}>
          Pauta
        </label>
        <select
          value={columnFilters.pautanameanuncio}
          onChange={(e) => handleFilterChange('pautanameanuncio', e.target.value)}
          className={`px-3 py-2 rounded border ${
            isDark
              ? 'bg-slate-700 text-white border-slate-600'
              : 'bg-white text-slate-800 border-slate-300'
          }`}
        >
          <option value="">Todas</option>
          {uniqueValues.pautanameanuncio.map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className={`text-xs mb-1 ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}>
          Campaña Origen
        </label>
        <select
          value={columnFilters.CampaOrigen}
          onChange={(e) => handleFilterChange('CampaOrigen', e.target.value)}
          className={`px-3 py-2 rounded border ${
            isDark
              ? 'bg-slate-700 text-white border-slate-600'
              : 'bg-white text-slate-800 border-slate-300'
          }`}
        >
          <option value="">Todas</option>
          {uniqueValues.CampaOrigen.map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className={`text-xs mb-1 ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}>
          Alias
        </label>
        <select
          value={columnFilters.Alias}
          onChange={(e) => handleFilterChange('Alias', e.target.value)}
          className={`px-3 py-2 rounded border ${
            isDark
              ? 'bg-slate-700 text-white border-slate-600'
              : 'bg-white text-slate-800 border-slate-300'
          }`}
        >
          <option value="">Todas</option>
          {uniqueValues.Alias.map(v => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>

    </motion.div>
  )}
</AnimatePresence>

      </form>

    </motion.div>
  )
}

export default LeadFilters