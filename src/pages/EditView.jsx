import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Pencil, Check, X } from "lucide-react";

export default function EditView() {

  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [open, setOpen] = useState(true);

  const [level, setLevel] = useState("");
  const [idcamp, setIdcamp] = useState("");
  const [campanas, setCampanas] = useState([]);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewEditOpen, setPreviewEditOpen] = useState(false);

  const API = "http://192.168.9.115:4000/api";

  const input = `w-full px-3 py-2 rounded-xl border transition`;
  const theme = isDark
    ? "bg-[#272833] text-white border-white/10"
    : "bg-white text-black border-gray-300";

  // =========================
  // LOAD CAMPANAS
  // =========================
  useEffect(() => {
    fetch(`${API}/campanas-select`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) setCampanas(data.data);
      });
  }, []);

  // =========================
  // NORMALIZADOR
  // =========================
  const normalizarVista = (v) => ({
    ...v,
    name_vista: v.name_vista || v.name_vista || "",
    idcamp: v.idcamp || v.id_camp || "",
  });

  // =========================
  // BUSCAR
  // =========================
  const buscar = async () => {
    if (!level) return;

    setLoading(true);

    let url = `${API}/vistas-filtradas?level=${level}`;
    if (idcamp) url += `&idcamp=${idcamp}`;

    const res = await fetch(url);
    const json = await res.json();

    if (json.ok) {
      const normalizados = json.data.map(normalizarVista);
      setData(normalizados);
    }

    setLoading(false);
  };

  // =========================
  // ABRIR EDIT
  // =========================
  const abrirEditar = async (id_vista) => {
    const res = await fetch(`${API}/vistas-filtradas/${id_vista}`);
    const json = await res.json();

    if (json.ok) {
      const v = normalizarVista(json.data);

      setEditing({
        ...v,
        level: v.level ?? "",
        activo: v.activo ?? ""
      });

      setModalOpen(true);
      setPreviewEditOpen(false);
    }
  };

  // =========================
  // GUARDAR (FIX REAL)
  // =========================
  const guardar = async () => {
    try {
      const payload = {
        level: Number(editing.level),
        idcamp: Number(editing.idcamp),
        name_vista: editing.name_vista, // 🔥 CLAVE
        url_vista: editing.url_vista,
        contenedor: editing.contenedor || null,
        contenedor2: editing.contenedor2 || null,
        activo: Number(editing.activo)
      };

      console.log("PAYLOAD:", payload);

      const response = await fetch(
        `${API}/vistas-filtradas/${editing.id_vista}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      const data = await response.json();

      if (data.ok) {
        alert("Vista actualizada correctamente");
      } else {
        alert(data.message || "Error al guardar");
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
    }

    setModalOpen(false);
    buscar();
  };

  return (
    <div className={`p-6 ${isDark ? "bg-[#1F2029] text-white" : "bg-gray-100"}`}>

      <motion.div layout className={`rounded-2xl p-6 shadow-xl ${theme}`}>

        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <h1 className="text-xl font-semibold">Editar Vistas</h1>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >

              {/* FILTROS */}
              <div className="grid grid-cols-3 gap-4 my-6">

                <select
                  value={level}
                  onChange={e => setLevel(e.target.value)}
                  className={`${input} ${theme}`}
                >
                  <option value="">Nivel</option>
                  <option value="1">Operativos</option>
                  <option value="2">Calidad</option>
                  <option value="3">Rentabilidad</option>
                  <option value="4">RRHH</option>
                </select>

                <select
                  value={idcamp}
                  onChange={e => setIdcamp(e.target.value)}
                  className={`${input} ${theme}`}
                >
                  <option value="">Campaña</option>
                  {campanas.map(c => (
                    <option key={c.id_camp} value={c.id_camp}>
  {c.nombre}
</option>
                  ))}
                </select>

                <button
                  onClick={buscar}
                  className="bg-red-800 hover:bg-red-950 text-white rounded-xl"
                >
                  Buscar
                </button>
              </div>

              {/* TABLA */}
              <div className="overflow-auto">
                <table className="w-full text-base border-separate border-spacing-y-2">
                  <tbody>
                    {data.map(row => (
                      <motion.tr
                        key={row.id_vista}
                        whileHover={{ scale: 1.01 }}
                        className={`${theme} shadow-md`}
                      >
                        <td className="p-4">{row.name_vista}</td>

                        <td className="p-4 truncate max-w-[250px]">
                          {row.url_vista}
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">

                            <button
                              onClick={() => abrirEditar(row.id_vista)}
                              className="bg-red-800 hover:bg-red-950 text-white p-2 rounded-xl"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              onClick={() => {
                                setEditing(row);
                                setPreviewOpen(true);
                              }}
                              className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-xl"
                            >
                              <Eye size={16} />
                            </button>

                          </div>
                        </td>

                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* MODAL */}
      <AnimatePresence>
        {modalOpen && editing && (
          <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center">

            <div className={`w-[1000px] max-w-[95%] p-6 rounded-2xl ${theme}`}>

              <h2 className="mb-4 text-lg font-semibold">Editar Vista</h2>

              <select
                value={editing.level}
                onChange={e => setEditing({ ...editing, level: e.target.value })}
                className={`${input} ${theme} mb-3`}
              >
                <option value="">Seleccionar</option>
                <option value="1">Operativos</option>
                <option value="2">Calidad</option>
                <option value="3">Rentabilidad</option>
                <option value="4">RRHH</option>
              </select>

              <select
                value={editing.idcamp}
                onChange={e => setEditing({ ...editing, idcamp: e.target.value })}
                className={`${input} ${theme} mb-3`}
              >
                {campanas.map(c => (
                  <option key={c.id_camp} value={c.id_camp}>
                    {c.nombre}
                  </option>
                ))}
              </select>

              {["name_vista", "url_vista", "contenedor", "contenedor2"].map(f => (
                <input
                  key={f}
                  value={editing[f] || ""}
                  onChange={e => setEditing({ ...editing, [f]: e.target.value })}
                  className={`${input} ${theme} mb-2`}
                  placeholder={f}
                />
              ))}

              <select
                value={editing.activo}
                onChange={e => setEditing({ ...editing, activo: e.target.value })}
                className={`${input} ${theme} mb-2`}
              >
                <option value="">Seleccione</option>
                <option value="1">Habilitado</option>
                <option value="0">Inhabilitado</option>
              </select>

              <button
                onClick={() => setPreviewEditOpen(!previewEditOpen)}
                className="mt-3 bg-red-800 text-white px-4 py-2 rounded"
              >
                {previewEditOpen ? "Ocultar Preview" : "Ver Preview"}
              </button>

              {previewEditOpen && (
                <div className="mt-4 h-[400px] border rounded-xl overflow-hidden">
                  <iframe src={editing.url_vista} className="w-full h-full" />
                </div>
              )}

              <div className="flex justify-end gap-3 mt-4">
                <button onClick={() => setModalOpen(false)}>
                  <X />
                </button>
                <button
                  onClick={guardar}
                  className="bg-green-900 px-4 py-2 rounded text-white"
                >
                  Guardar
                </button>
              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* PREVIEW GLOBAL */}
      <AnimatePresence>
        {previewOpen && editing && (
          <motion.div className="fixed inset-0 bg-black/70 flex items-center justify-center">

            <div className={`w-[85%] h-[85%] rounded-xl overflow-hidden flex flex-col ${theme}`}>
              <iframe src={editing.url_vista} className="flex-1" />

              <div className="p-6 flex justify-end">
                <button onClick={() => setPreviewOpen(false)}>
                  CERRAR
                </button>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}