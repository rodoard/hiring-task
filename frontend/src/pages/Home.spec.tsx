import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from './Home';
import { authStore } from '../stores/AuthStore';

// Mock the components to avoid importing actual implementations
jest.mock('../components/home/Authenticated', () => {
  return function MockAuthenticated() {
    return <div data-testid="authenticated-component">Authenticated Content</div>;
  };
});

jest.mock('../components/home/UnAuthenticated', () => {
  return function MockUnAuthenticated() {
    return <div data-testid="unauthenticated-component">Unauthenticated Content</div>;
  };
});

// Reset any request handlers that are added during the tests
afterEach(() => {
  // Reset the authentication state after each test
  authStore.isAuthenticated = false;
});

describe('Home Page', () => {
  test('renders Authenticated component when user is logged in', () => {
    // Simulate logged-in state
    authStore.isAuthenticated = true;

    render(<Home />);

    // Check that Authenticated component is rendered
    const authenticatedComponent = screen.getByTestId('authenticated-component');
    expect(authenticatedComponent).toBeInTheDocument();

    // Ensure UnAuthenticated component is not rendered
    const unauthenticatedComponent = screen.queryByTestId('unauthenticated-component');
    expect(unauthenticatedComponent).not.toBeInTheDocument();
  });

  test('renders UnAuthenticated component when user is not logged in', () => {
    // Ensure logged-out state (which is the default after reset)
    render(<Home />);

    // Check that UnAuthenticated component is rendered
    const unauthenticatedComponent = screen.getByTestId('unauthenticated-component');
    expect(unauthenticatedComponent).toBeInTheDocument();

    // Ensure Authenticated component is not rendered
    const authenticatedComponent = screen.queryByTestId('authenticated-component');
    expect(authenticatedComponent).not.toBeInTheDocument();
  });
});
