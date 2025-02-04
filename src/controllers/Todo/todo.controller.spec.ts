import request from 'supertest';
import { AppDataSource, dbCreate } from '../../db';
import { createUser } from '../../services/user.service';
import { UserEntity, TodoEntity } from '../../entities';
import app from '../../app';
import { generateToken } from '../../utils/generate';
import { TodoService } from '../../services/todo.service';
import { NotFoundError } from '../../errors/notFound.error';

describe('Todo Controller', () => {
  let user: UserEntity;
  let bearerToken: string;

  beforeAll(async () => {
    await AppDataSource.initialize();
    await AppDataSource.synchronize(true);
    await dbCreate();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  beforeEach(async () => {
    // Clear repositories
    const userRepository = AppDataSource.getRepository(UserEntity);
    const todoRepository = AppDataSource.getRepository(TodoEntity);
    await todoRepository.clear();
    await userRepository.clear();

    // Create a test user
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };
    user = await createUser(userData) as UserEntity;
    
    // Generate JWT token
    bearerToken = generateToken(user.uuid);
  });

  describe('POST /api/v1/todos', () => {
    it('should create a new todo', async () => {
      const todoData = {
        title: 'Test Todo',
        description: 'This is a test todo',
        isCompleted: false
      };

      const response = await request(app)
        .post('/api/v1/todos')
        .set('Authorization', bearerToken)
        .send(todoData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(todoData);
      expect(response.body.uuid).toBeDefined();
    });

    it('should handle error when creating todo fails', async () => {
      // Spy on TodoService to simulate an error
      const todoServiceSpy = jest.spyOn(TodoService.prototype, 'addTodo')
        .mockRejectedValue(new Error('Todo creation failed'));

      const todoData = {
        title: 'Test Todo',
        description: 'This is a test todo',
        isCompleted: false
      };

      const response = await request(app)
        .post('/api/v1/todos')
        .set('Authorization', bearerToken)
        .send(todoData);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Todo creation failed');

      todoServiceSpy.mockRestore();
    });
  });

  describe('GET /api/v1/todos', () => {
    it('should retrieve todos for the user', async () => {
      const todoRepository = AppDataSource.getRepository(TodoEntity);
      
      // Create multiple todos with specific due dates
      const todo1 = todoRepository.create({
        title: 'Todo 1',
        description: 'First todo',
        isCompleted: false,
        user,
        dueDate: new Date('2024-01-01T00:00:00Z'),
        createdAt: new Date('2023-01-01T00:00:00Z')
      });
      await todoRepository.save(todo1);

      const todo2 = todoRepository.create({
        title: 'Todo 2',
        description: 'Second todo',
        isCompleted: true,
        user,
        dueDate: new Date('2024-01-02T00:00:00Z'),
        createdAt: new Date('2023-01-02T00:00:00Z')
      });
      await todoRepository.save(todo2);

      const response = await request(app)
        .get('/api/v1/todos')
        .set('Authorization', bearerToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      // Todos are now sorted by dueDate, with the earliest due date first
      expect(response.body[0]).toMatchObject({
        title: 'Todo 1',
        description: 'First todo',
        isCompleted: false
      });
      expect(response.body[1]).toMatchObject({
        title: 'Todo 2',
        description: 'Second todo',
        isCompleted: true
      });
    });

    it('should handle error when retrieving todos fails', async () => {
      // Spy on TodoService to simulate an error
      const todoServiceSpy = jest.spyOn(TodoService.prototype, 'getTodos')
        .mockRejectedValue(new Error('Failed to retrieve todos'));

      const response = await request(app)
        .get('/api/v1/todos')
        .set('Authorization', bearerToken);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to retrieve todos');

      todoServiceSpy.mockRestore();
    });
  });

  describe('GET /api/v1/todos/:uuid', () => {
    it('should retrieve a specific todo', async () => {
      const todoRepository = AppDataSource.getRepository(TodoEntity);
      
      const todo = todoRepository.create({
        title: 'Specific Todo',
        description: 'A specific todo',
        isCompleted: false,
        user
      });
      const savedTodo = await todoRepository.save(todo);

      const response = await request(app)
        .get(`/api/v1/todos/${savedTodo.uuid}`)
        .set('Authorization', bearerToken);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        title: 'Specific Todo',
        description: 'A specific todo',
        isCompleted: false
      });
    });

    it('should handle error when todo is not found', async () => {
      // Spy on TodoService to simulate a not found error
      const todoServiceSpy = jest.spyOn(TodoService.prototype, 'getTodo')
        .mockResolvedValue(null);

      const response = await request(app)
        .get('/api/v1/todos/non-existent-uuid')
        .set('Authorization', bearerToken);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Todo not found');

      todoServiceSpy.mockRestore();
    });

    it('should handle other errors when retrieving a todo', async () => {
      // Spy on TodoService to simulate an error
      const todoServiceSpy = jest.spyOn(TodoService.prototype, 'getTodo')
        .mockRejectedValue(new Error('Failed to retrieve todo'));

      const response = await request(app)
        .get('/api/v1/todos/some-uuid')
        .set('Authorization', bearerToken);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to retrieve todo');

      todoServiceSpy.mockRestore();
    });
  });

  describe('PUT /api/v1/todos/:uuid', () => {
    it('should update an existing todo', async () => {
      const todoRepository = AppDataSource.getRepository(TodoEntity);
      
      const todo = todoRepository.create({
        title: 'Original Todo',
        description: 'Original description',
        isCompleted: false,
        user
      });
      const savedTodo = await todoRepository.save(todo);

      const updateData = {
        title: 'Updated Todo',
        description: 'Updated description',
        isCompleted: true
      };

      const response = await request(app)
        .put(`/api/v1/todos/${savedTodo.uuid}`)
        .set('Authorization', bearerToken)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(updateData);
    });

    it('should handle error when updating todo fails', async () => {
      // Spy on TodoService to simulate an error
      const todoServiceSpy = jest.spyOn(TodoService.prototype, 'updateTodo')
        .mockRejectedValue(new Error('Todo update failed'));

      const updateData = {
        title: 'Updated Todo',
        description: 'Updated description',
        isCompleted: true
      };

      const response = await request(app)
        .put('/api/v1/todos/some-uuid')
        .set('Authorization', bearerToken)
        .send(updateData);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Todo update failed');

      todoServiceSpy.mockRestore();
    });
  });

  describe('DELETE /api/v1/todos/:uuid', () => {
    it('should delete an existing todo', async () => {
      const todoRepository = AppDataSource.getRepository(TodoEntity);
      
      const todo = todoRepository.create({
        title: 'Todo to Delete',
        description: 'Will be deleted',
        isCompleted: false,
        user
      });
      const savedTodo = await todoRepository.save(todo);

      const response = await request(app)
        .delete(`/api/v1/todos/${savedTodo.uuid}`)
        .set('Authorization', bearerToken);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});

      // Verify todo is actually deleted
      const deletedTodo = await todoRepository.findOne({ 
        where: { uuid: savedTodo.uuid } 
      });
      expect(deletedTodo).toBeNull();
    });

    it('should handle error when deleting todo fails', async () => {
      // Spy on TodoService to simulate a not found error
      const todoServiceSpy = jest.spyOn(TodoService.prototype, 'getTodo')
        .mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/v1/todos/some-uuid')
        .set('Authorization', bearerToken);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Todo not found');

      todoServiceSpy.mockRestore();
    });
  });
});
