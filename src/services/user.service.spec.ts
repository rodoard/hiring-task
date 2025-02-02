import { AppDataSource as dataSource, dbCreate } from '../db';
import { createUser, getOneUser, UserFilter, CreateUserData } from './user.service';
import { UserEntity } from '../entities';
import { DataSource, Repository } from 'typeorm';
import { UserAlreadyExistsError } from '../errors/userAlreadyExists.error';

describe('UserService', () => {
  let userRepository: Repository<UserEntity>;
  
  beforeAll(async () => {
    // Initialize the data source before tests
    await dataSource.initialize();
    await dbCreate();
    userRepository = dataSource.getRepository(UserEntity);
  });

  afterAll(async () => {
    // Clean up the data source after tests
    await dataSource.destroy();
  });

  beforeEach(async () => {
    // Clear the user table before each test
    await userRepository.clear();
  });

  describe('createUser', () => {
    it('should create a new user when email is unique', async () => {
      const userData: CreateUserData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const result = await createUser(userData);

      expect(result).toBeDefined();
      expect(result.email).toBe(userData.email.toLowerCase());
      expect(result.username).toBe(userData.username);
      expect(result.uuid).toBeTruthy();
    });

    it('should throw UserAlreadyExistsError when email already exists', async () => {
      const userData: CreateUserData = {
        username: 'testuser',
        email: 'existing@example.com',
        password: 'password123'
      };

      // First, create a user
      await createUser(userData);

      // Try to create the same user again
      await expect(createUser(userData)).rejects.toThrow(UserAlreadyExistsError);
    });

    it('should handle case-insensitive email uniqueness check', async () => {
      const userData1: CreateUserData = {
        username: 'user1',
        email: 'test@example.com',
        password: 'password123'
      };

      const userData2: CreateUserData = {
        username: 'user2',
        email: 'TEST@EXAMPLE.COM', // Same email with different case
        password: 'password456'
      };

      // Create first user
      await createUser(userData1);

      // Try to create user with same email (different case)
      await expect(createUser(userData2)).rejects.toThrow(UserAlreadyExistsError);
    });

    it('should handle creating multiple unique users', async () => {
      const userData1: CreateUserData = {
        username: 'user1',
        email: 'user1@example.com',
        password: 'password123'
      };

      const userData2: CreateUserData = {
        username: 'user2',
        email: 'user2@example.com',
        password: 'password456'
      };

      const result1 = await createUser(userData1);
      const result2 = await createUser(userData2);

      expect(result1.uuid).toBeTruthy();
      expect(result2.uuid).toBeTruthy();
      expect(result1.uuid).not.toBe(result2.uuid);
    });
  });

  describe('getOneUser', () => {
    it('should retrieve a user by email', async () => {
      const userData: CreateUserData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      // Create a user first
      const createdUser = await createUser(userData);

      // Retrieve the user by email
      const filter: UserFilter = { email: userData.email };
      const foundUser = await getOneUser(filter);

      expect(foundUser).toBeDefined();
      expect(foundUser.email).toBe(filter.email);
    });

    it('should return null for non-existent user', async () => {
      const filter: UserFilter = { email: 'nonexistent@example.com' };
      const foundUser = await getOneUser(filter);

      expect(foundUser).toBeNull();
    });

    it('should retrieve a user by uuid', async () => {
      const userData: CreateUserData = {
        username: 'uuiduser',
        email: 'uuid@example.com',
        password: 'password123'
      };

      // Create a user first
      const createdUser = await createUser(userData);

      // Retrieve the user by UUID
      const filter: UserFilter = { uuid: createdUser.uuid };
      const foundUser = await getOneUser(filter);

      expect(foundUser).toBeDefined();
      expect(foundUser.uuid).toBe(createdUser.uuid);
    });

    it('should retrieve a user by username', async () => {
      const userData: CreateUserData = {
        username: 'searchuser',
        email: 'search@example.com',
        password: 'password123'
      };

      // Create a user first
      const createdUser = await createUser(userData);

      // Retrieve the user by username
      const filter: UserFilter = { username: userData.username };
      const foundUser = await getOneUser(filter);

      expect(foundUser).toBeDefined();
      expect(foundUser.username).toBe(userData.username);
    });

    it('should return null when searching with multiple filters', async () => {
      const userData: CreateUserData = {
        username: 'multifilteruser',
        email: 'multifilter@example.com',
        password: 'password123'
      };

      // Create a user first
      const createdUser = await createUser(userData);

      // Try to retrieve with multiple filters that don't match exactly
      const filter: UserFilter = { 
        email: userData.email, 
        username: 'differentusername' 
      };
      const foundUser = await getOneUser(filter);

      expect(foundUser).toBeNull();
    });
  });
});
