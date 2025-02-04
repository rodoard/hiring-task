import axios from 'axios';
import { Todo } from '../models/todo';
import { getApiUrl } from '../utils/apiUrl';

export const getTodos = async (): Promise<Todo[]> => {
  try {
    const response = await axios.get(getApiUrl('/todos'));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        throw new Error('Unauthorized. Please login to view todos.');
      }
    }
    console.error('Error fetching todos:', error);
    throw error;
  }
};

export const createTodo = async (todo: Omit<Todo, 'uuid'>): Promise<Todo> => {
  try {
    const response = await axios.post(getApiUrl('/todos'), todo);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        throw new Error('Unauthorized. Please login to create todos.');
      }
    }
    console.error('Error creating todo:', error);
    throw error;
  }
};

export const updateTodo = async (uuid: string, todo: Partial<Todo>): Promise<Todo> => {
  try {
    const response = await axios.patch(getApiUrl(`/todos/${uuid}`), todo);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        throw new Error('Unauthorized. Please login to update todos.');
      }
      if (error.response.status === 404) {
        throw new Error('Todo not found or you do not have permission to update this todo.');
      }
    }
    console.error('Error updating todo:', error);
    throw error;
  }
};

export const deleteTodo = async (uuid: string): Promise<void> => {
  try {
    await axios.delete(getApiUrl(`/todos/${uuid}`));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        throw new Error('Unauthorized. Please login to delete todos.');
      }
      if (error.response.status === 404) {
        throw new Error('Todo not found or you do not have permission to delete this todo.');
      }
    }
    console.error('Error deleting todo:', error);
    throw error;
  }
};

export const toggleTodoCompletion = async (uuid: string): Promise<Todo> => {
  try {
    const response = await axios.patch(getApiUrl(`/todos/${uuid}/toggle`));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 401) {
        throw new Error('Unauthorized. Please login to toggle todo completion.');
      }
      if (error.response.status === 404) {
        throw new Error('Todo not found or you do not have permission to modify this todo.');
      }
    }
    console.error('Error toggling todo completion:', error);
    throw error;
  }
};