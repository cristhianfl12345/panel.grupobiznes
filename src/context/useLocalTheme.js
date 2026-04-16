import { useEffect, useState } from 'react'

export function useLocalTheme(defaultTheme = 'light') {
  const [theme, setTheme] = useState(defaultTheme)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored) {
      setTheme(stored)
    }
  }, [])

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', next)
      return next
    })
  }

  return { theme, toggleTheme }
}
