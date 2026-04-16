import React from 'react'
import LeadStatus from './LeadStatus'
import { FiPhoneCall, FiClipboard, FiVolume2, FiPhoneOff } from 'react-icons/fi'
import { BsFillPlugFill } from 'react-icons/bs'
import { FaPhone } from 'react-icons/fa6'
import { useLocalTheme } from '../../context/useLocalTheme'
import { motion } from "framer-motion"

const cellAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.18 }
}

export default function LeadRow({ lead, index, onCopy, columns = [] }) {

  const { theme } = useLocalTheme()
  const isDark = theme === 'dark'

  const renderCell = (key) => {

    const baseClass = "border p-2"

    switch (key) {

    case 'index':
  return (
    <motion.td className={`${baseClass} text-center`}>
      {index}
    </motion.td>
  )

      case 'idkey':
      case 'IdKey_Computado':
        return (
          <motion.td
            {...cellAnimation}
            whileHover={{ scale: 1.02 }}
            className={`${baseClass} cursor-pointer transition-colors ${
              isDark
                ? 'text-white hover:text-black hover:bg-yellow-100'
                : 'hover:bg-yellow-100'
            }`}
            onClick={() => onCopy?.(lead.idkey)}
          >
            {lead.idkey}
          </motion.td>
        )

      case 'dni':
        return (
          <motion.td {...cellAnimation} className={baseClass}>
            {lead.dni || '-'}
          </motion.td>
        )

      case 'nombre_completo':
        return (
          <motion.td {...cellAnimation} className={baseClass}>
            {lead.nombre_completo || '-'}
          </motion.td>
        )

      case 'numero_telefono':
        return (
          <motion.td
            {...cellAnimation}
            whileHover={{ scale: 1.02 }}
            className={`${baseClass} cursor-pointer transition-colors ${
              isDark
                ? 'text-white hover:text-black hover:bg-yellow-100'
                : 'hover:bg-yellow-100'
            }`}
            onClick={() => onCopy?.(lead.numero_telefono)}
          >
            {lead.numero_telefono}
          </motion.td>
        )

      case 'email':
        return (
          <motion.td {...cellAnimation} className={baseClass}>
            {lead.email || '-'}
          </motion.td>
        )

      case 'email2':
        return (
          <motion.td {...cellAnimation} className={`${baseClass} text-center`}>
            {lead.email2 || '-'}
          </motion.td>
        )

      case 'perfil':
        return (
          <motion.td {...cellAnimation} className={baseClass}>
            {lead.perfil || '-'}
          </motion.td>
        )

      case 'segmento':
        return (
          <motion.td {...cellAnimation} className={baseClass}>
            {lead.segmento || '-'}
          </motion.td>
        )

      case 'Alias':
        return (
          <motion.td {...cellAnimation} className={baseClass}>
            {lead.Alias || '-'}
          </motion.td>
        )

      case 'CampaOrigen':
        return (
          <motion.td {...cellAnimation} className={baseClass}>
            {lead.CampaOrigen || '-'}
          </motion.td>
        )

      case 'pautanameanuncio':
        return (
          <motion.td {...cellAnimation} className={baseClass}>
            {lead.pautanameanuncio || '-'}
          </motion.td>
        )

      case 'modelo':
        return (
          <motion.td {...cellAnimation} className={baseClass}>
            {lead.modelo || '-'}
          </motion.td>
        )

      case 'plataforma':
        return (
          <motion.td {...cellAnimation} className={baseClass}>
            {lead.plataforma || '-'}
          </motion.td>
        )

      case 'politica':
        return (
          <motion.td {...cellAnimation} className={baseClass}>
            {lead.politica || '-'}
          </motion.td>
        )

      case 'fecha_creacion':
        return (
          <motion.td {...cellAnimation} className={`${baseClass} text-center`}>
            {lead.fecha_creacion
              ? lead.fecha_creacion.toString().slice(0, 8)
              : '-'}
          </motion.td>
        )

      case 'hora_creacion':
      case 'horac':
        return (
          <motion.td {...cellAnimation} className={`${baseClass} text-center`}>
            {lead.hora_creacion || lead.horac || '-'}
          </motion.td>
        )

case 'horai': {
  const h = lead.horai;
  
  // Verificamos si es un objeto y tiene los datos
  const tiempoFormateado = h && typeof h === 'object' 
    ? `${h.minutes}m ${h.seconds}s` 
    : (h || '-');

  return (
    <motion.td {...cellAnimation} className={`${baseClass} text-center font-mono text-xs`}>
      {tiempoFormateado}
    </motion.td>
  );
}

case 'discador':
  return (
    <motion.td {...cellAnimation} className={`${baseClass} text-center`}>
      <div className="flex items-center justify-center gap-2">
        {/* Mostramos el valor de la columna */}
        <span>{lead.discador}</span>
        
        
        {lead.discador && (
          <FiPhoneCall className="text-green-600" />
        )}
      </div>
    </motion.td>
  )

      case 'gestiones':
        return (
          <motion.td {...cellAnimation} className={`${baseClass} text-center`}>
            <div className="flex items-center justify-center gap-2">
              <span>{lead.gestiones}</span>
            {lead.gestiones && (
              <FiClipboard className="text-blue-500" />
            )}
            </div>
          </motion.td>
        )

case 'ultimocodcontacto': {
  // Mapeo de estilos según el código
  const statusStyles = {
    "NC": "bg-red-100 text-red-700 border-red-200",
    "CD": "bg-green-100 text-green-700 border-green-200",
    "CND": "bg-yellow-100 text-yellow-700 border-yellow-200",
  };

  // Seleccionamos el estilo o un gris por defecto
  const currentStyle = statusStyles[lead.ultimocodcontacto] || "bg-gray-100 text-gray-700 border-gray-500";

  return (
    <motion.td {...cellAnimation} className={`${baseClass} text-center`}>
      {lead.ultimocodcontacto || lead.ultnivel2 ? (
  <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${currentStyle}`}>
    {lead.ultimocodcontacto} - {lead.ultnivel2}
  </span>
) : (
  <FaPhone className="text-red-400 mx-auto" />
)}
    </motion.td>
  );
}
case 'ultimofecha':
        return (
          <motion.td {...cellAnimation} className={`${baseClass} text-center`}>
            {lead.ultimofecha
              ? lead.ultimofecha.toString().slice(0, 10)
              : '-'}
          </motion.td>
        )
        {/* ANTERIOR ULTIMO FECHA, SE DEJÓ GUARDADO POR SI SE QUIERE VOLVER A ESE FORMATO CON ICONO
      case 'ultimofecha':
        return (
          <motion.td {...cellAnimation} className={`${baseClass} text-center`}>
            {lead.ultimofecha && (
              <FiVolume2
                className="text-gray-600 mx-auto cursor-pointer"
                title={`${lead.ultimofecha} ${lead.ultimohora} - ${lead.ultgesasesorname}`}
              />
            )}
          </motion.td>
        ) */}

 case 'mejorcodcontacto': {
  // Definimos los estilos por código
  const statusStyles = {
    "NC": "bg-red-100 text-red-700 border-red-200",
    "CD": "bg-green-100 text-green-700 border-green-200",
    "CND": "bg-yellow-100 text-yellow-700 border-yellow-200",
  };

  // Obtenemos la clase según el valor, o una por defecto si no coincide
  const currentStyle = statusStyles[lead.mejorcodcontacto] || "bg-gray-100 text-gray-700 border-gray-500";

  return (
    <motion.td {...cellAnimation} className={`${baseClass} text-center`}>
      {lead.mejorcodcontacto || lead.mejornivel2 ? (
        <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${currentStyle}`}>
          {lead.mejorcodcontacto} - {lead.mejornivel2}
        </span>
      ) : (
        <FaPhone className="text-red-400 mx-auto" />
      )}
    </motion.td>
  );
}

      case 'mejorfecha':
        return (
          <motion.td {...cellAnimation} className={`${baseClass} text-center`}>
            {lead.mejorfecha && (
              <FiVolume2
                className="text-green-600 mx-auto cursor-pointer"
                title={`${lead.mejorservicio} - ${lead.mejorhora}`}
              />
            )}
          </motion.td>
        )

      case 'rswmejoridcall':
        return (
          <motion.td {...cellAnimation} className={`${baseClass} text-center`}>
            {lead.rswmejoridcall || '-'}
          </motion.td>
        )

      case 'rswmejornivel1':
        return (
          <motion.td {...cellAnimation} className={`${baseClass} text-center`}>
            {lead.rswmejornivel1 || '-'}
          </motion.td>
        )

      case 'ObsApi':
        return (
          <motion.td {...cellAnimation} className={`${baseClass} text-center`}>
            {lead.ObsApi === null ? (
              <BsFillPlugFill
                className="text-green-600 mx-auto"
                title="Sin observaciones"
              />
            ) : (
              '-'
            )}
          </motion.td>
        )

      default:
        return (
          <motion.td {...cellAnimation} className={baseClass}>
            {lead[key] ?? '-'}
          </motion.td>
        )
    }
  }

  return (
<motion.tr
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }} // <--- ESTO ES VITAL
    transition={{ duration: 0.15 }} // Una transición rápida para que no se encime
    whileHover={{
      backgroundColor: isDark
        ? "rgba(40,44,59,0.9)"
        : "rgba(229,231,235,0.7)"
    }}
    className="text-sm"
  >
    {columns.map((col) => {
      const key = col.key || col.query_vista
      return (
        <React.Fragment key={key}>
          {renderCell(key)}
        </React.Fragment>
      )
    })}
  </motion.tr>
)
}