//front/src/routes/PopUpAdmin.jsx
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";

const STORAGE_KEY = "notificaciones_cerradas_admin";

export default function PopUpAdmin({ open, setOpen }) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [visibles, setVisibles] = useState([]);
  const [contador, setContador] = useState(0);
  const [detalleUsuario, setDetalleUsuario] = useState({});
  const [loadingDetalle, setLoadingDetalle] = useState(null);
 
  const [isDark, setIsDark] = useState(false);

  const intervalRef = useRef(null);

  //  detectar tema
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    setIsDark(theme === "dark");
  }, []);

  // ==============================
  //  LOCAL STORAGE
  // ==============================
  const obtenerCerradas = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  };

  // ==============================
  // FETCH
  // ==============================
  const fetchNotificaciones = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:4000/api/notificaciones-sistemas/obtener",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json();
      if (!data.ok) return;

      const cerradas = obtenerCerradas();

      const nuevasVisibles = data.data.filter((n) => {
        const key = `${n.id_usuario}_${n.total}`;
        return !cerradas[key];
      });

      setNotificaciones(data.data);
      setVisibles(nuevasVisibles);
      setContador(data.data.length);

    } catch (err) {
      console.error("Error notificando:", err);
    }
  };

  useEffect(() => {
    fetchNotificaciones();
    intervalRef.current = setInterval(fetchNotificaciones, 20000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // ==============================
  // ❌ CERRAR POPUP
  // ==============================
  const cerrar = (n) => {
    const key = `${n.id_usuario}_${n.total}`;
    const actuales = obtenerCerradas();
    actuales[key] = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actuales));

    setVisibles((prev) =>
      prev.filter((item) => item.id_usuario !== n.id_usuario)
    );
  };

  // ==============================
  // DETALLE
  // ==============================
  const fetchDetalle = async (idUsuario) => {
    try {
      const token = localStorage.getItem("token");
      setLoadingDetalle(idUsuario);

      const res = await fetch(
        `http://localhost:4000/api/notificaciones-sistemas/detalle/${idUsuario}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json();
      if (!data.ok) return;

      setDetalleUsuario((prev) => ({
        ...prev,
        [idUsuario]: data.data
      }));

    } catch (err) {
      console.error("Error detalle:", err);
    } finally {
      setLoadingDetalle(null);
    }
  };

  // ==============================
  // 🎬 ANIMACIONES
  // ==============================
  const dropAnimation = {
    hidden: { y: -120, opacity: 0, scale: 0.7 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 500, damping: 25 }
    },
    exit: { y: -80, opacity: 0, scale: 0.8 }
  };

  return (
    <>
      {/* campana 
      <div
        className="fixed top-4 left-423 z-[9999] cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="relative">
          <Bell
            size={22}
            className={`transition ${
              isDark ? "text-gray-200" : "text-gray-700"
            } hover:scale-110`}
          />

          {contador > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center"
            >
              {contador > 99 ? "99+" : contador}
            </motion.span>
          )}
        </div>
      </div> */}

      {/* 📦 DROPDOWN MODERNO */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className={`fixed top-16 right-6 w-[420px] z-[9999] rounded-2xl shadow-2xl p-4 backdrop-blur-md ${
              isDark
                ? "bg-[#1e1e1e]/90 text-white"
                : "bg-white/90 text-gray-800"
            }`}
          >
            <h3 className="font-semibold mb-3 text-sm tracking-wide">
              Notificaciones
            </h3>

            <div className="flex flex-col gap-2 max-h-[400px] overflow-auto pr-1">
              {notificaciones.map((n) => (
                <motion.div
                 // key={n.id_usuario}
                  key={`${n.id_usuario}_${n.total}`}
                  layout
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 rounded-xl border transition ${
                    isDark
                      ? "border-gray-700 bg-[#2a2a2a]"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xs font-medium">
                      {n.mensaje}
                    </span>

                    <button
                      onClick={() => fetchDetalle(n.id_usuario)}
                      className="text-blue-500 text-xs hover:underline"
                    >
                      Ver
                    </button>
                  </div>

                  <AnimatePresence>
                    {loadingDetalle === n.id_usuario && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs mt-2"
                      >
                        Cargando...
                      </motion.div>
                    )}

                    {detalleUsuario[n.id_usuario] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-2 text-xs overflow-hidden"
                      >
                        {detalleUsuario[n.id_usuario].map((d, i) => (
                          <div
                           // key={i}
                           key={`${d.telefono}_${d.fecha}`}
                            className="flex justify-between border-b py-1 text-[11px]"
                          >
                            <span className="truncate w-[45%]">
                              {d.campana}
                            </span>
                            <span>{d.telefono}</span>
                            <span className="text-gray-400">
                              {d.fecha}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔴 CONTADOR GLOBAL */}
      <div id="notificaciones-contador" data-count={contador} />

      {/* 🔔 POPUPS */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 items-center">
        <AnimatePresence>
          {visibles.map((n) => (
            <motion.div
             // key={n.id_usuario}
             key={`${n.id_usuario}_${n.total}`}
              variants={dropAnimation}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="px-6 py-4 text-white shadow-xl flex items-center justify-between gap-4"
              style={{
                backgroundColor: "#DE0D2C",
                borderRadius: "999px",
                minWidth: "320px",
                maxWidth: "420px"
              }}
            >
              <span className="text-sm font-medium">
                {n.mensaje}
              </span>

              <button
                onClick={() => cerrar(n)}
                className="ml-2 text-white font-bold text-lg hover:opacity-70"
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}