import React, { createContext, useContext, useEffect, useState } from 'react'

// Define theme context type
type ThemeContextType = {
  isDarkMode: boolean
  toggleTheme: () => void
}

// Create context with default values
export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => { /* Default implementation */ }
})

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get initial theme from localStorage or system preference
  const getInitialTheme = (): boolean => {
    // Check localStorage
    const savedTheme = localStorage.getItem('darkMode')
    if (savedTheme) {
      return savedTheme === 'true'
    }
    
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  
  // Initialize theme after component mounts (to avoid SSR issues)
  useEffect(() => {
    setIsDarkMode(getInitialTheme())
  }, [])
  
  // Update document classes when theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    // Save to localStorage
    localStorage.setItem('darkMode', isDarkMode.toString())
  }, [isDarkMode])
  
  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev)
  }
  
  // Context value
  const value = {
    isDarkMode,
    toggleTheme
  }
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
