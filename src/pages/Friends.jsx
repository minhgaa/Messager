import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlusIcon, MagnifyingGlassIcon, ChatBubbleLeftIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import FriendList from '../components/Friends/FriendListComponent'
import {fetchFriendSuggestions, fetchFriends, fetchFriendRequests} from '../service/friendService'
import { set } from 'react-hook-form'
import { useAuth } from '../contexts/AuthContext' 

// const DUMMY_FRIENDS = [
//   {
//     id: '1',
//     name: 'John Doe',
//     email: 'john@example.com',
//     avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
//     online: true,
//     lastSeen: 'Active now'
//   },
//   {
//     id: '2',
//     name: 'Jane Smith',
//     email: 'jane@example.com',
//     avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
//     online: false,
//     lastSeen: '2 hours ago'
//   },
//   {
//     id: '3',
//     name: 'Alice Johnson',
//     email: 'alice@example.com',
//     avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
//     online: true,
//     lastSeen: 'Active now'
//   },
//   {
//     id: '4',
//     name: 'Bob Wilson',
//     email: 'bob@example.com',
//     avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
//     online: false,
//     lastSeen: '1 day ago'
//   }
// ]
// const DUMMY_ADDABLE_FRIENDS = [
//   {
//     id: '5',
//     name: 'Charlie Nguyen',
//     email: 'charlie@example.com',
//     avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie'
//   },
//   {
//     id: '6',
//     name: 'Emily Tran',
//     email: 'emily@example.com',
//     avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily'
//   }
// ]



export default function Friends() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [friends, setFriends] = useState([])
  const [friendRequests, setFriendRequests] = useState([])
  const [addableFriends, setAddableFriends] = useState([])
  const [selectedTab, setSelectedTab] = useState('all') // 'all' | 'online'
  const [isHovered, setIsHovered] = useState(null)
  const [mode, setMode] = useState('list') // 'list' | 'add'
  const [loading, setLoading] = useState(true)
  const [currentList]
  const filteredFriends = friends.filter(friend => {
    const matchesSearch = friend.name.toLowerCase().includes(search.toLowerCase()) || friend.email.toLowerCase().includes(search.toLowerCase())
    return selectedTab === 'online' ? matchesSearch && friend.online : matchesSearch
  })

  const loadFriends = async () => {
      try {
        const data = await fetchFriends(user.id)
        setFriends(data)
      } catch (err) {
        console.error('Error loading friends:', err)
      } finally {
        setLoading(false)
      }
    }

  const loadSuggestedFriends = async () => {
      try {
        const data = await fetchFriendSuggestions(user.id)
        setAddableFriends(data)
      } catch (err) {
        console.error('Error loading suggested friends:', err)
      } finally {
        setLoading(false)
      }
    }
  
  const loadFriendRequests = async () => {
      try {
        const data = await fetchFriendRequests(user.id)
        setFriendRequests(data)
      } catch (err) {
        console.error('Error loading friend requests:', err)
      } finally {
        setLoading(false)
      }
    }

  const onFriendRequestSent = () => {
    refreshData()
  }
  const refreshData = async () => {
      loadFriends()
      loadSuggestedFriends()
      loadFriendRequests()
  }
  const filteredAddableFriends = addableFriends.filter(friend =>
    friend.name.toLowerCase().includes(search.toLowerCase()) ||
    friend.email.toLowerCase().includes(search.toLowerCase())
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  }

  useEffect(() => {
    if (!user?.id) return;
    refreshData()
  }, [user])

  useEffect(() => {
    if (mode === 'list') {
      
    } else {
      loadSuggestedFriends()
    }
  }, [mode, selectedTab])

  if (loading) return <div>Loading...</div>
  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-3xl mx-auto space-y-6">
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {mode === 'list' ? 'Friends' : 'Add Friends'}
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMode(mode === 'list' ? 'add' : 'list')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900"
              >
                {mode === 'list' ? (
                  <>
                    <UserPlusIcon className="w-5 h-5 mr-2" />
                    Add Friend
                  </>
                ) : (
                  <>
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back to Friends
                  </>
                )}
              </motion.button>
            </div>

            {/* Search */}
            <div className="mt-6 space-y-4">
              {mode === 'list' && (
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setSelectedTab('all')}
                      className={`${selectedTab === 'all'
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'
                      } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                      All Friends
                    </button>
                    <button
                      onClick={() => setSelectedTab('online')}
                      className={`${selectedTab === 'online'
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'
                      } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                      Online
                    </button>
                    <button
                      onClick={() => setSelectedTab('requests')}
                      className={`${selectedTab === 'requests'
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700'
                      } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                      Requests
                    </button>
                  </nav>
                </div>
              )}

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

          {/* Friend or Addable List */}
          <div className="border-t border-gray-200 dark:border-gray-700">
            <AnimatePresence>
              {(mode === 'list' ? filteredFriends : filteredAddableFriends).length > 0 ? (
                <FriendList
                  friendIds={(mode === 'list' ? filteredFriends : filteredAddableFriends).map(f => f.id)}
                  allFriends={mode === 'list' ? friends : addableFriends}
                  mode={mode}
                  onFriendRequestSent={onFriendRequestSent}
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-6 py-8 text-center"
                >
                  <p className="text-gray-500 dark:text-gray-400">
                    No {mode === 'list' ? 'friends' : 'users to add'} found
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
