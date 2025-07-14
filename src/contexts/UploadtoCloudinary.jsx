import axios from 'axios';

export const uploadToCloudinary = async (file, onProgress) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "messager_avatar"); 

  try {
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/dl2lnn4dc/image/upload`,
      formData,
      {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        withCredentials: false,
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          }
        }
      }
    );

    return res.data.secure_url;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};