"use client"

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useAnimationFrame
} from "framer-motion"

import { useLocalTheme } from "../context/useLocalTheme"
import { useEffect, useState, useRef } from "react"

// Sub-componente para que el número cambie sin re-renderizar todo el Loader
function AnimatedNumber({ value, isDark }) {
  const ref = useRef(null);

  useAnimationFrame(() => {
    if (ref.current) {
      ref.current.textContent = `${Math.round(value.get())}%`;
    }
  });

  return (
    <span 
      ref={ref} 
      className={`text-lg font-semibold tracking-wide translate-y-[6px] ${
        isDark ? "text-white" : "text-gray-900"
      }`}
    />
  );
}

export default function Loader({ show = true }) {
  const { theme } = useLocalTheme()
  const isDark = theme === "dark"

  const [visible, setVisible] = useState(show)
  const [startTime, setStartTime] = useState(null)

  // Valor de movimiento base
  const motionProgress = useMotionValue(0)

  // Configuración de muelle más fluida: menos masa, stiffness equilibrado
const smoothProgress = useSpring(motionProgress, {
  stiffness: 45,
  damping: 18,
  mass: 0.35,
  restDelta: 0.001
})

  const size = 180
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  const strokeDashoffset = useTransform(
    smoothProgress,
    (v) => circumference - (v / 100) * circumference
  )

  const spinnerColor = isDark ? "#D11F1F" : "#6E1F1F"

  useEffect(() => {
    let interval

    if (show) {
      setVisible(true)
      setStartTime(Date.now())
      motionProgress.set(0)

      // Intervalo más corto para actualizaciones más granulares
      interval = setInterval(() => {
        const currentPos = motionProgress.get()
        if (currentPos < 95) {
          const next = currentPos + Math.random() * 4
          motionProgress.set(Math.min(next, 95))
        }
      }, 50) 

    } else {
      motionProgress.set(100)

      const elapsed = Date.now() - (startTime || 0)
      const remaining = Math.max(800 - elapsed, 0) // Un poco más rápido al finalizar

      const timer = setTimeout(() => {
        setVisible(false)
        motionProgress.set(0)
      }, remaining)

      return () => clearTimeout(timer)
    }

    return () => clearInterval(interval)
  }, [show, motionProgress])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className={`
            fixed inset-0 z-[9999]
            flex items-center justify-center
            backdrop-blur-xl
            ${isDark ? "bg-black/90" : "bg-white/90"}
          `}
        >
          <div className="flex flex-col items-center gap-6">
            <div className="relative flex items-center justify-center">
              
              {/* Glow ambiental */}
              <motion.div
                className="absolute w-[200px] h-[200px] rounded-full blur-3xl"
                style={{ backgroundColor: spinnerColor + "33" }}
                animate={{ 
                  scale: [1, 1.15, 1],
                  opacity: [0.5, 0.8, 0.5] 
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut"
                }}
              />

              {/* Progress circle */}
              <svg
                width={size}
                height={size}
                className="absolute -rotate-90"
              >
                <circle
                  stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}
                  fill="transparent"
                  strokeWidth={strokeWidth}
                  r={radius}
                  cx={size / 2}
                  cy={size / 2}
                />

                <motion.circle
                  stroke={spinnerColor}
                  fill="transparent"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  r={radius}
                  cx={size / 2}
                  cy={size / 2}
                  strokeDasharray={circumference}
                  style={{
                    strokeDashoffset
                  }}
                />
              </svg>

              {/* Logo con pulsación suave */}
              <motion.img
                src="/biznesss.png"
                alt="Bizness Loader"
                className="w-28 h-28 object-contain select-none z-10"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                draggable={false}
              />
            </div>

            {/* Porcentaje animado por frame */}
            <AnimatedNumber value={smoothProgress} isDark={isDark} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}