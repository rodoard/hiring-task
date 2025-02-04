import { authStore, LoginData } from './AuthStore';
import SecureStorage from '../utils/secureStorage';
import { apiClient } from '../utils/apiClient';
import { expect } from '@jest/globals';

// Mock apiClient
jest.mock('../utils/apiClient');
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

// Mock SecureStorage
jest.mock('../utils/secureStorage');
const MockedSecureStorage = SecureStorage as jest.Mocked<typeof SecureStorage>;

describe('AuthStore', () => {
  let secureStorageMock: jest.Mocked<SecureStorage>;

  beforeEach(() => {
    // Reset the store before each test
    authStore.token = null;
    authStore.isAuthenticated = false;
    authStore.user = null;

    // Create a mock instance of SecureStorage
    secureStorageMock = new MockedSecureStorage('test-namespace') as jest.Mocked<SecureStorage>;
    secureStorageMock.getItem = jest.fn();
    secureStorageMock.setItem = jest.fn();
    secureStorageMock.removeItem = jest.fn();

    // Replace the secureStorage in the authStore with our mock
    (authStore as any).secureStorage = secureStorageMock;

    // Reset apiClient mocks
    mockedApiClient.post.mockReset();
  });

  describe('logout', () => {
    it('should clear authentication state', async () => {
      // Prepare mock login response
      const mockLoginResponse = {
        data: {
          token: 'test-token'
        }
      };

      mockedApiClient.post.mockResolvedValue(mockLoginResponse);

      // Perform login first
      await authStore.login({
        email: 'test@example.com',
        password: 'testpassword'
      });

      // Verify login state first
      expect(authStore.token).toBe('test-token');
      expect(authStore.isAuthenticated).toBe(true);

      // Now test logout
      authStore.logout();

      expect(authStore.token).toBeNull();
      expect(authStore.isAuthenticated).toBe(false);
      expect(secureStorageMock.removeItem).toHaveBeenCalledWith('token');
    });
  });

  describe('checkAuthStatus', () => {
    it('should set authentication state if token exists in secure storage', () => {
      secureStorageMock.getItem.mockReturnValue('existing-token');

      authStore.checkAuthStatus();

      expect(authStore.token).toBe('existing-token');
      expect(authStore.isAuthenticated).toBe(true);
    });

    it('should not set authentication state if no token in secure storage', () => {
      secureStorageMock.getItem.mockReturnValue(null);

      authStore.checkAuthStatus();

      expect(authStore.token).toBeNull();
      expect(authStore.isAuthenticated).toBe(false);
    });
  });

  describe('login', () => {
    it('should handle successful login', async () => {
      const loginData: LoginData = {
        email: 'test@example.com',
        password: 'testpassword'
      };

      const mockLoginResponse = {
        data: {
          token: 'test-token'
        }
      };

      mockedApiClient.post.mockResolvedValue(mockLoginResponse);

      const result = await authStore.login(loginData);

      expect(result).toEqual({ token: 'test-token' });
      expect(authStore.token).toBe('test-token');
      expect(authStore.isAuthenticated).toBe(true);
      expect(secureStorageMock.setItem).toHaveBeenCalledWith('token', 'test-token');
    });

    it('should handle login failure', async () => {
      const loginData: LoginData = {
        email: 'test@example.com',
        password: 'testpassword'
      };

      const mockError = new Error('Invalid credentials');
      (mockError as any).response = {
        data: {
          message: 'Invalid credentials'
        },
        status: 400
      };

      mockedApiClient.post.mockRejectedValue(mockError);

      try {
        await authStore.login(loginData);
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.message).toBe('Invalid credentials');
      }

      expect(authStore.token).toBeNull();
      expect(authStore.isAuthenticated).toBe(false);
      expect(authStore.user).toBeNull();
      expect(secureStorageMock.removeItem).toHaveBeenCalledWith('token');
    });

    it('should handle login failure with validation error', async () => {
      const loginData: LoginData = {
        email: 'invalid@example.com',
        password: 'short'
      };

      const mockError = new Error('Password is too short');
      (mockError as any).response = {
        data: {
          message: 'Password is too short, Password must be at least 8 characters'
        },
        status: 400
      };

      mockedApiClient.post.mockRejectedValue(mockError);

      try {
        await authStore.login(loginData);
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.message).toContain('Password is too short');
      }

      expect(authStore.token).toBeNull();
      expect(authStore.isAuthenticated).toBe(false);
      expect(authStore.user).toBeNull();
    });
  });
});
