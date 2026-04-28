"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Phone,
  CreditCard,
  KeyRound,
  Loader2
} from "lucide-react";
import { INDICE_CAMPS } from "../context/indiceCamps";

const SEARCH_OPTIONS = [
  { value: "telefono", label: "Teléfono", icon: Phone },
  { value: "dni", label: "DNI", icon: CreditCard },
  { value: "idkey", label: "IdKey", icon: KeyRound },
];

export default function BusquedaTelefonos() {
  const [searchParams] = useSearchParams();
  const camp = searchParams.get("camp");

  // IS DARK REAL (igual que tu sistema)
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

  // ================= STATE =================
  const [tipo, setTipo] = useState("telefono");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState([]);

  const IconoActual = SEARCH_OPTIONS.find(o => o.value === tipo)?.icon;

  const bgMain = isDark ? "bg-[#1F2029] text-slate-200" : "bg-gray-100 text-gray-800";
  const cardBg = isDark ? "bg-[#262730]" : "bg-white";
  const border = isDark ? "border-zinc-700" : "border-zinc-200";

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${bgMain}`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ================= HEADER ================= */}
        {(() => {
          const campInfo = INDICE_CAMPS.find(c => String(c.id_camp) === String(camp));
          if (!campInfo) return null;

          return (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative mb-10"
            >
              <div className="absolute left-0 -top-12 translate-y-[6px] z-10">
                <span className={`text-xl font-semibold whitespace-nowrap ${
                  isDark ? "text-slate-300" : "text-slate-700"
                }`}>
                  KPI / Operativos / {campInfo.nombre} / Buscador
                </span>
              </div>
            </motion.div>
          );
        })()}

        {/* ================= BUSCADOR ================= */}
        <motion.div
          layout
          className={`${cardBg} ${border} border rounded-2xl shadow-xl p-5 space-y-5`}
        >

          {/* SELECTOR */}
          <div className="relative flex bg-black/5 dark:bg-white/5 p-1 rounded-xl w-fit overflow-hidden">

            <motion.div
              layout
              className="absolute top-1 bottom-1 w-[120px] bg-red-800 rounded-lg shadow-lg"
              animate={{
                x:
                  tipo === "telefono"
                    ? 0
                    : tipo === "dni"
                    ? 120
                    : 240
              }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
            />

            {SEARCH_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const active = tipo === opt.value;

              return (
                <button
                  key={opt.value}
                  onClick={() => setTipo(opt.value)}
                  className={`relative z-10 flex items-center gap-2 px-4 py-2 w-[120px] justify-center text-sm font-medium transition
                    ${active ? "text-white" : "text-zinc-400"}
                  `}
                >
                  <Icon size={16} />
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* INPUT */}
          <div className="flex flex-col md:flex-row gap-3">

            <motion.div
              whileFocus={{ scale: 1.01 }}
              className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border ${border}
                ${isDark ? "bg-[#1F2029]" : "bg-white"}
                focus-within:ring-2 focus-within:ring-red-800 transition`}
            >
              {IconoActual && (
                <IconoActual size={18} className="text-red-400" />
              )}

              <input
                type="text"
                placeholder={
                  tipo === "telefono"
                    ? "Ej: 987654321"
                    : tipo === "dni"
                    ? "Ej: 12345678"
                    : "Ej: A1B2C3..."
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full outline-none bg-transparent text-sm"
              />
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 bg-red-800 hover:bg-red-900 text-white px-6 py-3 rounded-xl font-semibold shadow-md"
            >
              <Search size={16} />
              Buscar
            </motion.button>

          </div>

        </motion.div>

        {/* ================= ESTADOS ================= */}
        <AnimatePresence>

          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-12"
            >
              <Loader2 className="animate-spin text-red-500" />
            </motion.div>
          )}

          {!loading && resultados.length === 0 && query && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 text-zinc-400"
            >
              Sin resultados encontrados
            </motion.div>
          )}

        </AnimatePresence>

        {/* ================= RESULTADOS ================= */}
        {!loading && resultados.length > 0 && (
          <motion.div layout className="grid gap-5">

            {resultados.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.015 }}
                className={`${cardBg} ${border} border rounded-2xl p-5 shadow-lg`}
              >

                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs text-zinc-400">
                    Resultado #{index + 1}
                  </span>

                  <span className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-md">
                    {item.campania || "Sin campaña"}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">

                  <Field label="Teléfono" value={item.telefono} />
                  <Field label="DNI" value={item.dni} />
                  <Field label="IdKey" value={item.idkey} />
                  <Field label="IP" value={item.ip} />

                  <Field label="Medio" value={item.medio} />
                  <Field label="Plataforma" value={item.plataforma} />
                  <Field label="Formato" value={item.formato} />
                  <Field label="Fecha" value={item.fecha_creacion} />

                </div>

              </motion.div>
            ))}

          </motion.div>
        )}

      </div>
    </div>
  );
}

/* FIELD */
function Field({ label, value }) {
  return (
    <div className="flex flex-col group">
      <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
        {label}
      </span>

      <span className="font-medium truncate group-hover:text-red-400 transition">
        {value || "-"}
      </span>
    </div>
  );
}