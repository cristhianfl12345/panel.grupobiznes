//front/src/pages/EditarHorarioCartera.jsx

import { useEffect, useMemo, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import {
  FaWhatsapp,
  FaGoogle,
  FaFacebookMessenger,
  FaTiktok,
} from "react-icons/fa";

import {
  MdPhoneAndroid,
  MdClose,
} from "react-icons/md";

import {
  Save,
  Loader2,
} from "lucide-react";

const API = "http://192.168.9.115:4000/api/agente-info";
//const API = "http://192.168.9.115:4000/api/agente-info";

const FUENTES = [
  {
    id: "1",
    key: "whatsapp",
    label: "WhatsApp",
    icon: FaWhatsapp,
    color: "from-green-500 to-emerald-600",
    glow: "shadow-green-500/30",
    iconText: "text-green-500",
    border: "border-green-500/30",
  },
  {
    id: "2",
    key: "landing interno",
    label: "Landing",
    icon: MdPhoneAndroid,
    color: "from-cyan-500 to-sky-600",
    glow: "shadow-cyan-500/30",
    iconText: "text-cyan-500",
    border: "border-cyan-500/30",
  },
  {
    id: "3",
    key: "google",
    label: "Google",
    icon: FaGoogle,
    color: "from-red-500 to-rose-600",
    glow: "shadow-red-500/30",
    iconText: "text-red-500",
    border: "border-red-500/30",
  },
  {
    id: "4",
    key: "fb,msg",
    label: "FB / MSG",
    icon: FaFacebookMessenger,
    color: "from-blue-500 to-indigo-600",
    glow: "shadow-blue-500/30",
    iconText: "text-blue-500",
    border: "border-blue-500/30",
  },
  {
    id: "5",
    key: "tiktok",
    label: "TikTok",
    icon: FaTiktok,
    color: "from-pink-500 to-fuchsia-600",
    glow: "shadow-pink-500/30",
    iconText: "text-pink-500",
    border: "border-pink-500/30",
  },
];

export default function EditarHorarioCartera({
  open,
  onClose,
  agente,
  reload,
}) {

  const [loading, setLoading] = useState(false);

  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {

    const handleStorage = () => {

      const theme =
        localStorage.getItem("theme") === "dark";

      setIsDark(theme);

    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );
    };

  }, []);

  const initialState = useMemo(() => {

    const base = {};

    FUENTES.forEach((f) => {

      const found = agente?.fuentes?.find(
        (x) => String(x.fuente) === String(f.id)
      );

      base[f.id] = {
        fuente: f.id,

        // LUNES A VIERNES
        hora_ini:
          found?.hora_ini?.slice(0, 5) || "13:30",

        hora_fin:
          found?.hora_fin?.slice(0, 5) || "18:00",

        // SÁBADOS
        hora_ini_s:
          found?.hora_ini_s?.slice(0, 5) || "08:00",

        hora_fin_s:
          found?.hora_fin_s?.slice(0, 5) || "13:00",
      };

    });

    return base;

  }, [agente]);

  const [form, setForm] = useState(initialState);

  useEffect(() => {
    setForm(initialState);
  }, [initialState]);

  const handleChange = (
    fuente,
    field,
    value
  ) => {

    setForm((prev) => ({
      ...prev,
      [fuente]: {
        ...prev[fuente],
        [field]: value,
      },
    }));

  };

  const guardar = async () => {

    try {
      const token = localStorage.getItem("token");

      setLoading(true);

      const promises = Object.values(form).map(
        async (item) => {

          return fetch(
            `${API}/horario`,
            {
              method: "PUT",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                id_carteriza:
                  agente.id_carteriza,

                fuente: item.fuente,

                hora_ini:
                  item.hora_ini || null,

                hora_fin:
                  item.hora_fin || null,

                hora_ini_s:
                  item.hora_ini_s || null,

                hora_fin_s:
                  item.hora_fin_s || null,
              }),
            }
          );

        }
      );

      await Promise.all(promises);

      if (reload) {
        await reload();
      }

      onClose();

    } catch (error) {

      console.error(error);

      alert(
        "Error actualizando horarios"
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <AnimatePresence>

      {open && (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="
            fixed inset-0 z-[9999]
            flex items-center justify-center
            bg-black/70 backdrop-blur-md
            p-3
          "
        >

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.82,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.85,
              y: 15,
            }}
            transition={{
              duration: 0.22,
            }}
            className={`
              relative
              w-full
              max-w-[1180px]
              h-[88vh]
              rounded-[34px]
              border
              overflow-hidden
              flex flex-col
              shadow-[0_25px_80px_rgba(0,0,0,0.45)]
              transition-all
              ${isDark
                ? `
                  border-[#343746]
                  bg-[#1B1C24]
                `
                : `
                  border-slate-200
                  bg-white
                `
              }
            `}
          >

            {/* HEADER */}

            <div
              className={`
                relative
                flex items-center justify-between
                border-b px-7 py-5 flex-shrink-0
                overflow-hidden
                ${isDark
                  ? `
                    border-[#343746]
                    bg-gradient-to-r
                    from-[#20222C]
                    via-[#242632]
                    to-[#1E2028]
                  `
                  : `
                    border-slate-200
                    bg-gradient-to-r
                    from-slate-50
                    to-white
                  `
                }
              `}
            >

              <div
                className="
                  absolute inset-0
                  bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_35%)]
                  pointer-events-none
                "
              />

              <div className="relative z-10">

                <h2
                  className={`
                    text-3xl font-black tracking-tight
                    ${isDark
                      ? "text-white"
                      : "text-slate-800"
                    }
                  `}
                >
                  Editar Horarios
                </h2>

                <div
                  className={`
                    mt-1 text-sm font-medium
                    ${isDark
                      ? "text-slate-400"
                      : "text-slate-500"
                    }
                  `}
                >
                  {agente?.nombre}
                </div>

              </div>

              <motion.button
                whileHover={{
                  scale: 1.08,
                  rotate: 90,
                }}
                whileTap={{ scale: 0.92 }}
                onClick={onClose}
                className={`
                  relative z-10
                  flex h-11 w-11
                  items-center justify-center
                  rounded-2xl border
                  transition-all
                  ${isDark
                    ? `
                      border-red-500/20
                      bg-red-500/10
                      text-red-400
                      hover:bg-red-500
                      hover:text-white
                    `
                    : `
                      border-red-200
                      bg-red-50
                      text-red-500
                      hover:bg-red-500
                      hover:text-white
                    `
                  }
                `}
              >

                <MdClose className="text-xl" />

              </motion.button>

            </div>

            {/* CONTENT */}

            <div className="flex-1 overflow-y-auto p-6 pb-32">

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                {FUENTES.map((fuente) => {

                  const Icon = fuente.icon;

                  return (

                    <motion.div
                      key={fuente.id}
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      whileHover={{
                        y: -3,
                      }}
                      className={`
                        relative overflow-hidden
                        rounded-[28px]
                        border
                        p-5
                        transition-all
                        shadow-xl
                        ${fuente.border}
                        ${fuente.glow}
                        ${isDark
                          ? `
                            bg-gradient-to-br
                            from-[#232530]
                            to-[#1C1D25]
                          `
                          : `
                            bg-gradient-to-br
                            from-white
                            to-slate-50
                          `
                        }
                      `}
                    >

                      <div
                        className={`
                          absolute top-0 right-0
                          h-28 w-28 rounded-full blur-3xl opacity-20
                          bg-gradient-to-br ${fuente.color}
                        `}
                      />

                      {/* TOP */}

                      <div className="relative mb-6 flex items-center gap-4">

                        <div
                          className={`
                            flex h-14 w-14
                            items-center justify-center
                            rounded-2xl
                            bg-gradient-to-br ${fuente.color}
                            text-2xl text-white
                            shadow-xl ${fuente.glow}
                          `}
                        >

                          <Icon />

                        </div>

                        <div>

                          <div
                            className={`
                              text-lg font-black tracking-wide
                              ${isDark
                                ? "text-white"
                                : "text-slate-800"
                              }
                            `}
                          >
                            {fuente.label}
                          </div>

                          <div
                            className={`
                              text-xs font-semibold uppercase tracking-widest
                              ${fuente.iconText}
                            `}
                          >
                            Fuente #{fuente.id}
                          </div>

                        </div>

                      </div>

                      {/* HORARIOS */}

                      <div className="space-y-4">

                        {/* LUNES A VIERNES */}

                        <div
                          className={`
                            flex flex-wrap items-center gap-2
                            text-sm font-bold
                            ${
                              isDark
                                ? "text-slate-200"
                                : "text-slate-700"
                            }
                          `}
                        >

                          <span>
                            Lun - Vie desde
                          </span>

                          <input
                            type="time"
                            value={
                              form[fuente.id]
                                ?.hora_ini || ""
                            }
                            onChange={(e) =>
                              handleChange(
                                fuente.id,
                                "hora_ini",
                                e.target.value
                              )
                            }
                            className={`
                              h-11 w-[120px]
                              rounded-2xl border
                              px-3
                              text-sm font-bold
                              outline-none
                              transition-all
                              shadow-lg
                              ${
                                isDark
                                  ? `
                                    border-[#3B3E4E]
                                    bg-[#2A2C38]
                                    text-white
                                    hover:border-blue-500/50
                                    focus:border-blue-500
                                    focus:ring-4
                                    focus:ring-blue-500/20
                                  `
                                  : `
                                    border-slate-200
                                    bg-white
                                    text-slate-700
                                    hover:border-slate-300
                                    focus:border-blue-500
                                    focus:ring-4
                                    focus:ring-blue-100
                                  `
                              }
                            `}
                          />

                          <span>
                            hasta
                          </span>

                          <input
                            type="time"
                            value={
                              form[fuente.id]
                                ?.hora_fin || ""
                            }
                            onChange={(e) =>
                              handleChange(
                                fuente.id,
                                "hora_fin",
                                e.target.value
                              )
                            }
                            className={`
                              h-11 w-[120px]
                              rounded-2xl border
                              px-3
                              text-sm font-bold
                              outline-none
                              transition-all
                              shadow-lg
                              ${
                                isDark
                                  ? `
                                    border-[#3B3E4E]
                                    bg-[#2A2C38]
                                    text-white
                                    hover:border-blue-500/50
                                    focus:border-blue-500
                                    focus:ring-4
                                    focus:ring-blue-500/20
                                  `
                                  : `
                                    border-slate-200
                                    bg-white
                                    text-slate-700
                                    hover:border-slate-300
                                    focus:border-blue-500
                                    focus:ring-4
                                    focus:ring-blue-100
                                  `
                              }
                            `}
                          />

                          <span>
                            horas
                          </span>

                        </div>

                        {/* SABADOS */}

                        <div
                          className={`
                            flex flex-wrap items-center gap-2
                            text-sm font-bold
                            ${
                              isDark
                                ? "text-slate-200"
                                : "text-slate-700"
                            }
                          `}
                        >

                          <span>
                            Sábados desde
                          </span>

                          <input
                            type="time"
                            value={
                              form[fuente.id]
                                ?.hora_ini_s || ""
                            }
                            onChange={(e) =>
                              handleChange(
                                fuente.id,
                                "hora_ini_s",
                                e.target.value
                              )
                            }
                            className={`
                              h-11 w-[120px]
                              rounded-2xl border
                              px-3
                              text-sm font-bold
                              outline-none
                              transition-all
                              shadow-lg
                              ${
                                isDark
                                  ? `
                                    border-[#3B3E4E]
                                    bg-[#2A2C38]
                                    text-white
                                    hover:border-blue-500/50
                                    focus:border-blue-500
                                    focus:ring-4
                                    focus:ring-blue-500/20
                                  `
                                  : `
                                    border-slate-200
                                    bg-white
                                    text-slate-700
                                    hover:border-slate-300
                                    focus:border-blue-500
                                    focus:ring-4
                                    focus:ring-blue-100
                                  `
                              }
                            `}
                          />

                          <span>
                            hasta
                          </span>

                          <input
                            type="time"
                            value={
                              form[fuente.id]
                                ?.hora_fin_s || ""
                            }
                            onChange={(e) =>
                              handleChange(
                                fuente.id,
                                "hora_fin_s",
                                e.target.value
                              )
                            }
                            className={`
                              h-11 w-[120px]
                              rounded-2xl border
                              px-3
                              text-sm font-bold
                              outline-none
                              transition-all
                              shadow-lg
                              ${
                                isDark
                                  ? `
                                    border-[#3B3E4E]
                                    bg-[#2A2C38]
                                    text-white
                                    hover:border-blue-500/50
                                    focus:border-blue-500
                                    focus:ring-4
                                    focus:ring-blue-500/20
                                  `
                                  : `
                                    border-slate-200
                                    bg-white
                                    text-slate-700
                                    hover:border-slate-300
                                    focus:border-blue-500
                                    focus:ring-4
                                    focus:ring-blue-100
                                  `
                              }
                            `}
                          />

                          <span>
                            horas
                          </span>

                        </div>

                      </div>

                    </motion.div>

                  );

                })}

              </div>

            </div>

            {/* FOOTER */}

            <div
              className={`
                sticky bottom-0 z-30
                flex justify-end gap-3
                border-t
                px-6 py-5
                backdrop-blur-xl
                flex-shrink-0
                ${
                  isDark
                    ? `
                      border-[#343746]
                      bg-[#1B1C24]/95
                    `
                    : `
                      border-slate-200
                      bg-white/95
                    `
                }
              `}
            >

              <div
                className="
                  pointer-events-none
                  absolute inset-x-0 top-0 h-px
                  bg-gradient-to-r
                  from-transparent
                  via-blue-500/40
                  to-transparent
                "
              />

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={onClose}
                className={`
                  rounded-2xl border px-6 py-3
                  text-sm font-bold transition-all
                  shadow-lg
                  ${isDark
                    ? `
                      border-[#343746]
                      bg-[#232530]
                      text-slate-300
                      hover:bg-[#2A2C38]
                    `
                    : `
                      border-slate-200
                      bg-white
                      text-slate-700
                      hover:bg-slate-50
                    `
                  }
                `}
              >
                Cancelar
              </motion.button>

              <motion.button
                whileHover={{
                  scale: 1.03,
                  y: -1,
                }}
                whileTap={{ scale: 0.96 }}
                onClick={guardar}
                disabled={loading}
                className="
                  flex items-center gap-2
                  rounded-2xl
                  bg-gradient-to-r
                  from-blue-600
                  via-indigo-500
                  to-cyan-500
                  px-6 py-3
                  text-sm font-bold text-white
                  shadow-2xl shadow-blue-500/30
                  transition-all
                  hover:shadow-blue-500/50
                  disabled:opacity-60
                "
              >

                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                Guardar cambios

              </motion.button>

            </div>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>

  );
}