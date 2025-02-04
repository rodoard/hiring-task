import { todoStore } from './TodoStore';
import { Todo } from '../models/todo';
import { getApiUrl } from '../utils/apiUrl';
import { apiClient } from '../utils/apiClient';

// Mock apiClient
jest.mock('../utils/apiClient');
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('TodoStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    todoStore.todos = [];
    todoStore.isLoading = false;
    todoStore.error = null;

    // Reset apiClient mocks
    mockedApiClient.get.mockReset();
    mockedApiClient.post.mockReset();
    mockedApiClient.put.mockReset();
    mockedApiClient.delete.mockReset();
  });

  describe('fetchTodos', () => {
    it('should fetch todos successfully', async () => {
      const mockTodos: Todo[] = [
        {
          uuid: '1',
          title: 'Test Todo 1',
          isCompleted: false,
          description: undefined,
          dueDate: undefined
        },
        {
          uuid: '2',
          title: 'Test Todo 2',
          isCompleted: true,
          description: undefined,
          dueDate: undefined
        }
      ];

      mockedApiClient.get.mockResolvedValue({ data: mockTodos });

      await todoStore.fetchTodos();

      expect(mockedApiClient.get).toHaveBeenCalledWith('/todos');
      expect(todoStore.todos).toEqual(mockTodos);
      expect(todoStore.isLoading).toBe(false);
      expect(todoStore.error).toBeNull();
    });

    it('should handle fetch todos error', async () => {
      const errorMessage = 'Network error';
      mockedApiClient.get.mockRejectedValue(new Error(errorMessage));

      await expect(todoStore.fetchTodos()).rejects.toThrow(errorMessage);
      expect(todoStore.todos).toEqual([]);
      expect(todoStore.isLoading).toBe(false);
      expect(todoStore.error).toBe(errorMessage);
    });
  });

  describe('createTodo', () => {
    it('should create a new todo', async () => {
      const newTodo: Todo = {
        uuid: '3',
        title: 'New Todo',
        isCompleted: false,
        description: undefined,
        dueDate: undefined
      };

      mockedApiClient.post.mockResolvedValue({ data: newTodo });

      const result = await todoStore.createTodo({ title: 'New Todo' });

      expect(mockedApiClient.post).toHaveBeenCalledWith('/todos', { title: 'New Todo' });
      expect(todoStore.todos).toContainEqual(newTodo);
      expect(result).toEqual(newTodo);
    });

    it('should handle create todo error', async () => {
      const errorMessage = 'Create error';
      mockedApiClient.post.mockRejectedValue(new Error(errorMessage));

      await expect(todoStore.createTodo({ title: 'New Todo' })).rejects.toThrow(errorMessage);
      expect(todoStore.error).toBe(errorMessage);
    });
  });

  describe('updateTodo', () => {
    it('should update an existing todo', async () => {
      const existingTodo: Todo = {
        uuid: '4',
        title: 'Existing Todo',
        isCompleted: false,
        description: undefined,
        dueDate: undefined
      };

      const updatedTodo: Todo = {
        ...existingTodo,
        title: 'Updated Todo',
        isCompleted: true
      };

      todoStore.todos = [existingTodo];
      mockedApiClient.put.mockResolvedValue({ data: updatedTodo });

      const result = await todoStore.updateTodo('4', { 
        title: 'Updated Todo', 
        isCompleted: true 
      });

      expect(mockedApiClient.put).toHaveBeenCalledWith('/todos/4', { 
        title: 'Updated Todo', 
        isCompleted: true 
      });
      expect(todoStore.todos).toContainEqual(updatedTodo);
      expect(result).toEqual(updatedTodo);
    });

    it('should update todo description', async () => {
      const existingTodo: Todo = {
        uuid: '4',
        title: 'Existing Todo',
        isCompleted: false,
        description: undefined,
        dueDate: undefined
      };

      const updatedTodo: Todo = {
        ...existingTodo,
        description: 'New description'
      };

      todoStore.todos = [existingTodo];
      mockedApiClient.put.mockResolvedValue({ data: updatedTodo });

      const result = await todoStore.updateTodo('4', { 
        description: 'New description' 
      });

      expect(mockedApiClient.put).toHaveBeenCalledWith('/todos/4', { 
        description: 'New description' 
      });
      expect(todoStore.todos).toContainEqual(updatedTodo);
      expect(result).toEqual(updatedTodo);
    });

    it('should update todo due date', async () => {
      const newDueDate = new Date('2024-01-01');
      const existingTodo: Todo = {
        uuid: '4',
        title: 'Existing Todo',
        isCompleted: false,
        description: undefined,
        dueDate: undefined
      };

      const updatedTodo: Todo = {
        ...existingTodo,
        dueDate: newDueDate
      };

      todoStore.todos = [existingTodo];
      mockedApiClient.put.mockResolvedValue({ data: updatedTodo });

      const result = await todoStore.updateTodo('4', { 
        dueDate: newDueDate 
      });

      expect(mockedApiClient.put).toHaveBeenCalledWith('/todos/4', { 
        dueDate: newDueDate 
      });
      expect(todoStore.todos).toContainEqual(updatedTodo);
      expect(result).toEqual(updatedTodo);
    });

    it('should handle update todo error', async () => {
      const errorMessage = 'Update error';
      mockedApiClient.put.mockRejectedValue(new Error(errorMessage));

      await expect(todoStore.updateTodo('4', { isCompleted: true })).rejects.toThrow(errorMessage);
      expect(todoStore.error).toBe(errorMessage);
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', async () => {
      const todoToDelete: Todo = {
        uuid: '5',
        title: 'Todo to Delete',
        isCompleted: false,
        description: undefined,
        dueDate: undefined
      };

      todoStore.todos = [todoToDelete];
      mockedApiClient.delete.mockResolvedValue({});

      await todoStore.deleteTodo('5');

      expect(mockedApiClient.delete).toHaveBeenCalledWith('/todos/5');
      expect(todoStore.todos).toEqual([]);
    });

    it('should handle delete todo error', async () => {
      const errorMessage = 'Delete error';
      mockedApiClient.delete.mockRejectedValue(new Error(errorMessage));

      await expect(todoStore.deleteTodo('5')).rejects.toThrow(errorMessage);
      expect(todoStore.error).toBe(errorMessage);
    });
  });
});
