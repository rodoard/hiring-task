import '@testing-library/jest-dom';
import { http, HttpResponse } from 'msw';
import { server } from '../setupTests';
import { getTodos, createTodo, updateTodo, deleteTodo } from './todos';
import { getApiUrl } from '../utils/apiUrl';

describe('Todos API', () => {
  test('getTodos fetches todos correctly', async () => {
    const mockTodos = [
      { uuid: '1', title: 'Todo 1', isCompleted: false },
      { uuid: '2', title: 'Todo 2', isCompleted: true }
    ];

    // Setup MSW handler
    server.use(
      http.get(getApiUrl('/todos'), () => {
        return HttpResponse.json(mockTodos);
      })
    );

    const result = await getTodos();
    expect(result).toEqual(mockTodos);
  });

  test('createTodo sends correct data', async () => {
    const newTodo = { title: 'New Todo', isCompleted: false };
    const createdTodo = { ...newTodo, uuid: '3' };

    // Setup MSW handler
    server.use(
      http.post(getApiUrl('/todos'), () => {
        return HttpResponse.json(createdTodo);
      })
    );

    const result = await createTodo(newTodo);
    expect(result).toEqual(createdTodo);
  });

  test('updateTodo sends correct data', async () => {
    const todoUpdate = { title: 'Updated Todo' };
    const updatedTodo = { uuid: '1', ...todoUpdate, isCompleted: false };

    // Setup MSW handler
    server.use(
      http.patch(getApiUrl('/todos/1'), () => {
        return HttpResponse.json(updatedTodo);
      })
    );

    const result = await updateTodo('1', todoUpdate);
    expect(result).toEqual(updatedTodo);
  });

  test('deleteTodo sends delete request', async () => {
    let deleteRequestReceived = false;

    // Setup MSW handler
    server.use(
      http.delete(getApiUrl('/todos/1'), () => {
        deleteRequestReceived = true;
        return new HttpResponse(null, { status: 200 });
      })
    );

    await deleteTodo('1');
    expect(deleteRequestReceived).toBe(true);
  });

  test('error handling in getTodos', async () => {
    // Setup MSW handler to simulate network error
    server.use(
      http.get(getApiUrl('/todos'), () => {
        return HttpResponse.error();
      })
    );

    await expect(getTodos()).rejects.toThrow();
  });
});
