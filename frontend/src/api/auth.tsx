import axios from 'axios';
import { getApiUrl } from '../utils/apiUrl';

export const register = async (userData: { email: string; password: string; username: string }) => {
  try {
    const response = await axios.post(getApiUrl('/auth/register'), userData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response.data.message || 
                           error.response.data.messages?.[0] || 
                           'Registration failed';
      
      // Directly throw the error message from the backend
      throw new Error(errorMessage);
    }
    
    // Generic error fallback
    console.error('Registration Error:', error);
    throw error;
  }
};