import { useEffect, useState } from "react";

export default function Home() {

  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {

    const handleStorage = () => {
      const theme = localStorage.getItem("theme") === "dark";
      setIsDark(theme);
      window.location.reload(); // recarga al cambiar modo
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };

  }, []);
  const [user, setUser] = useState(null);
  useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
}, []);
const fullName = user
  ? `${user.nombres} ${user.apellidos}`
  : "";
  return (

    <div
      className={`
      min-h-screen p-6 transition-colors duration-500
      ${isDark ? "bg-[#1F2029]" : "bg-gray-100"}
      `}
    >

      {/* Banner */}

      <div
        className={`
        rounded-xl shadow-sm p-6 flex flex-col lg:flex-row items-center justify-between mb-8 transition-colors
        ${isDark ? "bg-[#272833]" : "bg-white"}
        `}
      >

        {/* Texto */}

        <div className="max-w-xl">

<h2
  className={`
    text-xl font-semibold mb-2
    ${isDark ? "text-[#ff6b6b]" : "text-red-600"}
  `}
>
  ¡Bienvenido&nbsp;
  {fullName || "Cargando..."}
  , su panel de control esta listo!
</h2>

          <p
            className={`
            ${isDark ? "text-gray-300" : "text-gray-600"}
            `}
          >
            En el podra visualizar los indicadores de gestion mas relevantes de la actividad
            ejecutada contribuyendo a la toma de decisiones de la plataforma a cargo.
          </p>

        </div>

        {/* Imagen */}

        <div className="mt-6 lg:mt-0">

          <img
            src="/stadistics.svg"
            alt="dashboard"
            className="w-[420px]"
          />

        </div>

      </div>

      {/* SECCION 1 */}

      <div className="mb-8">

        <h3
          className={`
          font-semibold mb-4
          ${isDark ? "text-gray-200" : "text-gray-700"}
          `}
        >
          campaña x
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div
            className={`
            rounded-xl shadow-sm p-5 border-l-4 transition-colors
            ${isDark
                ? "bg-[#272833] border-[#FF0000]"
                : "bg-white border-red-500"}
            `}
          >
            <p className={`${isDark ? "text-red-400" : "text-red-600"} font-medium`}>
              Leads total
            </p>

            <h2 className="text-2xl font-bold mt-2">0</h2>
          </div>

          <div
            className={`
            rounded-xl shadow-sm p-5 border-l-4 transition-colors
            ${isDark
                ? "bg-[#272833] border-purple-800"
                : "bg-white border-purple-500"}
            `}
          >
            <p className={`${isDark ? "text-purple-300" : "text-purple-600"} font-medium`}>
              Agentes conectados
            </p>

            <div className="flex items-center justify-between mt-2">
              <h2 className="text-2xl font-bold">0</h2>
              <span className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
                0 %
              </span>
            </div>

          </div>

         

        </div>

      </div>

      {/* SECCION 2 */}

      <div className="mb-8">

        <h3
          className={`
          font-semibold mb-4
          ${isDark ? "text-gray-200" : "text-gray-700"}
          `}
        >
          campaña x
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div
            className={`
            rounded-xl shadow-sm p-5 border-l-4 transition-colors
            ${isDark
                ? "bg-[#272833] border-[#FF0000]"
                : "bg-white border-red-500"}
            `}
          >
            <p className={`${isDark ? "text-red-400" : "text-red-600"} font-medium`}>
              leads total
            </p>

            <h2 className="text-2xl font-bold mt-2">0</h2>

          </div>

          <div
            className={`
            rounded-xl shadow-sm p-5 border-l-4 transition-colors
            ${isDark
                ? "bg-[#272833] border-purple-800"
                : "bg-white border-purple-500"}
            `}
          >
            <p className={`${isDark ? "text-purple-300" : "text-purple-600"} font-medium`}>
              Agentes conectados
            </p>

            <div className="flex items-center justify-between mt-2">
              <h2 className="text-2xl font-bold">0</h2>
              <span className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
                0 %
              </span>
            </div>

          </div>

          

        </div>

      </div>

      {/* SECCION 3 */}

      <div>

        <h3
          className={`
          font-semibold mb-4
          ${isDark ? "text-gray-200" : "text-gray-700"}
          `}
        >
          campaña x
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div
            className={`
            rounded-xl shadow-sm p-5 border-l-4 transition-colors
            ${isDark
                ? "bg-[#272833] border-[#FF0000]"
                : "bg-white border-red-500"}
            `}
          >
            <p className={`${isDark ? "text-red-400" : "text-red-600"} font-medium`}>
              leads total
            </p>

            <h2 className="text-2xl font-bold mt-2">0</h2>

          </div>

          <div
            className={`
            rounded-xl shadow-sm p-5 border-l-4 transition-colors
            ${isDark
                ? "bg-[#272833] border-purple-800"
                : "bg-white border-purple-500"}
            `}
          >
            <p className={`${isDark ? "text-purple-300" : "text-purple-600"} font-medium`}>
              Agentes conectados
            </p>

            <div className="flex items-center justify-between mt-2">
              <h2 className="text-2xl font-bold">0</h2>
              <span className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
                0 %
              </span>
            </div>

          </div>

          
        </div>

      </div>

    </div>

  );
}