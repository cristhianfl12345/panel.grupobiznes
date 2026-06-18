import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { INDICE_CAMPS } from "../context/indiceCamps";

const STORAGE_KEY = "notificaciones_cerradas_supervisor";
const STORAGE_NOTI = "notificaciones_supervisor";

export default function PopUpSupervisor({ open, setOpen }) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [visibles, setVisibles] = useState([]);
  const [contador, setContador] = useState(0);
  const [isDark, setIsDark] = useState(false);

  // ==============================
  // MAPA ID -> NOMBRE (OPTIMIZADO)
  // ==============================
  const mapCampanas = useMemo(() => {
    const map = {};
    INDICE_CAMPS.forEach((c) => {
      map[String(c.id_camp)] = c.nombre;
      map[String(c.IdCamp)] = c.nombre;
    });
    return map;
  }, []);

  const obtenerNombreCamp = (id) => {
    return mapCampanas[String(id)] || id;
  };

  // ==============================
  // TEMA
  // ==============================
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    setIsDark(theme === "dark");
  }, []);

  // ==============================
  // STORAGE HELPERS
  // ==============================
  const obtenerCerradas = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  };

  const obtenerNotificacionesStorage = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_NOTI)) || [];
    } catch {
      return [];
    }
  };

  const guardarNotificacionesStorage = (data) => {
    localStorage.setItem(STORAGE_NOTI, JSON.stringify(data));
  };

  // ==============================
  // REHIDRATAR AL INICIO
  // ==============================
  useEffect(() => {
    const stored = obtenerNotificacionesStorage();
    const cerradas = obtenerCerradas();

    setNotificaciones(stored);

    const visiblesInicial = stored.filter((n) => !cerradas[n.id]);
    setVisibles(visiblesInicial);

    setContador(Object.keys(cerradas).length);
  }, []);

  // ==============================
  // SOCKET.IO
  // ==============================
  useEffect(() => {
    const token = localStorage.getItem("token");

    const socket = io("https://panel.bizapp.pe", {
      auth: { token },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      // console.log("Conectado a socket");
    });

    socket.on("nueva_notificacion", (data) => {
      const cerradas = obtenerCerradas();

      const id = `${data.camp}-${data.hora}`;

      if (cerradas[id]) return;

      // ==============================
      // REEMPLAZO DE ID POR NOMBRE
      // ==============================
      const nombreCamp = obtenerNombreCamp(data.camp);

      const mensajeTransformado = data.mensaje.replace(
        new RegExp(data.camp, "g"),
        nombreCamp
      );

      const nueva = {
        id,
        mensaje: mensajeTransformado,
        fecha: new Date().toISOString(),
      };

      setNotificaciones((prev) => {
        const existe = prev.find((n) => n.id === id);
        if (existe) return prev;

        const updated = [nueva, ...prev];
        guardarNotificacionesStorage(updated);
        return updated;
      });

      setVisibles((prev) => [nueva, ...prev]);
    });

    socket.on("disconnect", () => {
      console.log("Socket desconectado");
    });

    return () => socket.disconnect();
  }, [mapCampanas]);

  // ==============================
  // CERRAR
  // ==============================
  const cerrar = (n) => {
    const actuales = obtenerCerradas();
    actuales[n.id] = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actuales));

    setVisibles((prev) => prev.filter((x) => x.id !== n.id));
    setContador((prev) => prev + 1);
  };

  // ==============================
  // SOLO HOY
  // ==============================
  const esHoy = (fechaStr) => {
    const hoy = new Date();
    const fecha = new Date(fechaStr);
    return fecha.toDateString() === hoy.toDateString();
  };

  const notificacionesHoy = notificaciones.filter((n) =>
    esHoy(n.fecha)
  );

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
      {/* DROPDOWN */}
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

      {/* CONTADOR */}
      <div id="notificaciones-contador-supervisor" data-count={contador} />

      {/* POPUPS */}
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