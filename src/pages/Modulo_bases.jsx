"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Database, Filter, Clock } from "lucide-react";
import {INDICE_CAMPS} from "../context/indiceCamps";

const API_URL = "http://192.168.9.115:4000/api/modulo-bases";

export default function ModuloBases() {
  const [searchParams] = useSearchParams();
  const camp = searchParams.get("camp");

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

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [fechaFilter, setFechaFilter] = useState("");
  const [baseFilter, setBaseFilter] = useState("");

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}?camp=${camp}`);
        const json = await res.json();
        setData(json.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (camp) fetchData();
  }, [camp]);

  // ================= NORMALIZAR =================
  const normalizedData = useMemo(() => {
    return data.map(r => ({
      ...r,
      fechacarga: r.fechacarga || "EN BLANCO",
      NombreBase: r.NombreBase || "EN BLANCO",
      TotalMarcaciones: r.TotalMarcaciones || 0,
      TotalGestiones: r.TotalGestiones || 0,
      ContactoDirecto: r.ContactoDirecto || 0,
      ContactoNoDirecto: r.ContactoNoDirecto || 0,
      NoContacto: r.NoContacto || 0,
      Agendados: r.Agendados || 0,
      TMO_SEG: r.TMO_Final || 0,
TMO_STR: r.TMO_HHMMSS || "00:00:00"
    }));
  }, [data]);

  // ================= FILTROS =================
  const fechasRaw = [...new Set(normalizedData.map(d => d.fechacarga))];
  const bases = [...new Set(normalizedData.map(d => d.NombreBase))];

  const filtered = useMemo(() => {
    return normalizedData.filter(d =>
      (!fechaFilter || d.fechacarga === fechaFilter) &&
      (!baseFilter || d.NombreBase === baseFilter)
    );
  }, [normalizedData, fechaFilter, baseFilter]);

  // ================= GROUP =================
  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(row => {
      const f = row.fechacarga;
      if (!map[f]) map[f] = [];
      map[f].push(row);
    });
    return map;
  }, [filtered]);

  // ================= TOTAL =================
  const total = useMemo(() => {
    let t = { marc: 0, gest: 0, cd: 0, ncd: 0, nc: 0, ag: 0, tmo: 0, count: 0 };

    filtered.forEach(r => {
      t.marc += r.TotalMarcaciones;
      t.gest += r.TotalGestiones;
      t.cd += r.ContactoDirecto;
      t.ncd += r.ContactoNoDirecto;
      t.nc += r.NoContacto;
      t.ag += r.Agendados;
      t.tmo += r.TMO_SEG * r.TotalMarcaciones;
t.count += r.TotalMarcaciones;
    });

    return {
      ...t,
      tmoProm: t.count ? t.tmo / t.count : 0
    };
  }, [filtered]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center font-medium animate-pulse">
      Cargando...
    </div>
  );

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${
      isDark ? "bg-[#1F2029] text-slate-200" : "bg-gray-100 text-gray-800"
    }`}>

     {/* HEADER */}
{(() => {
  const campInfo = INDICE_CAMPS.find(c => String(c.id_camp) === String(camp));
  if (!campInfo) return null;

  return (
    <div className="relative mb-10">
      <div className="absolute left-0 -top-6 translate-y-[6px] z-10">
        <span className={`text-xl font-semibold whitespace-nowrap ${
          isDark ? 'text-slate-300' : 'text-slate-700'
        }`}>
          KPI / Operativos / Monitor de Bases /  {campInfo.nombre}
        </span>
      </div>
    </div>
  );
})()}
      {/* FILTROS */}
      <div className={`flex flex-wrap gap-4 p-4 rounded-xl mb-6 border transition-all ${
        isDark ? "bg-slate-800/50 border-slate-700 shadow-2xl" : "bg-white border-gray-200 shadow-sm"
      }`}>
        <div className="flex items-center gap-2 text-sm font-semibold opacity-70 mr-2">
          <Filter size={18} /> <span>FILTRAR POR:</span>
        </div>

        <select
          onChange={e => setFechaFilter(e.target.value)}
          value={fechaFilter}
          className={`px-4 py-2 rounded-lg border focus:ring-2 outline-none transition-all ${
            isDark ? "bg-slate-900 border-slate-600 text-white focus:ring-red-500" : "bg-gray-50 border-gray-300 focus:ring-red-400"
          }`}
        >
          <option value="">Todas las fechas</option>
          {fechasRaw.map(f => (
            <option key={f} value={f}>{formatDate(f)}</option>
          ))}
        </select>

        <select
          onChange={e => setBaseFilter(e.target.value)}
          value={baseFilter}
          className={`px-4 py-2 rounded-lg border focus:ring-2 outline-none transition-all ${
            isDark ? "bg-slate-900 border-slate-600 text-white focus:ring-red-500" : "bg-gray-50 border-gray-300 focus:ring-red-400"
          }`}
        >
          <option value="">Todas las bases</option>
          {bases.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      {/* TABLA CONTENEDOR */}
      <div className={`rounded-2xl overflow-hidden border transition-all ${
        isDark ? "bg-slate-900/40 border-slate-700 shadow-2xl" : "bg-white border-gray-200 shadow-xl"
      }`}>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className={`${isDark ? "bg-slate-800/80" : "bg-gray-100/80"} backdrop-blur-sm`}>
                <Th>Fechacarga</Th>
                <Th>NombreBase</Th>
                <Th>Total de Marcaciones</Th>
                <Th>Total de Gestiones</Th>
                <Th>Count Contacto Directo</Th>
                <Th>Count Contacto No Directo</Th>
                <Th>Count No Contacto</Th>
                <Th>Count Agendas</Th>
           {/*    <Th><div className="flex items-center gap-1"><Clock size={14} /> TMO promedio segundos</div></Th> */} 
                <Th>TMO final</Th>
              </tr>
            </thead>

            <tbody className="divide-y divide-transparent">
              <AnimatePresence>
                {Object.entries(grouped).map(([fecha, rows]) => (
                  <Group key={fecha} fecha={fecha} rows={rows} isDark={isDark} />
                ))}
              </AnimatePresence>

              {/* TOTAL GENERAL */}
              <tr className={`font-black ${isDark ? "bg-blue-900/30 text-blue-300" : "bg-blue-50 text-blue-900"}`}>
                <Td colSpan={2} className="text-right pr-6 uppercase tracking-widest text-xs">Total General</Td>
                <Td>{total.marc.toLocaleString()}</Td>
                <Td>{total.gest.toLocaleString()}</Td>
                <Td>{total.cd.toLocaleString()}</Td>
                <Td>{total.ncd.toLocaleString()}</Td>
                <Td>{total.nc.toLocaleString()}</Td>
                <Td>{total.ag.toLocaleString()}</Td>
               {/* <Td className="text-lg italic text-blue-400">{total.tmoProm.toFixed(1)}</Td> */} 
                 <Td>
                  <span className={`px-3 py-1 rounded-md text-xs border font-bold ${
                    isDark ? "bg-blue-500/10 border-blue-500/30 text-blue-400" : "bg-blue-600 text-white border-blue-700"
                  }`}>
                    {formatTime(Math.round(total.tmoProm))}
                  </span>
                </Td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ================= COMPONENTES HIJOS =================

function Group({ fecha, rows, isDark }) {
  return rows.map((r, i) => {
    const final = r.TMO_SEG;

    return (
      <motion.tr
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{
          scale: 1.002,
          backgroundColor: isDark
            ? "rgba(255,255,255,0.03)"
            : "rgba(0,0,0,0.02)"
        }}
        className={`border-b transition-colors ${
          isDark ? "border-slate-800/50" : "border-gray-100"
        }`}
      >
        {/* fecha */}
        {i === 0 && (
          <td
            rowSpan={rows.length}
            className={`px-5 py-3 align-top font-bold ${
              isDark ? "bg-slate-800/40" : "bg-gray-200/50"
            }`}
          >
            <div className="flex items-center gap-2 text-blue-500">
              <Calendar size={16} />
              {formatDate(fecha)}
            </div>
          </td>
        )}

        <Td className="font-medium">{r.NombreBase}</Td>
        <Td>{r.TotalMarcaciones}</Td>
        <Td>{r.TotalGestiones}</Td>
        <Td>{r.ContactoDirecto}</Td>
        <Td>{r.ContactoNoDirecto}</Td>
        <Td>{r.NoContacto}</Td>
        <Td>{r.Agendados}</Td>

        <Td>
          <span
            className={`px-2 py-1 rounded-md text-xs font-bold shadow-sm inline-block min-w-[50px] text-center border ${getColor(
              final,
              isDark
            )}`}
          >
            {formatTime(final)}
          </span>
        </Td>
      </motion.tr>
    );
  });
}

// ================= HELPERS =================

function formatDate(dateStr) {
  if (!dateStr || dateStr === "EN BLANCO") return dateStr;
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const aa = String(date.getFullYear()).slice(-2);

    return `${mm}/${dd}/${aa}`;
  } catch (e) {
    return dateStr;
  }
}

function parseTMO(value) {
  if (!value) return 0;
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.includes(":")) {
    const parts = value.split(":").map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return Number(value) || 0;
}

function formatTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);

  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

function getColor(sec, isDark) {
  if (sec === 0) {
    return isDark
      ? "bg-rose-500/10 text-rose-500 border-rose-500/50"
      : "bg-rose-600 text-white border-rose-700";
  }
  if (sec < 5) {
    return isDark
      ? "bg-orange-500/10 text-orange-500 border-orange-500/50"
      : "bg-orange-500 text-white border-orange-600";
  }
  if (sec < 30) {
    return isDark
      ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/50"
      : "bg-yellow-400 text-gray-900 border-yellow-500";
  }
  return isDark
    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/50"
    : "bg-emerald-600 text-white border-emerald-700";
}

function Th({ children, className = "" }) {
  return (
    <th className={`px-5 py-4 text-left text-xs font-bold uppercase tracking-wider opacity-60 ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, colSpan, className = "" }) {
  return (
    <td colSpan={colSpan} className={`px-5 py-3 text-sm ${className}`}>
      {children}
    </td>
  );
}