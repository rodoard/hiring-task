import request from 'supertest';
import { AppDataSource } from '../../db';
import { UserEntity } from '../../entities';
import { encryptPassword } from '../../utils/encrypt';
import app from '../../app';
import * as userServiceModule from '../../services/user.service';

describe('/api/v1', () => {
  describe('/auth/login', () => {
    beforeAll(async () => {
      await AppDataSource.initialize();
    });

    afterAll(async () => {
      await AppDataSource.destroy();
    });

    beforeEach(async () => {
      await AppDataSource.getRepository(UserEntity).clear();
      // Reset any mocks
      jest.restoreAllMocks();
    });

    describe('POST', () => {
      it('should return a token for valid credentials', async () => {
        const plainTextPassword = 'password123';
        const hashedPassword = await encryptPassword(plainTextPassword);

        // Create a test user
        const userRepository = AppDataSource.getRepository(UserEntity);
        await userRepository.save({
          username: 'John Doe',
          email: 'john.doe@example.com',
          password: hashedPassword,
        });

        // Call the login endpoint
        const response = await request(app)
          .post('/api/v1/auth/login')
          .send({ email: 'john.doe@example.com', password: plainTextPassword });

        // Validate the response
        expect(response.status).toBe(202);
        expect(response.body).toHaveProperty('token');
      });

      it('should return 401 for invalid email', async () => {
        // Call the login endpoint with an invalid email
        const response = await request(app)
          .post('/api/v1/auth/login')
          .send({ email: 'invalid@example.com', password: 'password123' });

        // Validate the response
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Invalid email or password' });
      });

      it('should return 401 for invalid password', async () => {
        const hashedPassword = await encryptPassword('password123');

        // Create a test user
        const userRepository = AppDataSource.getRepository(UserEntity);
        await userRepository.save({
          username: 'John Doe',
          email: 'john.doe@example.com',
          password: hashedPassword,
        });

        // Call the login endpoint with an invalid password
        const response = await request(app)
          .post('/api/v1/auth/login')
          .send({ email: 'john.doe@example.com', password: 'wrongpassword' });

        // Validate the response
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Invalid email or password' });
      });

      // Test case to cover deleted user scenario
      it('should return 401 for deleted user', async () => {
        const hashedPassword = await encryptPassword('password123');

        // Create a test user with a deletion timestamp
        const userRepository = AppDataSource.getRepository(UserEntity);
        await userRepository.save({
          username: 'Deleted User',
          email: 'deleted@example.com',
          password: hashedPassword,
          deletedAt: new Date() // Simulate a deleted user
        });

        // Call the login endpoint
        const response = await request(app)
          .post('/api/v1/auth/login')
          .send({ email: 'deleted@example.com', password: 'password123' });

        // Validate the response
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Invalid email or password' });
      });

      // Test case to cover error handling
      it('should handle unexpected errors during login', async () => {
        // Mock the userService to throw an error
        jest.spyOn(userServiceModule, 'getOneUser').mockImplementation(() => {
          throw new Error('Simulated database error');
        });

        // Attempt to log in
        const response = await request(app)
          .post('/api/v1/auth/login')
          .send({ email: 'error@example.com', password: 'password123' });

        // Expect an internal server error
        expect(response.status).toBe(500);
      }, 15000);  // Increased timeout to 15 seconds
    });
  });
});