import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { getApiUrl } from './apiUrl';
import SecureStorage from './secureStorage';
import { authStore } from '../stores/AuthStore';

class ApiClient {
  private secureStorage = new SecureStorage('hiring-task-auth');
  private client = axios.create({
    baseURL: getApiUrl('/'),
  });

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
   

    // Add a request interceptor to add bearer token
    this.client.interceptors.request.use(
      config => {
        const token = this.secureStorage.getItem('token');

        if (token) {
          // Check if token already starts with 'Bearer ', if not, add it
          config.headers['Authorization'] = token.startsWith('Bearer ') 
            ? token.replace(/^Bearer\s*/, '') 
            : `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Add a response interceptor for global error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        console.error('API Response Error:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        });

        if (error.response && error.response.status === 401) {
          console.warn('Unauthorized Access Detected');
          
          // Logout user on 401 (Unauthorized) error
          authStore.logout();
          
          // Trigger navigation event for components to catch
          window.dispatchEvent(new Event('unauthorized'));
        }
        return Promise.reject(error);
      }
    );
  }

  get interceptors() {
    return this.client.interceptors;
  }

  get defaults() {
    return this.client.defaults;
  }

  // Expose axios methods with type support
  get = <T = any, R = AxiosResponse<T>>(url: string, config?: any): Promise<R> => 
    this.client.get(url, config);

  post = <T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: any): Promise<R> => 
    this.client.post(url, data, config);

  put = <T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: any): Promise<R> => 
    this.client.put(url, data, config);

  delete = <T = any, R = AxiosResponse<T>>(url: string, config?: any): Promise<R> => 
    this.client.delete(url, config);
}

export const apiClient = new ApiClient();
