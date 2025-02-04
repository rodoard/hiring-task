import { makeAutoObservable, runInAction } from 'mobx';
import { apiClient } from '../utils/apiClient';
import SecureStorage from '../utils/secureStorage';
import { User, AuthUserData } from '../models/user';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name: string;
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

class AuthStore {
  user: User | null = null;
  token: string | null = null;
  isAuthenticated = false;
  isLoading = false;
  error: string | null = null;
  private secureStorage: SecureStorage;

  constructor() {
    makeAutoObservable(this);
    this.secureStorage = new SecureStorage('hiring-task-auth');
    this.checkAuthStatus();
  }

  // Check initial authentication status
  public checkAuthStatus() {
    this.token = this.secureStorage.getItem('token');
    this.isAuthenticated = !!this.token;
    return this.isAuthenticated;
  }

  // Login method
  async login(userData: LoginData) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.post<{ token: string }>('/auth/login', userData);
      
      const { token } = response.data;
      
      // Validate token
      if (!token) {
        throw new AuthenticationError('No authentication token received');
      }

      runInAction(() => {
        // Set token in store
        this.token = token;
        this.isAuthenticated = true;
        this.isLoading = false;
        this.secureStorage.setItem('token', token);
      });

      return { token };
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred during login';

      // Extract error message from response
      if (error.response) {
        const responseData = error.response.data;
        
        // Prioritize messages over message
        if (responseData.messages && Array.isArray(responseData.messages)) {
          errorMessage = responseData.messages.join(', ');
        } else if (responseData.message) {
          errorMessage = responseData.message;
        }
      }

      runInAction(() => {
        this.isLoading = false;
        this.isAuthenticated = false;
        this.token = null;
        this.user = null;
        this.secureStorage.removeItem('token');
        this.error = errorMessage;
      });

      throw new Error(errorMessage);
    }
  }

  // Register method
  async register(userData: RegisterData) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.post<AuthUserData>('/auth/register', userData);
      
      // Explicitly check for token and user
      if (!response.data.token || !response.data.user) {
        throw new AuthenticationError('Registration Failed');
      }

      runInAction(() => {
        this.token = response.data.token;
        this.user = response.data.user;
        this.isAuthenticated = true;
        this.isLoading = false;
        this.secureStorage.setItem('token', this.token);
      });

      return response.data;
    } catch (error: any) {
      runInAction(() => {
        // Differentiate between different types of errors
        if (error instanceof AuthenticationError) {
          this.error = error.message;
        } else {
          this.error = error.response?.data?.message || 'Registration Failed';
        }
        
        this.isLoading = false;
        this.isAuthenticated = false;
        
        // Clear token on registration failure
        this.secureStorage.removeItem('token');
        this.token = null;
        this.user = null;
      });

      throw error;
    }
  }

  // Logout method
  logout() {
    this.token = null;
    this.user = null;
    this.isAuthenticated = false;
    this.secureStorage.removeItem('token');
  }
}

export const authStore = new AuthStore();
