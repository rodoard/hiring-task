import { AxiosError } from 'axios';
import { message } from 'antd';

// Generic error response interface
interface ErrorResponse {
  message?: string;
}

// Generic error handler for Axios errors
export const handleAxiosError = (
  error: unknown, 
  defaultMessage: string = 'An error occurred. Please try again.'
): void => {
  const axiosError = error as AxiosError<ErrorResponse>;
  message.error(
    axiosError.response?.data?.message || defaultMessage
  );
};
