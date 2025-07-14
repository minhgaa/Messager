import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import {
  PencilIcon,
  CameraIcon,
  KeyIcon,
  BellIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { useTheme } from '../contexts/ThemeContext'
import EditProfileModal from '../components/EditProfileModal'


const menuItems = [
  {
    icon: PencilIcon,
    title: 'Edit Profile',
    description: 'Change your profile information'
  },
  {
    icon: KeyIcon,
    title: 'Password',
    description: 'Manage your password'
  },
  {
    icon: BellIcon,
    title: 'Notifications',
    description: 'Customize notification settings'
  }
]

export default function Profile() {
  const { user, logout } = useAuth()
  const { darkMode, toggleDarkMode } = useTheme()
  const [isHovered, setIsHovered] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAvatarLoading, setIsAvatarLoading] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-3xl mx-auto space-y-6"
      >
        {/* Profile Header */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
        >
          <div className="relative h-32 bg-gradient-to-r from-primary-500 to-primary-600">
            <button className="absolute bottom-2 right-2 p-2 rounded-full bg-black/30 text-white hover:bg-black/40 transition-colors">
              <CameraIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="px-6 py-4">
            <div className="flex items-center">
              <div className="relative -mt-16">
                <div className="relative">
                  <img
                    src={user?.avatarURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                    alt={user?.name}
                    className={`w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 transition-opacity ${
                      isAvatarLoading ? 'opacity-50' : 'opacity-100'
                    }`}
                  />
                </div>
              </div>
              <div className="ml-6 flex flex-col items-start">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.name || 'Your Name'}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email || 'your.email@example.com'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Settings Menu */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700"
        >
          {menuItems.map((item, index) => (
            <motion.button
              key={item.title}
              className="w-full px-6 py-4 flex items-center space-x-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              onHoverStart={() => setIsHovered(index)}
              onHoverEnd={() => setIsHovered(null)}
              whileHover={{ x: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={() => {
                if (item.title === 'Edit Profile') {
                  setIsEditModalOpen(true)
                }
              }}
            >
              <div className="flex-shrink-0">
                <item.icon 
                  className={`w-6 h-6 ${isHovered === index ? 'text-primary-500' : 'text-gray-400 dark:text-gray-500'}`}
                />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Preferences */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700"
        >
          <button
            onClick={toggleDarkMode}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <MoonIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />
              <div className="text-left">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Dark Mode
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Toggle dark mode theme
                </p>
              </div>
            </div>
            <div className={`w-11 h-6 flex items-center rounded-full p-1 ${darkMode ? 'bg-primary-500' : 'bg-gray-300'}`}>
              <motion.div
                className="w-4 h-4 rounded-full bg-white"
                animate={{ x: darkMode ? 20 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            </div>
          </button>

          <button
            onClick={logout}
            className="w-full px-6 py-4 flex items-center space-x-4 text-red-600 dark:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-6 h-6" />
            <div className="text-left">
              <h3 className="text-sm font-medium">Sign Out</h3>
              <p className="text-sm opacity-75">
                Log out of your account
              </p>
            </div>
          </button>
        </motion.div>

        {/* Edit Profile Modal */}
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      </motion.div>
    </div>
  )
} 