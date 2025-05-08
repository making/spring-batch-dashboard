import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

interface MainLayoutProps {
  children: React.ReactNode
}

// Navigation item definition
interface NavItem {
  name: string
  path: string
  exact?: boolean
}

// Navigation items for the sidebar
const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/', exact: true },
  { name: 'Job Instances', path: '/job-instances' },
  { name: 'Job Executions', path: '/job-executions' },
  { name: 'Statistics', path: '/statistics' }
]

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation()
  const { isDarkMode, toggleTheme } = useTheme()

  // Check if a path is active
  const isActivePath = (path: string, exact: boolean = false): boolean => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-md">
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-semibold text-primary-600 dark:text-primary-400">
              Spring Batch Dashboard
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="px-4 mt-6">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-2 text-sm rounded-md 
                    ${
                      isActivePath(item.path, item.exact)
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={toggleTheme}
            className="flex items-center justify-center w-full py-2 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex items-center px-6">
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
            {navItems.find(item => isActivePath(item.path, item.exact))?.name || 'Spring Batch Dashboard'}
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
