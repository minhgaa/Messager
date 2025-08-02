// FriendList.jsx
import { motion } from 'framer-motion'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { sendFriendRequest } from '../../service/friendService'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast';

export default function FriendList({ friendIds, allFriends, mode, onFriendRequestSent }) {
  const [isHovered, setIsHovered] = useState(null)
  const { user } = useAuth()
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  }

  const fetchSendFriendRequest = async (currentUserId, friendId) => {
    try {
      await sendFriendRequest(currentUserId, friendId)
      toast.success('Send add friend request successfully!')
      onFriendRequestSent()
    } catch (err) {
      toast.error(err)
    }
  }
  
  const selectedFriends = allFriends.filter(friend => friendIds.includes(friend.id))

  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
      {selectedFriends.map((friend, index) => (
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
              {mode === 'list' && friend.online && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"
                />
              )}
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{friend.name}</p>
                {mode === 'list' && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">{friend.lastSeen}</p>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{friend.email}</p>
            </div>
            {mode === 'list' ? (
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
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fetchSendFriendRequest(user.id, friend.id)}
                className="ml-4 px-3 py-1 text-sm font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                Add
              </motion.button>
            )}
          </div>
        </motion.li>
      ))}
    </ul>
  )
}
