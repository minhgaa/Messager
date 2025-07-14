import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { CameraIcon } from '@heroicons/react/24/outline'
import { uploadToCloudinary } from '../contexts/UploadtoCloudinary'

export default function AvatarUpload({ onUploadStart, onUpload, onUploadEnd }) {
  const [loading, setLoading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    setLoading(true)
    onUploadStart?.()

    try {
      const url = await uploadToCloudinary(file)
      onUpload?.(url) 
    } catch (err) {
      console.error("Upload error:", err)
    } finally {
      setLoading(false)
      onUploadEnd?.()
    }
  }, [onUploadStart, onUpload, onUploadEnd])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxSize: 5 * 1024 * 1024,
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