import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import {
  XMarkIcon,
  UserIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import AvatarUpload from '../components/AvatarUpload'

const tabs = [
  { id: 'profile', label: 'Profile Info', icon: UserIcon },
  { id: 'password', label: 'Password', icon: KeyIcon }
]

export default function EditProfileModal({ isOpen, onClose }) {
  const { user, updateProfile, changePassword } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [isAvatarLoading, setIsAvatarLoading] = useState(false)

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    username: user?.userName || '',
    avatarURL: user?.avatarURL || '',
  })

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const success = await updateProfile(profileForm)
      if (success) {
        onClose()
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    setLoading(true)
    try {
      const success = await changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      )
      if (success) {
        onClose()
      }
    } finally {
      setLoading(false)
    }
  }

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative border-b dark:border-gray-700">
          <div className="flex justify-center p-4">
            <div className="flex space-x-4 p-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors relative ${activeTab === tab.id
                    ? 'text-white'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary-500 rounded-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative flex items-center space-x-2">
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' ? (
              <motion.form
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleProfileSubmit}
                className="space-y-4"
              >
                <div className="flex justify-center items-center">
                  <div className="relative">
                    <img
                      src={
                        profileForm.avatarURL ||
                        user?.avatar ||
                        'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
                      }
                      alt={user?.name}
                      className={`w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 transition-opacity ${isAvatarLoading ? 'opacity-50' : 'opacity-100'
                        }`}
                    />
                    <div className="absolute bottom-0 right-0">
                      <AvatarUpload
                        onUploadStart={() => setIsAvatarLoading(true)}
                        onUpload={(url) => setProfileForm(prev => ({ ...prev, avatarURL: url }))}
                        onUploadEnd={() => setIsAvatarLoading(false)}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className=" text-left block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-left block text-sm font-medium text-gray-700 dark:text-gray-300">
                    UserName
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center space-x-1 pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-400">@</span>
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={profileForm.username}
                      onChange={handleProfileChange}
                      className="block w-full pl-14 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>


                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="password"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handlePasswordSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="text-left block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Current Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword.current ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword.current ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-left block text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword.new ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword.new ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className=" text-left block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm New Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword.confirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword.confirm ? (
                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
} 