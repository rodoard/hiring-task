import '@testing-library/jest-dom';
import { http, HttpResponse } from 'msw';
import { server } from '../setupTests';
import { register } from './auth';
import { getApiUrl } from '../utils/apiUrl';

describe('Authentication API', () => {
  describe('Register', () => {
    test('register new user', async () => {
      const newUserData = {
        email: 'newuser@example.com',
        password: 'password123',
        username: 'newuser'
      };

      // Setup MSW handler for registration
      server.use(
        http.post(getApiUrl('/auth/register'), () => {
          return HttpResponse.json({
            user: {
              uuid: '2',
              email: newUserData.email,
              username: newUserData.username
            },
            token: 'new-user-jwt-token'
          });
        })
      );

      const result = await register(newUserData);
      
      expect(result.user).toEqual({
        uuid: '2',
        email: newUserData.email,
        username: newUserData.username
      });
      expect(result.token).toBe('new-user-jwt-token');
    });

    test('register with existing email', async () => {
      const existingUserData = {
        email: 'existing@example.com',
        password: 'password123',
        username: 'existinguser'
      };

      // Setup MSW handler for registration failure
      server.use(
        http.post(getApiUrl('/auth/register'), () => {
          return HttpResponse.json({ 
            message: 'User with this email already exists' 
          }, { status: 400 });
        })
      );

      await expect(register(existingUserData)).rejects.toThrow('User with this email already exists');
    });

    test('register with invalid email format', async () => {
      const invalidEmailData = {
        email: 'invalid-email',
        password: 'password123',
        username: 'invaliduser'
      };

      // Setup MSW handler for email validation error
      server.use(
        http.post(getApiUrl('/auth/register'), () => {
          return HttpResponse.json({ 
            message: 'Invalid email format' 
          }, { status: 400 });
        })
      );

      await expect(register(invalidEmailData)).rejects.toThrow('Invalid email format');
    });

    test('register with missing username', async () => {
      const incompleteData = {
        email: 'incomplete@example.com',
        password: 'password123',
        username: ''
      };

      // Setup MSW handler for missing username
      server.use(
        http.post(getApiUrl('/auth/register'), () => {
          return HttpResponse.json({ 
            message: 'Arguments are invalid.',
            messages: ['Username is required.'] 
          }, { status: 400 });
        })
      );

      await expect(register(incompleteData)).rejects.toThrow('Arguments are invalid.');
    });
  });
});
