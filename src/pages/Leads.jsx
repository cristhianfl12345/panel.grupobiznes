"use client"
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { getLeads, getVistasCampana } from '../services/leads.service'
import LeadFilters from '../components/leads/LeadFilters'
import LeadTable from '../components/leads/LeadTable'
import { useLocalTheme } from '../context/useLocalTheme'
import Loader from '../pages/Loader'

export default function Leads() {

  const [searchParams] = useSearchParams()

  const campFromURL = searchParams.get("camp")

  const { theme } = useLocalTheme()
  const isDark = theme === 'dark'

  const [leads, setLeads] = useState([])
  const [columns, setColumns] = useState([])

  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const [searchText, setSearchText] = useState('')
  const [toast, setToast] = useState(null)

  const handleCopy = async (text) => {

    if (!text) return

    try {

      await navigator.clipboard.writeText(text.toString())

      setToast(`Copiado: ${text}`)

      setTimeout(() => setToast(null), 2000)

    } catch (err) {

      console.error('Error al copiar:', err)

    }

  }

  const fetchLeads = async ({ IdCamp, FechaIngreso, inicampania }) => {

    if (!FechaIngreso || !IdCamp) {
      alert('Debe seleccionar fecha')
      return
    }

    setLoading(true)
    setSearched(true)

    try {

      const response = await getLeads(
        FechaIngreso,
        IdCamp,
        inicampania
      )

      const rows = response?.data || []

      setLeads(rows)

      if (rows.length > 0) {

        const vistas = await getVistasCampana(IdCamp)

        const jsonKeys = Object.keys(rows[0])

        const matchedColumns = vistas
          .filter(col => jsonKeys.includes(col.query_vista))
          .map(col => ({
            key: col.query_vista,
            label: col.Vista,
            visible: col.activo
          }))

        setColumns([
          { key: 'index', label: 'N', visible: true },
          ...matchedColumns
        ])

      }

    } catch (err) {

      console.error('Error obteniendo leads:', err)

      setLeads([])
      setColumns([])

    } finally {

      setLoading(false)

    }

  }
  useEffect(() => {

    if (!campFromURL) return

    fetchLeads({
      IdCamp: campFromURL,
      FechaIngreso: new Date().toISOString().slice(0,10),
      inicampania: null
    })

  }, [campFromURL])

  const filteredLeads = useMemo(() => {

    if (!searchText) return leads

    const text = searchText.toLowerCase()

    return leads.filter((lead) => (

      Object.values(lead)
        .join(" ")
        .toLowerCase()
        .includes(text)

    ))

  }, [leads, searchText])

  return (

    <div className={`min-h-screen ${
      isDark
        ? 'bg-[#1F2029] text-white'
        : 'bg-slate-50 text-slate-800'
    }`}>

      {/* LOADER GLOBAL DE BUSQUEDA */}
      <Loader show={loading} />

      {toast && (

        <div className="fixed top-15 left-1/2 -translate-x-1/2 z-50 
                        bg-black text-white
                        dark:bg-yellow-100 dark:text-black
                        px-4 py-2 rounded-lg shadow-lg">

          {toast}

        </div>

      )}

      <div className="px-6 py-4 space-y-4 w-full">

        <LeadFilters
          onSearch={fetchLeads}
          columns={columns}
          setColumns={setColumns}
        />

        <LeadTable
          leads={filteredLeads}
          loading={loading}
          searched={searched}
          onCopy={handleCopy}
          columns={columns}
          setColumns={setColumns}
        />

      </div>

    </div>

  )

}