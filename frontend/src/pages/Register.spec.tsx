import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { message } from 'antd';
import Register from './Register';
import * as authApi from '../api/auth';
import * as reactRouterDom from 'react-router-dom';

// Add this interface at the top of the file
interface ApiError extends Error {
  response?: {
    data: {
      message: string;
    };
  };
}

// Mock dependencies
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    useNavigate: () => jest.fn(),
  };
});

jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  message: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('../api/auth', () => ({
  register: jest.fn(),
}));

describe('Register Page', () => {
  // Mock console.error to prevent actual error logging during tests
  const originalConsoleError = console.error;
  beforeEach(() => {
    console.error = jest.fn();
    // Reset mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  test('renders registration form correctly', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    // Check for form elements
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('displays login link', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    // Check for the login link
    const loginLink = screen.getByText(/Login now!/i);
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  test('handles successful registration', async () => {
    // Mock successful registration
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);
    const mockRegister = jest.spyOn(authApi, 'register').mockResolvedValue({ success: true });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    // Fill out form
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Wait for registration to complete
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('handles registration failure', async () => {
    // Mock failed registration
    const mockError: ApiError = new Error('Registration failed');
    mockError.response = { data: { message: 'Email already exists' } };
    const mockRegister = jest.spyOn(authApi, 'register').mockRejectedValue(mockError);

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    // Fill out form
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'existing@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Wait for registration failure handling
    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Email already exists');
    });
  });
});
