import axios from 'axios'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
 

export const fetchFriendSuggestions = async (userId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/Friend/suggestions`,
      {
        params: { userId },
        withCredentials: true
      }
    )
    return response.data
  } catch (error) {
    console.error("Failed to fetch suggestions:", error)
    return []
  }
}


export const fetchFriends = async (userId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/Friend/list`,
      {
        params: { userIdGuid: userId },
        withCredentials: true
      }
    )
    return response.data
  } catch (error) {
    console.error('Failed to fetch friends:', error)
    throw error
  }
}


export const sendFriendRequest = async (senderId, receiverId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/Friend/add-request`, {
      senderId,
      receiverId
    })
    return response.data
  } catch (error) {
    throw error.response?.data || 'Gửi lời mời kết bạn thất bại.'
  }
}

export const fetchFriendRequests = async (receiverId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/Friend/requests`, {
      receiverId
    })
    return response.data
  } catch (error) {
    throw error.response?.data || 'Gửi lời mời kết bạn thất bại.'
  }
}