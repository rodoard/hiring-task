import { AppDataSource as dataSource, dbCreate } from '../db';
import { TodoService } from './todo.service';
import { UserEntity, TodoEntity } from '../entities';
import { createUser } from './user.service';
import { DataSource, Repository } from 'typeorm';
import { NotFoundError, InvalidEntityError } from '../errors';

describe('TodoService', () => {
  let userRepository: Repository<UserEntity>;
  let todoRepository: Repository<TodoEntity>;
  let user: UserEntity;
  let todoService: TodoService;

  beforeAll(async () => {
    // Initialize the data source before tests
    await dataSource.initialize();
    await dbCreate();
    
    userRepository = dataSource.getRepository(UserEntity);
    todoRepository = dataSource.getRepository(TodoEntity);
  });

  afterAll(async () => {
    // Clean up the data source after tests
    await dataSource.destroy();
  });

  beforeEach(async () => {
    // Clear the repositories before each test
    await todoRepository.clear();
    await userRepository.clear();

    // Create a test user
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };
    user = await createUser(userData) as UserEntity;
    todoService = new TodoService(user.uuid);
  });

  describe('addTodo', () => {
    it('should add a new todo for the user', async () => {
      const todoData = {
        title: 'Test Todo',
        description: 'This is a test todo',
        isCompleted: false
      };

      const todo = await todoService.addTodo(todoData);

      expect(todo).toBeDefined();
      expect(todo).toMatchObject(todoData);
    });
  });

  describe('getTodos', () => {
    it('should retrieve todos for the user', async () => {
      // Add multiple todos
      const todoData1 = { title: 'Todo 1', description: 'First todo', isCompleted: false };
      const todoData2 = { title: 'Todo 2', description: 'Second todo', isCompleted: true };
      
      await todoService.addTodo(todoData1);
      await todoService.addTodo(todoData2);

      const todos = await todoService.getTodos();

      expect(todos).toHaveLength(2);
      expect(todos[0]).toMatchObject(todoData1);
      expect(todos[1]).toMatchObject(todoData2);
    });

    it('should return an empty array if no todos exist', async () => {
      const todos = await todoService.getTodos();
      expect(todos).toHaveLength(0);
    });

    it('should retrieve todos sorted by due date in ascending order', async () => {
      const todoData1 = {
        title: 'Todo 1',
        description: 'First todo',
        isCompleted: false,
        dueDate: new Date('2023-01-01')
      };

      const todoData2 = {
        title: 'Todo 2',
        description: 'Second todo',
        isCompleted: true,
        dueDate: new Date('2023-02-01')
      };

      const todo1 = todoRepository.create({
        ...todoData1,
        user,
        createdAt: new Date('2023-01-01T00:00:00Z')
      });
      await todoRepository.save(todo1);

      const todo2 = todoRepository.create({
        ...todoData2,
        user,
        createdAt: new Date('2023-01-02T00:00:00Z')
      });
      await todoRepository.save(todo2);

      const todos = await todoService.getTodos();

      expect(todos).toHaveLength(2);
      // Todos should be sorted by due date in ascending order
      expect(todos[0]).toMatchObject(todoData1);
      expect(todos[1]).toMatchObject(todoData2);
    });
  });

  describe('getTodo', () => {
    it('should retrieve a specific todo by UUID', async () => {
      // Add a todo
      const todoData = {
        title: 'Specific Todo',
        description: 'Todo to retrieve',
        isCompleted: false
      };
      const addedTodo = await todoService.addTodo(todoData);

      // Retrieve the todo
      const retrievedTodo = await todoService.getTodo(addedTodo.uuid);

      expect(retrievedTodo).toBeDefined();
      expect(retrievedTodo.uuid).toBe(addedTodo.uuid);
      expect(retrievedTodo).toMatchObject(todoData);
    });

    it('should return null when retrieving a todo that does not belong to the user', async () => {
      // Create another user
      const otherUserData = {
        username: 'otheruser',
        email: 'other@example.com',
        password: 'password456'
      };
      const otherUser = await createUser(otherUserData) as UserEntity;
      const otherTodoService = new TodoService(otherUser.uuid);

      // Add a todo for the original user
      const todoData = {
        title: 'Original User Todo',
        description: 'This todo belongs to another user',
        isCompleted: false
      };
      const addedTodo = await todoService.addTodo(todoData);

      // Try to retrieve the todo using the other user's service
      const retrievedTodo = await otherTodoService.getTodo(addedTodo.uuid);

      expect(retrievedTodo).toBeNull();
    });

    it('should return null for non-existent todo', async () => {
      const retrievedTodo = await todoService.getTodo('non-existent-uuid');
      expect(retrievedTodo).toBeNull();
    });
  });

  describe('updateTodo', () => {
    it('should update an existing todo', async () => {
      // First, create a todo
      const originalTodo = await todoService.addTodo({
        title: 'Original Todo',
        description: 'Original description',
        isCompleted: false
      });

      // Update the todo
      const updatedTodoData = {
        uuid: originalTodo.uuid,
        title: 'Updated Todo',
        description: 'Updated description',
        isCompleted: true
      };

      const updatedTodo = await todoService.updateTodo(updatedTodoData);

      expect(updatedTodo).toMatchObject(updatedTodoData);
    });

    it('should throw InvalidEntityError if UUID is not provided', async () => {
      await expect(todoService.updateTodo({})).rejects.toThrow(InvalidEntityError);
    });

    it('should throw NotFoundError if todo does not exist', async () => {
      await expect(
        todoService.updateTodo({ uuid: 'non-existent-uuid' })
      ).rejects.toThrow(NotFoundError);
    });

    it('should partially update a todo', async () => {
      // First, create a todo
      const originalTodo = await todoService.addTodo({
        title: 'Partial Update Todo',
        description: 'Original description',
        isCompleted: false
      });

      // Partially update the todo
      const updatedTodoData = {
        uuid: originalTodo.uuid,
        description: 'Updated description'
      };

      const updatedTodo = await todoService.updateTodo(updatedTodoData);

      expect(updatedTodo).toMatchObject({
        uuid: originalTodo.uuid,
        title: originalTodo.title,
        description: updatedTodoData.description,
        isCompleted: originalTodo.isCompleted
      });
    });

    it('should only update isCompleted status', async () => {
      // First, create a todo
      const originalTodo = await todoService.addTodo({
        title: 'Completion Status Todo',
        description: 'Original description',
        isCompleted: false
      });

      // Update only the completion status
      const updatedTodoData = {
        uuid: originalTodo.uuid,
        isCompleted: true
      };

      const updatedTodo = await todoService.updateTodo(updatedTodoData);

      expect(updatedTodo).toMatchObject({
        uuid: originalTodo.uuid,
        title: originalTodo.title,
        description: originalTodo.description,
        isCompleted: true
      });
    });
  });

  describe('deleteTodo', () => {
    it('should delete an existing todo', async () => {
      // First, create a todo
      const todo = await todoService.addTodo({
        title: 'Todo to delete',
        description: 'This todo will be deleted',
        isCompleted: false
      });

      // Delete the todo
      const deletedTodo = await todoService.deleteTodo(todo.uuid);

      expect(deletedTodo).toMatchObject({
        uuid: todo.uuid,
        title: todo.title,
        description: todo.description,
        isCompleted: false
      });

      // Verify the todo is actually deleted
      const remainingTodos = await todoService.getTodos();
      expect(remainingTodos).toHaveLength(0);
    });

    it('should throw InvalidEntityError if UUID is not provided', async () => {
      await expect(todoService.deleteTodo('')).rejects.toThrow(InvalidEntityError);
    });

    it('should throw NotFoundError if todo does not exist', async () => {
      await expect(
        todoService.deleteTodo('non-existent-uuid')
      ).rejects.toThrow(NotFoundError);
    });

    it('should prevent deleting a todo belonging to another user', async () => {
      // Create another user
      const otherUserData = {
        username: 'otheruser',
        email: 'other@example.com',
        password: 'password456'
      };
      const otherUser = await createUser(otherUserData) as UserEntity;
      const otherTodoService = new TodoService(otherUser.uuid);

      // Add a todo for the original user
      const todoData = {
        title: 'Todo to be protected',
        description: 'This todo should not be deletable by another user',
        isCompleted: false
      };
      const addedTodo = await todoService.addTodo(todoData);

      // Try to delete the todo using the other user's service
      await expect(
        otherTodoService.deleteTodo(addedTodo.uuid)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('addTodo', () => {
    it('should add a todo with all optional fields', async () => {
      const todoData = {
        title: 'Detailed Todo',
        description: 'A todo with all optional fields',
        isCompleted: true
      };

      const todo = await todoService.addTodo(todoData);

      expect(todo).toBeDefined();
      expect(todo).toMatchObject(todoData);
      expect(todo.user.uuid).toBe(user.uuid);
    });

    it('should add a todo with minimal fields', async () => {
      const todoData = {
        title: 'Minimal Todo'
      };

      const todo = await todoService.addTodo(todoData);

      expect(todo).toBeDefined();
      expect(todo.title).toBe(todoData.title);
      expect(todo.isCompleted).toBe(false); // Default value
      expect(todo.user.uuid).toBe(user.uuid);
    });
  });
});
