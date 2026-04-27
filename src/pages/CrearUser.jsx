import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Users,
  Pencil,
  Trash2,
  X,
  Save,
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  UserCircle
} from "lucide-react";

export default function CrearUser() {
  // --- ESTADO MODO OSCURO ---
  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const handleStorage = () => {
      setIsDark(localStorage.getItem("theme") === "dark");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // --- ESTADOS ORIGINALES ---
  const [usuarios, setUsuarios] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editUser, setEditUser] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);
  const [allCampanas, setAllCampanas] = useState([]);
  const [selectedCampanas, setSelectedCampanas] = useState([]);
  const [isCampanasOpen, setIsCampanasOpen] = useState(false); // Nuevo: control plegable

  const perPage = 10;

  const niveles = [
    { id: 1, descripcion: "Administrador" },
    { id: 2, descripcion: "Sistemas" },
    { id: 3, descripcion: "Usuario" },
    { id: 4, descripcion: "Coordinador" },
    { id: 5, descripcion: "Supervisor" },
    { id: 6, descripcion: "Gerencia" }
  ];

  const grupos = [
    // { id: 1, descripcion: "Caja Arequipa" },
    { id: 2, descripcion: "Empresa Biznes" },
    { id: 3, descripcion: "Empresa Biznes - Cliente" }
  ];

  // ==============================
  // FETCH (Sin cambios en lógica)
  // ==============================
  const obtenerUsuarios = async () => {
    const res = await fetch("http://192.168.9.115:4000/api/usuarios-get");
    const json = await res.json();
    setUsuarios(json.data);
    setFiltered(json.data);
    setLoading(false);
  };

const obtenerCampanas = async () => {
  const res = await fetch("http://192.168.9.115:4000/api/campanas-select");
  const json = await res.json();

  const normalizadas = json.data.map(c => ({
    IdCamp: Number(c.id_camp),
    Campana: c.nombre
  }));

  setAllCampanas(normalizadas);
};

  useEffect(() => {
    obtenerUsuarios();
    obtenerCampanas();
  }, []);

  // ==============================
  // BUSCADOR
  // ==============================
  useEffect(() => {
    const f = usuarios.filter(u =>
      (u.usuario + u.nombres + u.apellidos)
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFiltered(f);
    setPage(1);
  }, [search, usuarios]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const data = filtered.slice((page - 1) * perPage, page * perPage);

  // ==============================
  // HELPERS
  // ==============================
  const badgeGrupo = (grupoId) => {
    switch (grupoId) {
      case 1: return "bg-red-100 text-red-700 border border-red-200";
      case 2: return "bg-green-100 text-green-700 border border-green-200";
      case 3: return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      default: return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

  const isSistema = (u) => u.nivel?.id === 2 || u.nivel?.descripcion === "Sistemas"; // Para no mostrar campañas a usuarios de sistemas

  const changed = (field, value) => originalUser && originalUser[field] !== value;

  const inputClass = (field, value) => `
    w-full border p-2.5 rounded-lg transition-all duration-200 outline-none
    ${isDark ? "bg-[#1F2029] text-white" : "bg-white text-gray-900"}
    ${changed(field, value) 
      ? "border-green-500 ring-2 ring-green-500/20" 
      : isDark ? "border-gray-700 focus:border-red-500" : "border-gray-300 focus:border-red-500"}
  `;

  // ==============================
  // ACTIONS
  // ==============================
  const handleDelete = async (u) => {
    if (!confirm("¿Eliminar usuario?")) return;
    await fetch(`http://192.168.9.115:4000/api/usuarios/${u.id}`, { method: "DELETE" });
    obtenerUsuarios();
  };

  const handleEditOpen = (u) => {
    setEditUser({
      ...u,
      id_tipo_usuario: u.nivel.id,
      id_grupo: u.grupo.id,
      estado: Number(u.estado),
      reportes: Number(u.reportes),
      password: ""
    });
    setSelectedCampanas(u.campanas.map(c => c.IdCamp));
    setOriginalUser({
      nombres: u.nombres,
      apellidos: u.apellidos,
      id_tipo_usuario: u.nivel.id,
      id_grupo: u.grupo.id,
      reportes: Number(u.reportes),
      estado: Number(u.estado)
    });
    setIsCampanasOpen(false); // Resetear acordeón al abrir
  };

  const handleSave = async () => {
    await fetch(`http://192.168.9.115:4000/api/usuarios/${editUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editUser, campanas: selectedCampanas })
    });
    setEditUser(null);
    obtenerUsuarios();
  };
// crear usuario

const [openModal, setOpenModal] = useState(false)

const [form, setForm] = useState({
  nombres: "",
  apellidos: "",
  usuario: "",
  password: "",
  estado: "1",
  id_tipo_usuario: "",
  id_grupo: ""
})

// handler inputs
const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value
  })
}

// submit
const handleCreate = async () => {
  try {
    const res = await fetch("http://192.168.9.115:4000/api/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...form, campanas: selectedCampanas })
    })

    const data = await res.json()

    if (data.ok) {
      setOpenModal(false)
      // opcional: refrescar lista
      window.location.reload()
    } else {
      alert(data.message)
    }

  } catch (err) {
    console.error(err)
  }
}
// reportes
const reportesLabel = {
  0: "Ninguno",
  1: "Tipo 1 y 2",
  2: "Tipo 2"
};
// DOMINIOS PERSONALIZADOS PARA USUARIOS
const [usuarioBase, setUsuarioBase] = useState("");
const [dominio, setDominio] = useState("biznes.pe");
const dominios = [
  "biznes.pe",
  "grupobiznes.pe",
  "grupobiznes.com.pe",
  "hotmail.com",
  "gmail.com"
];
useEffect(() => {
  setForm((prev) => ({
    ...prev,
    usuario: usuarioBase
      ? `${usuarioBase}@${dominio}`
      : ""
  }));
}, [usuarioBase, dominio]);
  return (
    <div className={`min-h-screen transition-colors duration-500 p-4 md:p-8 ${isDark ? "bg-[#1F2029] text-white" : "bg-gray-100 text-gray-900"}`}>
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[1400px] mx-auto"
      >
        
{/* HEADER */}
<div className={`flex flex-col md:flex-row justify-between items-center mb-8 p-6 rounded-2xl shadow-sm border ${isDark ? "bg-[#272833] border-gray-800" : "bg-white border-gray-200"}`}>

  <h1 className="flex items-center gap-3 text-2xl font-bold italic">
    <Users size={32} className={isDark ? "text-red-500" : "text-red-600"} />
    Gestión de Usuarios
  </h1>

  <div className="flex items-center gap-4 mt-4 md:mt-0 w-full md:w-auto">

    {/* 🔍 BUSCADOR */}
    <div className="relative w-full md:w-80">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
      <input
        placeholder="Buscar por usuario o nombre..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border transition-all outline-none ${
          isDark
            ? "bg-[#1F2029] border-gray-700 focus:border-red-500"
            : "bg-gray-50 border-gray-300 focus:border-red-600"
        }`}
      />
    </div>

    {/* ➕ BOTÓN CREAR */}
    <button
      onClick={() => setOpenModal(true)}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-800 hover:bg-red-900 text-white font-semibold transition-all"
    >
      <Plus size={18} />
      Crear
    </button>

  </div>
</div>

{/* ============================== */}
{/* 🧾 MODAL CREAR USUARIO (MEJORADO) */}
{/* ============================== */}

<AnimatePresence>
  {openModal && (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className={`w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border ${
          isDark ? "bg-[#272833] border-gray-700" : "bg-white border-gray-100"
        }`}
      >
        {/* HEADER */}
        <div className={`p-6 flex justify-between items-center border-b ${
          isDark ? "border-gray-700" : "border-gray-100"
        }`}>
          <div className="flex items-center gap-3">
            <UserCircle size={28} className="text-green-500" />
            <h2 className="text-xl font-bold italic">Crear Usuario</h2>
          </div>
          <X
            onClick={() => setOpenModal(false)}
            className="cursor-pointer text-gray-500 hover:text-red-500"
            size={24}
          />
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">

          {/* CREAR USUARIO MODIFICAR + PASSWORD */}
<div className="grid grid-cols-1 gap-4">
  <div>
    <label className="text-[10px] uppercase font-bold text-gray-500 ml-2 mb-1 block">
      Usuario
    </label>

    <div className="flex">
      {/* INPUT USUARIO */}
      <input
        name="usuario"
        value={usuarioBase}
        onChange={(e) => setUsuarioBase(e.target.value)}
        placeholder="usuario"
        className={`w-full border p-2.5 rounded-l-lg ${
          isDark ? "bg-[#1c1d26] border-gray-700" : "bg-white border-gray-300"
        }`}
      />

      {/* DOMINIO FIJO VISUAL */}
      <div
        className={`flex items-center px-3 border-t border-b ${
          isDark ? "border-gray-700 bg-[#1c1d26]" : "border-gray-300 bg-gray-100"
        } text-sm`}
      >
        @
      </div>

      {/* SELECT DOMINIO */}
      <select
        value={dominio}
        onChange={(e) => setDominio(e.target.value)}
        className={`border p-2.5 rounded-r-lg ${
          isDark ? "bg-[#1c1d26] border-gray-700" : "bg-white border-gray-300"
        }`}
      >
        {dominios.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
    </div>
  </div>


            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-2 mb-1 block">Contraseña</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                className={`w-full border p-2.5 rounded-lg ${
                  isDark ? "bg-[#1c1d26] border-gray-700" : "bg-white border-gray-300"
                }`}
              />
            </div>
          </div>

          {/* NOMBRES */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-2 mb-1 block">Nombres</label>
              <input name="nombres" onChange={handleChange} className={`w-full border p-2.5 rounded-lg ${isDark ? "bg-[#1c1d26] border-gray-700" : "bg-white border-gray-300"}`} />
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-2 mb-1 block">Apellidos</label>
              <input name="apellidos" onChange={handleChange} className={`w-full border p-2.5 rounded-lg ${isDark ? "bg-[#1c1d26] border-gray-700" : "bg-white border-gray-300"}`} />
            </div>
          </div>

          {/* NIVEL + GRUPO */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-2 mb-1 block">Nivel</label>
              <select
                onChange={(e) => setForm({ ...form, id_tipo_usuario: Number(e.target.value) })}
                className={`w-full border p-2.5 rounded-lg ${
                  isDark ? "bg-[#1c1d26] border-gray-700" : "bg-white border-gray-300"
                }`}
              >
                <option value="">Seleccionar</option>
                {niveles.map(n => (
                  <option key={n.id} value={n.id}>{n.descripcion}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-2 mb-1 block">Grupo</label>
              <select
                onChange={(e) => setForm({ ...form, id_grupo: Number(e.target.value) })}
                className={`w-full border p-2.5 rounded-lg ${
                  isDark ? "bg-[#1c1d26] border-gray-700" : "bg-white border-gray-300"
                }`}
              >
                <option value="">Seleccionar</option>
                {grupos.map(g => (
                  <option key={g.id} value={g.id}>{g.descripcion}</option>
                ))}
              </select>
            </div>
          </div>

          {/* CAMPAÑAS */}
          <div className={`border rounded-xl overflow-hidden ${
            isDark ? "border-gray-700 bg-[#1c1d26]" : "border-gray-200 bg-gray-50"
          }`}>
            <button
              onClick={() => setIsCampanasOpen(!isCampanasOpen)}
              className="w-full flex justify-between items-center p-3"
            >
              <span className="text-sm font-bold">
                Campañas ({selectedCampanas.length})
              </span>
              {isCampanasOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            <motion.div animate={{ height: isCampanasOpen ? "auto" : 0 }} className="overflow-hidden">
              <div className="p-3 grid gap-2 max-h-48 overflow-y-auto">
                {allCampanas.map(c => (
                  <label key={c.IdCamp} className="flex items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={selectedCampanas.includes(c.IdCamp)}
                      onChange={() => {
                        if (selectedCampanas.includes(c.IdCamp)) {
                          setSelectedCampanas(selectedCampanas.filter(id => id !== c.IdCamp));
                        } else {
                          setSelectedCampanas([...selectedCampanas, c.IdCamp]);
                        }
                      }}
                    />
                    {c.Campana}
                  </label>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ESTADO */}
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-500 ml-2 mb-1 block">Estado</label>
            <select
              onChange={(e) => setForm({ ...form, estado: Number(e.target.value) })}
              className={`w-full border p-2.5 rounded-lg ${
                isDark ? "bg-[#1c1d26] border-gray-700" : "bg-white border-gray-300"
              }`}
            >
              <option value={1}>Activo</option>
              <option value={0}>Inactivo</option>
            </select>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={() => setOpenModal(false)}
              className={`px-6 py-2.5 rounded-xl font-bold ${
                isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
              }`}
            >
              Cancelar
            </button>

            <button
              onClick={handleCreate}
              className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center gap-2"
            >
              <Save size={18} /> Crear
            </button>
          </div>

        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

        {/* TABLA ANCHA */}
        <div className={`rounded-2xl shadow-xl overflow-hidden border ${isDark ? "bg-[#272833] border-gray-800" : "bg-white border-gray-200"}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`${isDark ? "bg-[#1c1d26]" : "bg-gray-100"} text-sm uppercase tracking-wider`}>
                  <th className="p-4 border-r border-gray-700/20">Usuario</th>
                  <th className="p-4 border-r border-gray-700/20">Nombres</th>
                  <th className="p-4 border-r border-gray-700/20">Apellidos</th>
                  <th className="p-4 border-r border-gray-700/20">Nivel</th>
                  <th className="p-4 border-r border-gray-700/20">Grupo</th>
                  <th className="p-4 border-r border-gray-700/20">Campañas</th>
                  <th className="p-4 border-r border-gray-700/20 text-center">Reportes</th>
                  <th className="p-4 border-r border-gray-700/20 text-center">Estado</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700/20">
                {loading ? (
                  <tr>
                    <td colSpan="9" className="p-10 text-center">
                      <Loader2 className="animate-spin mx-auto text-blue-500" size={40} />
                    </td>
                  </tr>
                ) : data.map((u) => (
                  <motion.tr 
                    layout
                    key={u.id} 
                    className={`transition-colors ${isDark ? "hover:bg-[#2d2e3d]" : "hover:bg-blue-50/50"}`}
                  >
                    <td className="p-4 font-medium border-r border-gray-700/10 italic">{u.usuario}</td>
                    <td className="p-4 border-r border-gray-700/10">{u.nombres}</td>
                    <td className="p-4 border-r border-gray-700/10">{u.apellidos}</td>
                    <td className="p-4 border-r border-gray-700/10">
                       <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${isDark ? "bg-blue-900/30 text-blue-400" : "bg-blue-100 text-blue-800"}`}>
                        {u.nivel.descripcion}
                       </span>
                    </td>
                    <td className="p-4 border-r border-gray-700/10">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${badgeGrupo(u.grupo.id)}`}>
                        {u.grupo.descripcion}
                      </span>
                    </td>
                    <td className="p-4 border-r border-gray-700/10 max-w-[200px]">
                      <p className=" text-xs text-gray-400">
                        {/*<p className="truncate text-xs text-gray-400"> esto es para no mostrar todas las campañas */}
                        {isSistema(u) ? "TODAS LAS CAMPAÑAS" : u.campanas.map(c => c.Campana).join(", ") || "Sin asignar"}
                      </p>
                    </td>
                    <td className="p-4 border-r border-gray-700/10 text-center">
  {reportesLabel[u.reportes] ?? "Ninguno"}
</td>
                    <td className="p-4 border-r border-gray-700/10 text-center">
                      <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-black ${Number(u.estado) === 1 ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>
                        {Number(u.estado) === 1 ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-4">
                        {!isSistema(u) && (
                          <>
                            <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                              <Pencil className="w-6 h-6 text-blue-400 cursor-pointer" onClick={() => handleEditOpen(u)} />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                              <Trash2 className="w-6 h-6 text-red-400 cursor-pointer" onClick={() => handleDelete(u)} />
                            </motion.button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINACIÓN */}
        <div className="flex justify-center gap-3 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-10 h-10 rounded-xl transition-all font-bold ${
                page === i + 1 
                ? "bg-red-800 text-white shadow-lg shadow-red-500/30" 
                : isDark ? "bg-[#272833] text-gray-400 hover:bg-gray-700" : "bg-white text-gray-600 hover:bg-gray-200 border"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </motion.div>

      {/* MODAL EDITAR */}
      <AnimatePresence>
        {editUser && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border ${isDark ? "bg-[#272833] border-gray-700" : "bg-white border-gray-100"}`}
            >
              {/* Modal Header */}
              <div className={`p-6 flex justify-between items-center border-b ${isDark ? "border-gray-700" : "border-gray-100"}`}>
                <div className="flex items-center gap-3">
                  <UserCircle size={28} className="text-blue-500" />
                  <h2 className="text-xl font-bold italic">Editar Perfil</h2>
                </div>
                <X onClick={() => setEditUser(null)} className="cursor-pointer text-gray-500 hover:text-red-500 transition-colors" size={24} />
              </div>

              <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="relative">
                    <label className="text-[10px] uppercase font-bold text-gray-500 ml-2 mb-1 block">Usuario</label>
                    <input disabled value={editUser.usuario} className={`w-full border p-2.5 rounded-lg italic ${isDark ? "bg-[#1c1d26] border-gray-800 text-gray-500" : "bg-gray-100 border-gray-200 cursor-not-allowed"}`} />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 ml-2 mb-1 block">Contraseña (Opcional)</label>
                    <input
                      type="password"
                      placeholder="Dejar en blanco para no cambiar"
                      onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                      className={inputClass("password", editUser.password)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 ml-2 mb-1 block">Nombres</label>
                    <input
                      value={editUser.nombres}
                      onChange={(e) => setEditUser({ ...editUser, nombres: e.target.value })}
                      className={inputClass("nombres", editUser.nombres)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 ml-2 mb-1 block">Apellidos</label>
                    <input
                      value={editUser.apellidos}
                      onChange={(e) => setEditUser({ ...editUser, apellidos: e.target.value })}
                      className={inputClass("apellidos", editUser.apellidos)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 ml-2 mb-1 block">Nivel de Acceso</label>
                    <select
                      value={editUser.id_tipo_usuario}
                      onChange={(e) => setEditUser({ ...editUser, id_tipo_usuario: Number(e.target.value) })}
                      className={inputClass("id_tipo_usuario", editUser.id_tipo_usuario)}
                    >
                      {niveles.map(n => (
                        <option key={n.id} value={n.id}>{n.descripcion}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 ml-2 mb-1 block">Grupo</label>
                    <select
                      value={editUser.id_grupo}
                      onChange={(e) => setEditUser({ ...editUser, id_grupo: Number(e.target.value) })}
                      className={inputClass("id_grupo", editUser.id_grupo)}
                    >
                      {grupos.map(g => (
                        <option key={g.id} value={g.id}>{g.descripcion}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ACORDEÓN DE CAMPAÑAS */}
                <div className={`border rounded-xl overflow-hidden ${isDark ? "border-gray-700 bg-[#1c1d26]" : "border-gray-200 bg-gray-50"}`}>
                  <button 
                    onClick={() => setIsCampanasOpen(!isCampanasOpen)}
                    className="w-full flex justify-between items-center p-3 hover:bg-blue-500/10 transition-colors"
                  >
                    <span className="text-sm font-bold flex items-center gap-2">
                      Campañas Asignadas ({selectedCampanas.length})
                    </span>
                    {isCampanasOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  
                  <motion.div
                    initial={false}
                    animate={{ height: isCampanasOpen ? "auto" : 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 grid grid-cols-1 gap-2 border-t border-gray-700/30 max-h-48 overflow-y-auto">
                      {allCampanas.map(c => (
                        <label key={c.IdCamp} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${isDark ? "hover:bg-gray-700" : "hover:bg-white"}`}>
                          <input
                            type="checkbox"
                            className="w-4 h-4 accent-blue-500"
                            checked={selectedCampanas.includes(c.IdCamp)}
                            onChange={() => {
                              if (selectedCampanas.includes(c.IdCamp)) {
                                setSelectedCampanas(selectedCampanas.filter(id => id !== c.IdCamp));
                              } else {
                                setSelectedCampanas([...selectedCampanas, c.IdCamp]);
                              }
                            }}
                          />
                          <span className="text-xs">{c.Campana}</span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 ml-2 mb-1 block">Reportes</label>
                    <select
  value={editUser.reportes}
  onChange={(e) =>
    setEditUser({
      ...editUser,
      reportes: Number(e.target.value)
    })
  }
  className={inputClass("reportes", editUser.reportes)}
>
                      <option value={0}>Ninguno</option>
                      <option value={1}>Tipo 1 y 2</option>
                      <option value={2}>Tipo 2</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 ml-2 mb-1 block">Estado</label>
                    <select
                      value={editUser.estado}
                      onChange={(e) => setEditUser({ ...editUser, estado: Number(e.target.value) })}
                      className={inputClass("estado", editUser.estado)}
                    >
                      <option value={1}>Activo</option>
                      <option value={0}>Inactivo</option>
                    </select>
                  </div>
                </div>

                {/* Footer Modal */}
                <div className="flex justify-end gap-3 pt-4">
                  <button 
                    onClick={() => setEditUser(null)} 
                    className={`px-6 py-2.5 rounded-xl font-bold transition-all ${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}
                  >
                    Cerrar
                  </button>
                  <button 
                    onClick={handleSave} 
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20"
                  >
                    <Save size={18}/> Actualizar
                  </button>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}