import { http, HttpResponse } from 'msw';
import { server } from '../setupTests';
import { authStore } from '../stores/AuthStore';
import { getApiUrl } from '../utils/apiUrl';

describe('Authentication API', () => {
  describe('Login', () => {
    const mockUser = {
      uuid: '1',
      email: 'test@example.com',
      username: 'testuser'
    };

    test('login with valid credentials', async () => {
      const loginCredentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      // Setup MSW handler for login
      server.use(
        http.post(getApiUrl('/auth/login'), () => {
          return HttpResponse.json({
            token: 'mock-jwt-token'
          });
        })
      );

      const result = await authStore.login(loginCredentials);
      
      expect(result.token).toBe('mock-jwt-token');
    });

    test('login with invalid credentials', async () => {
      const invalidCredentials = {
        email: 'wrong@example.com',
        password: 'wrongpassword'
      };

      // Setup MSW handler for failed login
      server.use(
        http.post(getApiUrl('/auth/login'), () => {
          return HttpResponse.json({ 
            message: 'Invalid credentials' 
          }, { status: 400 });
        })
      );

      await expect(authStore.login(invalidCredentials)).rejects.toThrow('Invalid credentials');
    });

    test('login with non-existent email', async () => {
      const nonExistentEmail = {
        email: 'notfound@example.com',
        password: 'password123'
      };

      // Setup MSW handler for non-existent email
      server.use(
        http.post(getApiUrl('/auth/login'), () => {
          return HttpResponse.json({ 
            message: 'User not found' 
          }, { status: 404 });
        })
      );

      await expect(authStore.login(nonExistentEmail)).rejects.toThrow('User not found');
    });

    test('login with empty credentials', async () => {
      const emptyCredentials = {
        email: '',
        password: ''
      };

      // Setup MSW handler for empty credentials
      server.use(
        http.post(getApiUrl('/auth/login'), () => {
          return HttpResponse.json({ 
            messages: ['Email and password are required'] 
          }, { status: 400 });
        })
      );

      await expect(authStore.login(emptyCredentials)).rejects.toThrow('Email and password are required');
    });

    test('login with multiple error messages', async () => {
      const invalidCredentials = {
        email: 'test@example.com',
        password: 'short'
      };

      // Setup MSW handler for multiple error messages
      server.use(
        http.post(getApiUrl('/auth/login'), () => {
          return HttpResponse.json({ 
            messages: [
              'Password is required', 
              'Password must be at least 8 characters'
            ] 
          }, { status: 400 });
        })
      );

      await expect(authStore.login(invalidCredentials))
        .rejects.toThrow('Password is required, Password must be at least 8 characters');
    });

    test('login with single message', async () => {
      const invalidCredentials = {
        email: 'test@example.com',
        password: 'short'
      };

      // Setup MSW handler for single message
      server.use(
        http.post(getApiUrl('/auth/login'), () => {
          return HttpResponse.json({ 
            messages: ['Password is too short'] 
          }, { status: 400 });
        })
      );

      await expect(authStore.login(invalidCredentials))
        .rejects.toThrow('Password is too short');
    });

    test('login with both message and messages', async () => {
      const invalidCredentials = {
        email: 'test@example.com',
        password: 'invalid'
      };

      // Setup MSW handler for message and messages
      server.use(
        http.post(getApiUrl('/auth/login'), () => {
          return HttpResponse.json({ 
            message: 'Validation failed',
            messages: ['Password is invalid'] 
          }, { status: 400 });
        })
      );

      await expect(authStore.login(invalidCredentials))
        .rejects.toThrow('Password is invalid');
    });
  });
});
