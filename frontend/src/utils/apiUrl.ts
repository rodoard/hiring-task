import config from "../config";

const BASE_API_URL = config.api.baseUrl;

/**
 * Generates a full API URL for a given path
 * @param path The API endpoint path (e.g., '/todos')
 * @returns Full URL for the API endpoint
 */
export const getApiUrl = (path: string): string => {
  // Ensure path starts with a '/' and remove any trailing '/'
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const sanitizedPath = cleanPath.replace(/\/+$/, '');
  return `${BASE_API_URL}${sanitizedPath}`;
};
