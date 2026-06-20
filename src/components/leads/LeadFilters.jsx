"use client"

import { useState, useEffect, useMemo } from 'react'

import {
  FiSearch,
  FiFilter
} from 'react-icons/fi'

import {
  FaUsers
} from 'react-icons/fa6'

import {
  MdClose
} from 'react-icons/md'

import {
  LayoutGrid,
  CalendarDays,
  Send,
  Users,
  Loader2,
  Eye,
  EyeOff
} from "lucide-react"
import { IoSettingsOutline } from "react-icons/io5";

import {
  motion,
  AnimatePresence
} from "framer-motion"

import { useLocalTheme } from '../../context/useLocalTheme'
import { getSubcampanias } from '../../services/leads.service'
import ColumnCustomizer from './ColumnCustomizer'
import { INDICE_CAMPS } from '../../context/indiceCamps'
import DescargarInfo from "../visualizaciones/DescargarInfo"
import ControlVistas from "./ControlVistas"

function LeadFilters({
  onSearch,
  columns,
  setColumns,
  leads = [],
  onFilterChange
}) {

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

  const [showColumnPanel, setShowColumnPanel] =
    useState(false)
  
    const [showControlVistas, setShowControlVistas] = useState(false)

  const [showFilters, setShowFilters] =
    useState(false)

  // =========================================================
  // MASIVOS
  // =========================================================

  const [showMasivosModal, setShowMasivosModal] =
    useState(false)

  const [agentesMasivos, setAgentesMasivos] =
    useState([])

  const [selectedAgents, setSelectedAgents] =
    useState([])

  const [fechaInicio, setFechaInicio] =
    useState('')

  const [fechaFin, setFechaFin] =
    useState('')

  const [loadingMasivos, setLoadingMasivos] =
    useState(false)

  // =========================================================

  const [columnFilters, setColumnFilters] =
    useState({
      pautanameanuncio: '',
      CampaOrigen: '',
      Alias: '',
      discador: '',
      gestiones: ''
    })

  const campInfo = useMemo(() => {

    if (!idCamp) return null

    return (
      INDICE_CAMPS.find(
        c => String(c.id_camp) === String(idCamp)
      ) || null
    )

  }, [idCamp])

  const uniqueValues = useMemo(() => {

const extract = (key) => {

  const set = new Set()

  leads.forEach(l => {

    const val = l[key]

    if (
      key === 'discador' ||
      key === 'gestiones'
    ) {

      set.add(
        val == null || val === ''
          ? 0
          : Number(val)
      )

    } else {

      if (
        val !== null &&
        val !== undefined &&
        val !== ''
      ) {
        set.add(val)
      }

    }

  })

  return Array.from(set).sort()

}

    return {
      pautanameanuncio: extract('pautanameanuncio'),
      CampaOrigen: extract('CampaOrigen'),
      Alias: extract('Alias'),
      discador: extract('discador'),
      gestiones: extract('gestiones')
    }

  }, [leads])

  useEffect(() => {

    if (onFilterChange) {
      onFilterChange(columnFilters)
    }

  }, [columnFilters])

  useEffect(() => {

    const params = new URLSearchParams(
      window.location.search
    )

    const campFromURL = params.get("camp")

    const finalCamp =
      campFromURL ||
      localStorage.getItem('id_campana')

    if (!finalCamp) return

    const parsedCamp = parseInt(finalCamp)

    setIdCamp(parsedCamp)

    getSubcampanias(parsedCamp)
      .then(data => {

        setSubcampanias(data || [])

        setIniCampania('')

      })
      .catch(err => {

        console.error(
          'Error cargando subcampañas:',
          err
        )

        setSubcampanias([])

      })

  }, [])

  // =========================================================
  // AGENTES MASIVOS
  // =========================================================

  const openMasivosModal = async () => {

    if (!idCamp) return

    try {
const token = localStorage.getItem('token')
      setLoadingMasivos(true)

      const response = await fetch(
        `http://192.168.9.115:4000/api/leads/masivos-carterizado/${idCamp}/4`,
       // `http://192.168.9.115:4000/api/leads/masivos-carterizado/${idCamp}/4`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      const agentes =
        Array.isArray(data)
          ? data
          : data?.data || []

      setAgentesMasivos(agentes)

      setShowMasivosModal(true)

    } catch (error) {

      console.error(
        'Error obteniendo agentes:',
        error
      )

      setAgentesMasivos([])

    } finally {

      setLoadingMasivos(false)

    }

  }

  const handleCheckAgent = (idUsuario) => {

    setSelectedAgents(prev => {

      if (prev.includes(idUsuario)) {
        return prev.filter(id => id !== idUsuario)
      }

      return [...prev, idUsuario]

    })

  }
  const handleAsignacionMasiva = async () => {

  try {

    if (!selectedAgents.length) {

      alert('Seleccione al menos un agente')

      return

    }

    if (!fechaInicio || !fechaFin) {

      alert('Seleccione fecha inicio y fecha fin')

      return

    }

    if (!idCamp) {

      alert('No existe una campaña seleccionada')

      return

    }

    const token = localStorage.getItem('token')

    setLoadingMasivos(true)

    const fechaInicioSQL =
      fechaInicio.replace('T', ' ') + ':00'

    const fechaFinSQL =
      fechaFin.replace('T', ' ') + ':00'

    const response = await fetch(
      'http://192.168.9.115:4000/api/leads/asignar-leads',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fechaInicio: fechaInicioSQL,
          fechaFin: fechaFinSQL,
          idCamp,
          usuarios: selectedAgents
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {

      throw new Error(
        data?.message ||
        'Error al asignar leads'
      )

    }

    alert(
      `Se asignaron ${data.totalLeads} leads entre ${data.totalUsuarios} agentes`
    )

    setShowMasivosModal(false)

    setSelectedAgents([])

    setFechaInicio('')

    setFechaFin('')

  } catch (error) {

    console.error(error)

    alert(
      error.message ||
      'Error al realizar la asignación'
    )

  } finally {

    setLoadingMasivos(false)

  }

}

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

  const handleFilterChange = (
    key,
    value
  ) => {

    setColumnFilters(prev => ({
      ...prev,
      [key]: value
    }))

  }

  return (
// border-b-0 despues de border
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`w-full p-4 rounded-t-[28px] border-t border-r border-l border-slate-400 shadow-md mb-6 relative ${
        isDark
          ? 'bg-slate-800'
          : 'bg-white' 
      }`}
    >

      {/* HEADER */}
      {campInfo && (

        <div className="text-lg absolute left-0 -top-9 translate-y-[1px] z-10 px-4 py-1">

          <span
            className={`text-xll font-semibold whitespace-nowrap ${
              isDark
                ? 'text-slate-300'
                : 'text-slate-700'
            }`}
          >
            KPI / Operativos / {campInfo.nombre} / Monitor de Leads
          </span>

        </div>

      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >

        <div className="flex flex-col sm:flex-row gap-4 items-end justify-align flex-wrap">

          <div className="flex flex-col sm:flex-row gap-4 items-end flex-wrap">

            {/* FECHA */}
            <div className="flex flex-col">

              <label className="text-sm mb-1 font-medium">
                Fecha
              </label>

              <input
                type="date"
                value={fecha}
                onChange={(e) =>
                  setFecha(e.target.value)
                }
                className={`px-3 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-100'
                }`}
              />

            </div>

            {/* SUBCAMPAÑA */}
            <div className="flex flex-col w-64">

              <label className="text-sm mb-1 font-medium">
                Inicampania
              </label>

              <select
                value={iniCampania}
                onChange={(e) =>
                  setIniCampania(e.target.value)
                }
                className={`px-3 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-100'
                }`}
              >

                <option value="">
                  Todas
                </option>

                {subcampanias.map((item) => (

                  item?.IniCampania && (

                    <option
                      key={item.IniCampania}
                      value={item.IniCampania}
                    >
                      {item.IniCampania}
                    </option>

                  )

                ))}

              </select>

            </div>

            {/* BUSCAR */}
            <button
              type="submit"
              className={`flex items-center gap-2 px-5 py-2 rounded-lg ${
                isDark
                  ? 'bg-[#6E0303]'
                  : 'bg-[#CC0404] text-white'
              }`}
            >

              <FiSearch />

              Buscar

            </button>

            {/* FILTROS */}
            <button
              type="button"
              onClick={() =>
                setShowFilters(!showFilters)
              }
              className="flex items-center gap-2 px-4 py-2 rounded-lg border"
            >

              <FiFilter />

              Filtros

            </button>

          </div>

       

            {/* MASIVOS */}
            <motion.button 
              whileHover={{
                scale: 1.04,
                y: -1
              }}
              whileTap={{
                scale: 0.96
              }}
              type="button"
              onClick={openMasivosModal}
              className={`
                relative overflow-hidden
                flex items-center gap-2
                rounded-2xl border
                px-1 py-1
                font-semibold
                shadow-xl
                transition-all
                ${
                  isDark
                    ? `
                      border-red-500/20
                      bg-gradient-to-br
                      from-[#1E293B]
                      to-[#111827]
                      text-red-100
                      hover:border-red-400/40
                    `
                    : `
                      border-red-200
                      bg-gradient-to-br
                      from-red-50
                      to-red-100
                      text-slate-700
                    `
                }
              `}
            >

              <div
                className="
                  absolute top-0 right-0
                  h-22 w-22 rounded-full
                  bg-red-500/20 blur-3xl
                "
              />

   <div
  className="
    relative z-10
    flex h-8 w-27 items-center justify-between
    rounded-xl
    text-slate-600 
    text-xs font-semibold py-1 px-3
  "
>
  <span>Asignación</span>
  <FaUsers size={16} />
</div>
            
            </motion.button>
            {/* VISTA */}
            <div className="flex items-center gap-2 ml-auto relative">

              {Number(idCamp) === 90 && (
                <DescargarInfo />
              )}
{/* 
              <button
                type="button"
                onClick={() =>
                  setShowColumnPanel(!showColumnPanel)
                }
                className="flex items-center gap-2 px-4 py-2 rounded-lg border"
              >
                <LayoutGrid size={18} />
                Vista
              </button>
*/}
              <button
                type="button"
                onClick={() =>
                  setShowControlVistas(!showControlVistas)
                }
                className="flex items-center gap-2 px-2 py-2 rounded-lg border"
              >
                <IoSettingsOutline size={22} />
                
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

              {showControlVistas && (
                <div className="absolute right-0 top-14 z-50">
                  <ControlVistas />
                </div>
              )}

            </div>

          </div>
        

        {/* FILTROS */}
        <AnimatePresence>

          {showFilters && (

            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className={`grid grid-cols-1 md:grid-cols-5 gap-4 mt-2 ${
                isDark
                  ? 'bg-slate-800/50'
                  : 'bg-slate-50'
              } p-3 rounded-lg`}
            >

              {/* PAUTA */}
              <div className="flex flex-col">

                <label
                  className={`text-xs mb-1 ${
                    isDark
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  Pauta
                </label>

                <select
                  value={columnFilters.pautanameanuncio}
                  onChange={(e) =>
                    handleFilterChange(
                      'pautanameanuncio',
                      e.target.value
                    )
                  }
                  className={`px-3 py-2 rounded border ${
                    isDark
                      ? 'bg-slate-700 text-white border-slate-600'
                      : 'bg-white text-slate-800 border-slate-300'
                  }`}
                >

                  <option value="">
                    Todas
                  </option>

                  {uniqueValues.pautanameanuncio.map(v => (

                    <option key={v} value={v}>
                      {v}
                    </option>

                  ))}

                </select>

              </div>

              {/* CAMPA ORIGEN */}
              <div className="flex flex-col">

                <label
                  className={`text-xs mb-1 ${
                    isDark
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  Campaña Origen
                </label>

                <select
                  value={columnFilters.CampaOrigen}
                  onChange={(e) =>
                    handleFilterChange(
                      'CampaOrigen',
                      e.target.value
                    )
                  }
                  className={`px-3 py-2 rounded border ${
                    isDark
                      ? 'bg-slate-700 text-white border-slate-600'
                      : 'bg-white text-slate-800 border-slate-300'
                  }`}
                >

                  <option value="">
                    Todas
                  </option>

                  {uniqueValues.CampaOrigen.map(v => (

                    <option key={v} value={v}>
                      {v}
                    </option>

                  ))}

                </select>

              </div>

              {/* ALIAS */}
              <div className="flex flex-col">

                <label
                  className={`text-xs mb-1 ${
                    isDark
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  Alias
                </label>

                <select
                  value={columnFilters.Alias}
                  onChange={(e) =>
                    handleFilterChange(
                      'Alias',
                      e.target.value
                    )
                  }
                  className={`px-3 py-2 rounded border ${
                    isDark
                      ? 'bg-slate-700 text-white border-slate-600'
                      : 'bg-white text-slate-800 border-slate-300'
                  }`}
                >

                  <option value="">
                    Todas
                  </option>

                  {uniqueValues.Alias.map(v => (

                    <option key={v} value={v}>
                      {v}
                    </option>

                  ))}

                </select>

              </div>

               {/* Discador */}
              <div className="flex flex-col">

                <label
                  className={`text-xs mb-1 ${
                    isDark
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  Discador
                </label>

                <select
                  value={columnFilters.discador}
                  onChange={(e) =>
                    handleFilterChange(
                      'discador',
                      e.target.value
                    )
                  }
                  className={`px-3 py-2 rounded border ${
                    isDark
                      ? 'bg-slate-700 text-white border-slate-600'
                      : 'bg-white text-slate-800 border-slate-300'
                  }`}
                >

                  <option value="">
                    Todas
                  </option>

                  {uniqueValues.discador.map(v => (

                    <option key={v} value={v}>
                      {v}
                    </option>

                  ))}

                </select>

              </div>
              {/* Gestiones */}
              <div className="flex flex-col">

                <label
                  className={`text-xs mb-1 ${
                    isDark
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  Gestiones
                </label>

                <select
                  value={columnFilters.gestiones}
                  onChange={(e) =>
                    handleFilterChange(
                      'gestiones',
                      e.target.value
                    )
                  }
                  className={`px-3 py-2 rounded border ${
                    isDark
                      ? 'bg-slate-700 text-white border-slate-600'
                      : 'bg-white text-slate-800 border-slate-300'
                  }`}
                >

                  <option value="">
                    Todas
                  </option>

                  {uniqueValues.gestiones.map(v => (

                    <option key={v} value={v}>
                      {v}
                    </option>

                  ))}

                </select>

              </div>

            </motion.div>

          )}

        </AnimatePresence>

      </form>

      {/* ========================================================= */}
      {/* MODAL */}
      {/* ========================================================= */}

      <AnimatePresence>

        {showMasivosModal && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed inset-0 z-[9999]
              flex items-center justify-center
              bg-black/70 backdrop-blur-md
              p-4
            "
          >

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.85,
                y: 20
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 10
              }}
              transition={{
                duration: 0.2
              }}
              className={`
                relative overflow-hidden
                w-full max-w-3xl
                rounded-[32px]
                border
                shadow-[0_25px_80px_rgba(0,0,0,0.45)]
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

              {/* HEADER */}
              <div
                className={`
                  relative
                  flex items-center justify-between
                  border-b px-7 py-5
                  overflow-hidden
                  ${
                    isDark
                      ? `
                        border-[#343746]
                        bg-gradient-to-r
                        from-[#20222C]
                        via-[#242632]
                        to-[#1E2028]
                      `
                      : `
                        border-slate-200
                        bg-gradient-to-r
                        from-slate-50
                        to-white
                      `
                  }
                `}
              >

                <div
                  className="
                    absolute inset-0
                    bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_35%)]
                    pointer-events-none
                  "
                />

                <div className="relative z-10">

                  <h2
                    className={`
                      text-xl font-black tracking-tight
                      ${
                        isDark
                          ? 'text-white'
                          : 'text-slate-800'
                      }
                    `}
                  >
                    Agentes Carterizados
                  </h2>

                  <div
                    className={`
                      mt-1 text-sm font-medium
                      ${
                        isDark
                          ? 'text-slate-400'
                          : 'text-slate-500'
                      }
                    `}
                  >
                    {campInfo?.nombre || 'Campaña'}
                  </div>

                </div>

                <motion.button
                  whileHover={{
                    scale: 1.08,
                    rotate: 90
                  }}
                  whileTap={{
                    scale: 0.92
                  }}
                  onClick={() =>
                    setShowMasivosModal(false)
                  }
                  className={`
                    relative z-10
                    flex h-11 w-11
                    items-center justify-center
                    rounded-2xl border
                    transition-all
                    ${
                      isDark
                        ? `
                          border-red-500/20
                          bg-red-500/10
                          text-red-400
                          hover:bg-red-500
                          hover:text-white
                        `
                        : `
                          border-red-200
                          bg-red-50
                          text-red-500
                          hover:bg-red-500
                          hover:text-white
                        `
                    }
                  `}
                >

                  <MdClose className="text-xl" />

                </motion.button>

              </div>

              {/* CONTENT */}
              <div className="p-6 space-y-6">

                {/* AGENTES */}
                <div
                  className={`
                    relative overflow-hidden
                    rounded-[28px]
                    border p-5
                    shadow-xl
                    ${
                      isDark
                        ? `
                          border-[#343746]
                          bg-gradient-to-br
                          from-[#232530]
                          to-[#1C1D25]
                        `
                        : `
                          border-slate-200
                          bg-gradient-to-br
                          from-white
                          to-slate-50
                        `
                    }
                  `}
                >

                  <div
                    className="
                      absolute top-0 right-0
                      h-28 w-28 rounded-full
                      bg-blue-500/20 blur-3xl
                    "
                  />

                  <div className="relative mb-5 flex items-center gap-4">

                    <div
                      className="
                        flex h-14 w-14
                        items-center justify-center
                        rounded-2xl
                        bg-gradient-to-br
                        from-slate-400
                        to-slate-300
                        text-white
                        shadow-xl shadow-indigo-500/30
                      "
                    >

                      <Users className="h-7 w-7" />

                    </div>

                    <div>

                      <div
                        className={`
                          text-lg font-black tracking-wide
                          ${
                            isDark
                              ? 'text-white'
                              : 'text-slate-800'
                          }
                        `}
                      >
                        Seleccionar Agentes
                      </div>

                      <div
                        className="
                          text-xs font-semibold
                          uppercase tracking-widest
                          text-blue-500
                        "
                      >
                        {selectedAgents.length} seleccionados
                      </div>

                    </div>

                  </div>

                  <div
                    className={`
                      max-h-[280px]
                      overflow-y-auto
                      rounded-2xl
                      border p-4
                      space-y-3
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

                    {loadingMasivos ? (

                      <div className="flex items-center gap-2 text-sm">

                        <Loader2 className="h-4 w-4 animate-spin" />

                        Cargando agentes...

                      </div>

                    ) : agentesMasivos.length === 0 ? (

                      <div className="text-sm opacity-70">
                        No hay agentes disponibles
                      </div>

                    ) : (

                      agentesMasivos.map((agente) => {

                        const checked =
                          selectedAgents.includes(
                            agente.id_usuario
                          )

                        return (

<motion.label
  whileHover={{
    x: 2
  }}
  key={agente.id_usuario}
  className={`
    flex items-center gap-3
    cursor-pointer transition-all
    rounded-lg px-1 py-[-1]
    ${
      checked
        ? `
          bg-blue-500/10
        `
        : ''
    }
  `}
>

  <input
    type="checkbox"
    checked={checked}
    onChange={() =>
      handleCheckAgent(
        agente.id_usuario
      )
    }
    className="h-4 w-4"
  />

  <span
    className={`
      text-sm font-bold
      ${
        isDark
          ? 'text-white'
          : 'text-slate-700'
      }
    `}
  >
    {agente.nombre}
  </span>

</motion.label>

                        )

                      })

                    )}

                  </div>

                </div>

                {/* FECHAS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* INICIO */}
                  <div
                    className={`
                      rounded-[28px]
                      border p-5 shadow-xl
                      ${
                        isDark
                          ? `
                            border-[#343746]
                            bg-gradient-to-br
                            from-[#232530]
                            to-[#1C1D25]
                          `
                          : `
                            border-slate-200
                            bg-gradient-to-br
                            from-white
                            to-slate-50
                          `
                      }
                    `}
                  >

                    <div className="flex items-center gap-3 mb-4">

                      <div
                        className="
                          flex h-12 w-12
                          items-center justify-center
                          rounded-2xl
                          bg-gradient-to-br
                          from-slate-400
                          to-slate-300
                          text-white
                          shadow-xl shadow-indigo-500/30
                        "
                      >

                        <CalendarDays className="h-6 w-6" />

                      </div>

                      <div>

                        <div
                          className={`
                            text-base font-black
                            ${
                              isDark
                                ? 'text-white'
                                : 'text-slate-800'
                            }
                          `}
                        >
                          Fecha Inicio
                        </div>

                      </div>

                    </div>

                    <input
                      type="datetime-local"
                      value={fechaInicio}
                      onChange={(e) =>
                        setFechaInicio(e.target.value)
                      }
                      className={`
                        h-12 w-full
                        rounded-2xl border
                        px-4 text-sm font-semibold
                        outline-none transition-all
                        shadow-lg
                        ${
                          isDark
                            ? `
                              border-[#3B3E4E]
                              bg-[#2A2C38]
                              text-white
                              focus:border-green-500
                              focus:ring-4
                              focus:ring-green-500/20
                            `
                            : `
                              border-slate-200
                              bg-white
                              text-slate-700
                              focus:border-green-500
                              focus:ring-4
                              focus:ring-green-100
                            `
                        }
                      `}
                    />

                  </div>

                  {/* FIN */}
                  <div
                    className={`
                      rounded-[28px]
                      border p-5 shadow-xl
                      ${
                        isDark
                          ? `
                            border-[#343746]
                            bg-gradient-to-br
                            from-[#232530]
                            to-[#1C1D25]
                          `
                          : `
                            border-slate-200
                            bg-gradient-to-br
                            from-white
                            to-slate-50
                          `
                      }
                    `}
                  >

                    <div className="flex items-center gap-3 mb-4">

                      <div
                        className="
                          flex h-12 w-12
                          items-center justify-center
                          rounded-2xl
                          bg-gradient-to-br
                          from-slate-400
                          to-slate-300
                          text-white
                          shadow-xl shadow-indigo-500/30
                        "
                      >

                        <CalendarDays className="h-6 w-6" />

                      </div>

                      <div>

                        <div
                          className={`
                            text-base font-black
                            ${
                              isDark
                                ? 'text-white'
                                : 'text-slate-800'
                            }
                          `}
                        >
                          Fecha Fin
                        </div>

                      </div>

                    </div>

                    <input
                      type="datetime-local"
                      value={fechaFin}
                      onChange={(e) =>
                        setFechaFin(e.target.value)
                      }
                      className={`
                        h-12 w-full
                        rounded-2xl border
                        px-4 text-sm font-semibold
                        outline-none transition-all
                        shadow-lg
                        ${
                          isDark
                            ? `
                              border-[#3B3E4E]
                              bg-[#2A2C38]
                              text-white
                              focus:border-red-500
                              focus:ring-4
                              focus:ring-red-500/20
                            `
                            : `
                              border-slate-200
                              bg-white
                              text-slate-700
                              focus:border-red-500
                              focus:ring-4
                              focus:ring-red-100
                            `
                        }
                      `}
                    />

                  </div>

                </div>

              </div>

              {/* FOOTER */}
              <div
                className={`
                  relative
                  flex justify-end gap-3
                  border-t px-6 py-5
                  backdrop-blur-xl
                  ${
                    isDark
                      ? `
                        border-[#343746]
                        bg-[#1B1C24]/95
                      `
                      : `
                        border-slate-200
                        bg-white/95
                      `
                  }
                `}
              >

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

                <motion.button
                  whileHover={{
                    scale: 1.03
                  }}
                  whileTap={{
                    scale: 0.96
                  }}
                  onClick={() => {

                    setShowMasivosModal(false)

                    setSelectedAgents([])

                  }}
                  className={`
                    rounded-2xl border px-6 py-3
                    text-sm font-bold transition-all
                    shadow-lg
                    ${
                      isDark
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
                  Cancelar
                </motion.button>

               <motion.button
  whileHover={{
    scale: 1.03,
    y: -1
  }}
  whileTap={{
    scale: 0.96
  }}
  onClick={handleAsignacionMasiva}
  disabled={loadingMasivos}
  className="
    flex items-center gap-2
    rounded-2xl
    bg-gradient-to-r
    from-emerald-400
    via-green-300
    to-emerald-400
    px-6 py-3
    text-sm font-bold text-slate-700
    shadow-2xl shadow-slate-500/60
    transition-all
    hover:shadow-indigo-500/50
    disabled:opacity-50
  "
>

  {
    loadingMasivos
      ? <Loader2 className="h-4 w-4 animate-spin" />
      : <Send className="h-4 w-4" />
  }

  {
    loadingMasivos
      ? 'Asignando...'
      : 'Enviar'
  }

</motion.button>
              </div>

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </motion.div>

  )

}

export default LeadFilters