"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Phone,
  CreditCard,
  KeyRound,
  Loader2
} from "lucide-react";
import { INDICE_CAMPS } from "../context/indiceCamps";
import { RxCrossCircled } from "react-icons/rx";
import { MdOutlineCheckCircle, MdPending } from "react-icons/md";
import * as htmlToImage from "html-to-image";
import { useRef } from "react";

const SEARCH_OPTIONS = [
  { value: "telefono", label: "Teléfono", icon: Phone },
  { value: "dni", label: "DNI", icon: CreditCard },
  { value: "idKey", label: "IdKey", icon: KeyRound },
];

/* ================= DESCRIPCIONES ================= */
const FIELD_DESCRIPTIONS = {
  "Segmento": "Segmento dentro de la plataforma Digital es:",
  "Medio": "medio por el cual se lanza la publicidad es:",
  "Página": "la pagina donde se muestra la publicidad es:",
  "Formato": "El formato en el cual se recibe la informacion del cliente es:"
};

/* ================= ICON MAPPER ================= */
function StatusIcon({ value }) {
  if (value === "ACEPTA") {
    return <MdOutlineCheckCircle className="text-green-500" size={18} />;
  }
  if (value === "NO ACEPTA") {
    return <RxCrossCircled className="text-red-500" size={18} />;
  }
  return <MdPending className="text-yellow-500" size={18} />;
}


export default function BusquedaTelefonos() {
  const [searchParams] = useSearchParams();
  const camp = searchParams.get("camp");

  const campInfo = INDICE_CAMPS.find(c => String(c.id_camp) === String(camp));

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

  const [tipo, setTipo] = useState("telefono");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [hasSearched, setHasSearched] = useState(false); // ✅ clave
const exportRef = useRef(null);
  const bgMain = isDark ? "bg-[#1F2029] text-slate-200" : "bg-gray-100 text-gray-800";
  const cardBg = isDark ? "bg-[#262730]" : "bg-white";
  const border = isDark ? "border-zinc-700" : "border-zinc-200";

  const handleBuscar = async () => {
    if (!query.trim() || !camp) return;

    setLoading(true);
    setResultados([]);
    setHasSearched(true); // ✅ marca que ya se buscó

    try {
      const params = new URLSearchParams();
      params.append("camp", camp);

      if (tipo === "telefono") params.append("telefono", query);
      if (tipo === "dni") params.append("dni", query);
      if (tipo === "idKey") params.append("idKey", query);

      const res = await fetch(`http://192.168.9.115:4000/api/busqueda?${params.toString()}`);
      const data = await res.json();

      setResultados(data.ok ? data.data : []);
    } catch (error) {
      console.error("Error en búsqueda:", error);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleBuscar();
  };

  const getTipoTexto = () => {
    if (tipo === "telefono") return "teléfono";
    if (tipo === "dni") return "DNI";
    return "IdKey";
  };
const handleExportImage = async () => {
  if (!exportRef.current) return;

  try {
    const dataUrl = await htmlToImage.toPng(exportRef.current, {
      cacheBust: true,
      backgroundColor: isDark ? "#1F2029" : "#ffffff"
    });

    /* ================= DESCARGAR ================= */
    const link = document.createElement("a");
    link.download = `busqueda_${tipo}_${query}.png`;
    link.href = dataUrl;
    link.click();

    /* ================= COPIAR AL PORTAPAPELES ================= */
    const blob = await (await fetch(dataUrl)).blob();

    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob
      })
    ]);
alert("Imagen descargada y copiada al portapapeles");
    console.log("Imagen copiada al portapapeles");

  } catch (err) {
    console.error("Error exportando/copiendo:", err);
  }
};

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${bgMain}`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        {campInfo && (
          <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="relative mb-10">
            <div className="absolute left-0 -top-12 translate-y-[6px] z-10">
              <span className={`text-xl font-semibold ${
                isDark ? "text-slate-300" : "text-slate-700"
              }`}>
                KPI / Operativos / {campInfo.nombre} / Buscador
              </span>
            </div>
          </motion.div>
        )}

        {/* BUSCADOR */}
        <motion.div className={`${cardBg} ${border} border rounded-2xl shadow-xl p-5 space-y-5`}>
          <div className="flex gap-2">
            {SEARCH_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => setTipo(opt.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                    tipo === opt.value ? "bg-red-800 text-white" : "text-zinc-400"
                  }`}
                >
                  <Icon size={16} />
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="flex gap-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Buscar por ${getTipoTexto()}`}
              className="flex-1 px-4 py-3 rounded-xl border outline-none bg-transparent"
            />

            <button
              onClick={handleBuscar}
              className="bg-red-800 hover:bg-red-900 text-white px-6 py-3 rounded-xl flex items-center gap-2"
            >
              <Search size={16} />
              Buscar
            </button>
          </div>
        </motion.div>

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-red-500" />
          </div>
        )}

        {/* SIN RESULTADOS */}
        {!loading && hasSearched && resultados.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${cardBg} ${border} border rounded-2xl p-6 text-center`}
          >
            <p className="text-sm text-zinc-400">
              No se ha obtenido resultado para el{" "}
              <span className="font-semibold text-red-500">
                {getTipoTexto()}
              </span>{" "}
              <span className="font-semibold">
                "{query}"
              </span>{" "}
              en la campaña{" "}
              <span className="font-semibold text-red-500">
                {campInfo?.nombre || camp}
              </span>.
            </p>
          </motion.div>
        )}

        {/* RESULTADOS */}
       {!loading && resultados.length > 0 && (
  <div className="space-y-4">

    {/* BOTÓN */}
    <button
      onClick={handleExportImage}
      className="bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
    >
      COPIAR Y GUARDAR
    </button>

    {/* CONTENIDO EXPORTABLE */}
    <div
      ref={exportRef}
      className={`p-6 rounded-2xl ${cardBg} ${border} border space-y-4`}
    >
      {/* CABECERA */}
      <div className="text-sm space-y-1">
        <p className="font-semibold text-red-500">
          Resultado de la busqueda:
        </p>
        <p>
          {tipo.toUpperCase()} :{" "}
          <span className="font-bold">{query}</span>
        </p>
      </div>

      {/* RESULTADOS */}
      {resultados.map((item, i) => {
        const idkey = item.idkey || item.IdKey;

        return (
          <div key={i} className={`${cardBg} rounded-xl p-4`}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">

              <Field label="Segmento" value={item.segmento} />
              <Field label="Medio" value={item.medio} />
              <Field label="Página" value={item.pag} />
              <Field label="Formato" value={item.formato} />

              <Field label="IdKey" value={idkey} />
              <Field label="Anuncio ID" value={item.id_anuncio} />
              <Field label="Teléfono" value={item.numero_telefono} />
              <Field label="Usuario" value={item.idusuario} />

              <Field label="Fecha Creación" value={item.fecha_creacion} />
              <Field label="Fecha Plataforma" value={item.fcreacion_plataforma} />
              <Field label="Form ID" value={item.formid} />
              <Field label="Anuncio" value={item.pautanameanuncio} />

              <Field label="Campaña" value={item.campania} />
              <Field label="IP" value={item.remote_ip} />

              <IconField label="Políticas" value={item.politica} />
              <IconField label="Fines Adicionales" value={item.finesadicionales} />

            </div>
          </div>
        );
      })}
    </div>
  </div>
)}

      </div>
    </div>
  );
}

/* FIELD NORMAL */
function Field({ label, value }) {
  const descripcion = FIELD_DESCRIPTIONS[label];

  return (
    <div className="flex flex-col">
      <span className="text-[10px] text-zinc-500 uppercase">{label}</span>

      {descripcion && (
        <span className="text-[11px] text-zinc-400 leading-tight">
          {descripcion}
        </span>
      )}

      <span className="font-medium truncate">
        {value || "-"}
      </span>
    </div>
  );
}

/* FIELD ICONO */
function IconField({ label, value }) {
  return (
    <div className="flex flex-col items-start justify-center">
      <span className="text-[10px] text-zinc-500 uppercase mb-1">{label}</span>
      <StatusIcon value={value} />
    </div>
  );
}