// src/context/ThemeProvider.jsx
import { createContext, useState, useEffect } from 'react'

export const ThemeContext = createContext()

export const THEMES = {
  dark: {
    name: 'dark',
    label: 'Mode Gelap',
    bg: 'bg-[#080C14]',
    surface: 'bg-[#0C1120]',
    border: 'border-white/[0.06]',
    text: 'text-slate-100',
    textSecondary: 'text-slate-400',
    input: 'bg-[#0F1829] border-white/[0.08]',
  },
  light: {
    name: 'light',
    label: 'Mode Terang',
    bg: 'bg-slate-50',
    surface: 'bg-white',
    border: 'border-slate-200',
    text: 'text-slate-900',
    textSecondary: 'text-slate-600',
    input: 'bg-slate-100 border-slate-300',
  },
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved || 'dark'
  })

  useEffect(() => {
    localStorage.setItem('theme', theme)
    // Apply theme to document
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    
    // Apply background color
    const bodyClass = theme === 'dark' ? THEMES.dark.bg : THEMES.light.bg
    document.body.className = `${bodyClass} transition-colors duration-300`
  }, [theme])

  const toggleTheme = () => {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }

  const currentTheme = THEMES[theme]

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, toggleTheme, THEMES }}>
      {children}
    </ThemeContext.Provider>
  )
}
