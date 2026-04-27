'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type ThemeContextType = {
  theme: string
  font: string
  isDark: boolean
  setTheme: (theme: string) => void
  setFont: (font: string) => void
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState('')
  const [font, setFontState] = useState('')
  const [isDark, setIsDarkState] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Carregar preferências salvas ao montar
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || ''
    const savedFont = localStorage.getItem('font') || ''
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(savedTheme)
    setFontState(savedFont)
    setIsDarkState(savedDarkMode || prefersDark)
    setMounted(true)
  }, [])

  // Aplicar tema ao elemento root - EFEITO PRINCIPAL
  useEffect(() => {
    const html = document.documentElement
    
    // Remover apenas temas antigos (preservar variáveis de font)
    const classesAtuais = html.className.split(' ')
    const filteredClasses = classesAtuais.filter(
      cls => !cls.startsWith('theme-') && cls !== 'dark'
    )
    
    // Se houve mudança, atualizar
    if (filteredClasses.length !== classesAtuais.length) {
      html.className = filteredClasses.join(' ')
    }

    // Adicionar novo tema
    if (theme) {
      html.classList.add(theme)
    }

    // Adicionar classe dark
    if (isDark) {
      html.classList.add('dark')
    }
  }, [theme, isDark])

  // Aplicar fonte
  useEffect(() => {
    if (!mounted) return

    const html = document.documentElement
    
    // Remover classes de fonte antigas (mas preservar variáveis como familjen-variable, etc)
    const currentClasses = html.className.split(' ')
    const filteredClasses = currentClasses.filter(
      cls => !cls.match(/^font-(inter|montserrat|open-sans|familjen)$/)
    )

    html.className = filteredClasses.join(' ')

    // Adicionar nova fonte
    if (font) {
      html.classList.add(font)
    }
  }, [font, mounted])

  const setTheme = (newTheme: string) => {
    console.log('👤 setTheme chamado com:', newTheme)
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const setFont = (newFont: string) => {
    console.log('👤 setFont chamado com:', newFont)
    setFontState(newFont)
    localStorage.setItem('font', newFont)
  }

  const toggleDarkMode = () => {
    const newDarkMode = !isDark
    console.log('👤 toggleDarkMode chamado, novo valor:', newDarkMode)
    setIsDarkState(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
  }

  // SEMPRE retornar com o Provider, mesmo antes de montar
  return (
    <ThemeContext.Provider value={{ theme, font, isDark, setTheme, setFont, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider')
  }
  return context
}

