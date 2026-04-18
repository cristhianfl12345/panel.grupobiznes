import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  Check,
  Pencil
} from "lucide-react";
import EditView from "./EditView";

export default function CrearVista() {

  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const handleStorage = () => {
      const theme = localStorage.getItem("theme") === "dark";
      setIsDark(theme);
      window.location.reload();
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // TAB CONTROL
  const [activeTab, setActiveTab] = useState("crear");

  const [form, setForm] = useState({
    level: "",
    id_camp: "",
    name_vista: "",
    url_vista: "",
    contenedor: "",
    contenedor2: "",
    activo: "1"
  });

  const [campanas, setCampanas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [urlConfirmada, setUrlConfirmada] = useState(false);
  const [tempUrl, setTempUrl] = useState("");
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    const loadCampanas = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/campanas-select");
        const data = await res.json();

        if (Array.isArray(data)) {
          setCampanas(data);
        } else if (data.ok && Array.isArray(data.data)) {
          setCampanas(data.data);
        }

      } catch (error) {
        console.error(error);
      }
    };

    loadCampanas();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    if (e.target.name === "url_vista") {
      setUrlConfirmada(false);
    }
  };

  const abrirPreview = () => {
    if (!form.url_vista || !form.url_vista.startsWith("http")) {
      setMsg({ type: "error", text: "URL inválida" });
      return;
    }

    setTempUrl(form.url_vista);
    setPreviewOpen(true);
    setIframeLoading(true);
    setIframeError(false);
  };

  const confirmarUrl = () => {
    setUrlConfirmada(true);
    setPreviewOpen(false);
  };

  const modificarUrl = () => {
    setUrlConfirmada(false);
    setPreviewOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("http://localhost:4000/api/vistasss", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
  level: Number(form.level),
  idcamp: Number(form.id_camp),        
  name_vista: form.name_vista,         
  url_vista: form.url_vista,
  contenedor: form.contenedor,
  contenedor2: form.contenedor2,
  activo: Number(form.activo)
})
      });

      const data = await res.json();

      if (data.ok) {
        setMsg({ type: "success", text: "Vista creada correctamente" });

        setForm({
          level: "",
          id_camp: "",
          name_vista: "",
          url_vista: "",
          contenedor: "",
          contenedor2: "",
          activo: "1"
        });

        setUrlConfirmada(false);

      } else {
        setMsg({ type: "error", text: data.message });
      }

    } catch {
      setMsg({ type: "error", text: "Error de conexión" });
    }

    setLoading(false);
  };

  const inputBase = `
    w-full px-3 py-2 rounded-xl border transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-red-500/40
  `;

  const inputTheme = isDark
    ? "bg-[#1F2029] border-white/10 text-white"
    : "bg-white border-gray-300 text-gray-800";

  return (
    <div className={`max-full-screen p-6 ${isDark ? "bg-[#1F2029] text-white" : "bg-gray-100 text-slate-800"}`}>
{/* tabs */}
<div className="w-full flex justify-center gap-6 mb-8 mt-8">
  <button
    onClick={() => setActiveTab("crear")}
    className={`px-8 py-3 text-lg font-medium rounded-2xl transition-all duration-200 shadow-md ${
      activeTab === "crear"
        ? "bg-red-800 text-white scale-110"
        : isDark
        ? "bg-[#272833] text-white hover:bg-[#32334a]"
        : "bg-white text-gray-700 hover:bg-gray-200 border border-gray-200"
    }`}
  >
    Crear Vista
  </button>

  <button
    onClick={() => setActiveTab("editar")}
    className={`px-8 py-3 text-lg font-medium rounded-2xl transition-all duration-200 shadow-md ${
      activeTab === "editar"
        ? "bg-red-800 text-white scale-110"
        : isDark
        ? "bg-[#272833] text-white hover:bg-[#32334a]"
        : "bg-white text-gray-700 hover:bg-gray-200 border border-gray-200"
    }`}
  >
    Editar Vista
  </button>
</div>
      {/* CONTENIDO POR TAB */}
      <AnimatePresence mode="wait">

        {activeTab === "crear" && (
          <motion.div
            key="crear"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >

            <motion.div
              className={`max-w-3xl mx-auto rounded-2xl shadow-xl p-8 ${isDark ? "bg-[#272833]" : "bg-white"}`}
            >

              <h2 className="text-2xl font-semibold mb-6">Crear vista</h2>

              <AnimatePresence>
                {msg && (
                  <motion.div className={`mb-4 px-4 py-3 rounded-lg flex gap-2 text-sm ${
                    msg.type === "success" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  }`}>
                    {msg.type === "success" ? <CheckCircle size={18}/> : <XCircle size={18}/>}
                    {msg.text}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="grid gap-4">

                <select name="level" value={form.level} onChange={handleChange} className={`${inputBase} ${inputTheme}`} required>
                  <option value="">Seleccionar Nivel</option>
                  <option value="1">Operativos</option>
                  <option value="2">Calidad</option>
                  <option value="3">Rentabilidad</option>
                  <option value="4">RRHH</option>
                </select>

                <select name="id_camp" value={form.id_camp} onChange={handleChange} className={`${inputBase} ${inputTheme}`} required>
                  <option value="">Seleccionar Campaña</option>
                  {campanas.map(c => (
                    <option key={c.id_camp} value={c.id_camp}>
                      {c.id_camp} - {c.nombre}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  name="name_vista"
                  value={form.name_vista}
                  onChange={handleChange}
                  placeholder="Nombre de la vista"
                  className={`${inputBase} ${inputTheme}`}
                />

                <div className="relative">
                  <input
                    type="text"
                    name="url_vista"
                    value={form.url_vista}
                    onChange={handleChange}
                    disabled={urlConfirmada}
                    placeholder="URL del iframe"
                    className={`${inputBase} ${inputTheme} pr-10 ${urlConfirmada ? "opacity-60" : ""}`}
                  />

                  <button
                    type="button"
                    onClick={abrirPreview}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-red-500 flex gap-1 text-sm"
                  >
                    Preview <Eye size={18}/>
                  </button>
                </div>

                {urlConfirmada && (
                  <div className="flex items-center gap-2 text-green-500 text-sm">
                    <Check size={16}/> URL confirmada
                  </div>
                )}

                {["contenedor", "contenedor2"].map(field => (
                  <input
                    key={field}
                    type="text"
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    placeholder={field}
                    className={`${inputBase} ${inputTheme}`}
                  />
                ))}

                <select name="activo" value={form.activo} onChange={handleChange} className={`${inputBase} ${inputTheme}`}>
                  <option value="1">Habilitado</option>
                  <option value="0">Inhabilitado</option>
                </select>

                <button className="bg-red-800 hover:bg-red-950 text-white py-3 rounded-xl">
                  {loading ? "Guardando..." : "Crear Vista"}
                </button>

              </form>
            </motion.div>
          </motion.div>
        )}

        {activeTab === "editar" && (
          <motion.div
            key="editar"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <EditView />
          </motion.div>
        )}

      </AnimatePresence>

      {/* MODAL PREVIEW */}
      <AnimatePresence>
        {previewOpen && (
          <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

            <div className={`w-[90%] h-[80%] rounded-xl overflow-hidden ${isDark ? "bg-[#1F2029]" : "bg-white"}`}>

              <div className="h-full flex flex-col">

                <div className="flex justify-between p-3 border-b">
                  <span className="text-sm">Preview</span>
                  <button onClick={() => setPreviewOpen(false)}>✖</button>
                </div>

                <div className="flex-1 relative">
                  {iframeLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="animate-spin"/>
                    </div>
                  )}

                  {iframeError && (
                    <div className="flex items-center justify-center h-full text-red-500">
                      No se puede mostrar esta URL
                    </div>
                  )}

                  <iframe
                    src={tempUrl}
                    className="w-full h-full"
                    onLoad={() => setIframeLoading(false)}
                    onError={() => setIframeError(true)}
                  />
                </div>

                <div className="p-4 flex justify-end gap-3 border-t">
                  <button onClick={modificarUrl} className="px-4 py-2 bg-gray-400 rounded flex items-center gap-2">
                    <Pencil size={16}/> Modificar
                  </button>
                  <button onClick={confirmarUrl} className="px-4 py-2 bg-green-600 text-white rounded flex items-center gap-2">
                    <Check size={16}/> Confirmar
                  </button>
                </div>

              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}