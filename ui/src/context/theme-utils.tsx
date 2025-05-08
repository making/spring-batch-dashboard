import { useContext } from 'react'
import { ThemeContext } from './ThemeContext'

// Custom hook to use theme context
export const useTheme = () => useContext(ThemeContext)
