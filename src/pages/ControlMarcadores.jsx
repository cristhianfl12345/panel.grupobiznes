import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function ControlMarcadores() {

  const API = "http://localhost:4000/api"

  const [searchParams] = useSearchParams()
  const idCampFromUrl = searchParams.get("camp")

  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  )

  const [campanas, setCampanas] = useState([])
  const [marcadores, setMarcadores] = useState([])
const [resumenMarcadores, setResumenMarcadores] = useState([]) // nuevo estado para resumen

const user = JSON.parse(localStorage.getItem("user") || "{}")
const id_usuario = user.id

  const [idCamp, setIdCamp] = useState(idCampFromUrl || "")
  const [idMarcador, setIdMarcador] = useState("")
  const [cantidad, setCantidad] = useState(1)

  const [activos, setActivos] = useState([])
  const [spam, setSpam] = useState([])
const [activosAbierto, setActivosAbierto] = useState(null)
const [spamAbierto, setSpamAbierto] = useState(null)
  const [previewMascaras, setPreviewMascaras] = useState([])

  useEffect(() => {

    const handleStorage = () => {
      const theme = localStorage.getItem("theme") === "dark"
      setIsDark(theme)
      window.location.reload()
    }

    window.addEventListener("storage", handleStorage)

    return () => window.removeEventListener("storage", handleStorage)

  }, [])

  /* ============================= */

  useEffect(() => {

    fetch(`${API}/campanas`)
      .then(r => r.json())
      .then(data => setCampanas(data))

  }, [])

  // inicio resumen marcadores
  useEffect(() => {

  if (!idCamp) return

  fetch(`${API}/resumen-marcadores/${idCamp}`)
    .then(r => r.json())
    .then(data => setResumenMarcadores(data))

}, [idCamp])
// fin

  useEffect(() => {

    if (!idCamp) return

    fetch(`${API}/marcadores/${idCamp}`)
      .then(r => r.json())
      .then(data => setMarcadores(data))

  }, [idCamp])

  useEffect(() => {

    if (!idCamp) return

    fetch(`${API}/activos/${idCamp}`)
      .then(r => r.json())
      .then(data => setActivos(data))

    fetch(`${API}/spam/${idCamp}`)
      .then(r => r.json())
      .then(data => setSpam(data))

  }, [idCamp])

  /* ============================= */

  const generarMascaras = async () => {

    if (!idMarcador) {
      alert("Seleccione marcador")
      return
    }

    const res = await fetch(`${API}/generar-mascaras`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idCamp,
        idMarcador,
        cantidad
      })
    })

    const data = await res.json()

    if (!data.status) {
      alert("Error generando")
      return
    }

    setPreviewMascaras(data.data)

  }

  const confirmarMascaras = async () => {

    const ids = previewMascaras.map(m => m.id_gen_mask)

    const res = await fetch(`${API}/confirmar-mascaras`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ids,
        idCamp,
        idMarcador,
        id_usuario
      })
    })

    const data = await res.json()

    if (!data.status) {
      alert("Error confirmando")
      return
    }

    alert("Máscaras insertadas")

    setPreviewMascaras([])

    const activosRes = await fetch(`${API}/activos/${idCamp}`)
    setActivos(await activosRes.json())

  }

  const moverSpam = async (id) => {

    if (!confirm("Mover a spam?")) return

    const res = await fetch(`${API}/mover-spam`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, id_usuario })
    })

    const data = await res.json()

    if (!data.status) {
      alert("Error")
      return
    }


    alert("Nuevo número movido a spam: ")
    setActivos(activos.filter(a => a.id !== id))

  }

  const reemplazar = async (id) => {
     if (!confirm("reemplazar este numero?")) return

    const res = await fetch(`${API}/reemplazar-spam`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, id_usuario })
    })

    const data = await res.json()

    if (!data.status) {
      alert("Error")
      return
    }

    alert("Nuevo número: " + data.telefono_nuevo)

    setSpam(spam.filter(s => s.id !== id))

  }

  const totalActivos = activos.length
  const totalSpam = spam.length

  return (

    <div
      className={`
      min-h-screen p-6 transition-colors
      ${isDark ? "bg-[#1F2029] text-gray-200" : "bg-gray-100"}
      `}
    >

      {/* BREADCRUMB */}

      <div className="mb-6 text-lg font-semibold">
        Control / Marcadores / {idCamp}
      </div>

{/* KPI + RESUMEN MARCADORES */}

<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

  {resumenMarcadores.map(m => (

    <>

      {/* BLOQUE MARCADOR */}

      <div
        key={`marcador-${m.id_marcador}`}
        className={`
        rounded-xl shadow-sm p-5 border-l-4
        ${isDark ? "bg-[#272833] border-purple-700" : "bg-white border-purple-500"}
        `}
      >

        <p className="text-sm opacity-70">Marcador</p>

        <h2 className="text-xl font-bold text-purple-500">
          {m.id_marcador} - {m.marcador}
        </h2>

      </div>

      {/* BLOQUE ACTIVOS */}

      <div
        key={`activos-${m.id_marcador}`}
        className={`
        rounded-xl shadow-sm p-5 border-l-4
        ${isDark ? "bg-[#272833] border-green-700" : "bg-white border-green-500"}
        `}
      >

        <p className="text-sm opacity-70">Teléfonos Activos</p>

        <h2 className="text-2xl font-bold text-green-500">
          {m.activos}
        </h2>

      </div>

      {/* BLOQUE SPAM */}

      <div
        key={`spam-${m.id_marcador}`}
        className={`
        rounded-xl shadow-sm p-5 border-l-4
        ${isDark ? "bg-[#272833] border-red-700" : "bg-white border-red-500"}
        `}
      >

        <p className="text-sm opacity-70">Teléfonos Spam</p>

        <h2 className="text-2xl font-bold text-red-500">
          {m.spam}
        </h2>

      </div>

    </>

  ))}

</div>
{/* GENERADOR */}

<motion.div
initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4 }}
className={`
rounded-2xl shadow-lg p-6 mb-8 border
${isDark
  ? "bg-[#272833] border-[#343545]"
  : "bg-white border-gray-200"
}
`}
>

  <motion.h2
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="font-semibold text-lg mb-6"
  >
    Generador de Máscaras
  </motion.h2>

  {/* CONTROLES */}

  <div className="grid md:grid-cols-3 gap-6 mb-6">

    <motion.input
      whileFocus={{ scale: 1.02 }}
      value={idCamp}
      readOnly
      className={`
      p-2 rounded-lg border transition-all
      focus:outline-none focus:ring-2 focus:ring-red-500
      ${isDark
        ? "bg-[#1F2029] border-gray-700"
        : "bg-white border-gray-300"
      }
      `}
    />

    <motion.select
      whileFocus={{ scale: 1.02 }}
      value={idMarcador}
      onChange={e => setIdMarcador(e.target.value)}
      className={`
      p-2 rounded-lg border transition-all
      focus:outline-none focus:ring-2 focus:ring-red-500
      ${isDark
        ? "bg-[#1F2029] border-gray-700"
        : "bg-white border-gray-300"
      }
      `}
    >

      <option value="">Seleccione marcador</option>

      {marcadores.map(m => (
        <option key={m.id_marcador} value={m.id_marcador}>
          {m.id_marcador} - {m.marcador}
        </option>
      ))}

    </motion.select>

    <motion.input
      whileFocus={{ scale: 1.02 }}
      type="number"
      value={cantidad}
      onChange={e => setCantidad(e.target.value)}
      className={`
      p-2 rounded-lg border transition-all
      focus:outline-none focus:ring-2 focus:ring-red-500
      ${isDark
        ? "bg-[#1F2029] border-gray-700"
        : "bg-white border-gray-300"
      }
      `}
    />

  </div>

  {/* BOTON GENERAR */}

  <div className="flex justify-end mb-6">

    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={generarMascaras}
      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow-md transition-all"
    >
      Generar máscaras
    </motion.button>

  </div>

  {/* PREVIEW */}

  <AnimatePresence>

    {previewMascaras.length === 0 && (

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        className="text-sm"
      >
        Aquí aparecerán las máscaras generadas...
      </motion.p>

    )}

  </AnimatePresence>

  <AnimatePresence>

    {previewMascaras.length > 0 && (

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >

        <table className="w-full text-sm mb-6 rounded-lg overflow-hidden">

          <thead className={isDark ? "bg-[#1F2029]" : "bg-gray-100"}>

            <tr>

              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Teléfono</th>
             
              <th className="p-3 text-left">Marcador</th>
             
              <th className="p-3 text-left">Campaña</th>

            </tr>

          </thead>

          <tbody>

            {previewMascaras.map((m, i) => (

              <motion.tr
                key={m.id_gen_mask}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`
                border-t
                ${isDark
                  ? "border-gray-700 hover:bg-[#30313d]"
                  : "border-gray-200 hover:bg-gray-50"
                }
                transition
                `}
              >

                <td className="p-3">{m.id_gen_mask}</td>
                <td className="p-3">{m.telefono}</td>
                <td className="p-3">{m.id_marcador}</td>
                
                <td className="p-3">{m.IdCamp}</td>

              </motion.tr>

            ))}

          </tbody>

        </table>

        <div className="flex justify-end">

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={confirmarMascaras}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md transition-all"
          >
            Confirmar e insertar
          </motion.button>

        </div>

      </motion.div>

    )}

  </AnimatePresence>

</motion.div>

{/* ACTIVOS */}

<div
  className={`
  rounded-xl shadow-sm p-6 mb-8
  ${isDark ? "bg-[#272833]" : "bg-white"}
  `}
>

  {/* HEADER PLEGABLE */}

  <div
    className="flex items-center justify-between cursor-pointer"
    onClick={() => setActivosAbierto(!activosAbierto)}
  >

    <h2 className="font-semibold">
      Teléfonos Activos
    </h2>

    <div className="transition-all">
      {activosAbierto
        ? <ChevronUp size={22}/>
        : <ChevronDown size={22}/>
      }
    </div>

  </div>

  {/* CONTENIDO ANIMADO */}

  <AnimatePresence>

    {activosAbierto && (

      <motion.div
        initial={{ opacity: 0, height: 0, y: -10 }}
        animate={{ opacity: 1, height: "auto", y: 0 }}
        exit={{ opacity: 0, height: 0, y: -10 }}
        transition={{ duration: 0.35 }}
        className="overflow-hidden mt-4"
      >

        <table className="w-full text-sm">

          <thead className={isDark ? "bg-[#1F2029]" : "bg-gray-100"}>

            <tr>
              <th className="p-2 text-left">Teléfono</th>
              <th className="p-2 text-left">Asignado por</th>
              <th className="p-2 text-left">Marcador</th>
              <th className="p-2 text-left">Fecha</th>
              <th className="p-2 text-left">Acción</th>
            </tr>

          </thead>

          <tbody>

            {activos.map(a => (

              <tr key={a.id} className="border-t border-gray-700">

                <td className="p-2">{a.telefono}</td>
                <td className="p-2">{a.usuario_nombre}</td>
                <td className="p-2">{a.marcador_nombre}</td>

                <td className="p-2">
                  {new Date(a.fecha_consulta).toLocaleString('sv-SE', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </td>

                <td className="p-2">

                  <button
                    onClick={async () => {
                      await moverSpam(a.id)
                      window.location.reload()
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition"
                  >
                    Mover a Spam
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </motion.div>

    )}

  </AnimatePresence>

</div>
{/* SPAM */}

<div
  className={`
  rounded-xl shadow-sm p-6
  ${isDark ? "bg-[#272833]" : "bg-white"}
  `}
>

  {/* HEADER PLEGABLE */}

  <div
    className="flex items-center justify-between cursor-pointer"
    onClick={() => setSpamAbierto(!spamAbierto)}
  >

    <h2 className="font-semibold">
      Teléfonos Spam
    </h2>

    <div className="transition-all">
      {spamAbierto
        ? <ChevronUp size={22}/>
        : <ChevronDown size={22}/>
      }
    </div>

  </div>

  {/* CONTENIDO ANIMADO */}

  <AnimatePresence>

    {spamAbierto && (

      <motion.div
        initial={{ opacity: 0, height: 0, y: -10 }}
        animate={{ opacity: 1, height: "auto", y: 0 }}
        exit={{ opacity: 0, height: 0, y: -10 }}
        transition={{ duration: 0.35 }}
        className="overflow-hidden mt-4"
      >

        <table className="w-full text-sm">

          <thead className={isDark ? "bg-[#1F2029]" : "bg-gray-100"}>

            <tr>
              <th className="p-2 text-left">Teléfono</th>
              <th className="p-2 text-left">Movido por</th>
              <th className="p-2 text-left">Marcador</th>
              <th className="p-2 text-left">Fecha</th>
              <th className="p-2 text-left">Acción</th>
            </tr>

          </thead>

          <tbody>

            {spam.map(s => (

              <tr key={s.id} className="border-t border-gray-700">

                <td className="p-2">{s.telefono}</td>
                <td className="p-2">{s.usuario_nombre}</td>
                <td className="p-2">{s.marcador_nombre}</td>

                <td className="p-2">
                  {new Date(s.fecha_consulta).toLocaleString('sv-SE', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </td>

                <td className="p-2">

                  <button
                    onClick={async () => {
                      await reemplazar(s.id)
                      window.location.reload()
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-xs transition"
                  >
                    Reemplazar
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </motion.div>

    )}

  </AnimatePresence>

</div>

</div>

  )

}