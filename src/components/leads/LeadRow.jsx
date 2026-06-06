import React, { useEffect, useState } from 'react'
import LeadStatus from './LeadStatus'

import {
  FiPhoneCall,
  FiClipboard,
  FiVolume2,
} from 'react-icons/fi'
import { FaUserEdit } from "react-icons/fa"
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
const formatearNombreAgente = (nombreCompleto = "") => {

  const partes = nombreCompleto
    .trim()
    .split(/\s+/)

  if (partes.length < 3) {
    return nombreCompleto
  }

  const primerNombre = partes[0]

  const cantidadApellidos = 2

  const nombres = partes.slice(
    0,
    partes.length - cantidadApellidos
  )

  const apellidos = partes.slice(
    partes.length - cantidadApellidos
  )

  const segundoNombre =
    nombres.length >= 2
      ? `${nombres[1][0]}.`
      : ""

  const primerApellido =
    apellidos[0] || ""

  return [
    primerNombre,
    segundoNombre,
    primerApellido
  ]
    .filter(Boolean)
    .join(" ")

}

  const [agentesCampana, setAgentesCampana] = useState([])
  const [agenteSeleccionado, setAgenteSeleccionado] = useState("")
const [guardandoAsignacion, setGuardandoAsignacion] = useState(false)
const [modoEdicionAgente, setModoEdicionAgente] =
  useState(false)
const [agenteAsignado, setAgenteAsignado] = useState(null)

const handleAsignarAgente = async () => {

  if (!agenteSeleccionado) {
    return
  }

  try {

    setGuardandoAsignacion(true)

    const token = localStorage.getItem("token")

    const res = await fetch(
      "http://192.168.9.115:4000/api/leads/carterizar-individual",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          idLead: Number(lead.idlead),
          idCamp: Number(camp),
          idUsuario: Number(agenteSeleccionado)
        })
      }
    )

    const data = await res.json()

    if (!res.ok) {
      throw new Error(
        data.message || "Error asignando lead"
      )
    }

    
  const agente =
  agentesCampana.find(
    a =>
      Number(a.id_usuario) ===
      Number(agenteSeleccionado)
  )

setAgenteAsignado({
  nombre_agente_asignado:
    agente?.nombre || ""
})
setModoEdicionAgente(false)

  } catch (error) {

    console.error(
      "Error asignando lead:",
      error
    )

  } finally {

    setGuardandoAsignacion(false)

  }

}
// editar:
const handleReasignarAgente = async () => {

  if (!agenteSeleccionado) {
    return
  }

  try {

    setGuardandoAsignacion(true)

    const token = localStorage.getItem("token")

    const res = await fetch(
      "http://192.168.9.115:4000/api/leads/reasignar-lead",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          idLead: Number(lead.idlead),
          idUsuario: Number(agenteSeleccionado)
        })
      }
    )

    const data = await res.json()

    if (!res.ok) {
      throw new Error(
        data.message || "Error reasignando lead"
      )
    }

    const agente = agentesCampana.find(
      a =>
        Number(a.id_usuario) ===
        Number(agenteSeleccionado)
    )

    setAgenteAsignado({
      ...agenteAsignado,
      id_usuario: Number(agenteSeleccionado),
      nombre_agente_asignado:
        agente?.nombre || ""
    })

    setModoEdicionAgente(false)

  } catch (error) {

    console.error(
      "Error reasignando lead:",
      error
    )

  } finally {

    setGuardandoAsignacion(false)

  }

}
  // =========================================================
  // OBTENER AGENTES SEGUN CAMPAÑA
  // =========================================================

useEffect(() => {

  const getAgentesCampana = async () => {

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://192.168.9.115:4000/api/leads/agentes-campana/${camp}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
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


}

, [camp])
// carterizzado por agente
useEffect(() => {

  const getAgenteAsignado = async () => {

    try {

      const token =
        localStorage.getItem("token")

      const res = await fetch(
        `http://192.168.9.115:4000/api/leads/leads-asignados/${camp}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!res.ok) {
        throw new Error()
      }

      const data = await res.json()

const asignado = Array.isArray(data)
  ? data.find(
      item =>
        Number(item.idlead) ===
        Number(lead.idlead)
    )
  : null

setAgenteAsignado(asignado || null)
setModoEdicionAgente(false)

    } catch (error) {

      console.error(error)

      setAgenteAsignado(null)

    }

  }

  if (
    lead?.idlead &&
    camp
  ) {
    getAgenteAsignado()
  }

}, [lead?.idlead, camp])

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

//case 'PRUEBA':
 case 'Carterizacion':
case '__asignacion_agente__':

  return (

    <motion.td
      {...cellAnimation}
      className={`${baseClass} text-center`}
    >

    {agenteAsignado && !modoEdicionAgente ? (

 <div
  className="
    flex items-center justify-center
  "
>

  <div
    className={`
      w-[177px]
      rounded-xl
      px-3
      py-2
      text-xs
      font-bold
      text-center
      truncate
      ${
        isDark
          ? "bg-emerald-900/30 text-emerald-300"
          : "bg-emerald-100 text-emerald-700"
      }
    `}
    title={
      agenteAsignado.nombre_agente_asignado ||
      agenteAsignado.nombre
    }
  >
    {formatearNombreAgente(
      agenteAsignado.nombre_agente_asignado ||
      agenteAsignado.nombre
    )}
  </div>

  <div className="w-[50px] ml-1 flex justify-center">

    <button
      type="button"
      title="Doble clic para editar"
      onDoubleClick={() => {
        setModoEdicionAgente(true)
        setAgenteSeleccionado("")
      }}
      className={`
        rounded-lg
        p-2
        transition-all
        ${
          isDark
            ? `
              bg-slate-800
              text-slate-300
              hover:text-white
            `
            : `
              bg-yellow-500/50
              text-slate-600/80
              hover:text-slate-900
            `
        }
      `}
    >
      <FaUserEdit size={14} />
    </button>

  </div>

</div>

) : (

  <div className="flex items-center gap-2">

    <select
      value={agenteSeleccionado}
      onChange={(e) =>
        setAgenteSeleccionado(e.target.value)
      }
      className={`
        w-[180px]
        rounded-xl
        border
        px-3
        py-2
        text-xs
        font-semibold
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

            const partes =
              agente.nombre?.trim().split(/\s+/) || []

            const primerNombre =
              partes[0] || ''

            const apellidoPaterno =
              partes.length >= 3
                ? partes[partes.length - 2]
                : partes[1] || ''

            return `${primerNombre} ${apellidoPaterno}`

          })()}
        </option>

      ))}

    </select>

    <button
  onClick={
    modoEdicionAgente
      ? handleReasignarAgente
      : handleAsignarAgente
  }
      disabled={
        !agenteSeleccionado ||
        guardandoAsignacion
      }
      className={`
        rounded-lg
        px-3
        py-2
        text-xs
        font-bold
        transition-all
        ${
          !agenteSeleccionado
            ? `
              cursor-not-allowed
              bg-slate-300
              text-slate-500
            `
            : `
              bg-emerald-600
              text-white
              hover:bg-emerald-700
            `
        }
      `}
    >
      OK
    </button>

  </div>

)}

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

{[
  ...columns,
  {
    key: '__asignacion_agente__'
  }
].map((col) => {

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