import '@testing-library/jest-dom';
import { http, HttpResponse } from 'msw';
import { server } from '../setupTests';
import { getTodos, createTodo, updateTodo, deleteTodo } from './todos';
import { getApiUrl } from '../utils/apiUrl';

describe('Todos API Authentication', () => {
  const mockTodos = [
    { uuid: '1', title: 'User 1 Todo', userId: '1', isCompleted: false },
    { uuid: '2', title: 'User 2 Todo', userId: '2', isCompleted: true }
  ];

  test('getTodos fails for unauthenticated user', async () => {
    // Setup MSW handler for unauthorized access
    server.use(
      http.get(getApiUrl('/todos'), () => {
        return new HttpResponse(null, { status: 401 });
      })
    );

    await expect(getTodos()).rejects.toThrow('Unauthorized. Please login to view todos.');
  });

  test('createTodo fails for unauthenticated user', async () => {
    const newTodo = { title: 'New Todo', isCompleted: false };

    // Setup MSW handler for unauthorized access
    server.use(
      http.post(getApiUrl('/todos'), () => {
        return new HttpResponse(null, { status: 401 });
      })
    );

    await expect(createTodo(newTodo)).rejects.toThrow('Unauthorized. Please login to create todos.');
  });

  test('updateTodo fails for unauthenticated user', async () => {
    const todoUpdate = { title: 'Updated Todo' };

    // Setup MSW handler for unauthorized access
    server.use(
      http.patch(getApiUrl('/todos/1'), () => {
        return new HttpResponse(null, { status: 401 });
      })
    );

    await expect(updateTodo('1', todoUpdate)).rejects.toThrow('Unauthorized. Please login to update todos.');
  });

  test('updateTodo fails for todo not belonging to user', async () => {
    const todoUpdate = { title: 'Updated Todo' };

    // Setup MSW handler for forbidden access
    server.use(
      http.patch(getApiUrl('/todos/1'), () => {
        return new HttpResponse(null, { status: 404 });
      })
    );

    await expect(updateTodo('1', todoUpdate)).rejects.toThrow('Todo not found or you do not have permission to update this todo.');
  });

  test('deleteTodo fails for unauthenticated user', async () => {
    // Setup MSW handler for unauthorized access
    server.use(
      http.delete(getApiUrl('/todos/1'), () => {
        return new HttpResponse(null, { status: 401 });
      })
    );

    await expect(deleteTodo('1')).rejects.toThrow('Unauthorized. Please login to delete todos.');
  });

  test('deleteTodo fails for todo not belonging to user', async () => {
    // Setup MSW handler for forbidden access
    server.use(
      http.delete(getApiUrl('/todos/1'), () => {
        return new HttpResponse(null, { status: 404 });
      })
    );

    await expect(deleteTodo('1')).rejects.toThrow('Todo not found or you do not have permission to delete this todo.');
  });
});
