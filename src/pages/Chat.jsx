import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import {
  PaperAirplaneIcon,
  PlusCircleIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  PhoneIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  PhotoIcon,
  DocumentIcon,
  LinkIcon,
  PaperClipIcon,
  ArrowDownTrayIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'

// Dummy data for demonstration
const DUMMY_ONLINE_FRIENDS = [
  {
    id: '3',
    name: 'Alice Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
  },
  {
    id: '4',
    name: 'Bob Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
  },
  {
    id: '5',
    name: 'Carol Brown',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol',
  },
]

const DUMMY_CHATS = [
  {
    id: '1',
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    timestamp: '2:30 PM',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    online: true,
  },
  {
    id: '2',
    name: 'Jane Smith',
    lastMessage: 'The meeting is at 3 PM',
    timestamp: '1:45 PM',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    online: false,
  },
]

const DUMMY_MESSAGES = [
  {
    id: '1',
    type: 'text',
    text: 'Hey, how are you?',
    sender: '1',
    timestamp: '2:30 PM',
    status: 'read',
  },
  {
    id: '2',
    type: 'text',
    text: 'I\'m good, thanks! How about you?',
    sender: 'current',
    timestamp: '2:31 PM',
    status: 'read',
  },
  {
    id: '3',
    type: 'image',
    url: 'https://picsum.photos/800/600',
    sender: '1',
    timestamp: '2:32 PM',
    status: 'read',
    metadata: {
      name: 'image.jpg',
      size: '1.2 MB',
      dimensions: '800x600'
    }
  },
  {
    id: '4',
    type: 'file',
    url: '#',
    sender: 'current',
    timestamp: '2:33 PM',
    status: 'read',
    metadata: {
      name: 'document.pdf',
      size: '2.5 MB',
      type: 'application/pdf'
    }
  }
]

const DUMMY_SHARED_FILES = {
  images: [
    { id: 1, url: 'https://picsum.photos/200/300', name: 'Image 1.jpg', date: '2024-03-15' },
    { id: 2, url: 'https://picsum.photos/200/301', name: 'Image 2.jpg', date: '2024-03-14' },
    { id: 3, url: 'https://picsum.photos/200/302', name: 'Image 3.jpg', date: '2024-03-13' },
  ],
  files: [
    { id: 1, name: 'Document.pdf', size: '2.5 MB', date: '2024-03-15' },
    { id: 2, name: 'Presentation.pptx', size: '5.1 MB', date: '2024-03-14' },
    { id: 3, name: 'Spreadsheet.xlsx', size: '1.8 MB', date: '2024-03-13' },
  ],
  links: [
    { id: 1, url: 'https://example.com', title: 'Example Website', date: '2024-03-15' },
    { id: 2, url: 'https://google.com', title: 'Google', date: '2024-03-14' },
  ]
}

export default function Chat() {
  const { id: chatId } = useParams()
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const [chats] = useState(DUMMY_CHATS)
  const [messages] = useState(DUMMY_MESSAGES)
  const [onlineFriends] = useState(DUMMY_ONLINE_FRIENDS)
  const [showChatInfo, setShowChatInfo] = useState(false)
  const [searchVisible, setSearchVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState('images')
  
  // File handling states
  const [attachments, setAttachments] = useState([])
  const [previewAttachment, setPreviewAttachment] = useState(null)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    handleFiles(files)
  }

  const handleFiles = (files) => {
    const newAttachments = files.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      type: file.type.startsWith('image/') ? 'image' : 
            file.type.startsWith('video/') ? 'video' : 'file',
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }))
    
    setAttachments(prev => [...prev, ...newAttachments])
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleRemoveAttachment = (id) => {
    setAttachments(prev => {
      const filtered = prev.filter(att => att.id !== id)
      // Cleanup URL objects
      const removed = prev.find(att => att.id === id)
      if (removed?.preview) URL.revokeObjectURL(removed.preview)
      return filtered
    })
  }

  const handlePreviewAttachment = (attachment) => {
    setPreviewAttachment(attachment)
  }

  const handleClosePreview = () => {
    setPreviewAttachment(null)
    setIsZoomed(false)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!message.trim() && attachments.length === 0) return
    
    // Here you would typically upload the files and get URLs
    // For demo, we'll just clear the attachments
    attachments.forEach(att => {
      if (att.preview) URL.revokeObjectURL(att.preview)
    })
    setAttachments([])
    setMessage('')
  }

  const selectedChat = chats.find((chat) => chat.id === chatId)

  const filteredMessages = searchQuery
    ? messages.filter(msg => 
        msg.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages

  const handleCall = (type) => {
    console.log(`Initiating ${type} call with ${selectedChat.name}`)
  }

  return (
    <div className="flex h-full w-full">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col"
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Active Now</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {onlineFriends.map((friend) => (
              <Link
                key={friend.id}
                to={`/chat/${friend.id}`}
                className="flex flex-col items-center gap-1 min-w-[4rem]"
              >
                <div className="relative">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-300 truncate w-full text-center">
                  {friend.name.split(' ')[0]}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {chats.map((chat) => (
            <Link
              key={chat.id}
              to={`/chat/${chat.id}`}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  chatId === chat.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="w-12 h-12 rounded-full"
                    />
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {chat.name}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {chat.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-colors">
            <PlusCircleIcon className="w-5 h-5" />
            <span>New Chat</span>
          </button>
        </div>
      </motion.div>

      {/* Chat Area */}
      {selectedChat ? (
        <div className="flex-1 flex">
          <div className="flex-1 flex flex-col h-full">
            {/* Chat header */}
            <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={selectedChat.avatar}
                      alt={selectedChat.name}
                      className="w-10 h-10 rounded-full"
                    />
                    {selectedChat.online && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                      {selectedChat.name}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedChat.online ? 'Active Now' : 'Offline'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setSearchVisible(!searchVisible)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <MagnifyingGlassIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleCall('voice')}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <PhoneIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleCall('video')}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <VideoCameraIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setShowChatInfo(!showChatInfo)}
                    className={`p-2 ${showChatInfo ? 'text-primary-500' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                  >
                    <InformationCircleIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <AnimatePresence>
                {searchVisible && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4"
                  >
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search in conversation..."
                        className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          <XMarkIcon className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              {filteredMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    msg.sender === 'current' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] ${
                      msg.sender === 'current'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    } rounded-lg px-4 py-2`}
                  >
                    {msg.type === 'text' && (
                      <p>{msg.text}</p>
                    )}

                    {msg.type === 'image' && (
                      <div className="space-y-2">
                        <div 
                          className="relative cursor-pointer group"
                          onClick={() => handlePreviewAttachment(msg)}
                        >
                          <img 
                            src={msg.url} 
                            alt={msg.metadata.name}
                            className="rounded-lg max-h-60 w-auto object-contain"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
                            <ArrowsPointingOutIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all" />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <DocumentIcon className="w-4 h-4" />
                          <span>{msg.metadata.name}</span>
                          <span>•</span>
                          <span>{msg.metadata.size}</span>
                        </div>
                      </div>
                    )}

                    {msg.type === 'file' && (
                      <div className="flex items-center gap-3">
                        <DocumentIcon className="w-8 h-8" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {msg.metadata.name}
                          </p>
                          <p className="text-xs opacity-75">
                            {msg.metadata.size}
                          </p>
                        </div>
                        <button 
                          className="p-1.5 hover:bg-black hover:bg-opacity-10 rounded-full transition-colors"
                          onClick={() => window.open(msg.url, '_blank')}
                        >
                          <ArrowDownTrayIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <div
                      className={`flex items-center gap-1 text-xs mt-1 ${
                        msg.sender === 'current'
                          ? 'text-primary-200'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {msg.sender === 'current' && (
                        <span>{msg.status === 'read' ? '✓✓' : '✓'}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Message input */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              {/* Attachment Preview */}
              <AnimatePresence>
                {attachments.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mb-4"
                  >
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {attachments.map((att) => (
                        <div
                          key={att.id}
                          className="relative group"
                        >
                          {att.type === 'image' ? (
                            <div 
                              className="w-20 h-20 rounded-lg overflow-hidden cursor-pointer"
                              onClick={() => handlePreviewAttachment(att)}
                            >
                              <img
                                src={att.preview}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-20 h-20 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                              <DocumentIcon className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                          <button
                            onClick={() => handleRemoveAttachment(att.id)}
                            className="absolute -top-2 -right-2 p-1 bg-gray-800 dark:bg-gray-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Drag & Drop Zone */}
              <AnimatePresence>
                {isDragging && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-0 bg-primary-500 bg-opacity-10 dark:bg-opacity-20 border-2 border-dashed border-primary-500 rounded-lg flex items-center justify-center z-10"
                  >
                    <div className="text-center">
                      <DocumentIcon className="w-12 h-12 text-primary-500 mx-auto mb-2" />
                      <p className="text-primary-600 dark:text-primary-400 font-medium">
                        Thả file để gửi
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <form 
                onSubmit={handleSendMessage} 
                className="relative flex items-center gap-2"
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  multiple
                  onChange={handleFileSelect}
                  accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                />
                
                <label
                  htmlFor="file-upload"
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
                >
                  <PaperClipIcon className="w-5 h-5" />
                </label>

                <button
                  type="submit"
                  disabled={!message.trim() && attachments.length === 0}
                  className="p-2 text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Preview Modal */}
            <AnimatePresence>
              {previewAttachment && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
                >
                  <div className="relative w-full max-w-4xl">
                    <div className="absolute top-0 right-0 flex items-center gap-2 p-4">
                      <button
                        onClick={() => setIsZoomed(!isZoomed)}
                        className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                      >
                        {isZoomed ? (
                          <ArrowsPointingInIcon className="w-5 h-5" />
                        ) : (
                          <ArrowsPointingOutIcon className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={handleClosePreview}
                        className="p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    </div>

                    {'preview' in previewAttachment ? (
                      <img
                        src={previewAttachment.preview}
                        alt=""
                        className={`max-h-[80vh] w-auto mx-auto ${
                          isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                        }`}
                        style={{
                          transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
                          transition: 'transform 0.2s'
                        }}
                      />
                    ) : (
                      <img
                        src={previewAttachment.url}
                        alt={previewAttachment.metadata?.name}
                        className={`max-h-[80vh] w-auto mx-auto ${
                          isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
                        }`}
                        style={{
                          transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
                          transition: 'transform 0.2s'
                        }}
                      />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Chat Information Sidebar */}
          <AnimatePresence>
            {showChatInfo && (
              <motion.div
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Chat Info
                    </h3>
                    <button
                      onClick={() => setShowChatInfo(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Profile Section */}
                  <div className="flex flex-col items-center mb-6">
                    <img
                      src={selectedChat.avatar}
                      alt={selectedChat.name}
                      className="w-20 h-20 rounded-full mb-2"
                    />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                      {selectedChat.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedChat.online ? 'Active Now' : 'Offline'}
                    </p>
                  </div>

                  {/* Shared Content Tabs */}
                  <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-4">
                      {[
                        { id: 'images', label: 'Images', icon: PhotoIcon },
                        { id: 'files', label: 'Files', icon: DocumentIcon },
                        { id: 'links', label: 'Links', icon: LinkIcon },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setSelectedTab(tab.id)}
                          className={`${
                            selectedTab === tab.id
                              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                          } flex items-center gap-1 whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                          <tab.icon className="w-4 h-4" />
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>

                {/* Shared Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedTab === 'images' && (
                    <div className="grid grid-cols-3 gap-2">
                      {DUMMY_SHARED_FILES.images.map((image) => (
                        <motion.div
                          key={image.id}
                          whileHover={{ scale: 1.05 }}
                          className="aspect-square rounded-lg overflow-hidden"
                        >
                          <img
                            src={image.url}
                            alt={image.name}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {selectedTab === 'files' && (
                    <div className="space-y-2">
                      {DUMMY_SHARED_FILES.files.map((file) => (
                        <motion.div
                          key={file.id}
                          whileHover={{ scale: 1.02 }}
                          className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <DocumentIcon className="w-8 h-8 text-gray-400" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {file.size} • {file.date}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {selectedTab === 'links' && (
                    <div className="space-y-2">
                      {DUMMY_SHARED_FILES.links.map((link) => (
                        <motion.a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.02 }}
                          className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <LinkIcon className="w-5 h-5 text-gray-400" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {link.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {link.date}
                              </p>
                            </div>
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-gray-800">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 mb-4 text-gray-400 dark:text-gray-500">
              <ChatBubbleLeftRightIcon />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              Your Messages
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Send private messages to a friend
            </p>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Send Message
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 