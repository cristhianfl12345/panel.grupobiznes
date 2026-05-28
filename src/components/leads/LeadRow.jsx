import React, { useEffect, useState } from 'react'
import LeadStatus from './LeadStatus'

import {
  FiPhoneCall,
  FiClipboard,
  FiVolume2,
} from 'react-icons/fi'

import { BsFillPlugFill } from 'react-icons/bs'

import { FaPhone } from 'react-icons/fa6'

import { useLocalTheme } from '../../context/useLocalTheme'

import { motion } from "framer-motion"

import { useSearchParams } from 'react-router-dom'

const cellAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.18 }
}

export default function LeadRow({
  lead,
  index,
  onCopy,
  columns = []
}) {

  const { theme } = useLocalTheme()

  const isDark = theme === 'dark'

  const [searchParams] = useSearchParams()

  const camp = searchParams.get('camp')

  const [agentesCampana, setAgentesCampana] = useState([])

  // =========================================================
  // OBTENER AGENTES SEGUN CAMPAÑA
  // =========================================================

useEffect(() => {

  const getAgentesCampana = async () => {

    try {

      const res = await fetch(
        `http://192.168.9.115:4000/api/leads/agentes-campana/${camp}`
      )

      const data = await res.json()

      setAgentesCampana(
        Array.isArray(data)
          ? data
          : Array.isArray(data.data)
            ? data.data
            : []
      )

    } catch (error) {

      console.error(error)

      setAgentesCampana([])

    }

  }

  if (camp) {
    getAgentesCampana()
  }

}, [camp])

  const renderCell = (key) => {

    const baseClass = "border p-2"

    switch (key) {

      case 'index':

        return (

          <motion.td
            className={`${baseClass} text-center`}
          >
            {index}
          </motion.td>

        )

      case 'idkey':
      case 'IdKey_Computado':

        return (

          <motion.td
            {...cellAnimation}
            whileHover={{ scale: 1.02 }}
            className={`
              ${baseClass}
              cursor-pointer
              transition-colors
              ${
                isDark
                  ? 'text-white hover:text-black hover:bg-yellow-100'
                  : 'hover:bg-yellow-100'
              }
            `}
            onClick={() =>
              onCopy?.(lead.idkey)
            }
          >
            {lead.idkey}
          </motion.td>

        )

      case 'dni':

        return (

          <motion.td
            {...cellAnimation}
            className={baseClass}
          >
            {lead.dni || '-'}
          </motion.td>

        )

      case 'nombre_completo':

        return (

          <motion.td
            {...cellAnimation}
            className={baseClass}
          >
            {lead.nombre_completo || '-'}
          </motion.td>

        )

      case 'numero_telefono':

        return (

          <motion.td
            {...cellAnimation}
            whileHover={{ scale: 1.02 }}
            className={`
              ${baseClass}
              cursor-pointer
              transition-colors
              ${
                isDark
                  ? 'text-white hover:text-black hover:bg-yellow-100'
                  : 'hover:bg-yellow-100'
              }
            `}
            onClick={() =>
              onCopy?.(lead.numero_telefono)
            }
          >
            {lead.numero_telefono}
          </motion.td>

        )

      case 'email':

        return (

          <motion.td
            {...cellAnimation}
            className={baseClass}
          >
            {lead.email || '-'}
          </motion.td>

        )

      case 'email2':

        return (

          <motion.td
            {...cellAnimation}
            className={`${baseClass} text-center`}
          >
            {lead.email2 || '-'}
          </motion.td>

        )

      case 'perfil':

        return (

          <motion.td
            {...cellAnimation}
            className={baseClass}
          >
            {lead.perfil || '-'}
          </motion.td>

        )

      case 'segmento':

        return (

          <motion.td
            {...cellAnimation}
            className={baseClass}
          >
            {lead.segmento || '-'}
          </motion.td>

        )

      case 'Alias':

        return (

          <motion.td
            {...cellAnimation}
            className={baseClass}
          >
            {lead.Alias || '-'}
          </motion.td>

        )

      case 'CampaOrigen':

        return (

          <motion.td
            {...cellAnimation}
            className={baseClass}
          >
            {lead.CampaOrigen || '-'}
          </motion.td>

        )

      case 'pautanameanuncio':

        return (

          <motion.td
            {...cellAnimation}
            className={baseClass}
          >
            {lead.pautanameanuncio || '-'}
          </motion.td>

        )

      case 'modelo':

        return (

          <motion.td
            {...cellAnimation}
            className={baseClass}
          >
            {lead.modelo || '-'}
          </motion.td>

        )

      case 'plataforma':

        return (

          <motion.td
            {...cellAnimation}
            className={baseClass}
          >
            {lead.plataforma || '-'}
          </motion.td>

        )

      case 'politica':

        return (

          <motion.td
            {...cellAnimation}
            className={baseClass}
          >
            {lead.politica || '-'}
          </motion.td>

        )

      case 'fecha_creacion':

        return (

          <motion.td
            {...cellAnimation}
            className={`${baseClass} text-center`}
          >
            {lead.fecha_creacion
              ? lead.fecha_creacion.toString().slice(0, 8)
              : '-'}
          </motion.td>

        )

      case 'hora_creacion':
      case 'horac':

        return (

          <motion.td
            {...cellAnimation}
            className={`${baseClass} text-center`}
          >
            {lead.hora_creacion || lead.horac || '-'}
          </motion.td>

        )

      case 'horai': {

        const h = lead.horai

        let tiempoFormateado = '-'

        if (typeof h === 'string') {

          const parts = h.split(':')

          if (parts.length === 3) {

            const hours =
              parseInt(parts[0], 10) || 0

            const minutes =
              parseInt(parts[1], 10) || 0

            const seconds =
              Math.floor(parseFloat(parts[2])) || 0

            tiempoFormateado =
              `${hours}h ${minutes}m ${seconds}s`

          }

        } else if (
          h &&
          typeof h === 'object'
        ) {

          const hours = h.hours ?? 0
          const minutes = h.minutes ?? 0
          const seconds = h.seconds ?? 0

          tiempoFormateado =
            `${hours}h ${minutes}m ${seconds}s`

        }

        return (

          <motion.td
            {...cellAnimation}
            className={`
              ${baseClass}
              text-center
              font-mono
              text-xs
            `}
          >
            {tiempoFormateado}
          </motion.td>

        )

      }

      case 'discador':

        return (

          <motion.td
            {...cellAnimation}
            className={`${baseClass} text-center`}
          >

            <div className="flex items-center justify-center gap-2">

              <span>
                {lead.discador}
              </span>

              {lead.discador && (
                <FiPhoneCall className="text-green-600" />
              )}

            </div>

          </motion.td>

        )

      case 'gestiones':

        return (

          <motion.td
            {...cellAnimation}
            className={`${baseClass} text-center`}
          >

            <div className="flex items-center justify-center gap-2">

              <span>
                {lead.gestiones}
              </span>

              {lead.gestiones && (
                <FiClipboard className="text-blue-500" />
              )}

            </div>

          </motion.td>

        )

      case 'ultimocodcontacto': {

        const statusStyles = {
          NC: "bg-red-100 text-red-700 border-red-200",
          CD: "bg-green-100 text-green-700 border-green-200",
          CND: "bg-yellow-100 text-yellow-700 border-yellow-200",
        }

        const currentStyle =
          statusStyles[
            lead.ultimocodcontacto
          ] ||
          "bg-gray-100 text-gray-700 border-gray-500"

        return (

          <motion.td
            {...cellAnimation}
            className={`${baseClass} text-center`}
          >

            {lead.ultimocodcontacto ||
            lead.ultnivel2 ? (

              <span
                className={`
                  inline-block
                  px-2 py-1
                  rounded
                  text-xs
                  font-medium
                  border
                  ${currentStyle}
                `}
              >
                {lead.ultimocodcontacto}
                {' - '}
                {lead.ultnivel2}
              </span>

            ) : (

              <FaPhone className="text-red-400 mx-auto" />

            )}

          </motion.td>

        )

      }

      case 'ultimofecha':

        return (

          <motion.td
            {...cellAnimation}
            className={`${baseClass} text-center`}
          >
            {lead.ultimofecha
              ? lead.ultimofecha.toString().slice(0, 10)
              : '-'}
          </motion.td>

        )

      case 'mejorcodcontacto': {

        const statusStyles = {
          NC: "bg-red-100 text-red-700 border-red-200",
          CD: "bg-green-100 text-green-700 border-green-200",
          CND: "bg-yellow-100 text-yellow-700 border-yellow-200",
        }

        const currentStyle =
          statusStyles[
            lead.mejorcodcontacto
          ] ||
          "bg-gray-100 text-gray-700 border-gray-500"

        return (

          <motion.td
            {...cellAnimation}
            className={`${baseClass} text-center`}
          >

            {lead.mejorcodcontacto ||
            lead.mejornivel2 ? (

              <span
                className={`
                  inline-block
                  px-2 py-1
                  rounded
                  text-xs
                  font-medium
                  border
                  ${currentStyle}
                `}
              >
                {lead.mejorcodcontacto}
                {' - '}
                {lead.mejornivel2}
              </span>

            ) : (

              <FaPhone className="text-red-400 mx-auto" />

            )}

          </motion.td>

        )

      }

      case 'mejorfecha':

        return (

          <motion.td
            {...cellAnimation}
            className={`${baseClass} text-center`}
          >

            {lead.mejorfecha && (

              <FiVolume2
                className="
                  text-green-600
                  mx-auto
                  cursor-pointer
                "
                title={`
                  ${lead.mejorservicio}
                  -
                  ${lead.mejorhora}
                `}
              />

            )}

          </motion.td>

        )

      case 'rswmejoridcall':

        return (

          <motion.td
            {...cellAnimation}
            className={`${baseClass} text-center`}
          >
            {lead.rswmejoridcall || '-'}
          </motion.td>

        )

      case 'rswmejornivel1':

        return (

          <motion.td
            {...cellAnimation}
            className={`${baseClass} text-center`}
          >
            {lead.rswmejornivel1 || '-'}
          </motion.td>

        )

      case 'ObsApi':

        return (

          <motion.td
            {...cellAnimation}
            className={`${baseClass} text-center`}
          >

            {lead.ObsApi === null ? (

              <BsFillPlugFill
                className="
                  text-green-600
                  mx-auto
                "
                title="Sin observaciones"
              />

            ) : (

              '-'

            )}

          </motion.td>

        )

      case 'PRUEBA':
      case 'semaforoTipoLead':

        return (

          <motion.td
            {...cellAnimation}
            className={`${baseClass} text-center`}
          >

            <select
              defaultValue=""
              className={`
                w-[180px]
                rounded-xl
                border
                px-3 py-2
                text-xs font-semibold
                outline-none
                transition-all
                ${
                  isDark
                    ? `
                      border-[#3B3E4E]
                      bg-[#1E1F27]
                      text-white
                    `
                    : `
                      border-slate-200
                      bg-white
                      text-slate-700
                    `
                }
              `}
            >

              <option value="">
                Seleccionar agente
              </option>

              {agentesCampana.map((agente) => (

                <option
                  key={agente.id_usuario}
                  value={agente.id_usuario}
                >
                  {(() => {

                    const partes = agente.nombre
                      ?.trim()
                      .split(/\s+/) || []

                    const primerNombre = partes[0] || ''

                    const apellidoPaterno =
                      partes.length >= 3
                        ? partes[partes.length - 2]
                        : partes[1] || ''

                    return `${primerNombre} ${apellidoPaterno}`

                  })()}
                </option>

                              ))}

            </select>

          </motion.td>

        )

      default:

        return (

          <motion.td
            {...cellAnimation}
            className={baseClass}
          >
            {lead[key] ?? '-'}
          </motion.td>

        )

    }

  }

  return (

    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      whileHover={{
        backgroundColor: isDark
          ? "rgba(40,44,59,0.9)"
          : "rgba(229,231,235,0.7)"
      }}
      className="text-sm"
    >

      {columns.map((col) => {

        const key =
          col.key || col.query_vista

        return (

          <React.Fragment key={key}>
            {renderCell(key)}
          </React.Fragment>

        )

      })}

    </motion.tr>

  )

}