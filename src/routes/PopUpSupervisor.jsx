import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "notificaciones_cerradas_supervisor";

export default function PopUpSupervisor({ open, setOpen }) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [visibles, setVisibles] = useState([]);
  const [contador, setContador] = useState(0);
  const [isDark, setIsDark] = useState(false);

  const intervalRef = useRef(null);

  // ==============================
  // 🧠 UTILIDAD: VALIDAR SI ES HOY
  // ==============================
  const esHoy = (fechaStr) => {
    const hoy = new Date();
    const fecha = new Date(fechaStr);

    return fecha.toDateString() === hoy.toDateString();
  };

  // ==============================
  // 📅 NOTIFICACIONES DEL DÍA
  // ==============================
  const notificacionesHoy = notificaciones.filter((n) =>
    esHoy(n.fecha)
  );

  // ==============================
  // TEMA
  // ==============================
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    setIsDark(theme === "dark");
  }, []);

  // ==============================
  // LOCAL STORAGE
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
        "http://localhost:4000/api/notificaciones-supervisor/obtener",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("❌ RESPUESTA NO ES JSON:", text);
        return;
      }

      if (!data.ok) return;

      const cerradas = obtenerCerradas();

      // 🔹 TODAS → CAMPANA
      setNotificaciones(data.data);

      // 🔹 SOLO POPUPS (FILTRADAS POR HOY)
      const nuevasVisibles = data.data.filter((n) => {
        return !cerradas[n.id] && esHoy(n.fecha);
      });

      setVisibles(nuevasVisibles);

      // 🔹 CONTADOR
      setContador(Object.keys(cerradas).length);

    } catch (err) {
      console.error("Error notificaciones supervisor:", err);
    }
  };

  // ==============================
  // POLLING
  // ==============================
  useEffect(() => {
    fetchNotificaciones();
    intervalRef.current = setInterval(fetchNotificaciones, 20000);

    return () => clearInterval(intervalRef.current);
  }, []);

  // ==============================
  // ❌ CERRAR
  // ==============================
  const cerrar = async (n) => {
    try {
      const key = n.id;

      const actuales = obtenerCerradas();
      actuales[key] = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(actuales));

      const token = localStorage.getItem("token");

      await fetch(
        "http://localhost:4000/api/notificaciones-supervisor/marcar-leida",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            idNotificacion: n.id,
          }),
        }
      );

      // quitar popup
      setVisibles((prev) => prev.filter((x) => x.id !== n.id));

      // actualizar contador
      setContador((prev) => prev + 1);

    } catch (err) {
      console.error("Error cerrar notificación:", err);
    }
  };

  // ==============================
  // ANIMACIÓN
  // ==============================
  const dropAnimation = {
    hidden: { y: -120, opacity: 0, scale: 0.7 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 500, damping: 25 },
    },
    exit: { y: -80, opacity: 0, scale: 0.8 },
  };

  return (
    <>
      {/* 📦 DROPDOWN */}
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
              {notificacionesHoy.length === 0 ? (
                <div className="text-xs opacity-70">
                  Sin notificaciones
                </div>
              ) : (
                notificacionesHoy.map((n) => {
                  const cerradas = obtenerCerradas();

                  return (
                    <motion.div
                      key={n.id}
                      layout
                      whileHover={{ scale: 1.02 }}
                      className={`p-3 rounded-xl border ${
                        isDark
                          ? "border-gray-700 bg-[#2a2a2a]"
                          : "border-gray-200 bg-gray-50"
                      } ${cerradas[n.id] ? "opacity-60" : ""}`}
                    >
                      <span className="text-xs font-medium">
                        {n.mensaje}
                      </span>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔴 CONTADOR */}
      <div id="notificaciones-contador-supervisor" data-count={contador} />

      {/* 🔔 POPUPS */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 items-center">
        <AnimatePresence>
          {visibles.map((n) => (
            <motion.div
              key={n.id}
              variants={dropAnimation}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="px-6 py-4 text-white shadow-xl flex items-center justify-between gap-4"
              style={{
                backgroundColor: "#753AB5",
                borderRadius: "999px",
                minWidth: "320px",
                maxWidth: "420px",
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