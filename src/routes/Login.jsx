import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Lightbulb, LightbulbOff } from "lucide-react"

export default function Login() {

  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const [isDark, setIsDark] = useState(
    localStorage.getItem("theme") === "dark"
  )

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light")
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  // 🔐 LOGIN REAL
  const handleLogin = async (e) => {
    e.preventDefault()

    setError("")
    setLoading(true)

    try {

      const res = await fetch("http://192.168.9.115:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: user,
          password: pass,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Error al iniciar sesión")
      }

      // 💾 guardar sesión
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.setItem("id_tipo_usuario", data.user.id_tipo_usuario);

      // 🚀 redirigir
      navigate("/home")

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (

    <div
      className="min-h-screen flex items-center justify-center bg-center bg-cover transition-all duration-700"
      style={{
        backgroundImage: isDark
          ? "url('/fondoN.png')"
          : "url('/fondo.png')"
      }}
    >

      {/* BOTON DARKMODE */}

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className={`
        absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-md
        ${isDark
            ? "bg-[#1F2029]/80 text-white"
            : "bg-white/80 text-gray-700"}
        `}
      >

        <AnimatePresence mode="wait">

          {isDark ? (

            <motion.div
              key="dark"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2"
            >
              <LightbulbOff size={18}/>
              
            </motion.div>

          ) : (

            <motion.div
              key="light"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2"
            >
              <Lightbulb size={18}/>
             
            </motion.div>

          )}

        </AnimatePresence>

      </motion.button>

      {/* CARD */}

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`
        w-[820px] rounded-xl shadow-2xl flex overflow-hidden backdrop-blur-xl
        ${isDark ? "bg-[#1F1F26]/90" : "bg-white"}
        `}
      >

        {/* PANEL IZQUIERDO */}

        <div
          className={`
          w-1/2 flex items-center justify-center p-10 transition-colors
          ${isDark ? "bg-[#06172E]" : "bg-[#0b223f]"}
          `}
        >

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center text-white"
          >

            <img
              src="/logo.png"
              alt="Wireless Logo"
              className="w-56 mx-auto"
            />

          </motion.div>

        </div>

        {/* FORMULARIO */}

        <div className="w-1/2 p-10 flex flex-col justify-center">

          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`
            text-xl mb-6 text-center
            ${isDark ? "text-gray-200" : "text-gray-700"}
            `}
          >
            ¡Bienvenido de nuevo!
          </motion.h2>

          <form
            onSubmit={handleLogin}
            className="space-y-4"
          >

            {/* USUARIO */}

            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              placeholder="Usuario"
              value={user}
              onChange={(e)=>setUser(e.target.value)}
              className={`
              w-full rounded-full px-4 py-3 outline-none transition
              ${isDark
                ? "bg-[#1F2029] text-white border border-[#3a3b47]"
                : "bg-gray-200"}
              `}
            />

            {/* PASSWORD */}

            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="password"
              placeholder="Contraseña"
              value={pass}
              onChange={(e)=>setPass(e.target.value)}
              className={`
              w-full rounded-full px-4 py-3 outline-none transition
              ${isDark
                ? "bg-[#1F2029] text-white border border-[#3a3b47]"
                : "bg-gray-200"}
              `}
            />

            {/* RECORDAR */}

            <div className={`flex items-center gap-2 text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>

              <input type="checkbox" className="cursor-pointer"/>

              <label>Recuérdame</label>

            </div>

            {/* ERROR */}

            {error && (
              <motion.p
                initial={{ opacity:0 }}
                animate={{ opacity:1 }}
                className="text-red-500 text-sm"
              >
                {error}
              </motion.p>
            )}

            {/* BOTON LOGIN */}

            <motion.button
              whileHover={{ scale:1.03 }}
              whileTap={{ scale:0.97 }}
              type="submit"
              disabled={loading}
              className={`
              w-full py-3 rounded-full transition font-semibold cursor-pointer
              ${isDark
                ? "bg-[#4A0909] hover:bg-[#5c0c0c] text-white"
                : "bg-red-600 hover:bg-red-700 text-white"}
              `}
            >
              {loading ? "Ingresando..." : "Login"}
            </motion.button>

          </form>

        </div>

      </motion.div>

    </div>

  )
}