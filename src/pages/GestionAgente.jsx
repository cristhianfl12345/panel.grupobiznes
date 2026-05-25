//front/src/pages/GestionAgente.jsx

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaWhatsapp,
  FaGoogle,
  FaFacebookMessenger,
  FaTiktok,
  FaUser,
  FaTrash,
  FaPlus,
  FaTimes,
  FaSearch,
  FaEdit,
  FaMobileAlt,
  FaFacebookF,
  FaKey
} from "react-icons/fa";
import { Trash2} from "lucide-react";

import { useSearchParams } from "react-router-dom";
import EditarHorarioCartera from "./EditarHorarioCartera";
import AgregarAgente from "./AgregarAgente";
import { INDICE_CAMPS } from "../context/indiceCamps";

const API = "http://192.168.9.115:4000/api/agente-info";

const FUENTE_ICON = {
  whatsapp: FaWhatsapp,
  "landing interno": FaMobileAlt,
  google: FaGoogle,
  "fb,msg": FaFacebookMessenger,
  tiktok: FaTiktok,
};

const FUENTE_LABEL = {
  whatsapp: "WhatsApp",
  "landing interno": "Landing",
  google: "Google",
  "fb,msg": "FB / MSG",
  tiktok: "TikTok",
};
const PLATAFORMAS = {
  1: "Busqueda",
  2: "Monitor",
  3: "Busqueda y monitor",
  4: "Toda la plataforma",
};
export default function GestionAgente() {

  const [searchParams] = useSearchParams();

  const idCampana = searchParams.get("camp");
  const campInfo = INDICE_CAMPS.find(
    c => String(c.id_camp) === String(idCampana)
  );

  const [loading, setLoading] = useState(true);
  const [agentes, setAgentes] = useState([]);
  const [search, setSearch] = useState("");

  const [showAgregar, setShowAgregar] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);

const [agenteEditar, setAgenteEditar] = useState(null);
const [showPassword, setShowPassword] = useState({});


  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {

    const handleStorage = () => {

      const theme = localStorage.getItem("theme") === "dark";

      setIsDark(theme);

      window.location.reload();

    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };

  }, []);

  const getAgentes = async () => {

    try {

      setLoading(true);

      const res = await fetch(
        `${API}/campana/${idCampana}`
      );

      const data = await res.json();

      setAgentes(data?.data || []);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    if (idCampana) {
      getAgentes();
    }

  }, [idCampana]);

  const filtered = useMemo(() => {

    return agentes.filter((item) => {

      const txt =
        `${item.nombre} ${item.usuario} ${item.dni}`
          .toLowerCase();

      return txt.includes(search.toLowerCase());

    });

  }, [agentes, search]);

  return (

    <div
      className={`
        min-h-screen p-6 transition-colors duration-500
        ${isDark ? "bg-[#1F2029]" : "bg-gray-100"}
      `}
    >
{/* BREADCRUMB */}

<motion.div
  initial={{ opacity: 0, y: -15 }}
  animate={{ opacity: 1, y: 0 }}
  className="mb-8"
>

  <div
    className={`
      flex flex-wrap items-center gap-2
      text-sm font-semibold tracking-wide
      ${isDark
          ? "text-slate-300"
          : "text-slate-600"
      }
    `}
  >



    <span
      className={`
        font-semibold uppercase text-lg
        ${isDark
          ? "text-slate-300"
          : "text-slate-600"
        }
      `}
    >
      Operativos
    </span>

    <span
      className={`
        ${isDark
          ? "text-slate-300"
          : "text-slate-600"
        }
      `}
    >
      /
    </span>

    <span
      className={` font-semibold text-lg
        ${isDark
          ? "text-slate-300"
          : "text-slate-600"
        }
      `}
    >
      {campInfo?.nombre || "Sin campaña"}
    </span>

    <span
      className={` font-bold
        ${isDark
          ? "text-slate-300"
          : "text-slate-600"
        }
      `}
    >
      /
    </span>

    <span
      className={`
        font-semibold uppercase text-lg
        ${isDark
          ? "text-slate-300"
          : "text-slate-600"
        }
      `}
    >
      Gestión de agentes
    </span>

  </div>

</motion.div>
      {/* HEADER */}

      <div
        className={`
          mb-8 rounded-3xl border p-6 shadow-sm transition-all
          ${isDark
            ? "border-[#343746] bg-[#272833]"
            : "border-gray-200 bg-white"}
        `}
      >

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <h1
              className={`
                text-4xl font-black tracking-tight
                ${isDark ? "text-white" : "text-slate-800"}
              `}
            >
              Lista de Usuarios
            </h1>

           

          </div>

          <div className="flex items-center gap-3">

            {/* SEARCH */}

            <div className="relative">

              <FaSearch
  className={`
    absolute left-3 top-1/2 -translate-y-1/2
    ${isDark ? "text-slate-500" : "text-slate-400"}
  `}
/>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar agente..."
                className={`
                  h-11 w-[260px] rounded-2xl border pl-10 pr-4 text-sm outline-none transition-all
                  ${isDark
                    ? `
                      border-[#3b3d4d]
                      bg-[#1F2029]
                      text-white
                      placeholder:text-slate-500
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-500/20
                    `
                    : `
                      border-slate-200
                      bg-white
                      text-slate-700
                      focus:border-blue-500
                      focus:ring-4
                      focus:ring-blue-100
                    `
                  }
                `}
              />

            </div>

            {/* ADD */}

            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => setShowAgregar(true)}
              className="
                flex h-11 items-center gap-2 rounded-2xl
                bg-green-700 px-5 font-semibold text-white
                shadow-lg shadow-green-500/20
              "
            >

             <FaPlus className="text-sm" />

              Nuevo Usuario

            </motion.button>

          </div>

        </div>

      </div>

      {/* TABLE */}

      <motion.div
        layout
        className={`
          overflow-hidden rounded-[30px] border shadow-[0_15px_50px_rgba(0,0,0,0.08)]
          ${isDark
            ? "border-[#343746] bg-[#272833]"
            : "border-slate-200 bg-white"}
        `}
      >

        <div className="overflow-auto">

          <table className="min-w-full border-collapse">

<thead>

  <tr
    className={`
      border-b
      ${isDark
        ? "border-[#343746] bg-[#2d2f3d]"
        : "border-slate-200 bg-slate-50"}
    `}
  >

    <Th isDark={isDark}>ID</Th>
    <Th isDark={isDark}>Doc.</Th>
    <Th isDark={isDark}>Nombre</Th>
    <Th isDark={isDark}>Usuario</Th>
    <Th isDark={isDark}>

  <div className="flex justify-center">
    <FaKey className="text-yellow-400 text-sm" />
  </div>

</Th>
    <Th isDark={isDark}>Registro</Th>
    <Th isDark={isDark}>Plataforma</Th>

    {/* WHATSAPP */}

    <Th isDark={isDark}>

      <div className="flex justify-center">
        <FaWhatsapp className="text-green-500 text-lg" />
      </div>

    </Th>

    {/* LANDING */}

    <Th isDark={isDark}>

      <div className="flex justify-center">
        <FaMobileAlt className="text-orange-500 text-lg" />
      </div>

    </Th>

    {/* GOOGLE */}

    <Th isDark={isDark}>

      <div className="flex justify-center">
        <FaGoogle className="text-red-400 text-lg" />
      </div>

    </Th>

    {/* FACEBOOK + MSG */}

    <Th isDark={isDark}>

      <div className="flex items-center justify-center gap-1">

        <FaFacebookF className="text-blue-400 text-lg" />

        <FaFacebookMessenger className="text-cyan-500 text-lg" />

      </div>

    </Th>

    {/* TIKTOK */}

    <Th isDark={isDark}>

      <div className="flex justify-center">
        <FaTiktok className="text-purple-400 text-lg" />
      </div>

    </Th>

    <Th isDark={isDark}>Entrada</Th>
    <Th isDark={isDark}>Salida</Th>
    <Th isDark={isDark}>Última conexión</Th>
    <Th isDark={isDark}>Acciones</Th>

  </tr>

</thead>

            <tbody>

              <AnimatePresence>

                {loading ? (

                  <tr>

                    <td
                      colSpan={11}
                      className={`
                        h-[400px] text-center
                        ${isDark ? "text-slate-400" : "text-slate-500"}
                      `}
                    >
                      Cargando agentes...
                    </td>

                  </tr>

                ) : filtered.length === 0 ? (

                  <tr>

                    <td
                      colSpan={11}
                      className={`
                        h-[400px] text-center
                        ${isDark ? "text-slate-400" : "text-slate-500"}
                      `}
                    >
                      No hay registros
                    </td>

                  </tr>

                ) : (

                  filtered.map((item, index) => (

                    <motion.tr
                      key={item.id_usuario}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`
                        border-b transition-all
                        ${isDark
                          ? "border-[#343746] hover:bg-[#2d2f3d]"
                          : "border-slate-100 hover:bg-slate-50"}
                      `}
                    >

                      <Td>

                        <div
                          className={`
                            font-semibold
                            ${isDark ? "text-white" : "text-slate-700"}
                          `}
                        >
                          {item.id_usuario}
                        </div>

                      </Td>

                      <Td>

                        <span className="
                          rounded-lg bg-slate-200 text-sm
                          px-2 py-1 font-semibold text-black
                        ">
                          {item.dni}
                        </span>

                      </Td>

                      <Td>

                        <div className="flex items-center gap-3">

                         

                          <div>

                            {/*
                            <div
                              className={`
                                font-semibold uppercase leading-tight text-sm
                                ${isDark ? "text-white" : "text-slate-800"}
                              `}
                            >
                              {item.nombre}
                            </div> */}
                            <div
  className={`
    font-semibold uppercase leading-tight text-sm
    ${isDark ? "text-white" : "text-slate-800"}
  `}
>
  {(() => {
    const palabras = item.nombre.trim().split(/\s+/);
    if (palabras.length <= 3) return item.nombre; // Si ya tiene 3 palabras o menos, lo deja igual
    
    const primerNombre = palabras[0];
    const primerApellido = palabras[palabras.length - 2];
    const segundoApellido = palabras[palabras.length - 1];
    
    return `${primerNombre} ${primerApellido} ${segundoApellido}`;
  })()}
</div>

                            <div className="text-[10px] text-slate-500">
                              id_carteriza: {item.id_carteriza}
                            </div>

                          </div>

                        </div>

                      </Td>

                      <Td>

                        <div className="flex justify-center rounded-xl bg-slate-200 font-semibold text-black">
                           {item.usuario}
                        </div>

                      </Td>
                      <Td>

  <div className="flex items-center justify-center">

    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      onClick={() =>
        setShowPassword((prev) => ({
          ...prev,
          [item.id_usuario]: !prev[item.id_usuario],
        }))
      }
      className={`
        flex h-9 w-9 items-center justify-center
        rounded-xl border transition-all duration-300
        ${isDark
          ? `
            border-yellow-500/20
            bg-yellow-500/10
            text-yellow-300
            hover:bg-yellow-500/20
            hover:border-yellow-400
          `
          : `
            border-yellow-200
            bg-yellow-50
            text-yellow-600
            hover:bg-yellow-100
          `
        }
      `}
    >

      <FaKey className="text-sm" />

    </motion.button>

    <AnimatePresence>

      {showPassword[item.id_usuario] && (

        <motion.div
          initial={{
            opacity: 0,
            width: 0,
            x: -10,
          }}
          animate={{
            opacity: 1,
            width: "auto",
            x: 0,
          }}
          exit={{
            opacity: 0,
            width: 0,
            x: -10,
          }}
          transition={{
            duration: 0.2,
          }}
          className="overflow-hidden"
        >

          <div
            className={`
              ml-2 flex items-center uppercase
              rounded-xl border px-3 py-2
              text-xs font-bold tracking-wide
              whitespace-nowrap shadow-sm
              ${isDark
                ? `
                  border-[#3b3d4d]
                  bg-[#1F2029]
                  text-slate-200
                `
                : `
                  border-slate-200
                  bg-white
                  text-slate-700
                `
              }
            `}
          >

            {`${item.dni}_${item.nombre
              ?.trim()
              ?.split(" ")
              ?.slice(-2, -1)[0]
              ?.substring(0, 2)
              ?.toLowerCase() || ""}`}

          </div>

        </motion.div>

      )}

    </AnimatePresence>

  </div>

</Td>

                      <Td>

                        <div className="
                          inline-flex rounded-xl
                          bg-slate-200 px-3 py-2
                          text-xs font-semibold text-black
                        ">
                          {formatDate(item.fecha_registro).split(',')[0]}
                        </div>

                      </Td>

                      <Td>

                        <span className="flex justify-center
                          rounded-xl bg-slate-200 uppercase
                          px-3 py-2 text-xs font-bold text-black
                        ">
                          {
                            PLATAFORMAS[item.plataforma] || "-"
                          }
                        </span>

                      </Td>

                      {/* cambio de fuentes*/}

                     <Td>
  <FuenteHorario
    item={item}
    fuente="whatsapp"
    isDark={isDark}
  />
</Td>

<Td>
  <FuenteHorario
    item={item}
    fuente="landing interno"
    isDark={isDark}
  />
</Td>

<Td>
  <FuenteHorario
    item={item}
    fuente="google"
    isDark={isDark}
  />
</Td>

<Td>
  <FuenteHorario
    item={item}
    fuente="fb,msg"
    isDark={isDark}
  />
</Td>

<Td>
  <FuenteHorario
    item={item}
    fuente="tiktok"
    isDark={isDark}
  />
</Td>

                      <Td>
                        <HourBadge value={item.hora_entrada} />
                      </Td>

                      <Td>
                        <HourBadge value={item.hora_salida} />
                      </Td>

                      <Td>
{/*
                        <div
                          className={`
                            text-xs font-semibold leading-tight
                            ${isDark ? "text-slate-400" : "text-slate-600"}
                          `}
                        >
                          {item.ultima_conexion
                            ? formatDate(item.ultima_conexion)
                            : "Sin conexión"}
                        </div>
*/}
<div
  className={`flex items-center rounded-xl
                          bg-slate-200
    text-xs font-semibold leading-tight flex flex-col
    ${isDark ? "text-black" : "text-black"}
  `}
>
  {item.ultima_conexion ? (
    (() => {
      const [fecha, hora] = formatDate(item.ultima_conexion).split(', ');
      return (
        <>
          <span>{fecha}</span>
          <span className="flex justify-center text-xs opacity-95">{hora}</span>
        </>
      );
    })()
  ) : (
    "Sin conexión"
  )}
</div>
                      </Td>

                      <Td>

                        <div className="flex items-center gap-2">

                          {/* BOTON EDITAR + MODAL */}

<><motion.button
  whileHover={{ scale: 1.06 }}
  whileTap={{ scale: 0.94 }}
  onClick={() => {

    setAgenteEditar(item);

    setOpenEditar(true);

  }}
  className="
    flex h-10 w-10 items-center justify-center
    rounded-xl bg-amber-400 text-slate-800
    transition-all hover:bg-amber-300
    shadow-md
  "
>

  <FaEdit className="text-sm" />

</motion.button>

</>

                          <DeleteButton
  id={item.id_carteriza}
  reload={getAgentes}
/>
                          

                        </div>

                      </Td>

                    </motion.tr>

                  ))

                )}

              </AnimatePresence>

            </tbody>

          </table>

        </div>

      </motion.div>

      {/* MODAL AGREGAR */}

     
<AnimatePresence>

  {showAgregar && (

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="
        fixed inset-0 z-[999]
        flex items-center justify-center
        bg-black/60 backdrop-blur-md
        p-5
      "
    >

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{
          duration: 0.22,
          ease: "easeOut"
        }}
        className={`
          relative w-full max-w-5xl
          rounded-[32px] border shadow-2xl
          overflow-hidden
          ${isDark
            ? `
              border-[#343746]
              bg-[#272833]
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
            flex items-center justify-between
            border-b px-6 py-5
            ${isDark
              ? "border-[#343746]"
              : "border-slate-200"}
          `}
        >

          <div>

            <h2
              className={`
                text-2xl font-black
                ${isDark
                  ? "text-white"
                  : "text-slate-800"}
              `}
            >
              Nuevo Usuario
            </h2>

            <p
              className={`
                mt-1 text-sm
                ${isDark
                  ? "text-slate-400"
                  : "text-slate-500"}
              `}
            >
              Registrar agente para campaña
            </p>

          </div>

          {/* CLOSE */}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAgregar(false)}
            className={`
              flex h-11 w-11 items-center justify-center
              rounded-2xl transition-all
              ${isDark
                ? `
                  bg-[#1F2029]
                  text-slate-300
                  hover:bg-red-500
                  hover:text-white
                `
                : `
                  bg-slate-100
                  text-slate-700
                  hover:bg-red-500
                  hover:text-white
                `
              }
            `}
          >

            <FaTimes className="text-lg" />

          </motion.button>

        </div>

        {/* CONTENT */}

        <div className="max-h-[85vh] overflow-auto p-6">

          <AgregarAgente
            onClose={() => setShowAgregar(false)}
            reload={getAgentes}
            idCampana={idCampana}
            isDark={isDark}
          />

        </div>

      </motion.div>

    </motion.div>

  )}

</AnimatePresence>
{/* 
<AnimatePresence>

  {openEditar && agenteEditar && (

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-black/60 backdrop-blur-md
        p-4
      "
    >

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9,
          y: 20
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0
        }}
        exit={{
          opacity: 0,
          scale: 0.9,
          y: 20
        }}
        transition={{
          duration: 0.2
        }}
        className={`
          relative w-full max-w-5xl
          rounded-[30px] border
          overflow-hidden shadow-2xl
          ${isDark
            ? `
              border-[#343746]
              bg-[#272833]
            `
            : `
              border-slate-200
              bg-white
            `
          }
        `}
      >

        

        <div
          className={`
            flex items-center justify-between
            border-b px-6 py-5
            ${isDark
              ? "border-[#343746]"
              : "border-slate-200"
            }
          `}
        >

          <div>

            <h2
              className={`
                text-2xl font-black
                ${isDark
                  ? "text-white"
                  : "text-slate-800"
                }
              `}
            >
              Hora
            </h2>

            <p
              className={`
                mt-1 text-sm
                ${isDark
                  ? "text-slate-400"
                  : "text-slate-500"
                }
              `}
            >
              {agenteEditar.nombre}
            </p>

          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {

              setOpenEditar(false);

              setAgenteEditar(null);

            }}
            className={`
              flex h-10 w-10 items-center justify-center
              rounded-2xl transition-all
              ${isDark
                ? `
                  bg-[#1F2029]
                  text-slate-300
                  hover:bg-red-500
                  hover:text-white
                `
                : `
                  bg-slate-100
                  text-slate-700
                  hover:bg-red-500
                  hover:text-white
                `
              }
            `}
          >

            <Trash2 className="h-4 w-4" />

          </motion.button>

        </div>

        

        <div className="max-h-[85vh] overflow-auto p-6">

          <EditarHorarioCartera
            open={openEditar}
            onClose={() => {

              setOpenEditar(false);

              setAgenteEditar(null);

            }}
            agente={agenteEditar}
            reload={getAgentes}
          />

        </div>

      </motion.div>

    </motion.div>

  )}

</AnimatePresence>
*/}
<EditarHorarioCartera
  open={openEditar}
  onClose={() => {

    setOpenEditar(false);

    setAgenteEditar(null);

  }}
  agente={agenteEditar}
  reload={getAgentes}
/>
    </div>

  );
}

function FuenteCard({
  fuente,
  icon: Icon,
  idCarteriza,
  reload,
  isDark
}) {

  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    hora_ini: fuente.hora_ini?.slice(0, 5) || "",
    hora_fin: fuente.hora_fin?.slice(0, 5) || "",
    hora_ini_s: fuente.hora_ini_s?.slice(0, 5) || "",
    hora_fin_s: fuente.hora_fin_s?.slice(0, 5) || "",
  });

  const save = async () => {

    try {

      await fetch(
        `${API}/horario`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_carteriza: idCarteriza,
            fuente: fuente.fuente,
            ...form,
          }),
        }
      );

      setOpen(false);

      reload();

    } catch (error) {

      console.error(error);

    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className={`
          group flex items-center gap-2 rounded-2xl
          border px-3 py-2 shadow-sm transition-all
          ${isDark
            ? `
              border-[#3b3d4d]
              bg-[#1F2029]
              hover:border-blue-500
            `
            : `
              border-slate-200
              bg-white
              hover:border-blue-300
            `
          }
        `}
      >

        <div className="
          flex h-9 w-9 items-center justify-center
          rounded-xl bg-blue-500/10 text-blue-500
        ">
          <Icon className="h-4 w-4" />
        </div>

        <div className="text-left">

          <div
            className={`
              text-xs font-black uppercase
              ${isDark ? "text-white" : "text-slate-800"}
            `}
          >
            {FUENTE_LABEL[fuente.fuente]}
          </div>

          <div className="text-[11px] font-semibold text-slate-500">
            {fuente.hora_ini?.slice(0, 5)} - {fuente.hora_fin?.slice(0, 5)}
          </div>

        </div>

      </motion.button>

    </>
  );
}

function DeleteButton({ id, reload }) {

  const remove = async () => {

    const ok = confirm("¿Eliminar agente de la campaña?");

    if (!ok) return;

    try {

      await fetch(
        `${API}/campana/${id}`,
        {
          method: "DELETE",
        }
      );

      reload();

    } catch (error) {

      console.error(error);

    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={remove}
      className="
        flex h-10 w-10 items-center justify-center
        rounded-xl bg-red-500 text-white
      "
    >
      <Trash2 className="h-4 w-4" />
    </motion.button>
  );
}

function FuenteHorario({
  item,
  fuente,
  isDark
}) {

  // MAPEO NUMERICO DEL BACK

  const fuenteMap = {
    whatsapp: "1",
    "landing interno": "2",
    google: "3",
    "fb,msg": "4",
    tiktok: "5",
  };

  // ACA ESTA EL ERROR QUE TENIAS:
  // TU BACK DEVUELVE "1", "2", "3"
  // Y TU FRONT BUSCABA "whatsapp"

  const horario = item.fuentes?.find(
    (x) => String(x.fuente) === fuenteMap[fuente]
  );

  if (!horario) {

    return (

      <div
        className={`
          text-center text-xs
          ${isDark
            ? "text-slate-600"
            : "text-slate-400"}
        `}
      >
        -
      </div>

    );
  }

  return (

    <motion.div
      whileHover={{ scale: 1.03 }}
      className={`
        rounded-xl border px-2 py-2 text-center
        transition-all cursor-pointer
        ${isDark
          ? `
            border-[#3b3d4d]
            bg-[#1F2029]
            hover:border-blue-500
            text-slate-200
          `
          : `
            border-slate-200
            bg-white
            hover:border-blue-300
            text-slate-700
          `
        }
      `}
    >

      <div className="text-xs font-bold">

        {horario.hora_ini?.slice(0, 5)}
        {" - "}
        {horario.hora_fin?.slice(0, 5)}

      </div>

      {(horario.hora_ini_s || horario.hora_fin_s) && (

        <div
          className={`
            mt-1 text-[10px]
            ${isDark
              ? "text-slate-500"
              : "text-slate-400"}
          `}
        >

          {horario.hora_ini_s?.slice(0, 5)}
          {" - "}
          {horario.hora_fin_s?.slice(0, 5)}

        </div>

      )}

    </motion.div>

  );
}
function HourBadge({ value }) {

  return (
    <div className="
      inline-flex rounded-xl
      bg-slate-200 px-3 py-2
      text-sm font-bold text-black
    ">
      {value?.slice(0, 5) || "--:--"}
    </div>
  );
}

function Th({ children, isDark }) {

  return (
    <th
      className={`
        whitespace-nowrap px-4 py-4
        text-left text-xs font-black uppercase tracking-wide
        ${isDark ? "text-slate-300" : "text-slate-700"}
      `}
    >
      {children}
    </th>
  );
}

function Td({ children }) {

  return (
    <td className="px-4 py-4 align-middle">
      {children}
    </td>
  );
}

function formatDate(date) {

  if (!date) return "-";

  return new Date(date).toLocaleString("es-PE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}