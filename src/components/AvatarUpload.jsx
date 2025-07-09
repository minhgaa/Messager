import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { CameraIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'

export default function AvatarUpload({ onUploadStart, onUploadEnd }) {
  const { updateAvatar } = useAuth()
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    setLoading(true)
    onUploadStart?.()

    try {
      await updateAvatar(file)
    } finally {
      setLoading(false)
      onUploadEnd?.()
    }
  }, [updateAvatar, onUploadStart, onUploadEnd])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false
  })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <button 
        type="button"
        disabled={loading}
        className={`p-1.5 rounded-full text-white transition-colors ${
          loading 
            ? 'bg-gray-400' 
            : isDragActive 
              ? 'bg-primary-600' 
              : 'bg-primary-500 hover:bg-primary-600'
        }`}
      >
        <CameraIcon className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
      </button>
    </div>
  )
} 