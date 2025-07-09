import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { ChatBubbleLeftIcon, UserGroupIcon, UserCircleIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

export default function Layout() {
  const { user, logout } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()

  return (
    <div className="flex h-screen w-full bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <motion.nav
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        className="flex flex-col  w-20 bg-white dark:bg-gray-800 shadow-lg border-r border dark:border-gray-700"
      >

        <div className="flex-1 flex flex-col items-center gap-4 py-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `p-2 rounded-lg transition-colors ${isActive
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <ChatBubbleLeftIcon className="w-6 h-6" />
          </NavLink>
          <NavLink
            to="/friends"
            className={({ isActive }) =>
              `p-2 rounded-lg transition-colors ${isActive
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <UserGroupIcon className="w-6 h-6" />
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `p-2 rounded-lg transition-colors ${isActive
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            <UserCircleIcon className="w-6 h-6" />
          </NavLink>
        </div>
        <div className="p-4 flex flex-col items-center">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
} 