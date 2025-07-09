import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlusIcon, MagnifyingGlassIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'

// Dummy data for demonstration
const DUMMY_FRIENDS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    online: true,
    lastSeen: 'Active now'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    online: false,
    lastSeen: '2 hours ago'
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    online: true,
    lastSeen: 'Active now'
  },
  {
    id: '4',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    online: false,
    lastSeen: '1 day ago'
  }
]

export default function Friends() {
  const [search, setSearch] = useState('')
  const [friends] = useState(DUMMY_FRIENDS)
  const [selectedTab, setSelectedTab] = useState('all') // 'all' | 'online'
  const [isHovered, setIsHovered] = useState(null)

  const filteredFriends = friends.filter(friend => {
    const matchesSearch = 
      friend.name.toLowerCase().includes(search.toLowerCase()) ||
      friend.email.toLowerCase().includes(search.toLowerCase())
    
    if (selectedTab === 'online') {
      return matchesSearch && friend.online
    }
    return matchesSearch
  })

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
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Friends
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900"
              >
                <UserPlusIcon className="w-5 h-5 mr-2" />
                Add Friend
              </motion.button>
            </div>

            <div className="mt-6 space-y-4">
              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setSelectedTab('all')}
                    className={`${
                      selectedTab === 'all'
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'
                    } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                  >
                    All Friends
                  </button>
                  <button
                    onClick={() => setSelectedTab('online')}
                    className={`${
                      selectedTab === 'online'
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'
                    } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                  >
                    Online
                  </button>
                </nav>
              </div>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search friends..."
                  className="block w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Friend List */}
          <div className="border-t border-gray-200 dark:border-gray-700">
            <AnimatePresence>
              {filteredFriends.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredFriends.map((friend, index) => (
                    <motion.li
                      key={friend.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="relative"
                      onHoverStart={() => setIsHovered(index)}
                      onHoverEnd={() => setIsHovered(null)}
                    >
                      <div className="px-6 py-4 flex items-center">
                        <div className="relative flex-shrink-0">
                          <motion.img
                            whileHover={{ scale: 1.05 }}
                            src={friend.avatar}
                            alt={friend.name}
                            className="w-12 h-12 rounded-full"
                          />
                          {friend.online && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"
                            />
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {friend.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {friend.lastSeen}
                            </p>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {friend.email}
                          </p>
                        </div>
                        <motion.button
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ 
                            opacity: isHovered === index ? 1 : 0,
                            x: isHovered === index ? 0 : 10
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="ml-4 p-2 rounded-full text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                        >
                          <ChatBubbleLeftIcon className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-6 py-8 text-center"
                >
                  <p className="text-gray-500 dark:text-gray-400">
                    No friends found
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
} 