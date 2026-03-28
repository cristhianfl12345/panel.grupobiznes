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
  const [urlConfirmada, setUrlConfirmada] = useState(false);

  const [previewEditOpen, setPreviewEditOpen] = useState(false); // NUEVO

  const API = "http://localhost:4000/api";

  const levelMap = {
    1: "Operativos",
    2: "Calidad",
    3: "Rentabilidad",
    4: "RRHH"
  };

  const activoLabel = (val) => {
    if (val === 1 || val === "1") return "Habilitado";
    if (val === 0 || val === "0") return "Inhabilitado";
    return "Seleccione";
  };

  useEffect(() => {
    fetch(`${API}/campanas-select`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) setCampanas(data.data);
      });
  }, []);

  const buscar = async () => {
    if (!level) return;

    setLoading(true);

    let url = `${API}/vistas-filtradas?level=${level}`;
    if (idcamp) url += `&idcamp=${idcamp}`;

    const res = await fetch(url);
    const json = await res.json();

    if (json.ok) setData(json.data);

    setLoading(false);
  };

  const abrirEditar = async (id) => {
    const res = await fetch(`${API}/vistas-filtradas/${id}`);
    const json = await res.json();

    if (json.ok) {
      setEditing({
        ...json.data,
        level: json.data.level ?? "",
        activo: json.data.activo ?? ""
      });
      setModalOpen(true);
      setUrlConfirmada(false);
      setPreviewEditOpen(false);
    }
  };

  const guardar = async () => {
    try {
      const response = await fetch(`${API}/vistas-filtradas/${editing.orden}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing)
      });

      if (response.ok) {
        alert("Vista actualizada correctamente");
      } else {
        alert("Error al guardar: Intenta nuevamente");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Hubo un problema de conexión. Intenta nuevamente");
    }

    setModalOpen(false);
    buscar();
  };

  const input = `w-full px-3 py-2 rounded-xl border transition`;
  const theme = isDark
    ? "bg-[#272833] text-white border-white/10"
    : "bg-white text-black border-gray-300";

  return (
    <div className={`p-6 ${isDark ? "bg-[#1F2029] text-white" : "bg-gray-100"}`}>

      <motion.div layout className={`rounded-2xl p-6 shadow-xl ${theme}`}>

        <div className="flex justify-between items-center cursor-pointer"
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

                <select value={level} onChange={e => setLevel(e.target.value)} className={`${input} ${theme}`}>
                  <option value="">Nivel</option>
                  <option value="1">Operativos</option>
                  <option value="2">Calidad</option>
                  <option value="3">Rentabilidad</option>
                  <option value="4">RRHH</option>
                </select>

                <select value={idcamp} onChange={e => setIdcamp(e.target.value)} className={`${input} ${theme}`}>
                  <option value="">Campaña</option>
                  {campanas.map(c => (
                    <option key={c.IdCamp} value={c.IdCamp}>
                      {c.Campana}
                    </option>
                  ))}
                </select>

                <button onClick={buscar} className="bg-red-800 hover:bg-red-950 text-white rounded-xl">
                  Buscar
                </button>
              </div>

              {/* TABLA */}
              <div className="overflow-auto">
                <table className="w-full text-base border-separate border-spacing-y-2">
                  <tbody>
                    {data.map(row => (
                      <motion.tr key={row.orden} whileHover={{ scale: 1.01 }} className={`${theme} shadow-md`}>

                        <td className="p-4">{row.Name_vista}</td>

                        <td className="p-4 truncate max-w-[250px]">
                          {row.url_vista}
                        </td>

    <td className="p-4">
  <div className="flex items-ce gap-2"> 
    {/* Botón Editar */}
    <button
      onClick={() => abrirEditar(row.orden)}
      className="flex items-center justify-center bg-red-800 hover:bg-red-950 text-white p-2 rounded-xl shadow"
    >
      <Pencil size={16}/>
    </button>

    {/* Botón Ver */}
    <button
      onClick={() => {
        setEditing(row);
        setPreviewOpen(true);
      }}
      className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-xl shadow"
    >
      <Eye size={16}/>
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

      {/* MODAL EDICIÓN */}
      <AnimatePresence>
        {modalOpen && editing && (
          <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center">

            {/* 👇 ANCHO AUMENTADO */}
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
                  <option key={c.IdCamp} value={c.IdCamp}>
                    {c.Campana}
                  </option>
                ))}
              </select>

              {["Name_vista", "url_vista", "contenedor", "contenedor2"].map(f => (
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

              {/* 🔥 NUEVO PREVIEW DENTRO DEL EDIT */}
              <button
                onClick={() => setPreviewEditOpen(!previewEditOpen)}
                className="mt-3 bg-red-800 text-white px-4 py-2 rounded"
              >
                {previewEditOpen ? "Ocultar Preview" : "Ver Preview"}
              </button>

              {previewEditOpen && (
                <div className="mt-4 h-[400px] border rounded-xl overflow-hidden">
                  <iframe
                    src={editing.url_vista}
                    className="w-full h-full"
                  />
                </div>
              )}

              {urlConfirmada && (
                <div className="text-green-500 flex gap-1 mt-2">
                  <Check size={14}/> URL Confirmada
                </div>
              )}

              <div className="flex justify-end gap-3 mt-4">
                <button onClick={() => setModalOpen(false)}>
                  <X/>
                </button>
                <button onClick={guardar} className="bg-green-900 px-4 py-2 rounded text-white">
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

              <iframe src={editing.url_vista} className="flex-1"/>

              <div className="p-6 flex text-red-500 justify-end gap-3 text-xl">
                <button onClick={() => setPreviewOpen(false)}>
                  CERRAR
                </button>
             {/*   <button
                  onClick={() => {
                    setUrlConfirmada(true);
                    setPreviewOpen(false);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Confirmar
                </button> */}
              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}