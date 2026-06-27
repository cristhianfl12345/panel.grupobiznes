"use client"

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUserTie, FaUserClock } from "react-icons/fa";
import { FaPhoneVolume, FaEye } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const API = "http://192.168.9.115:4000/api/dashboard/home";

export default function Home() {

  /* ===========================
      TEMA
  =========================== */
const navigate = useNavigate();

  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {

    const handleStorage = () => {
      const theme = localStorage.getItem("theme") === "dark";
      setIsDark(theme);

      // Mantiene el comportamiento que ya tenías
      window.location.reload();
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };

  }, []);

  /* ===========================
      USUARIO
  =========================== */

  const [user, setUser] = useState(null);

  const fullName = user
    ? `${user.nombres} ${user.apellidos}`
    : "";

  /* ===========================
      DASHBOARD
  =========================== */

  const [campanas, setCampanas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setLoading(false);
      return;
    }

    const usuario = JSON.parse(storedUser);

    setUser(usuario);

    const obtenerDashboard = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API}/${usuario.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        console.log("HOME DASHBOARD:", data);

        if (data.ok) {
          setCampanas(data.data);
        }

      } catch (error) {

        console.error("Error cargando dashboard:", error);

      } finally {

        setLoading(false);

      }

    };

    obtenerDashboard();

  }, []);

  /* ===========================
      ANIMACIONES
  =========================== */

  const cardAnimation = {
    initial: {
      opacity: 0,
      y: 25
    },
    animate: {
      opacity: 1,
      y: 0
    },
    transition: {
      duration: .35
    },
    whileHover: {
      y: -5,
      scale: 1.02
    }
  };

  const sectionAnimation = (index) => ({
    initial: {
      opacity: 0,
      y: 25
    },
    animate: {
      opacity: 1,
      y: 0
    },
    transition: {
      duration: .4,
      delay: index * .08
    }
  });

  const formatNumber = (number) => {

    return Number(number || 0).toLocaleString("es-PE");

  };
return (

  <div
    className={`
      min-h-screen
      p-6
      transition-colors
      duration-500
      ${isDark ? "bg-[#1F2029]" : "bg-gray-100"}
    `}
  >

    {/* ===========================
          BANNER
    =========================== */}
<motion.div

  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: .45 }}

  className={`
    relative
    overflow-hidden
    rounded-xl
    shadow-sm
    p-6
    flex
    flex-col
    lg:flex-row
    items-center
    justify-between
    mb-10

    ${isDark
      ? "bg-[#272833]"
      : "bg-white"
    }

  `}
>

  {/* CONTENIDO */}

  <div className="max-w-xl relative z-10">

    <h2
      className={`
        text-2xl
        font-bold
        mb-3
        ${isDark
          ? "text-[#ff6b6b]"
          : "text-red-600"
        }
      `}
    >
      ¡Bienvenido {fullName || "..."}!
    </h2>

    <p
      className={`
        leading-relaxed
        ${isDark
          ? "text-gray-300"
          : "text-gray-600"
        }
      `}
    >
      Su panel de control está listo. Aquí podrá visualizar
      los indicadores más relevantes de las campañas que
      tiene asignadas.
    </p>

  </div>

  <img
    src="/stadistics.svg"
    alt=""
    className="w-[400px] mt-8 lg:mt-0 relative z-10"
  />

  {/* MONTAÑAS DECORATIVAS */}

  <svg
    className="absolute bottom-0 left-0 w-full h-28"
    viewBox="0 0 1440 320"
    preserveAspectRatio="none"
  >
    <path
      fill={isDark ? "#2f3142" : "#e2e8f0"}
      d="
        M0,220
        L120,180
        L240,240
        L360,150
        L480,210
        L600,120
        L720,200
        L840,140
        L960,230
        L1080,160
        L1200,210
        L1320,170
        L1440,220
        L1440,320
        L0,320
        Z
      "
    />
  </svg>

</motion.div>{/* ===========================
      LOADING
=========================== */}

{loading && (

  <div
    className="
      flex
      justify-center
      items-center
      h-60
    "
  >

    <motion.div

      animate={{
        rotate: 360
      }}

      transition={{
        repeat: Infinity,
        duration: 1,
        ease: "linear"
      }}

      className="
        w-12
        h-12
        rounded-full
        border-4
        border-red-500
        border-t-transparent
      "
    />

  </div>

)}

{/* ===========================
      SIN CAMPAÑAS
=========================== */}

{!loading && campanas.length === 0 && (

  <div

    className={`
      rounded-xl
      p-10
      text-center

      ${isDark
        ? "bg-[#272833] text-gray-300"
        : "bg-white text-gray-600"
      }

    `}
  >

    No hay campañas disponibles.

  </div>

)}

{/* ===========================
      CAMPAÑAS (COMPACTO)
=========================== */}

{

  !loading &&

  campanas.map((camp, index) => (

    <motion.div

      key={camp.IdCamp}

      {...sectionAnimation(index)}

      className="mb-6"

    >

      <h2

        className={`
          text-lg
          font-bold
          mb-4

          ${isDark
            ? "text-white"
            : "text-gray-800"
          }

        `}

      >

        {camp.Campana}

      </h2>

      <div

        className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-4
        "

      >

        {/* =====================
              LEADS
        ===================== */}

        <motion.div

          {...cardAnimation}

          className={`
            rounded-xl
            p-4
            border-l-4
            shadow-sm
            flex
            items-center
            justify-between

            ${isDark
              ? "bg-[#272833] border-red-500"
              : "bg-white border-red-500"
            }

          `}

        >

          <div>

            <p

              className={`
                text-sm
                font-medium

                ${isDark
                  ? "text-red-300"
                  : "text-red-600"
                }

              `}

            >

              Leads Totales

            </p>

            <h1

              className={`
                text-3xl
                font-bold
                mt-2

                ${isDark
                  ? "text-white"
                  : "text-gray-800"
                }

              `}

            >

              {formatNumber(camp.leads)}

            </h1>

          </div>

          <div className="flex items-center gap-4">

            <button
              onClick={() => navigate(`/monitor?camp=${camp.IdCamp}`)}
              className={`
                transition
                hover:scale-110

                ${isDark
                  ? "text-red-400 hover:text-red-300"
                  : "text-red-600/70 hover:text-red-700"
                }
              `}
            >
              <FaEye size={22} />
            </button>

            <FaPhoneVolume
              size={42}
              className={`
                opacity-40

                ${isDark
                  ? "text-green-400"
                  : "text-green-500"
                }
              `}
            />

          </div>

        </motion.div>

        {/* =====================
            AGENTES
        ===================== */}

        <motion.div

          {...cardAnimation}

          className={`
            rounded-xl
            p-4
            border-l-4
            shadow-sm

            ${isDark
              ? "bg-[#272833] border-purple-600"
              : "bg-white border-purple-500"
            }

          `}

        >

          <p

            className={`
              text-sm
              font-medium
              mb-4

              ${isDark
                ? "text-purple-300"
                : "text-purple-600"
              }

            `}

          >

            Agentes Conectados

          </p>

          <div className="space-y-3">

            {/* FULL */}

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2">

                <FaUserTie
                  size={20}
                  className="text-green-500"
                />

                <span
                  className="text-sm"
                >
                  Full
                </span>

              </div>

              <div className="flex items-center gap-3">

                <button
                  onClick={() =>
                    navigate(`/control-supervisor?camp=${camp.IdCamp}`)
                  }
                  className={`
                    transition
                    hover:scale-110

                    ${isDark
                      ? "text-purple-400 hover:text-purple-300"
                      : "text-purple-600/70 hover:text-purple-700"
                    }
                  `}
                >
                  <FaEye size={20} />
                </button>

                <span
                  className="text-2xl font-bold"
                >
                  {camp.agentes_conectados.full}
                </span>

              </div>

            </div>

            {/* PART */}

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2">

                <FaUserClock
                  size={20}
                  className="text-yellow-500"
                />

                <span
                  className="text-sm"
                >
                  Part
                </span>

              </div>

              <span
                className="text-2xl font-bold"
              >
                {camp.agentes_conectados.partial}
              </span>

            </div>

          </div>

        </motion.div>
      </div>

    </motion.div>

  ))

}
</div>

);}