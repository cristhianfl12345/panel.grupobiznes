import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Users,
  Pencil,
  Trash2,
  X,
  Save
} from "lucide-react";

export default function CrearUser() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [editUser, setEditUser] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);
  const [allCampanas, setAllCampanas] = useState([]);
const [selectedCampanas, setSelectedCampanas] = useState([]);

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
    { id: 1, descripcion: "Caja Arequipa" },
    { id: 3, descripcion: "Empresa Biznes" },
    { id: 4, descripcion: "Empresa Biznes - Caja Arequipa" }
  ];

  // ==============================
  // FETCH
  // ==============================
  const obtenerUsuarios = async () => {
    const res = await fetch("http://localhost:4000/api/usuarios-get");
    const json = await res.json();
    setUsuarios(json.data);
    setFiltered(json.data);
    setLoading(false);
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);
const obtenerCampanas = async () => {
  const res = await fetch("http://localhost:4000/api/campanas-select");
  const json = await res.json();
  setAllCampanas(json.data);
};
useEffect(() => {
  obtenerUsuarios();
  obtenerCampanas();
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
};
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
      case 1:
        return "bg-red-100 text-red-700";
      case 3:
        return "bg-green-100 text-green-700";
      case 4:
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const isSistema = (u) =>
    u.nivel?.id === 2 || u.nivel?.descripcion === "Sistemas";

  const changed = (field, value) => {
    return originalUser && originalUser[field] !== value;
  };

  const inputClass = (field, value) => `
    w-full border p-2 rounded transition
    ${changed(field, value)
      ? "bg-green-50 border-green-400"
      : "border-gray-300"}
  `;

  // ==============================
  // ACTIONS
  // ==============================

  const handleDelete = async (u) => {
    if (!confirm("¿Eliminar usuario?")) return;

    await fetch(`http://localhost:4000/api/usuarios/${u.id}`, {
      method: "DELETE"
    });

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

  // ✅ ESTO FALTABA
  setSelectedCampanas(u.campanas.map(c => c.IdCamp));

  setOriginalUser({
    nombres: u.nombres,
    apellidos: u.apellidos,
    id_tipo_usuario: u.nivel.id,
    id_grupo: u.grupo.id,
    reportes: Number(u.reportes),
    estado: Number(u.estado)
  });
};

const handleSave = async () => {
  await fetch(`http://localhost:4000/api/usuarios/${editUser.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...editUser,
      campanas: selectedCampanas
    })
  });

  setEditUser(null);
  obtenerUsuarios();
};

  // ==============================
  // RENDER
  // ==============================
  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h1 className="flex items-center gap-2 text-lg font-semibold">
          <Users /> Usuarios
        </h1>

        <input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-1 rounded text-sm"
        />
      </div>

      {/* TABLA */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-2">Usuario</th>
              <th className="p-2">Nombres</th>
              <th className="p-2">Apellidos</th>
              <th className="p-2">Nivel</th>
              <th className="p-2">Grupo</th>
              <th className="p-2">Campañas</th>
              <th className="p-2">Reportes</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Acción</th>
            </tr>
          </thead>

          <tbody>
            {data.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.usuario}</td>
                <td className="p-2">{u.nombres}</td>
                <td className="p-2">{u.apellidos}</td>
                <td className="p-2">{u.nivel.descripcion}</td>

                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-xs ${badgeGrupo(u.grupo.id)}`}>
                    {u.grupo.descripcion}
                  </span>
                </td>

                <td className="p-2">
                  {isSistema(u)
                    ? "-"
                    : u.campanas.map(c => c.Campana).join(", ")}
                </td>

                <td className="p-2">
                  {u.reportes ? "Tipo 1 y 2" : "Ninguno"}
                </td>

               <td className="p-2">
  {Number(u.estado) === 1 ? "Activo" : "Inactivo"}
</td>

                <td className="p-2 flex gap-2">
                  {!isSistema(u) && (
                    <>
                      <Pencil
                        className="w-4 cursor-pointer text-blue-500"
                        onClick={() => handleEditOpen(u)}
                      />
                      <Trash2
                        className="w-4 cursor-pointer text-red-500"
                        onClick={() => handleDelete(u)}
                      />
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-2 ${page === i + 1 ? "font-bold" : ""}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {editUser && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white w-[460px] rounded-xl shadow-lg p-5"
            >
              <div className="flex justify-between mb-4">
                <h2 className="font-semibold">Editar Usuario</h2>
                <X onClick={() => setEditUser(null)} className="cursor-pointer" />
              </div>

              <div className="space-y-3 text-sm">

                <input disabled value={editUser.usuario} className="w-full border p-2 rounded bg-gray-100" />

                <input
                  placeholder="Nueva contraseña"
                  onChange={(e) =>
                    setEditUser({ ...editUser, password: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />

                <input
                  value={editUser.nombres}
                  onChange={(e) =>
                    setEditUser({ ...editUser, nombres: e.target.value })
                  }
                  className={inputClass("nombres", editUser.nombres)}
                />

                <input
                  value={editUser.apellidos}
                  onChange={(e) =>
                    setEditUser({ ...editUser, apellidos: e.target.value })
                  }
                  className={inputClass("apellidos", editUser.apellidos)}
                />

                <select
                  value={editUser.id_tipo_usuario}
                  onChange={(e) =>
                    setEditUser({ ...editUser, id_tipo_usuario: Number(e.target.value) })
                  }
                  className={inputClass("id_tipo_usuario", editUser.id_tipo_usuario)}
                >
                  {niveles.map(n => (
                    <option key={n.id} value={n.id}>{n.descripcion}</option>
                  ))}
                </select>

                <select
                  value={editUser.id_grupo}
                  onChange={(e) =>
                    setEditUser({ ...editUser, id_grupo: Number(e.target.value) })
                  }
                  className={inputClass("id_grupo", editUser.id_grupo)}
                >
                  {grupos.map(g => (
                    <option key={g.id} value={g.id}>{g.descripcion}</option>
                  ))}
                </select>

                <select
                  value={editUser.reportes ? 1 : 0}
                  onChange={(e) =>
                    setEditUser({ ...editUser, reportes: Number(e.target.value) })
                  }
                  className={inputClass("reportes", editUser.reportes)}
                >
                  <option value={0}>Ninguno</option>
                  <option value={1}>Tipo 1 y 2</option>
                </select>
{/* CAMPAÑAS */}
<div>
  <p className="mb-1 font-medium">Campañas</p>

  <div className="max-h-32 overflow-y-auto border rounded p-2 space-y-1">
    {allCampanas.map(c => (
      <label key={c.IdCamp} className="flex items-center gap-2 text-xs cursor-pointer">
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

  {/* CHIPS */}
  <div className="flex flex-wrap gap-1 mt-2">
    {selectedCampanas.map(id => {
      const camp = allCampanas.find(c => c.IdCamp === id);
      return (
        <span
          key={id}
          className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
        >
          {camp?.Campana || id}
        </span>
      );
    })}
  </div>
</div>
                <select
                  value={editUser.estado}
                  onChange={(e) =>
                    setEditUser({ ...editUser, estado: Number(e.target.value) })
                  }
                  className={inputClass("estado", editUser.estado)}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </select>

                <div className="flex justify-end gap-2 pt-3">
                  <button onClick={() => setEditUser(null)} className="px-3 py-1 bg-gray-200 rounded">
                    Cancelar
                  </button>
                  <button onClick={handleSave} className="px-3 py-1 bg-green-600 text-white rounded flex items-center gap-1">
                    <Save size={14}/> Guardar
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