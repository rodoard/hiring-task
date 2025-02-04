/**
 * Represents a user in the application
 */
export interface User {
  uuid: string;
  username?: string;
  email: string;
}

/**
 * Represents the authentication response from the server
 */
export interface AuthUserData {
  token: string;
  user: User;
}
