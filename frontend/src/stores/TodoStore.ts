import { makeAutoObservable, runInAction } from 'mobx';
import { apiClient } from '../utils/apiClient';
import { Todo } from '../models/todo';
import { authStore } from './AuthStore';
import SecureStorage from '../utils/secureStorage';

class TodoStore {
  todos: Todo[] = [];
  isLoading = false;
  error: string | null = null;
  private secureStorage: SecureStorage;

  constructor() {
    makeAutoObservable(this);
    this.secureStorage = new SecureStorage('hiring-task-auth');
  }

  // Fetch all todos for the authenticated user
  async fetchTodos() {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.get('/todos');

      runInAction(() => {
        this.todos = response.data;
        this.isLoading = false;
      });
      return response.data;
    } catch (error: any) {
      console.error('Fetch todos error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });

      runInAction(() => {
        this.error = error instanceof Error 
          ? error.message 
          : 'Failed to fetch todos';
        this.isLoading = false;
      });
      throw error;
    }
  }

  // Fetch a specific todo by ID
  async fetchTodoById(todoId: string) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.get(`/todos/${todoId}`);

      runInAction(() => {
        const existingTodoIndex = this.todos.findIndex(todo => todo.uuid === todoId);
        if (existingTodoIndex !== -1) {
          this.todos[existingTodoIndex] = response.data;
        } else {
          this.todos.push(response.data);
        }
        this.isLoading = false;
      });
      return response.data;
    } catch (error: any) {
      console.error(`Fetch todo by ID error (${todoId}):`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });

      runInAction(() => {
        this.error = error instanceof Error 
          ? error.message 
          : 'Failed to fetch todo';
        this.isLoading = false;
      });
      throw error;
    }
  }

  // Create a new todo item
  async createTodo(todoData: Partial<Todo>) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.post('/todos', todoData);

      runInAction(() => {
        this.todos.push(response.data);
        this.isLoading = false;
      });
      return response.data;
    } catch (error: any) {
      console.error('Create todo error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });

      runInAction(() => {
        this.error = error instanceof Error 
          ? error.message 
          : 'Failed to create todo';
        this.isLoading = false;
      });
      throw error;
    }
  }

  // Update an existing todo item
  async updateTodo(todoId: string, todoData: Partial<Todo>) {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await apiClient.put(`/todos/${todoId}`, todoData);

      runInAction(() => {
        const index = this.todos.findIndex(todo => todo.uuid === todoId);
        if (index !== -1) {
          this.todos[index] = response.data;
        }
        this.isLoading = false;
      });
      return response.data;
    } catch (error: any) {
      console.error('Update todo error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });

      runInAction(() => {
        this.error = error instanceof Error 
          ? error.message 
          : 'Failed to update todo';
        this.isLoading = false;
      });
      throw error;
    }
  }

  // Delete a todo item
  async deleteTodo(todoId: string) {
    this.isLoading = true;
    this.error = null;

    try {
      await apiClient.delete(`/todos/${todoId}`);

      runInAction(() => {
        this.todos = this.todos.filter(todo => todo.uuid !== todoId);
        this.isLoading = false;
      });
    } catch (error: any) {
      console.error('Delete todo error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });

      runInAction(() => {
        this.error = error instanceof Error 
          ? error.message 
          : 'Failed to delete todo';
        this.isLoading = false;
      });
      throw error;
    }
  }

  // Computed properties
  get completedTodos() {
    return this.todos.filter(todo => todo.isCompleted);
  }

  get pendingTodos() {
    return this.todos.filter(todo => !todo.isCompleted);
  }
}

export const todoStore = new TodoStore();
