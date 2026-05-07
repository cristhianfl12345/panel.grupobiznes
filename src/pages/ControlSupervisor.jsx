// src/pages/ControlSupervisor.jsx

"use client"

import {
  useEffect,
  useState,
  Fragment,
  useMemo,
  useRef
} from "react"

import {
  useSearchParams
} from "react-router-dom"

import axios from "axios"

import * as htmlToImage from "html-to-image"

import {
  AnimatePresence,
  motion
} from "framer-motion"

import {
  INDICE_CAMPS
} from "../context/indiceCamps"

import {
  SlUserFemale
} from "react-icons/sl"

import {
  CiUser
} from "react-icons/ci"

import {
  FiClock,
  FiMinus,
  FiPlus,
  FiRefreshCw,
  FiDownload,
  FiTrendingUp,
  FiUsers,
  FiActivity,
  FiPhoneCall,
  FiTarget
} from "react-icons/fi"

import {
  BsArrowDownUp
} from "react-icons/bs"

const API =
  "http://192.168.9.115:4000/api/control-supervisor"

function formatTime(value) {

  if (
    value == null ||
    value === "" ||
    value === "-"
  ) {
    return "--:--:--"
  }

  if (
    typeof value === "string" &&
    value.includes(":")
  ) {
    return value
  }

  const n = Number(value)

  if (isNaN(n)) return value

  const h = Math.floor(n / 3600)
  const m = Math.floor((n % 3600) / 60)
  const s = n % 60

  return [h, m, s]
    .map(v => String(v).padStart(2, "0"))
    .join(":")
}

function getSemaforoColor(valor) {

  switch (Number(valor)) {

    case 1:
      return "#ef4444"

    case 2:
      return "#facc15"

    case 3:
      return "#22c55e"

    default:
      return "#9ca3af"

  }

}

export default function ControlSupervisor() {

  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  )

  useEffect(() => {

    const handleStorage = () => {

      const theme =
        localStorage.getItem("theme") === "dark"

      setIsDark(theme)

      window.location.reload()

    }

    window.addEventListener(
      "storage",
      handleStorage
    )

    return () => {

      window.removeEventListener(
        "storage",
        handleStorage
      )

    }

  }, [])

  const containerRef = useRef(null)

  const [searchParams] =
    useSearchParams()

  const idCamp = Number(
    searchParams.get("camp")
  )

  const [loading, setLoading] =
    useState(true)

  const [supervisores, setSupervisores] =
    useState([])

  const [now, setNow] =
    useState(new Date())

  const campanaActual = useMemo(() => {

    return INDICE_CAMPS.find(c =>
      Number(
        c.id_camp ||
        c.IdCamp
      ) === Number(idCamp)
    )

  }, [idCamp])

  useEffect(() => {

    if (!idCamp) return

    obtenerData()

    const interval = setInterval(() => {
      setNow(new Date())
    }, 60000)

    return () => clearInterval(interval)

  }, [idCamp])

  const obtenerData = async () => {

    try {

      setLoading(true)

      const res = await axios.get(
        `${API}?camp=${idCamp}`
      )

      const payload =
        res.data?.data ||
        res.data ||
        []

      const campFiltrada =
        payload.find(
          c =>
            Number(c.IdCamp) ===
            Number(idCamp)
        )

      setSupervisores(
        campFiltrada?.supervisores || []
      )

    } catch (err) {

      console.error(err)

    } finally {

      setLoading(false)

    }

  }

  const descargarImagen = async () => {

    if (!containerRef.current) return

    try {

      const dataUrl =
        await htmlToImage.toPng(
          containerRef.current,
          {
            quality: 1,
            pixelRatio: 2
          }
        )

      const link =
        document.createElement("a")

      link.download =
        `control_supervisor_${idCamp}.png`

      link.href = dataUrl

      link.click()

    } catch (err) {

      console.error(err)

    }

  }

  const formatDate = (d) => {

    const yyyy = d.getFullYear()

    const mm = String(
      d.getMonth() + 1
    ).padStart(2, "0")

    const dd = String(
      d.getDate()
    ).padStart(2, "0")

    const hh = String(
      d.getHours()
    ).padStart(2, "0")

    const min = String(
      d.getMinutes()
    ).padStart(2, "0")

    const ss = String(
      d.getSeconds()
    ).padStart(2, "0")

    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`

  }

  if (loading) {

    return (

      <div
        className={`
          min-h-screen flex items-center justify-center
          ${isDark
            ? "bg-[#1F2029] text-white"
            : "bg-gray-100 text-gray-900"}
        `}
      >

        Cargando reporte...

      </div>

    )

  }

  return (

    <div
      className={`
        min-h-screen p-5 transition-colors duration-500
        ${isDark
          ? "bg-[#1F2029]"
          : "bg-gray-100"}
      `}
    >

      <div
        className={`
          rounded-3xl overflow-hidden border shadow-2xl
          ${isDark
            ? "bg-[#272833] border-[#323544]"
            : "bg-white border-gray-200"}
        `}
      >

        {/* HEADER */}
        <div
          className={`
            px-6 py-5 border-b flex items-center justify-between
            ${isDark
              ? "border-[#323544]"
              : "border-gray-200"}
          `}
        >

          <div>

            <h1
              className={`
                text-2xl font-bold
                ${isDark
                  ? "text-white"
                  : "text-gray-900"}
              `}
            >

              Reporte de Control de Supervisores
              {" "}
              -
              {" "}

              <span className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>

                {
                  campanaActual?.nombre ||
                  campanaActual?.Campana ||
                  "Campaña"
                }

              </span>

            </h1>

            <div
              className={`
                text-xs mt-1
                ${isDark
                  ? "text-gray-400"
                  : "text-gray-500"}
              `}
            >

              Campaña ID:
              {" "}
              {idCamp}

            </div>

          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={descargarImagen}
              className="
                w-11 h-11 rounded-full
                flex items-center justify-center
                bg-red-600 text-white
                shadow-lg hover:scale-105
                transition
              "
            >

              <FiDownload />

            </button>

            <button
              onClick={obtenerData}
              className="
                w-11 h-11 rounded-full
                flex items-center justify-center
                bg-red-500 text-white
                shadow-lg hover:rotate-180
                transition duration-300
              "
            >

              <FiRefreshCw />

            </button>

          </div>

        </div>

        {/* SUBHEADER */}
        <div
          className={`
            px-6 py-3 border-b flex items-center justify-between
            ${isDark
              ? "bg-[#1d1f29] border-[#323544]"
              : "bg-gray-50 border-gray-200"}
          `}
        >

          <div className="text-red-500 text-sm font-bold">
            Control en Línea
          </div>

          <div
            className={`
              text-xs
              ${isDark
                ? "text-gray-400"
                : "text-gray-500"}
            `}
          >

            🕒 Actualizado :
            {" "}
            {formatDate(now)}

          </div>

        </div>

        {/* CONTENIDO */}
        <div
          ref={containerRef}
          className="p-5 space-y-5"
        >

          {
            supervisores.map(
              (supervisor, i) => (

                <CardSupervisor
                  key={i}
                  supervisor={supervisor}
                  isDark={isDark}
                />

              )
            )
          }

        </div>

      </div>

    </div>

  )

}

function CardSupervisor({
  supervisor,
  isDark
}) {

  const [open, setOpen] =
    useState(false)

  const m =
    supervisor.metricas || {}

  const isFemale =
    supervisor?.SexoSup
      ?.toLowerCase() === "f"

  return (

    <motion.div
      layout
      className={`
        rounded-3xl overflow-hidden border shadow-xl
        ${isDark
          ? "bg-[#272833] border-[#323544]"
          : "bg-white border-gray-200"}
      `}
    >

      {/* TOP */}
      <div className="p-5">

        <div className="
          flex flex-col
          2xl:flex-row
          gap-4
        ">

          {/* LEFT */}
          <div className="
            min-w-[300px]
            flex items-center gap-4
          ">

            <button
              onClick={() => setOpen(!open)}
              className={`
                w-9 h-9 rounded-full
                flex items-center justify-center
                text-white shadow-lg transition
                ${open
                  ? "bg-red-500"
                  : "bg-green-500"}
              `}
            >

              {
                open
                  ? <FiMinus />
                  : <FiPlus />
              }

            </button>

            <div className="
              w-16 h-16 rounded-full
              bg-orange-100
              border border-orange-200
              flex items-center justify-center
              text-[42px] text-orange-400
              shadow-inner
            ">

              {
                isFemale
                  ? <SlUserFemale />
                  : <CiUser />
              }

            </div>
<div className="flex-1 min-w-0 overflow-hidden">

  {/* FILA 1 */}
  <div className="
    flex flex-col xl:flex-row
    items-center justify-between
    gap-4
  ">

    {/* INFO SUPERVISOR */}
    <div className="text-center xl:text-left">

      <div
        className={`
          text-[14px] xl:text-[15px]
          font-bold uppercase tracking-wide
          leading-none
          ${isDark
            ? "text-white"
            : "text-gray-900"}
        `}
      >

        {supervisor.Supervisor}

      </div>

      <div className="
        mt-1 text-[9px]
        font-semibold tracking-[0.20em]
        text-red-500
      ">
        SUPERVISOR
      </div>

    </div>

    {/* FULL / PART */}
    <div className="
      flex items-center justify-center
      gap-2 flex-nowrap
      overflow-hidden
      w-full xl:w-auto
    ">

      {/* FULL */}
      <div
        className={`
          px-2 py-1.5 rounded-xl
          border shadow-sm
          flex items-center justify-center
          gap-2 shrink
          min-w-0
          ${isDark
            ? "bg-blue-500/10 border-blue-400/20"
            : "bg-blue-50 border-blue-200"}
        `}
      >

        <div className="
          w-7 h-7 rounded-full
          flex items-center justify-center
          bg-blue-500 text-white
          text-[11px] shrink-0
        ">

          <FiUsers />

        </div>

        <div className="text-center leading-tight min-w-0">

          <div className="
            text-[8px] uppercase
            font-semibold tracking-wide
            text-blue-500
            whitespace-nowrap
          ">
            FULL
          </div>

          <div
            className={`
              text-[11px]
              font-bold
              whitespace-nowrap
              leading-none
              ${isDark
                ? "text-white"
                : "text-gray-900"}
            `}
          >

            {m.AgenteFull || 0}
            {" / "}
            {m.AgenteFullConectado || 0}

          </div>

        </div>

      </div>

      {/* PART */}
      <div
        className={`
          px-2 py-1.5 rounded-xl
          border shadow-sm
          flex items-center justify-center
          gap-2 shrink
          min-w-0
          ${isDark
            ? "bg-purple-500/10 border-purple-400/20"
            : "bg-purple-50 border-purple-200"}
        `}
      >

        <div className="
          w-7 h-7 rounded-full
          flex items-center justify-center
          bg-purple-500 text-white
          text-[11px] shrink-0
        ">

          <FiActivity />

        </div>

        <div className="text-center leading-tight min-w-0">

          <div className="
            text-[8px] uppercase
            font-semibold tracking-wide
            text-purple-500
            whitespace-nowrap
          ">
            PART
          </div>

          <div
            className={`
              text-[11px]
              font-bold
              whitespace-nowrap
              leading-none
              ${isDark
                ? "text-white"
                : "text-gray-900"}
            `}
          >

            {m.AgentePart || 0}
            {" / "}
            {m.AgentePartConectado || 0}

          </div>

        </div>

      </div>

    </div>

  </div>
  {/* FILA 2 */}
  <div className="
    mt-3
    grid grid-cols-1
    xl:grid-cols-3
    gap-2
    items-stretch
  ">

    {/* BLOQUE 1 */}
    <BloqueMetricas
      title="Gestiones"
      icon={<FiPhoneCall />}
      isDark={isDark}
    >

      <div className="
        w-full
        flex items-center justify-center
        gap-[4px]
        flex-nowrap
        overflow-hidden
        whitespace-nowrap
        text-center
      ">

        <div className="flex-1 min-w-0 flex justify-center">
          <Metric compact tiny fit label="-5M" value={m.menos_5} isDark={isDark} />
        </div>

        <div className="flex-1 min-w-0 flex justify-center">
          <Metric compact tiny fit label="+5M" value={m.mas_5} isDark={isDark} />
        </div>

        <div className="flex-1 min-w-0 flex justify-center">
          <Metric compact tiny fit label="+10M" value={m.mas_10} isDark={isDark} />
        </div>

        <div className="flex-1 min-w-0 flex justify-center">
          <Metric compact tiny fit label="Total" value={m.total_ges} isDark={isDark} />
        </div>

        <div className="flex-1 min-w-0 flex justify-center">
          <Metric compact tiny fit label="Únicas" value={m.MarcacionesUnicas} isDark={isDark} />
        </div>

        <div className="flex-1 min-w-0 flex justify-center">
          <Metric compact tiny fit label="TMO" value={formatTime(m.tmo_mayor_5)} isDark={isDark} />
        </div>

        <div className="flex-1 min-w-0 flex justify-center">
          <Metric compact tiny fit label="No tipif." value={`${m.porcen_sintipi || 0}%`} isDark={isDark} />
        </div>

      </div>

    </BloqueMetricas>

    {/* BLOQUE 2 */}
    <BloqueMetricas
      title="Ventas"
      icon={<FiTrendingUp />}
      isDark={isDark}
    >

      <div className="
        w-full
        flex items-center justify-center
        gap-[4px]
        flex-nowrap
        overflow-hidden
        whitespace-nowrap
        text-center
      ">

        <div className="flex-1 min-w-0 flex justify-center">
          <Metric compact tiny fit label="1er contacto" value={m.venta1Contacto || 0} isDark={isDark} />
        </div>

        <div className="flex-1 min-w-0 flex justify-center">
          <Metric compact tiny fit label="2do contacto" value={m.venta2Contacto || 0} isDark={isDark} />
        </div>

        <div className="flex-1 min-w-0 flex justify-center">
          <Metric compact tiny fit label="Ventas Únicas" value={m.VentasUnicas || 0} isDark={isDark} />
        </div>

        <div className="flex-1 min-w-0 flex justify-center">
          <Metric compact tiny fit label="Total" value={m.TotalVentas || 0} isDark={isDark} />
        </div>

      </div>

    </BloqueMetricas>

    {/* BLOQUE 3 */}
    <BloqueMetricas
      title="Productividad"
      icon={<FiActivity />}
      isDark={isDark}
    >

      <div className="
        w-full
        flex items-center justify-center
        gap-[4px]
        flex-nowrap
        overflow-hidden
        whitespace-nowrap
        text-center
      ">

        <div className="flex-1 min-w-0 flex justify-center">
          <MetricSemaforo
            compact
            tiny
            fit
            label="Dens."
            value={m.Densidad || "0.00"}
            semaforo={m.SemaforoDensidad}
            isDark={isDark}
          />
        </div>

        <div className="flex-1 min-w-0 flex justify-center">
          <MetricSemaforo
            compact
            tiny
            fit
            label="SPH"
            value={m.SPH || "0.00"}
            semaforo={m.SemaforoSPH}
            isDark={isDark}
          />
        </div>

        <div className="flex-1 min-w-0 flex justify-center">
          <MetricSemaforo
            compact
            tiny
            fit
            label="Product."
            value={`${m.Productividad || 0}%`}
            semaforo={m.SemaforoProductividad}
            isDark={isDark}
          />
        </div>

        <div className="flex-1 min-w-0 flex justify-center">
          <Metric
            compact
            tiny
            fit
            label="Ausentismo"
            value={m.Ausentismo || 0}
            isDark={isDark}
          />
        </div>

        <div className="flex-1 min-w-0 flex justify-center">
          <Metric
            compact
            tiny
            fit
            label="Rotación"
            value={m.Rotacion || 0}
            isDark={isDark}
          />
        </div>

      </div>

    </BloqueMetricas>

  </div>

</div>
</div>
</div>
      {/* TABLA */}
      <AnimatePresence>

        {
          open && (

            <motion.div
              initial={{
                opacity: 0,
                height: 0
              }}
              animate={{
                opacity: 1,
                height: "auto"
              }}
              exit={{
                opacity: 0,
                height: 0
              }}
              transition={{
                duration: 0.25
              }}
              className="px-4 pb-4"
            >

              <div
                className={`
                  rounded-2xl overflow-hidden border shadow-lg
                  ${isDark
                    ? "border-[#323544]"
                    : "border-gray-200"}
                `}
              >

                <div className="overflow-x-auto">

                  <table className="w-full text-xs">

                    <thead>

                      <tr className="bg-[#f04a3a] text-white">

                        <TH />

                        <TH>Asesor</TH>

                        <TH>-5 M</TH>

                        <TH>+5 M</TH>

                        <TH>+10 M</TH>

                        <TH>Total Gest</TH>

                        <TH>TMO</TH>

                        <TH>% NO TIPIS</TH>

                        <TH>VNTAS 1C</TH>

                        <TH>VNTAS 2C</TH>

                        <TH>VNTAS UNICAS</TH>

                        <TH>TT VNTAS</TH>

                        <TH>DENSIDAD</TH>

                        <TH>PRODUCT</TH>

                        <TH>SPH</TH>

                        <TH>CUARTIL</TH>

                      </tr>

                    </thead>

                    <tbody>

                      {
                        [...(supervisor.asesores || [])]
                          .sort((a, b) => {

                            const totalA =
                              Number(
                                a?.metricas?.total_ges || 0
                              )

                            const totalB =
                              Number(
                                b?.metricas?.total_ges || 0
                              )

                            return totalB - totalA

                          })
                          .map((asesor, i) => (

                            <AsesorRow
                              key={i}
                              asesor={asesor}
                              isDark={isDark}
                            />

                          ))
                      }

                    </tbody>

                  </table>

                </div>

              </div>

            </motion.div>

          )
        }

      </AnimatePresence>

        </div>

    </motion.div>

  )

}

function AsesorRow({
  asesor,
  isDark
}) {

  const [expanded, setExpanded] =
    useState(false)

  const a =
    asesor.metricas || {}

  const conectado =
    Number(a.Coneccion) === 1

  const productividad =
    parseFloat(a.productividad || 0)

  return (

    <Fragment>

      <tr
        onClick={() => setExpanded(!expanded)}
        className={`
          cursor-pointer transition hover:brightness-105
          ${isDark
            ? "bg-[#252733]"
            : "bg-white"}
        `}
      >

        <TD>

          <div className={`
            w-3 h-3 rounded-full mx-auto
            ${conectado
              ? "bg-green-500"
              : "bg-gray-400"}
          `} />

        </TD>

        <TD isDark={isDark}>

          <div className="flex flex-col items-start">

            <span className="uppercase font-semibold whitespace-nowrap">
              {asesor.Agente}
            </span>

          </div>

        </TD>

        <TD isDark={isDark}>
          {a.menos_5 || 0}
        </TD>

        <TD isDark={isDark}>
          {a.mas_5 || 0}
        </TD>

        <TD isDark={isDark}>
          {a.mas_10 || 0}
        </TD>

        <TD isDark={isDark}>
          {a.total_ges || 0}
        </TD>

        <TD isDark={isDark}>
          {formatTime(a.min_tmo_alto)}
        </TD>

        <TD isDark={isDark}>
          {a.porcen_sintipi || 0}
        </TD>

        <TD isDark={isDark}>
          {a.venta1Contacto || 0}
        </TD>

        <TD isDark={isDark}>
          {a.venta2Contacto || 0}
        </TD>

        <TD isDark={isDark}>
          {a.VentasUnicas || 0}
        </TD>

        <TD isDark={isDark}>
          {a.TotalVentas || 0}
        </TD>

        <TD isDark={isDark}>
          {a.Densidad || "0.00"}
        </TD>

        <TD isDark={isDark}>

  <div className="
    flex items-center justify-center
    gap-2 whitespace-nowrap
  ">

    <span
      className="w-2.5 h-2.5 rounded-full shrink-0"
      style={{
        backgroundColor:
          getSemaforoColor(
            a.SemaforoProductividad
          )
      }}
    />

    <span className="font-semibold">
      {productividad.toFixed(2)}%
    </span>

  </div>

</TD>

        <TD isDark={isDark}>
          {a.SPH || "0.00"}
        </TD>

        <TD isDark={isDark}>
          {a.Cuartil || 0}
        </TD>

      </tr>

      <AnimatePresence>

        {
          expanded && (

            <motion.tr
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              exit={{
                opacity: 0
              }}
            >

              <td
                colSpan={16}
                className={`
                  p-4
                  ${isDark
                    ? "bg-[#1d1f29]"
                    : "bg-gray-50"}
                `}
              >

                <div className="
                  grid grid-cols-2
                  md:grid-cols-3
                  xl:grid-cols-5
                  2xl:grid-cols-10
                  gap-3
                ">

                  <Detalle
                    label="Baño"
                    value={formatTime(a.Tiempo_bano)}
                    isDark={isDark}
                  />

                  <Detalle
                    label="Auxiliar Hablado"
                    value={formatTime(a.Seg_AuxHablado)}
                    isDark={isDark}
                  />

                  <Detalle
                    label="ACW"
                    value={formatTime(a.Seg_ACW)}
                    isDark={isDark}
                  />

                  <Detalle
                    label="FeedBack"
                    value={formatTime(a.TIEMPO_AUXILIAR)}
                    isDark={isDark}
                  />

                  <Detalle
                    label="Tiempos Disponible"
                    value={formatTime(a.Seg_TiempoDisponible)}
                    isDark={isDark}
                  />

                  <Detalle
                    label="Tiempos Hablado ACD"
                    value={formatTime(a.Seg_TiempoHabladoAcd)}
                    isDark={isDark}
                  />

                  <Detalle
                    label="Tiempo Total Conex"
                    value={formatTime(a.seg_tiempoTotalConeccion)}
                    isDark={isDark}
                  />

                  <Detalle
                    label="Hora Inicio"
                    value={a.HoraInicio || "--"}
                    isDark={isDark}
                  />

                  <Detalle
                    label="Ult Hora Ges"
                    value={a.HoraFin || "--"}
                    isDark={isDark}
                  />

                  <Detalle
                    label="Productividad"
                    value={`${productividad.toFixed(2)} %`}
                    isDark={isDark}
                  />

                </div>

              </td>

            </motion.tr>

          )
        }

      </AnimatePresence>

    </Fragment>

  )

}

function BloqueMetricas({
  children,
  title,
  icon,
  isDark
}) {

  return (

    <div
      className={`
        rounded-2xl p-4 shadow-inner
        flex flex-col gap-3
        min-h-[120px]
        ${isDark
          ? "bg-[#1d1f29] border border-[#323544]"
          : "bg-gray-50 border border-gray-200"}
      `}
    >

      <div className="
        flex items-center gap-2
        text-red-500 text-xs
        font-bold uppercase
      ">

        {icon}

        {title}

      </div>

      <div className="
        flex flex-wrap gap-4
      ">

        {children}

      </div>

    </div>

  )

}

function TH({
  children
}) {

  return (

    <th className="p-3 text-center whitespace-nowrap">

      <div className="flex items-center justify-center gap-1">

        {children}

        <BsArrowDownUp className="opacity-50 text-[10px]" />

      </div>

    </th>

  )

}

function TD({
  children,
  isDark
}) {

  return (

    <td
      className={`
        p-3 text-center whitespace-nowrap
        ${isDark
          ? "text-gray-200"
          : "text-gray-700"}
      `}
    >

      {children}

    </td>

  )

}

function Metric({
  label,
  value,
  isDark
}) {

  return (

    <div className="text-center min-w-[60px]">

      <div
        className={`
          text-[10px] mb-1
          ${isDark
            ? "text-gray-400"
            : "text-gray-500"}
        `}
      >

        {label}

      </div>

      <div
        className={`
          font-bold text-sm
          ${isDark
            ? "text-white"
            : "text-gray-900"}
        `}
      >

        {value}

      </div>

    </div>

  )

}

function MetricSemaforo({
  label,
  value,
  semaforo,
  isDark
}) {

  return (

    <div className="text-center min-w-[75px]">

      <div
        className={`
          text-[10px] mb-1
          ${isDark
            ? "text-gray-400"
            : "text-gray-500"}
        `}
      >

        {label}

      </div>

      <div className="flex items-center justify-center gap-2">

        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{
            backgroundColor:
              getSemaforoColor(
                semaforo
              )
          }}
        />

        <span
          className={`
            font-bold text-sm
            ${isDark
              ? "text-white"
              : "text-gray-900"}
          `}
        >

          {value}

        </span>

      </div>

    </div>

  )

}

function Detalle({
  label,
  value,
  isDark
}) {

  return (

    <div
      className={`
        rounded-2xl p-3 border shadow-md
        ${isDark
          ? "bg-[#252733] border-[#323544]"
          : "bg-white border-gray-200"}
      `}
    >

      <div
        className={`
          text-[10px] mb-1
          ${isDark
            ? "text-gray-400"
            : "text-gray-500"}
        `}
      >

        {label}

      </div>

      <div
        className={`
          flex items-center gap-2
          text-xs font-semibold
          ${isDark
            ? "text-white"
            : "text-gray-900"}
        `}
      >

        <FiClock />

        {value || "--"}

      </div>

    </div>

  )

}